
var confirmedArr = [], recoveredArr = [], deathsArr = [], totalsArr = [], countryArr = [];
fetch("./data.json")
  .then(response => response.json())
  .then(data => {

    var worldData = [];
    Object.keys(data).forEach(function(key) {
        //console.table('Key : ' + key + ', Value : ' + data[key]);
        
        var length = data[key].length;
        var countryData = data[key];
        worldData.push({ "country": key, "confirmed": countryData[length-1].confirmed, "recovered": countryData[length-1].recovered, "deaths": countryData[length-1].deaths, 
        "total" : countryData[length-1].confirmed+countryData[length-1].recovered+countryData[length-1].deaths});
    });

        worldData = worldData.sort((a, b) => b.total - a.total).slice(0,10);
        console.log(worldData.slice(0,10));

        worldData.forEach(({country, confirmed, recovered, deaths, total}) => {
            countryArr.push(country);
            confirmedArr.push(confirmed);
            recoveredArr.push(recovered);
            deathsArr.push(deaths);
            totalsArr.push(total);
        });

        drawROWChart({"countries" : countryArr, "confirmed" : confirmedArr, "recovered" : recoveredArr, "deaths" : deathsArr});

    
    });


function drawROWChart(data) {


    var options = {
        series: [{
        name: 'Confirmed',
        data: data.confirmed.slice(0,10)
      }, {
        name: 'Deaths',
        data: data.deaths.slice(0,10)
      }],
        chart: {
        type: 'bar',
        height: 350,
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
        text: 'Worldwide Cases',
        align: 'center',
        style: {
          fontSize: "22px",
          color: '#fff'
        }
      },
      xaxis: {
        categories: data.countries.slice(0,10),
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
          text: 'Countries',
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

      var chart = new ApexCharts(document.querySelector("#row-chart"), options);
      chart.render();

}