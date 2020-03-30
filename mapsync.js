const fs = require("fs");
const path = require("path");
const parse = require("csv-parse/lib/sync");
const fetch = require("node-fetch");
const fipsmap = require("./files/us-fips.json");

const WORKSPACE = process.env.GITHUB_WORKSPACE;
const DATA_REPO = "data"; // from main.yml checkout action path
const MAIN_REPO = "main"; // from main.yml checkout action path

/*
const dataPath = path.join(
  WORKSPACE,
  DATA_REPO,
  "csse_covid_19_data",
  "csse_covid_19_time_series"
);
const outputPath = path.join(WORKSPACE, MAIN_REPO, "docs", "data.json");
*/
/*
function extract(filename) {
//  const csv = fs.readFileSync(path.resolve(dataPath, filename));
  const csv = fs.readFileSync('./files/'+filename);
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

const [confirmed, dates] = extract(FILENAME_CONFIRMED);
const [deaths] = extract(FILENAME_DEATHS);
const [recovered] = extract(FILENAME_RECOVERED);
const countries = Object.keys(confirmed);
const results = {};
countries.forEach(country => {
  results[country] = dates.map(date => {
    const [month, day] = date.split("/");
    return {
      date: `2020-${month}-${day}`,
      country: country,
      confirmed: confirmed[country][date],
      deaths: deaths[country][date],
      recovered: recovered[country][date],
      total: confirmed[country][date] + deaths[country][date] + recovered[country][date]
    };
  });
});
*/

function getData() {
  

fetch("https://coronadatascraper.com/data.json")
.then(response => response.json())
.then(data => {

  var usData = data.filter(row => row.country === "USA" && row.county && row.cases !== 0);
  var data = [];
  usData.forEach(({ county, cases, country, state, deaths, recovered }) => {

    /*
    var countyValue = {
      county: county,
      confirmed: cases,
      recovered: (recovered)? recovered:0,
      deaths: deaths,
      state: state,
      country: country
    };
    */
    var countyVal = county+','+state;
    
    if (fipsmap[countyVal]) {
      var fips = fipsmap[countyVal].statefip + fipsmap[countyVal].countyfip;
      data.push({county: fips, cases: +cases, countyName: countyVal});
    }
  });
  console.log(data);
//fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
fs.writeFileSync('./docs/data/uscounty.json', JSON.stringify(data, null, 2));
});

}

getData();


/*
function generateFipsMap(){
const csv = fs.readFileSync('./national_county.txt');
const [...rows] = parse(csv);
var countyMap = {};
//AL,01,001,Autauga County,H1
rows.forEach(([state, statefip, countyfip, countyName, data]) => {
  countyMap[countyName+','+state] = {
      statefip: statefip,
      countyfip:countyfip
  }
});

console.log(countyMap);

fs.writeFileSync('./files/us-fips.json', JSON.stringify(countyMap, null, 2));

}

*/