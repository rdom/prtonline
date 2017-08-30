// online dispalay for gsi prototype (png version)
// contact: r.dzhygadlo at gsi.de

var gOnline = 1;


$(document).ready(function(){

    var canv = document.getElementById('canv').getContext('2d');
    var iprt = new Image();
    
    
    var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 110, left: 80},
    margin2 = {top: 330, right: 20, bottom: 30, left: 80},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

    var parseDate = d3.timeParse(".%L");

    var bisectDate = d3.bisector(function(d) { return d.time; }).left;
    

    var x = d3.scaleTime().range([0, width]),
	x2 = d3.scaleTime().range([0, width]),
	y = d3.scaleLinear().range([height, 0]),
	y2 = d3.scaleLinear().range([height2, 0]);

    var xAxis = d3.axisBottom(x),
	xAxis2 = d3.axisBottom(x2),
	yAxis = d3.axisLeft(y);

    var brush = d3.brushX()
        .extent([[0, 0], [width, height2]])
        .on("brush end", brushed);

    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    var area = d3.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.total);});
    
    var area2 = d3.area()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return x2(d.time); })
        .y0(height2)
        .y1(function(d) { return y2(d.total); });

    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    
    var vline = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    vline.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", height)
    
    svg.append("defs").append("clipPath")
        .attr("id", "clip")
	.append("rect")
        .attr("width", width)
        .attr("height", height);
    
    var mfocus = svg.append("g")
        .attr("class", "mfocus")
        .style("display", "none");

    mfocus.append("circle")
        .attr("r", 4.5);

    mfocus.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

    var adata;

    d3.csv("data/timeline.csv", function(error, data0) {
	if (error) throw error;

	var data = new Array();
	data0.forEach(function(d) {
	    if(d.total>100) {
		d.time = new Date(d.time*1000);
		d.total = +d.total/1000;
		data.push(d);
	    }
	});

	data.sort(function(a, b) {
	    return a.time - b.time;
	});

	adata=data;

	 x.domain(d3.extent(data, function(d) { return d.time; }));
	 y.domain([0, d3.max(data, function(d) { return d.total; })]);
	
	// x.domain([data[0].time, data[data.length - 1].time]);
	// y.domain(d3.extent(data, function(d) { return d.total; }));
	
	x2.domain(x.domain());
	y2.domain(y.domain());

	focus.append("path")
	    .datum(data)
	    .attr("class", "area")
	    .attr("d", area);
	
	focus.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis);

	focus.append("g")
	    .attr("class", "axis axis--y")
	    .call(yAxis);

	context.append("path")
	    .datum(data)
	    .attr("class", "area")
	    .attr("d", area2);

	context.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + height2 + ")")
	    .call(xAxis2);

	context.append("g")
	    .attr("class", "brush")
	    .call(brush)
	    .call(brush.move, x.range());

	svg.append("rect")
	    .attr("class", "zoom")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	    .on("mouseover", function() {
		mfocus.style("display", null);
		vline.style("display", null);
		//		label.style("display", null);
	    })
	    .on("mouseout", function() {
		mfocus.style("display", "none");
		vline.style("display", "none");
		//		label.style("display", "none");
	    })	
	    .on("mousemove", mousemove)
	    .call(zoom);

	// append scatter plot to main chart area
	var dots = focus.append("g");
	dots.attr("clip-path", "url(#clip)");
	dots.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr('class', 'dot')
            .attr("r",3)
            .attr("cx", function(d) { return x(d.time); })
            .attr("cy", function(d) { return y(d.total); })


	function mousemove() {
	var x0 = x.invert(d3.mouse(this)[0]),
	    i = bisectDate(data, x0, 1),
	    d0 = data[i - 1],
	    d1 = data[i],
	    d = x0 - d0.time > d1.time - x0 ? d1 : d0;
	    mfocus.attr("transform", "translate(" + (margin.left +x(d.time)) + "," + (margin.top + y(d.total)) + ")");
	    vline.attr("transform", "translate(" + (margin.left+ x(d.time)) + "," + margin.top + ")");
	mfocus.select("text").text(d.time.getTime()/1000);
	    if(gOnline==0){
		console.log("data/pics/digi_"+d.time.getTime()/1000+".png");
		iprt.src = "data/pics/digi_"+d.time.getTime()/1000+".png";
		iprt.onload = function(){ canv.drawImage(iprt, 0, 0); }
	    }
    }

    });


    function brushed() {
	if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
	var s = d3.event.selection || x2.range();
	x.domain(s.map(x2.invert, x2));
	focus.select(".area").attr("d", area);
	focus.select(".axis--x").call(xAxis);
	svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
				 .scale(width / (s[1] - s[0]))
				 .translate(-s[0], 0));

	focus.selectAll(".dot")
	    .attr("cx", function(d) { return x(d.time); })
	    .attr("cy", function(d) { return y(d.total); });
	
    }

    function zoomed() {
	if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
	var t = d3.event.transform;
	x.domain(t.rescaleX(x2).domain());
	focus.select(".area").attr("d", area);
	focus.select(".axis--x").call(xAxis);


	focus.selectAll(".dot")
	    .attr("cx", function(d) { return x(d.time); })
	    .attr("cy", function(d) { return y(d.total); });

	context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
    }

    function type(d) {
	d.time = parseDate(d.time);
	d.total = +d.total;
	return d;
    }

    setInterval(function(){ readData();}, 1000);
    var ttt =1;
    function readData(){
	d3.csv("data/last_timeline", function(newdata) {
	    newdata.forEach(function(d) {
		d.time = new Date(d.time*1000);
		d.total = +d.total/1000;
	    });

	    if(adata[adata.length - 1].time != newdata[0].time && adata[adata.length - 1].total != newdata[0].total){
		adata.push(newdata[0]);
		svg.select("g.x.axis").call(xAxis);
		svg.select("path.line").attr("d", line(adata));
	    }
	});

	if(gOnline==1){
	    x.domain([x.domain()[0], adata[adata.length - 1].time]);
	    y.domain([0, d3.max(adata, function(d) { return d.total; })]);

	    iprt.src = "data/last_digi?" + escape(new Date());
	    iprt.onload = function(){ canv.drawImage(iprt, 0, 0); }
	}
    }
        
    
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
