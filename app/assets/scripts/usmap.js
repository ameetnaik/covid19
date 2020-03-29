

var width = 720,
height = 500;
var margin = {top: 0, left: 0, bottom: 0, right: 0}, mapRatio = .55;

var projection = d3.geoAlbersUsa()
.scale(1000)
.translate([width / 2, height / 2]);

var path = d3.geoPath()
.projection(projection);




var svg = d3.select("#us-map").append("svg")
.attr("width", width)
.attr("height", height);

var tooltip = d3.select("#us-map-tooltip").append("svg").append("div") 
        .attr("class", "tooltip")       
        .style("opacity", 0);

/*
var color = d3.scaleQuantize()
    .domain([0, .05])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
*/
//var color = d3.scaleThreshold()
//.domain([0.10, 0.2, 0.3, 0.4, 0.5, 0.6])
//.range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);

var range = [0, 10, 20, 30, 40, 50];

var color = d3.scaleThreshold()
    .domain(range)
//    .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);
    .range(d3.schemeOrRd[range.length-1]);

d3.queue()
.defer(d3.json, "./data/us.json")
.defer(d3.json, "./data/counties.json")
.defer(d3.json, "./data/countyfips.json")
//.defer(d3.json, "./data/uscounty.json")
//.defer(d3.tsv, "./data/unemployment.tsv")
.await(ready);

function ready(error, us, counties, countyfips) {
if (error) throw error;
var countiesById = counties;
/*
var countiesById = {}; // Create empty object for holding dataset
uscounty.forEach(function(d) {
//  console.log(d);
countiesById[+d.county] = +d.cases; // Create property for each ID, give it value from rate
// important: cast rate to numeric value (+)

});
*/

//console.log(counties);

var g = svg.append("g");

/*
const zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([[0,0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", () => {
      g.attr("transform", d3.event.transform);
    });
*/
  g.attr("class", "counties")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.counties).features)
  .enter().append("path")
  .attr("d", path)
  .style("fill", function(d) {
    var result = color(countiesById[d.id]);
    
    if (!color(countiesById[d.id])) {
      //console.log("==="+d.id);
      result = color(0);
    }
    return result;
  })
  .on("mouseover", mover)
  .on("mouseout", mout);
  //.call(zoom);

//Function to call when you mouseover a node
function mover(d) {
	var el = d3.select(this)
		.transition()
		.duration(10)		  
    .style("fill-opacity", 0.3);
    
var xPosition = parseFloat(d3.select(this).attr("x"));// + xScale.bandwidth() / 2;
var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

d3.select("#tooltip")
  .style("left", xPosition + "px")
  .style("top", yPosition + "px")
  .select("#countyName")
  .text(countyfips[d.id]);

d3.select("#tooltip")
  .select("#cases")
  .text(countiesById[d.id]);

d3.select("#tooltip").classed("hidden", false);
}

//Mouseout function
function mout(d) { 
	var el = d3.select(this)
	   .transition()
	   .duration(1000)
     .style("fill-opacity", 1);

d3.select("#tooltip").classed("hidden", true);
};

svg.append("path")
.datum(topojson.mesh(us, us.objects.states, function(a, b) {
  return a.id !== b.id;
}))
.attr("class", "states")
.attr("d", path);


// catch the resize
//d3.select(window).on('resize', resize);

/*
var legendWidth = width * 0.6,
	legendHeight = 10;

//Color Legend container
var legendsvg = d3.select("#us-map-legend").append("g")
	.attr("class", "legendWrapper")
	.attr("transform", "translate(" + (width/2 - 10) + "," + (height+50) + ")");

//Draw the Rectangle
legendsvg.append("rect")
	.attr("class", "legendRect")
	.attr("x", -legendWidth/2)
	.attr("y", 10)
	//.attr("rx", legendHeight/2)
	.attr("width", legendWidth)
	.attr("height", legendHeight)
	.style("fill", "none");
	
//Append title
legendsvg.append("text")
	.attr("class", "legendTitle")
	.attr("x", 0)
	.attr("y", -2)
	.text("Store Competition Index");

//Set scale for x-axis
var xScale = d3.scaleLinear()
	 .range([0, legendWidth])
	 .domain([0,100]);
	 //.domain([d3.min(pt.legendSOM.colorData)/100, d3.max(pt.legendSOM.colorData)/100]);

//Define x-axis
var xAxis = d3.axisBottom()
	  .ticks(5)  //Set rough # of ticks
	  //.tickFormat(formatPercent)
	  .scale(xScale);

//Set up X axis
legendsvg.append("g")
	.attr("class", "axis")  //Assign "axis" class
	.attr("transform", "translate(" + (-legendWidth/2) + "," + (10 + legendHeight) + ")")
	.call(xAxis);

*/


/*
legend({
  color: d3.scaleQuantize(range, d3.schemeOrRd[range.length-1]),
  title: "Unemployment rate (%)"
});
*/


/*
legend({
  color: d3.scaleOrdinal(["<10", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70-79", "≥80"], d3.schemeSpectral[10]),
  title: "Age (years)",
  tickSize: 5,
  ticks: 10
});
*/

}


function resize() {
  // adjust things when the window size changes
  width = parseInt(d3.select('#us-map').style('width'));
  width = width - margin.left - margin.right;
  height = width * mapRatio;

  // update projection
  projection
      .translate([width / 2, height / 2])
      .scale(width);

  // resize the map container
  svg
      .style('width', width + 'px')
      .style('height', height + 'px');

  // resize the map
  svg.select('.land').attr('d', path);
  svg.selectAll('.state').attr('d', path);
}





function legend({
  color,
  title,
  tickSize = 6,
  width = 320, 
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues
} = {}) {

  const svg = d3.select("#us-map-legend").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible")
      .style("display", "block");

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;

  console.log(color.interpolate());
  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);
    console.log(color.interpolate);
    x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
  }

  // Sequential
  else if (color.interpolator) {
    x = Object.assign(color.copy()
        .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
        {range() { return [marginLeft, width - marginRight]; }});

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.interpolator()).toDataURL());

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds
        = color.thresholds ? color.thresholds() // scaleQuantize
        : color.quantiles ? color.quantiles() // scaleQuantile
        : color.domain(); // scaleThreshold

    const thresholdFormat
        = tickFormat === undefined ? d => d
        : typeof tickFormat === "string" ? d3.format(tickFormat)
        : tickFormat;

    x = d3.scaleLinear()
        .domain([-1, color.range().length - 1])
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.range())
      .append("rect")
        .attr("x", (d, i) => x(i - 1))
        .attr("y", marginTop)
        .attr("width", (d, i) => x(i) - x(i - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", d => d);

    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);
  }

  // Ordinal
  else {
    x = d3.scaleBand()
        .domain(color.domain())
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.domain())
      .append("rect")
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", color);

    tickAdjust = () => {};
  }

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues))
      .call(tickAdjust)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop + marginBottom - height - 6)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(title));

  return svg.node();
}