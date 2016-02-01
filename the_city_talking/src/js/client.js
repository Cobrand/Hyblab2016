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

function drawmonth(month)
{
	d3.json("json_centre/"+month+".json",function(error,json){
		if (error) throw error;
		data = json.map(function(d){return {"Date":formatDate.parse(d.Date),"NO2":+d.NO2};});

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



setTimeout(function()
{
	drawmonth("04-2013");
},500);

setTimeout(function()
{
	drawmonth("08-2015");
},2000);
