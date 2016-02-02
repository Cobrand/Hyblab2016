const d3 = require('d3');
import "../scss/main.scss";

var width=1000,
	height=400;

var data=[],
	text;

var testmonth="01-2014";

var chart = d3.select(".chart")
	.attr("width",width)
	.attr("height",height)

chart.append("path");

var formatDate = d3.time.format("%H\:00");

function type(d) {
  d.date = formatDate.parse(d.date);
  d.no2 = +d.no2;
  return d;
}

var x = d3.time.scale()
	.range([0,width]);

var y = d3.scale.linear()
	.range([height,0]);

chart.append("linearGradient")                
        .attr("id", "line-gradient")            
        .attr("gradientUnits", "userSpaceOnUse")    
        .attr("x1", 0).attr("y1", 0)         
        .attr("x2", 0).attr("y2", height)      
    .selectAll("stop")                      
        .data([                             
            {offset: "0%", color: "red"},       
            {offset: "25%", color: "red"},  
            {offset: "25%", color: "black"},        
            {offset: "50%", color: "black"},        
            {offset: "50%", color: "lawngreen"},    
            {offset: "100%", color: "lawngreen"}    
        ])                  
    .enter().append("stop")         
        .attr("offset", function(d) { return d.offset; })   
        .attr("stop-color", function(d) { return d.color; });  

var line = d3.svg.line()
	.interpolate("cardinal")
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.NO2); });

function format_normal(number)
{
	if(number < 10)
	{
		return "0"+number;
	}
	return ""+number;
}

function update_month(month)
{
	// TODO : Remplacer par les vraies valeurs actuelles
	var year = 2010;
	var facility = "centre"

	drawmonth(month,year,facility)
}

function update_year(year)
{
	// TODO : Remplacer  par les vraies valeurs actuelles
	var month = 1
	var facility = "centre"

	drawmonth(month,year,facility)
}

function update_facility(facility)
{
	// TODO : Remplacer par les vraies valeurs actuelles
	var year = 2010;
	var month = 1;

	drawmonth(month,year,facility)
}

function drawmonth(month,year,facility)
{
	d3.json("json_"+facility+"/"+format_normal(month)+"-"+year+".json",function(error,json){
		if (error) throw error;
		data = json.map(function(d){return {"Date":formatDate.parse(d.Hour),"NO2":+d.NO2};});

		x.domain(d3.extent(data, function(d) { return d.Date; }));
		y.domain(d3.extent(data, function(d) { return d.NO2; }));

		chart.select("path")
			.datum(data)
			.transition()
			.attr("d",line)
			.attr("class","line");

		text = chart.selectAll("text")
			.data(data)
			.text(function(d){return d.NO2;})
			.attr("x",function(d){return x(d.Date)+10;})

		text.transition()
			.delay(250)
			.attr("y",function(d){return y(d.NO2)-3;})

		text.enter().append("text")
			.attr("x",function(d){return x(d.Date)+10;})
			.attr("y",function(d){return y(d.NO2)-3;})
			.text(function(d){return d.NO2;});			

		text.exit().remove();

	});
}

var buttons = d3.select("body")
	.append("div")
	.attr("id","buttons");

var rowmonths = buttons.append("div")
	.attr("id","rowmonths");

var rowyears = buttons.append("div")
	.attr("id","rowyears");

var rowfacilities = buttons.append("div")
	.attr("id","rowfacilities");

/*
body.append("button")
	.on("click",function(){drawmonth("03-2014")})
	.attr("value","kek");
*/

var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
var d_months=months.map(function(d,i){ return {"month":d,"num":i}});
var monthbuttons = rowmonths.selectAll("button")
	.data(d_months);

monthbuttons.enter().append("button")
	.text(function(d){return d.month;})
	.attr("class","monthbutton")
	.on("click",function(d){
		update_month(d.num);
	});

var years=[2010,2011,2012,2013,2014,2015,2016];
var d_years=years.map(function(d){return {"year":d}});
var yearbuttons = rowyears.selectAll("button")
	.data(d_years);

yearbuttons.enter().append("button")
	.text(function(d){return d.year;})
	.attr("class","yearbutton")
	.on("click",function(d){
		update_year(d.year);
	});

var facilities=["centre","kerbside"]
var d_facilities=facilities.map(function(d){return {"fac":d}});
var facilitybuttons = rowfacilities.selectAll("button")
	.data(d_facilities);

facilitybuttons.enter().append("button")
	.text(function(d){return d.fac;})
	.attr("class","facilitybutton")
	.on("click",function(d){
		update_facility(d.fac);
	});

setTimeout(function()
{
	drawmonth(4,2013,"centre");
},500);

setTimeout(function()
{
	drawmonth(8,2015,"centre");
},2000);
