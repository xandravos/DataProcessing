/*
Name: Xandra Vos
Studentnumber: 10731148

Data Processing - Week 3
Scripts to draw a graph in the local host.
*/

// get JSON file and execute a http request
var fileName = "data.json";
var txtFile = new XMLHttpRequest();
txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {

        // make a variable to store the JSON file in
        var array = JSON.parse(txtFile.responseText);

        // select canvas of javascript.html to write on there in 2d
        var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');

        // make all needed variables
        var xPadding = 40;
        var yPadding = 40;
        var canvasMaxY = 400;
        var canvasMaxX = 600;
        var startYear = 2013;
        var endYear = 2017;
        var yMax = 100;

        // draw grid with label on x-axis
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xPadding, 0);
        ctx.lineTo(xPadding, canvasMaxY);
        ctx.stroke();
        ctx.moveTo(xPadding, canvasMaxY);
        ctx.lineTo(canvasMaxX + xPadding, canvasMaxY);
        ctx.stroke();
        ctx.font = "16px Verdana";
        ctx.fillText("Years", canvasMaxX / 2, canvasMaxY + yPadding);

        // save old style
        ctx.save();

        // write rotated label on y-axis
        ctx.translate(12, canvasMaxY / 2);
        ctx.rotate(-0.5 * Math.PI);
        ctx.fillText("Students enrolled", 0, 0);

        // restore old style
        ctx.restore();

        // make function for linear transformation y and x using createTransform
        yTransform = createTransform([0, yMax], [0, canvasMaxY]);
        xTransform = createTransform([startYear, endYear], [xPadding, canvasMaxX
                     + xPadding]);

        // make new style
        ctx.save();
        ctx.font = "13px Verdana";
        ctx.strokeStyle = "#D3D3D3";
        ctx.linewidth = 0.1;
        ctx.beginPath();

        // draw ticks on y-axis and vertical lines from the ticks
        for (var i = 0; i < yMax; i += 10) {
            ctx.fillText(i, xPadding - 20, canvasMaxY - yTransform(i));
            ctx.moveTo(xPadding, yTransform(i));
            ctx.lineTo(canvasMaxX + xPadding, yTransform(i));
            ctx.stroke();
        }

        // restore old style
        ctx.restore();

        // make style for drawing points
        ctx.fillStyle = "#333";

        // set radius on 4
        var radius = 4;

        // draw points on datapoints
        Object.keys(array).forEach(function(key) {
            ctx.beginPath();
            ctx.arc(xTransform(key), canvasMaxY - yTransform(array[key]), radius,
            0, Math.PI * 2, true);
            ctx.fill();
        });

        // draw graph
        Object.keys(array).forEach(function(key) {

            // calculate the x- and y-coordinate
            xValue = xTransform(key);
            yValue = canvasMaxY - yTransform(array[key]);

            // start the path at the first year and move to coordinates
            if (key == startYear) {
                ctx.beginPath();
                ctx.moveTo(xValue, yValue);

            // from the second year on, draw lines to coordinates
            } else {
                ctx.lineTo(xValue, yValue);
                ctx.stroke();
            }

            // draw x ticks
            ctx.font = "13.5px Verdana";
            ctx.textAlign = "center";
            ctx.fillText(key, xValue, canvasMaxY + 20);
        });
    }
}

// send request to the server
txtFile.open("GET", fileName);
txtFile.send();

// returns the function for linear transformation
function createTransform(domain, range) {
    // domain is a two-element array of the data bounds [domain_min, domain_max]
    // range is a two-element array of the screen bounds [range_min, range_max]
    // this gives you two equations to solve:
    // range_min = alpha * domain_min + beta
    // range_max = alpha * domain_max + beta
    // a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var delta_domain = domain_max - domain_min
    var range_min = range[0]
    var range_max = range[1]
    var delta_range = range_max - range_min

    // formulas to calculate the alpha and the beta
    var alpha = delta_range / delta_domain
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x) {
        return alpha * x + beta;
    }
}
