
var width = window.innerWidth, height = window.innerHeight;
var body = d3.select("body");

var svg = d3.select("#colormap").append("svg")
    .attr("width", width)
    .attr("height", height);


//viewport area in coordinates

var extent = [[37.460,55.706],[37.746,55.796]];
var lines = [];
var offset = 0;
var pw = (width>1200) ? width : 1200;

//specifying projection
var projection = d3.geo.mercator()
//	.center([37.530182,55.768239])
  .center([37.610643,55.778450])
  .scale(900000*(pw/1200));

var path = d3.geo.path()
		.projection(projection);

var parksPath = d3.geo.path()
		.projection(projection);


//setting the area
var rect = svg.append("svg:g")
	.attr("width", width)
	.attr("height", height)
	.attr("id", "rect");

var streets = rect.append("svg:g")
	.attr("id", "streets");

var contours = rect.append("svg:g")
  .attr("id", "contours");


var stationsPoints = rect.append("svg:g")
	.attr("id", "stations");

/*
d3.json("geodata/streets.geojson", function(collection) {
	  streets.selectAll("#streetsLines")
	    .data(collection.features)
	    .enter().append("svg:path","streetsLines")
		.attr("fill", "none")
		.style("stroke", "rgba(100,100,100,0.5)")
		.style("stroke-width", 0.7)
	    .attr("d", path);
	});
  */

  function color(d,i) {
    var c = d3.hsl((i = ((i+offset)) % 360), 0.5, 0.45);
    return c;
  }

  function setID(d,i) {
    return i;
  }

  d3.json("geodata/contours4.geojson", function(collection) {

    var arr =collection.features.sort(function(a,b) {
        return (a.properties['e'] - b.properties['e']);
      });

  	  contours.selectAll("#streetsLines")
  	    .data(collection.features)
  	    .enter()
        .append("svg:path","streetsLines")
  		  .attr("fill", "none")
        .style("stroke", color)
  		  .style("stroke-width", 0.8)
        .attr("id", setID)
  	    .attr("d", path)
        .call(function() {
          lines.push(this);
        });

        setInterval(recolor, 50);

  	});

    function recolor() {

      if(offset >= 360) offset = 0;

      lines.forEach(function(el,i) {
        el.style("stroke", color);
      });

      offset++;

    }
