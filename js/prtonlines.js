// online dispalay for gsi prototype (png version)
// contact: r.dzhygadlo at gsi.de

var gOnline = 1;


$(document).ready(function(){

    var context = document.getElementById('canv').getContext('2d');
    var iprt = new Image();
    
    var margin = {top: 20, right: 50, bottom: 30, left: 100},
	width = 1200 - margin.left - margin.right,
	height = 250 - margin.top - margin.bottom;
    
    var panExtent = {x: [0,width], y: [-100,400] };
    

    var minDate = new Date(2015, 0, 1);
    maxDate = new Date(2016, 0, 1);

    var bisectDate = d3.bisector(function(d) { return d.time; }).left;
    
    var x = d3.time.scale()
	.range([0, width]);

    var y = d3.scale.linear()
	.range([height, 0]);

    var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

    var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

    var line = d3.svg.line()
	.x(function(d) { return x(d.time); })
	.y(function(d) { return y(d.total); });

    var svg = d3.select("#timeline").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var zoom = d3.behavior.zoom()
	.x(x)
    	.scaleExtent([0.02, 40])
	.on("zoom", draw);

    var adata;
    
    d3.csv("data/timeline.csv", function(error, data) {
	data.forEach(function(d) {
	    d.time = new Date(d.time*1000);
	    d.total = +d.total/1000;
	});

	data.sort(function(a, b) {
	    return a.time - b.time;
	});

	x.domain([data[0].time, data[data.length - 1].time]);
	y.domain(d3.extent(data, function(d) { return d.total; }));
	zoom.x(x);
	
	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	    .append("text")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 6)
	    .attr("dy", ".71em")
	    .style("text-anchor", "end")
	    .text("x1k");

	svg.append("path")
	    .attr("class", "line")
	;//   .attr("d", line(data));

	var focus = svg.append("g")
	    .attr("class", "focus")
	    .style("display", "none");

	focus.append("circle")
	    .attr("r", 4.5);

	focus.append("text")
	    .attr("x", 9)
	    .attr("dy", ".35em");

	svg.append("rect")
	    .attr("class", "overlay")
	    .attr("width", width)
	    .attr("height", height)
	    .on("mouseover", function() { focus.style("display", null); })
	    .on("mouseout", function() { focus.style("display", "none"); })
	    .on("mousemove", mousemove)
	    .call(zoom)
	    .on("click",function() { gOnline=0; d3.select("#btnOnline").text("Offline"); });

	adata = data;
	svg.select("path.line").data([data]);
	draw();

	function mousemove() {
	    var x0 = x.invert(d3.mouse(this)[0]),
		i = bisectDate(data, x0, 1),
		d0 = data[i - 1],
		d1 = data[i],
		d = x0 - d0.time > d1.time - x0 ? d1 : d0;
	    focus.attr("transform", "translate(" + x(d.time) + "," + y(d.total) + ")");
	    focus.select("text").text(d.time.getTime()/1000);
	    if(gOnline==0){
		iprt.src = "data/pics/digi_"+d.time.getTime()/1000+".png";
		iprt.onload = function(){ context.drawImage(iprt, 0, 0); }
	    }
	}
	
	
    });
    
    setInterval(function(){ readData();}, 1000);
    var ttt =1;
    function readData(){
	d3.csv("data/last_timeline", function(newdata) {
	    newdata.forEach(function(d) {
		d.time = new Date(d.time*1000);
		d.total = +d.total/1000;
	    });

//	    var adata = d3.selectAll(".line").data();
	    adata.push(newdata[0]);
	    // adata[adata.length - 1].time-86400000 

	    x.domain([x.domain()[0], adata[adata.length - 1].time]);
	    y.domain([0, d3.max(adata, function(d) { return d.total; })]);
	    // x.domain(d3.extent(adata, function(d) { return d.date; }));

	    //zoom.translate([0, 1000]);
	    
	    svg.select("g.x.axis").call(xAxis);
            svg.select("path.line").attr("d", line(adata));
	});
    }
    
    function draw() {

	if(adata[adata.length - 1].time - x.domain()[0]>3600 ){
	    
	x.domain([x.domain()[0],adata[adata.length - 1].time]);
	    
	svg.select("g.x.axis").call(xAxis);
	svg.select("g.y.axis").call(yAxis);
	    svg.select("path.line").attr("d", line);
	}
   }
    
   //  function draw() {
// 	var e = d3.event,
//         tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale)),
//         ty = e.translate[1];
	
//         zoom.translate([tx, ty]);
// //	x.domain([adata[0].time, adata[adata.length - 1].time]);
	   
	
// 	svg.select("g.x.axis").call(xAxis);
// 	svg.select("g.y.axis").call(yAxis);
//         svg.select("path.line").attr("d", line(adata));

//     }
    
    
});


function prtOnline(){
    if(gOnline == 1){
	gOnline = 0;
	d3.select("#btnOnline").text("Offline");
    }else{
	gOnline = 1;
	d3.select("#btnOnline").text("Online");
    }
}
