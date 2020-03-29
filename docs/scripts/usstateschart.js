
var stateCasesArr = [], stateDeathsArr = [], stateTotalsArr = [], statesArr = [];
fetch("./data/states.json")
  .then(response => response.json())
  .then(data => {

    var stateData = [];
    Object.keys(data).forEach(function(key) {
        //console.table('Key : ' + key + ', Value : ' + data[key]);
        
        var length = data[key].length;
        var stateRowData = data[key];
        stateData.push({ "country": key, "cases": stateRowData[length-1].cases, "deaths": stateRowData[length-1].deaths, 
        "total" : stateRowData[length-1].cases + stateRowData[length-1].deaths});
    });

        stateData = stateData.sort((a, b) => b.cases - a.cases).slice(0,50);
        //console.log(stateData.slice(0,10));

        stateData.forEach(({country, cases, recovered, deaths, total}) => {
            statesArr.push(country);
            stateCasesArr.push(cases);
            stateDeathsArr.push(deaths);
            stateTotalsArr.push(total);
        });

        drawStateChart({"countries" : statesArr, "cases" : stateCasesArr, "recovered" : recoveredArr, "deaths" : stateDeathsArr});

    
    });


function drawStateChart(data) {


    var stateOptions = {
        series: [{
        name: 'Cases',
        data: data.cases.slice(0,50)
      }, {
        name: 'Deaths',
        data: data.deaths.slice(0,50)
      }],
        chart: {
        type: 'bar',
        height: 800,
        stacked: true,
        toolbar: {
            show: false,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: false
            }
        }
      },
      grid: {
        show: false
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      title: {
        text: 'State Cases',
        align: 'center',
        style: {
          fontSize: "22px",
          color: '#fff'
        }
      },
      xaxis: {
        categories: data.countries.slice(0,50),
        labels: {
          formatter: function (val) {
            return val + "K"
          },
          style: {
              colors: '#fff',
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-yaxis-label',
          }
        }
      },
      yaxis: {
        title: {
          text: 'US States',
          style: {
            color: '#fff'
          }
        },
        labels: {
            show: true,
            align: 'right',
            minWidth: 0,
            maxWidth: 160,
            style: {
                colors: '#fff',
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
            }
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "K"
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 100,
        labels: {
            colors: ['#fff'],
            useSeriesColors: true
        }
      },
      tooltip: {
        enabled: true,
        enabledOnSeries: true,
        shared: true,
        followCursor: false,
        intersect: false,
        inverseOrder: false,
        custom: undefined,
        fillSeriesColor: false,
        theme: 'dark',
        style: {
          fontSize: '12px',
          fontFamily: undefined
        },
        onDatasetHover: {
            highlightDataSeries: false,
        },
        x: {
            show: true,
            format: 'dd MMM',
            formatter: undefined,
        },
        y: {
            formatter: undefined,
            title: {
                formatter: (seriesName) => seriesName,
            },
        },
        z: {
            formatter: undefined,
            title: 'Size: '
        },
        marker: {
            show: true,
        },
        fixed: {
            enabled: false,
            position: 'topRight',
            offsetX: 0,
            offsetY: 0,
        },
    }
      };

      var stateChart = new ApexCharts(document.querySelector("#us-states-chart"), stateOptions);
      stateChart.render();

}