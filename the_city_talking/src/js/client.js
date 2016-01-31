const d3 = require('d3');
import "../scss/main.scss";

var width=1000,
	height=400;

var data=[];

var testmonth="01-2014";

var chart = d3.select(".chart")
	.attr("width",width)
	.attr("height",height);

var formatDate = d3.time.format("%d-%m-%Y");

var x = d3.time.scale()
	.range([0,width]);

var y = d3.scale.linear()
	.range([height,0]);

var line = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.NO2); });

function drawmonth(month)
{
	d3.json("json_centre/"+testmonth+".json",function(error,json){

	});
	d3.select("path").datum();
}

d3.json("json_centre/"+testmonth+".json",function(error,json){
	if (error) throw error;
	data.Date = json.map(function(d){return formatDate.parse(d.Date)});
	data.NO2 = json.map(function(d){return +d.NO2});

	console.log(data);

	x.domain(d3.extent(data, function(d) { return d.Date; }));
	y.domain(d3.extent(data, function(d) { return d.NO2; }));

	chart.append("path")
		.datum(data)
		.attr("d",line)
		.attr("class","lineb")
		.transition()
		.delay(500)
		.attr("class","line");
});
