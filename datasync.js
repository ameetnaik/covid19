const fs = require("fs");
const path = require("path");
const parse = require("csv-parse/lib/sync");

const WORKSPACE = process.env.GITHUB_WORKSPACE;
const DATA_REPO = "data"; // from main.yml checkout action path
const MAIN_REPO = "main"; // from main.yml checkout action path
const FILENAME_CONFIRMED = "time_series_covid19_confirmed_global.csv";
const FILENAME_DEATHS = "time_series_covid19_deaths_global.csv";
const FILENAME_RECOVERED = "time_series_covid19_recovered_global.csv";

const dataPath = path.join(
  WORKSPACE,
  DATA_REPO,
  "csse_covid_19_data",
  "csse_covid_19_time_series"
);

const outputPath = path.join(WORKSPACE, MAIN_REPO, "docs", "data.json");

function extract(filepath) {
  const csv = fs.readFileSync(filepath);
  const [headers, ...rows] = parse(csv);
  const [province, country, lat, long, ...dates] = headers;
  const countList = {};

  rows.forEach(([province, country, lat, long, ...counts]) => {
    countList[country] = countList[country] || {};
    dates.forEach((date, i) => {
      countList[country][date] = countList[country][date] || 0;
      countList[country][date] += +counts[i];
    });
  });
  return [countList, dates];
}

const patchCountryNames = {
  Bahamas: "Bahamas, The",
  Gambia: "Gambia, The"
};

const [confirmed, dates] = extract(path.resolve(dataPath, FILENAME_CONFIRMED));
const [deaths] = extract(path.resolve(dataPath, FILENAME_DEATHS));
const [recovered] = extract(path.resolve(dataPath, FILENAME_RECOVERED));

/*
const [confirmed, dates] = extract('./files/'+FILENAME_CONFIRMED);
const [deaths] = extract('./files/'+FILENAME_DEATHS);
const [recovered] = extract('./files/'+FILENAME_RECOVERED);
*/

const countries = Object.keys(confirmed);
const results = {};
countries.forEach(country => {
  // Some country names are different in the recovered dataset
  const recoverdCountry = patchCountryNames[country] || country;

  if (!recovered[recoverdCountry]) {
    console.warn(`${recoverdCountry} is missing from the recovered dataset`);
  }

  results[country] = dates.map(date => {
    const [month, day] = date.split("/");
    return {
      country: country,
      date: `2020-${month}-${day}`,
      confirmed: confirmed[country][date],
      deaths: deaths[country][date],
      total: confirmed[country][date]+deaths[country][date],
      recovered:
        recovered[recoverdCountry] && recovered[recoverdCountry][date] != null
          ? recovered[recoverdCountry][date]
          : null
    };
  });
});

fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
//fs.writeFileSync('./files/data.json', JSON.stringify(results, null, 2));


const dataPathDaily = path.join(
  WORKSPACE,
  DATA_REPO,
  "csse_covid_19_data",
  "csse_covid_19_daily_reports"
);
const outputPathDaily = path.join(WORKSPACE, MAIN_REPO, "docs", "uscounty.json");

function getDate() {
  var date = new Date();
  
  var dateString = ('0' + date.getDate()).slice(-2) + '-'
    + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
    + date.getFullYear();
  return dateString;
}

function getData() {
  var filename = getDate() + '.csv';
  const csv = fs.readFileSync(path.resolve(dataPathDaily, filename));
  //const csv = fs.readFileSync('./files/'+getDate());
  const [headers, ...rows] = parse(csv);
  const [fips, admin2, province_state, country_region, last_update, lat, long, confirmed, deaths, recovered, active, combined_key] = headers;
  const countList = {};
  var data = [];
  rows.forEach(([fips, admin2, province_state, country_region, last_update, lat, long, confirmed, deaths, recovered, active, combined_key]) => {
    data.push({ county: fips, cases: +confirmed, countyName: combined_key });
  });
  console.log(data);

  fs.writeFileSync(outputPathDaily, JSON.stringify(data, null, 2));
  //fs.writeFileSync('./docs/data/uscounty.json', JSON.stringify(data, null, 2));

}

getData();