const fs = require("fs");
const fetch = require("node-fetch");
const parse = require("csv-parse/lib/sync");




function getStates() {

    fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv')
    .then(res => res.text())
    .then(body => {

//date,state,fips,cases,deaths
        const [headers, ...rows] = parse(body);
        const [date,state,fips,cases,deaths] = headers;
        var data = {};
        rows.forEach(([date,state,fips,cases,deaths]) => {
          if(!data[state]) data[state] = [];
          data[state].push({ date: date, fips: fips, cases: cases, state: state, deaths: deaths, total: cases+deaths });
          //data[+fips] = +cases;
        });
        //console.log(data);
 
    //fs.writeFileSync(outputPathDaily, JSON.stringify(data, null, 2));
    fs.writeFileSync('./app/assets/data/states.json', JSON.stringify(data, null, 2));
 
    });

}

getStates();