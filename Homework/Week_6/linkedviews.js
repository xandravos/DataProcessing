/*
Name: Xandra Vos
Studentnumber: 10731148

Data Processing - Week 6
Script to visualize the NOG AANVULLEN.
*/

// set variables for further use
var canvasX = 650;
var canvasY = 300;
var width = 600;
var height = 300;
var xPadding = 50;
var yPadding = 50;
var barPadding = 13;
var labelPadding = 40;

// read data.json
d3.json("data.json").then(function(data) {

    // get data
    var allData = prepareData(data);
    var studies = allData[0];
    var totStudents = allData[1];
    var menWomen = allData[2];

    // scale x and y
    var xScaled = scaleX(studies);
    var yScaled = scaleY(totStudents);

    // make SVG
    makeSVG();

    // make barchart and axes
    barLabels(xScaled, yScaled);
    barChart(studies, totStudents, menWomen, xScaled, yScaled);
});

// function to prepare data
function prepareData(data) {
    // get keys and values of data
    var studies = Object.keys(data);
    var values = Object.values(data);

    // make lists for later use
    var totStudents = [];
    var menWomen = [];
    for (var i = 0; i < values.length; i++) {
        totStudents.push(values[i][0]);
        menWomen.push(values[i][1]);
    };

    return [studies, totStudents, menWomen];
};

// scale x
function scaleX(studies) {
   var scaleX = d3.scaleBand()
                  .domain(studies)
                  .range([xPadding, width]);

    return scaleX;
};

// scale y
function scaleY(totStudents) {

    // get minimum and maximum value of all students list
    var yMin = d3.min(totStudents);
    var yMax = d3.max(totStudents);

    // scale y
    var scaleY = d3.scaleLinear()
                   .domain([0, yMax + yPadding])
                   .range([height - yPadding, yPadding]);

    return scaleY;
};

// function to make svg
function makeSVG(){

    // make svg in container
    var svg = d3.select("#container")
                .append("svg")
                .attr("width", canvasX)
                .attr("height", canvasY)
                .attr("class", "bars")
};

//
function barChart(studies, totStudents, menWomen, xScaled, yScaled) {
    var colors = d3.scaleOrdinal(d3.schemeSet2);

    // make rectangles for barchart
    var svg = d3.select(".bars");
    svg.selectAll("rect")
       .attr("class", "rects")
       .data(totStudents)
       .enter()
       .append("rect")
       .attr("x", function(d, i) {
           return i * ((width - xPadding)/ totStudents.length) + xPadding + 1;
       })
       .attr("y", function(d) {
           return yScaled(d);
       })
       .attr("width", (width / totStudents.length) - barPadding)
       .attr("height", function(d) {
           return (height - yScaled(d) - yPadding);
       })
       .attr("fill", function(d) {
           return colors(d);
       })

       // make bars interactive
       .on("mouseout", function(d) {
           d3.selectAll("#tipText").remove()
           d3.select(this)
           .attr("fill", function(d) {
               return colors(d);
           });
       })
       .on("mouseover", function(d, i) {
           d3.select(this)
             .attr("fill", "#cc3300")
             svg.append("text")
                .attr("id", "tipText")
                .attr("x", function() {
                    return xScaled(studies[i]) + 20;
                })
                .attr("y", function() {
                    return yScaled(d) - 5;
                })
                .text(+ (d) + " students");
      })
      .on("click", function(d, i) {
          makePie(menWomen[i])
      });
};

// make labels for barchart
function barLabels(xScaled, yScaled) {

    // make x and y axis
    var xAxis = d3.axisBottom(xScaled)
    var yAxis = d3.axisLeft(yScaled)

    // append ticks to x-axis
    d3.select(".bars")
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height - yPadding) + ")")
      .call(xAxis);

    // append x-label
    d3.select(".bars")
      .append("text")
      .attr("class", "myLabelX")
      .attr("y", height - 10)
      .attr("x", width / 2)
      .attr('text-anchor', 'middle')
      .text("Studies");

    // append ticks to y-axis
    d3.select(".bars")
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + xPadding + ",0)")
      .call(yAxis);

    // append y-label
    d3.select(".bars")
      .append("text")
      .attr("class", "myLabelY")
      .attr("y", 12)
      .attr("x", -150)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .text("Number of students enrolled")
};

// function to make legend
function makeLegend(data, svg) {

    // make list for legend
    var sexes = ["Women", "Men"]

    // make colors scale
    var colors = d3.scaleOrdinal(d3.schemeCategory10)

    // make group for legends
    var legends = d3.select(".pie")
                    .append("g")
                    .attr("transform", "translate(300, 20)")
                    .selectAll(".legends")
                    .data(data)

    // make legend
    var legend = legends.enter()
                        .append("g")
                        .classed("legends", true)
                        .attr("transform", function(d, i){
                            return "translate(0," + (i+1)*20 +")";
                        });

    // append circles to legend
    legend.append("circle")
          .attr("cx", 200)
          .attr("cy", 50)
          .attr("r", 5)
          .attr("fill", function (d) {
              return colors(d.data);
          });

    // append text to legend
    legend.append("text")
          .attr("x", 210)
          .attr("y", 52)
          .attr("id", "legendText")
          .text(function(d, i){
              return sexes[i];
          })
};

// function to make piechart
function makePie(menWomen) {

    // remove old piechart
    d3.selectAll(".pie").remove()

    // make color scale and set height
    var colors = d3.scaleOrdinal(d3.schemeCategory10)
    var height = 500;

    // make svg for piechart
    var svg = d3.select("#container")
                .append("svg")
                .attr("class", "pie")
                .attr("width", width)
                .attr("height", height)

    // make data for piechart
    var data = d3.pie()(menWomen)

    // make pie
    var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(150)

    // make parts of pie
    var arcs = svg.append("g")
                  .attr("class", "pieArcs")
                  .attr("transform", "translate(250, 250)")
                  .selectAll("path")
                  .data(data);

    // fill arcs of pie
    arcs.enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function (d) {
            return colors(d.data)
        });

    // make place for text in pie
    var content = d3.select(".pieArcs")
                    .selectAll("text")
                    .data(data);

    // write text in pie
    content.enter()
           .append("text")
           .attr("class", "pieText")
           .each(function(d) {
               var center = arc.centroid(d);
               d3.select(this)
                 .attr("x", center[0])
                 .attr("y", center[1])
                 .text(d.data);
           });

    // make legend for piechart
    makeLegend(data, svg)
}
