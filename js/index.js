var margin = {
  top: 30,
  right: 80,
  bottom: 80,
  left: 30
};

var width = parseInt(d3.select('#plot').style('width')),
    width = width - margin.left - margin.right,
    mapRatio = .6,
    height = width * mapRatio;

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function(error, data) {

  if (error) {
    console.log('error');
  } else {
    //console.log(data);
  }

  // svg canvas
  var svg = d3.select("#plot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // get the fastest and slowest times for the scales
  var fastestTime = data[0]["Seconds"];
  var slowestTime = data[data.length - 1]["Seconds"];

  // y-scaling
  var yScale = d3.scale.linear()
    .domain([1, data.length + 1])
    .range([0, height]);

  // x-scaling with some added padding for the x-axis
  var xScale = d3.time.scale()
    .domain([new Date(slowestTime * 1000 + 10000), new Date(fastestTime * 1000 - 5000)])
    .range([margin.left, (width - margin.right / 2)]);

  // draw x-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(d3.time.format("%M:%S"));

  // draw y-axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  // circle colour according to doping allegation
  function circleColour(d) {
    if (d === "") {
      return "#26A69A";
    } else {
      return "#EF5350";
    }
  };

  //tooltip
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // draw the scatterplot
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr({
      cx: function(d) { return xScale(new Date(d["Seconds"] * 1000)); },
      cy: function(d) { return yScale(d["Place"]); },
      r: 0,
      fill: function(d) { return circleColour(d["Doping"]); }
    })
    // tooltip
    .on("mouseover", function(d) {

      var html = "<div><h2>" + d["Name"] + " (" + d["Nationality"] + ")</h2>";
          html += "<h4>" + d["Year"] + "</h4>";
          html += "<h3>Time: " + d["Time"] + "</h3>";
          html += "<h4>" + d["Doping"] + "</h4>";
          html += "</div>";
      tooltip.transition()
        .duration(500)
        .style("opacity", 0.9);
      tooltip.html(html)
        .style("left", +width + "px")
        .style("top", height - margin.bottom - margin.top + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .transition().duration(500)
      .attr("r", 5);

  // scatterplot points text labels
  svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) { return d["Name"]; })
    .attr({
      x: function(d) { return xScale(new Date(d["Seconds"] * 1000)) + 10; },
      y: function(d) { return yScale(d["Place"]) + 5; }
    });

  // add x-axis
  svg.append("g")
    .call(xAxis)
    .attr({
      class: "axis",
      transform: "translate(0, " + height + ")"
    });

  // x-axis label
  svg.append("text")
    .attr("transform", "translate(" + (width - margin.right / 2) + ", " + (height + (margin.bottom / 2)) + ")")
    .style("text-anchor", "middle")
    .text("Time (mins)");

  // add y-axis
  svg.append("g")
    .call(yAxis)
    .attr({
      class: "axis",
      transform: "translate(" + margin.left + ", 0 )"
    });

  // y-axis label
  svg.append("text")
    .attr({
      transform: "rotate(-90)",
      x: 0 - margin.top,
      y: 0
    })
    .style("text-anchor", "middle")
    .text("Ranking");

  // key
  var legend = svg.append("g");

    legend.append("circle")
      .attr({
        cx: width - margin.left - margin.right - 100,
        cy: height - margin.bottom,
        r: 5,
        fill: "#26A69A"
      });

    legend.append("text")
    .attr({
      x: width - margin.left - margin.right - 90,
      y: height - margin.bottom + 5
    })
    .text("Clean riders");

    legend.append("circle")
      .attr({
        cx: width - margin.left - margin.right - 100,
        cy: height - margin.bottom + 20,
        r: 5,
        fill: "#EF5350"
      });

    legend.append("text")
      .attr({
        x: width - margin.left - margin.right - 90,
        y: height - margin.bottom + 25
      })
      .text("Riders with doping allegations");

});
