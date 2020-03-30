const fs = require("fs");
const path = require("path");
const parse = require("csv-parse/lib/sync");
const fetch = require("node-fetch");
const fipsmap = require("./files/us-fips.json");

const WORKSPACE = process.env.GITHUB_WORKSPACE;
const DATA_REPO = "data"; // from main.yml checkout action path
const MAIN_REPO = "main"; // from main.yml checkout action path

/*
const dataPathDaily = path.join(
  WORKSPACE,
  DATA_REPO,
  "csse_covid_19_data",
  "csse_covid_19_daily_reports"
);
const outputPathDaily = path.join(WORKSPACE, MAIN_REPO, "docs", "uscounty.json");
*/

function getDate(offset=0) {
  var date = new Date();

  date.setDate(date.getDate()+offset);
  
  var dateString =     + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
    + ('0' + date.getDate()).slice(-2) + '-'
    + date.getFullYear();
    console.log(dateString);
  return dateString;
}

function getData() {
  var filename = getDate() + '.csv';
  //const csv = fs.readFileSync(path.resolve(dataPathDaily, filename));
  var csv;
  
  fs.access('./files/'+getDate(), fs.constants.R_OK, (err) => {
    console.log(err);
    if (err) {
      csv = fs.readFileSync('./files/'+getDate(-1));
    } else {
      csv = fs.readFileSync('./files/'+getDate());
    }
  });
  
  const [headers, ...rows] = parse(csv);
  const [fips, admin2, province_state, country_region, last_update, lat, long, confirmed, deaths, recovered, active, combined_key] = headers;
  const countList = {};
  var data = [];
  rows.forEach(([fips, admin2, province_state, country_region, last_update, lat, long, confirmed, deaths, recovered, active, combined_key]) => {
    data.push({ county: fips, cases: +confirmed, countyName: combined_key });
  });
  console.log(data);

  //fs.writeFileSync(outputPathDaily, JSON.stringify(data, null, 2));
  fs.writeFileSync('./docs/data/uscounty.json', JSON.stringify(data, null, 2));

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