/*
Name: Xandra Vos
Studentnumber: 10731148

Data Processing - Week 5
Script to draw a scatterplot onto the scatter.html page.
*/

// set variables for later use
var canvasX = 800;
var canvasY = 400;
var width = 650;
var height = 400;
var padding = 50;
var startYear = "2007";
var endYear = "2015";


window.onload = function() {

    // requests both queries and waits till all requests are fulfilled
    var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
    var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

    var requests = [d3.json(womenInScience), d3.json(consConf)];

    // executes a function
    Promise.all(requests).then(function(response) {

        // get data from response and calculate minimum and maximum
        var dataMSTI = transformResponse(response[0]);
        var minMaxMSTI = minMax(dataMSTI);
        var dataCons = transformResponse(response[1]);
        var minMaxCons = minMax(dataCons);

        // combine data from datasets into one dataset
        dataset = combineData(dataCons, dataMSTI);

        // make svg for later use
        svg = makeSVG();

        // get data for first year (2007)
        var yearData = dataYear(dataset, startYear)

        // make scale function for x
        var scaleX = d3.scaleLinear()
                       .domain([minMaxMSTI[0] - 1, minMaxMSTI[1] + 1])
                       .range([padding, width + padding]);

        // make scale function for y
        var scaleY = d3.scaleLinear()
                       .domain([minMaxCons[0] - 1, minMaxCons[1] + 1])
                       .range([height - padding, padding]);

        // make scatter for first year (2007)
        scatter(yearData, scaleX, scaleY)

        // make scatterlabels
        scatterLabels(scaleX, scaleY)

        // make legend for first year (2007)
        makeLegend(yearData, svg)

        // make dropdown menu
        dropDown(dataset, scaleX, scaleY, svg)

    }).catch(function(e){
        throw(e);
    });
};

// function to combine data from 2 datasets
function combineData(data1, data2){

    // make dict
    dict = {};

    // initialize counter
    counter = 0;

    // iterate over dataset 1
    for (var i = 0; i < data1.length; i++){

        // iterate over dataset 2
        for (var j = 0; j < data2.length; j++){

            // checks if data matches
            if (data1[i]["Country"] == data2[j]["Country"] && data1[i]["time"] == data2[j]["time"]){

                // deletes data if data is undefined
                if (dict[data1[i]["time"]] == undefined){
                    dict[data1[i]["time"]] = [];
                };

            // push usable data to dict
            dict[data1[i]["time"]].push([data1[i]["Country"], data1[i]["datapoint"],
            data2[j]["datapoint"]]);
            };
        };
    };
    // return dict
    return dict;
};

// function for dropdown menu
function dropDown(data, scaleX, scaleY, svg) {

    // list of all years
    var years = ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]

    // make dropdown
    var select = d3.select('body')
                   .append('select')
  	               .attr('class','select')
                   .on('change',onchange)

    // fill dropdown with years as options
    var options = select
        .selectAll('option')
	    .data(years).enter()
	    .append('option')
		.text(function (d) { return d; })

        // updategraph if other year chosen
        function onchange() {
        	selectValue = d3.select('select').property('value')
            updateGraph(data, selectValue, scaleX, scaleY, svg)
        };
};

// function for selecting data of a specific year
function dataYear(data, year){

    // make lists for datapoints of one year
    datapoints = [];
    yearData = [];

    // set data to data of specific year
    data = data[year];

    // iterate over data and push countries and datapoints for that year
    for (var i = 0; i < data.length; i++) {
        datapoints.push(data[i][1]);
        datapoints.push(data[i][2]);
        datapoints.push(data[i][0]);
        yearData.push(datapoints);
        datapoints = [];
    };

    console.log(yearData)
    // return data for specific year
    return yearData;
};

// function to update graph
function updateGraph(data, year, scaleX, scaleY, svg) {

    // remove legend and datapoints
    svg.selectAll("circle").remove();
    svg.selectAll(".legend").remove();

    // get data for selected year
    data = dataYear(data, year)

    // make scatter and legend for selected year
    scatter(data, scaleX, scaleY)
    makeLegend(data, svg)
};

// function to update legend
function updateLegend(data) {

    // make list for countries, colors and combination
    var countries = [];
    var useColors = [];
    var countriesColors = [];

    // list of chosen colors
    var colors = ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffd92f"];

    // iterate over data and get right colors per country
    for (var i = 0; i < data.length; i++) {
        countriesColors.push([data[i][2], colors[i]]);
        countries = [];
        useColors = [];
    }

    // return list of colors with countries
    return countriesColors;
};

// function to make svg
function makeSVG(){
    var svg = d3.select("body")
                .append("svg")
                .attr("width", canvasX)
                .attr("height", canvasY)
                .attr("id", "svg")
    return svg;
};

// function to make scatter
function scatter(data, scaleX, scaleY) {

    // get colors list
    var colors = updateLegend(data);

    // append circles and fill with right colors
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
          return scaleX(d[1])
      })
      .attr("cy", function(d) {
          return scaleY(d[0]);
      })
      .attr("r", 5)
      .attr("fill", function(d, i) {
          return colors[i][1]
      });
};

// function for labels on axis
function scatterLabels(scaleX, scaleY) {

    // make y and x axis
    var xAxis = d3.axisBottom(scaleX)
    var yAxis = d3.axisLeft(scaleY)

    // draw x axis
     svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

      // draw y axis
      svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(" + padding + ",0)")
       .call(yAxis);

       // append label to x axis
       svg.append("text")
           .attr("class", "myLabel")
           .attr("y", height - 10)
           .attr("x", width / 2)
           .attr('text-anchor', 'middle')
           .text("Percentage of women in science (%)")
           .style("font-family", "verdana")
           .style("font-size", "12px");

        // append label to y-axis
       svg.append("text")
           .attr("class", "myLabel")
           .attr("y", 12)
           .attr("x", -190)
           .attr('transform', 'rotate(-90)')
           .attr('text-anchor', 'middle')
           .text("Consumer confidence (%)")
           .style("font-family", "verdana")
           .style("font-size", "12px");
};

// function to make legend
function makeLegend(data, svg) {

    // get list of colors
    colorsList = updateLegend(data);

    // make legend
    var legend = svg.selectAll(".legend")
                    .data(colorsList)
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function(d, i) {return "translate(0," + i * 15 +")";});

    // append circles to legend
    legend.append("circle")
          .attr("cx", width - 50)
          .attr("cy", 50)
          .attr("r", 5)
          .style("fill", function(d) {
              return d[1]
          });

    // append text to legend
    legend.append("text")
          .attr("x", width - 40)
          .attr("y", 55)
          .text(function(d){
              return d[0]
          })
          .style("font-family", "verdana")
          .style("font-size", "12px");
};

// calculate minimum and maximum of given data
function minMax(data){

    // make list for datapoint
    var datapoints = [];

    // iterate over data and push datapoint to datapoints list
    data.forEach(function(element){
        datapoints.push(element.datapoint);
    });

    // make list to store minimum and maximum
    var minMaxData = [];

    // calculate minimum and maximum and push to minmax list
    var min = d3.min(datapoints);
    var max = d3.max(datapoints);
    minMaxData.push(min, max);

    // return minmax list
    return minMaxData;
};


function transformResponse(data){

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":");
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}
