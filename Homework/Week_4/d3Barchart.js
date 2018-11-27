/*
Name: Xandra Vos
Studentnumber: 10731148

Data Processing - Week 4
Script to draw a barchart into the index.html page.
*/

// append title and text to page
d3.select("head").append("title").text("D3 Barchart");
d3.select("body").append("h3").text("Barchart");
d3.select("body").append("p").text("Name: Xandra Vos");
d3.select("body").append("p").text("Student number: 10731148");
d3.select("body").append("p").text("This is a barchart about \
renewable energy. Renewable energy is defined as the contribution \
of renewables to total primary energy supply. This indicator is \
measured in thousand toe (tonne of oil equivalent).");

// set dimensions canvas
var canvasX = 1000;
var canvasY = 400;

// make SVG and needed variables
var width = 600;
var height = 300;
var padding = 50;
var barPadding = 1.5;
var labelPadding = 40;
var svg = d3.select("body")
            .append("svg")
            .attr("width", canvasX)
            .attr("height", canvasY);

// prepare tooltip
var tooltip = d3.select("body")
              .append("div")
              .attr("class", "tooltip")
              .style("display", "none")
tooltip.append("text")

// get values out of JSON file
d3.json("data.json").then(function(data) {
    var years = Object.keys(data)
    var values = Object.values(data)

    // make list for values and append all values to list
    listValues = []
    for (var index = 0; index < years.length; index++) {
        listValues.push(values[index]["Value"])
    };

    // make variables for maximum x and y value
    var xMin = d3.min(years);
    var xMax = d3.max(years);
    var yMax = 9000;

    // scale x
    var scaleX = d3.scaleTime()
                   .domain([new Date(xMin,0), new Date(xMax,0)])
                   .range([padding, width]);

    // scale y
    var scaleY = d3.scaleLinear()
                   .domain([0, yMax])
                   .range([height - padding, padding]);

    // call barchart function and put in the list of values
    barchart(listValues)

    // make a function for making the barchart
    function barchart(listValues) {

        // make rectangles for barchart
        var rects = svg.selectAll("rect")
            .data(listValues)
            .enter()
            .append("rect")
        rects.attr("x", function(d, i) {
            return i * ((width - padding)/ listValues.length) + padding;
        })
        .attr("y", function(d) {
            return scaleY(d);
        })
        .attr("width", width / listValues.length - barPadding)
        .attr("height", function(d) {
            return (height - scaleY(d) - padding);
        })
        .attr("fill", function(d) {
            return "rgb(0, 0, " + (d * 0.027) + ")";
        })

        // make barchart interactive
        .on('mouseout', function(d) {
          tooltip.style("display", "none")
          d3.select(this).attr("fill", function(d) {
            return "rgb(0,0, " + (d * 0.027) + ")"
          });
        })
        .on('mousemove', function(d, i) {
          d3.select(this).attr("fill", "orange")
          tooltip.style("display", null);
          tooltip.select("text").text("Value: " + (d) +
          " thousand toe"  + ", Year: " + years[i]);
        });

        // make x and y axis
        var xAxis = d3.axisBottom(scaleX)
        var yAxis = d3.axisLeft(scaleY)

        // append ticks to x-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(xAxis);

        // append x-label
        svg.append("text")
            .attr("class", "myLabel")
            .attr("y", height - 10)
            .attr("x", width / 2)
            .attr('text-anchor', 'middle')
            .text("Years");

        // append ticks to y-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);

        // append y-label
        svg.append("text")
            .attr("class", "myLabel")
            .attr("y", 10)
            .attr("x", -150)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text("Values (in thousand toe)")
    }
});
