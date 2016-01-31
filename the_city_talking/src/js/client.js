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

function type(d) {
  d.date = formatDate.parse(d.date);
  d.no2 = +d.no2;
  return d;
}

var x = d3.time.scale()
	.range([0,width]);

var y = d3.scale.linear()
	.range([height,0]);

var line = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.NO2); });

function drawmonth(month)
{
	d3.json("json_centre/"+month+".json",function(error,json){
		if (error) throw error;
		data = json.map(function(d){return {"Date":formatDate.parse(d.Date),"NO2":+d.NO2};});

		x.domain(d3.extent(data, function(d) { return d.Date; }));
		y.domain(d3.extent(data, function(d) { return d.NO2; }));

		chart.append("path")
			.datum(data)
			.attr("d",line)
			.attr("class","line");

		chart.selectAll("text")
			.data(data)
			.enter().append("text")
			.attr("x",function(d){return x(d.Date)+10;})
			.attr("y",function(d){return y(d.NO2)-3;})
			.text(function(d){return d.NO2;});

		chart.selectAll("text")
			.exit().remove();

	});
}



setTimeout(function()
{
	drawmonth("04-2013");
},500);
/*
setTimeout(function()
{
	drawmonth("08-2015");
},2000);
*/