const fs = require("fs");
const fetch = require("node-fetch");
const parse = require("csv-parse/lib/sync");

function getCounties() {

    fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv')
    .then(res => res.text())
    .then(body => {
        const [headers, ...rows] = parse(body);
        const [date,county,state,fips,cases,deaths] = headers;
        var data = {};
        var countiesFip = {};
        rows.forEach(([date,county,state,fips,cases,deaths]) => {
//          if(!data[fips]) data[fips] = [];
//          data[fips].push({ date: date, fips: fips, cases: cases, countyName: county, state: state, deaths: deaths, countyName: county+','+state });
            data[+fips] = +cases;
            countiesFip[+fips] = county+','+state;
        });
 
    //outputPath = path.join(WORKSPACE, MAIN_REPO, "docs/data/", "counties.json");
    //fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    //outputPath = path.join(WORKSPACE, MAIN_REPO, "docs/data/", "countyfips.json");
    //fs.writeFileSync(outputPath, JSON.stringify(countiesFip, null, 2));
    fs.writeFileSync('./app/assets/data/counties.json', JSON.stringify(data, null, 2));
    fs.writeFileSync('./app/assets/data/countyfips.json', JSON.stringify(countiesFip, null, 2));
 
    });

}

getCounties();