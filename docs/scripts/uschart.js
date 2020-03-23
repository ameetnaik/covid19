
fetch("https://pomber.github.io/covid19/timeseries.json")
.then(response => response.json())
.then(data => {
  var confirmedArr = [], recoveredArr = [], deathsArr = [], dates = [];
  var prevRec = 0;
  data["US"].forEach(({ date, confirmed, recovered, deaths }) => {
    dates.push(date);
    confirmedArr.push(confirmed);
    if (recovered === 0) {
      recovered = prevRec;
    } else {
      prevRec = recovered;
    }
    recoveredArr.push(recovered);
    deathsArr.push(deaths);

  });
  drawUSChart({"dates": dates, "confirmed": confirmedArr, "recovered": recoveredArr, "deaths": deathsArr});
})

function drawUSChart(data) {

    var options = {
        series: [{
        name: 'Confirmed',
        data: data.confirmed
      },
      {
        name: 'Recovered',
        data: data.recovered
      },
      {
        name: 'Deaths',
        data: data.deaths
      }
    ],
    chart: {
        height: 350,
        type: 'line',
        zoom: {
            enabled: false
        },
        toolbar: {
            show: false,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: false
            }
        }
      },
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center', 
        labels: {
            colors: ['#fff'],
            useSeriesColors: true
        }
    },
      stroke: {
        width: 5,
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
 //       categories: ['1/11/2000', '2/11/2000', '3/11/2000', '4/11/2000', '5/11/2000', '6/11/2000', '7/11/2000', '8/11/2000', '9/11/2000', '10/11/2000', '11/11/2000', '12/11/2000', '1/11/2001', '2/11/2001', '3/11/2001','4/11/2001' ,'5/11/2001' ,'6/11/2001'],
        categories: data.dates,
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
            },
        }
        
    },
      title: {
        text: 'US Cases',
        align: 'center',
        style: {
          fontSize: "22px",
          color: '#fff'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: [ '#FDD835'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        },
      },
      markers: {
        size: 0,
        colors: ["#FFA41B"],
        strokeColors: "#222",
        strokeWidth: 2,
        hover: {
          size: 7,
        }
      },
      yaxis: {
        min: 0,
        max: 50000,
        title: {
          text: 'Cases',
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
            },
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
    
      var chart = new ApexCharts(document.querySelector("#us-chart"), options);
      chart.render();

}

