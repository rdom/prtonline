// online dispalay for gsi prototype (interactive version)

var colorz =  ["#000082","#000283","#000484","#000786","#000987","#000b89","#000e8a","#00108c","#00128d","#00158e","#001790","#001a91","#001c93","#001e94","#002196","#002397","#002599","#00289a","#002a9b","#002d9d","#002f9e","#0031a0","#0034a1","#0036a3","#0038a4","#003ba5","#003da7","#0040a8","#0042aa","#0044ab","#0047ad","#0049ae","#004bb0","#004eb1","#0050b2","#0053b4","#0055b5","#0057b7","#005ab8","#005cba","#005ebb","#0061bc","#0063be","#0066bf","#0068c1","#006ac2","#006dc4","#006fc5","#0071c6","#0074c8","#0076c9","#0079cb","#007bcc","#007dce","#0080cf","#0082d1","#0084d2","#0087d3","#0089d5","#008cd6","#008ed8","#0090d9","#0093db","#0095dc","#0097dd","#009adf","#009ce0","#009fe2","#00a1e3","#00a3e5","#00a6e6","#00a8e8","#00aae9","#00adea","#00afec","#00b2ed","#00b4ef","#00b6f0","#00b9f2","#00bbf3","#00bdf4","#00c0f6","#00c2f7","#00c5f9","#00c7fa","#00c9fc","#00ccfd","#00ceff","#03cffb","#06cff8","#09d0f5","#0cd1f1","#10d2ee","#13d2eb","#16d3e8","#19d4e4","#1cd4e1","#20d5de","#23d6db","#26d6d7","#29d7d4","#2dd8d1","#30d9ce","#33d9ca","#36dac7","#39dbc4","#3ddbc1","#40dcbd","#43ddba","#46ddb7","#49deb4","#4ddfb0","#50e0ad","#53e0aa","#56e1a7","#5ae2a3","#5de2a0","#60e39d","#63e49a","#66e596","#6ae593","#6de690","#70e78d","#73e789","#76e886","#7ae983","#7de980","#80ea7c","#83eb79","#87ec76","#8aec73","#8ded6f","#90ee6c","#93ee69","#97ef66","#9af062","#9df05f","#a0f15c","#a3f259","#a7f355","#aaf352","#adf44f","#b0f54c","#b4f548","#b7f645","#baf742","#bdf73f","#c0f83b","#c4f938","#c7fa35","#cafa32","#cdfb2e","#d0fc2b","#d4fc28","#d7fd25","#dafe21","#ddff1e","#defb1e","#def81d","#dff41d","#e0f11c","#e0ed1c","#e1ea1b","#e1e61a","#e2e31a","#e2df19","#e3dc19","#e4d818","#e4d518","#e5d217","#e5ce17","#e6cb16","#e6c716","#e7c415","#e7c015","#e8bd14","#e9b914","#e9b613","#eab213","#eaaf12","#ebac12","#eba811","#eca511","#eda110","#ed9e10","#ee9a0f","#ee970f","#ef930e","#ef900e","#f08c0d","#f0890c","#f1850c","#f2820b","#f27f0b","#f37b0a","#f3780a","#f47409","#f47109","#f56d08","#f66a08","#f66607","#f76307","#f75f06","#f85c06","#f85905","#f95505","#f95204","#fa4e04","#fb4b03","#fb4703","#fc4402","#fc4002","#fd3d01","#fd3901","#fe3600","#ff3300","#fb3100","#f83000","#f52f00","#f22e00","#ef2c00","#ec2b00","#e92a00","#e62900","#e32700","#e02600","#dd2500","#da2400","#d72200","#d42100","#d12000","#ce1f00","#cb1d00","#c81c00","#c51b00","#c21a00","#bf1800","#bb1700","#b81600","#b51500","#b21300","#af1200","#ac1100","#a91000","#a60e00","#a30d00","#a00c00","#9d0b00","#9a0900","#970800","#940700","#910600","#8e0400","#8b0300","#880200","#850100"];


var drc_pulseColor;
var drc_pulseColorId = 0;
var drc_PreRect;
var drc_PreColor = "red";
var drc_PreId;
var drc_Block = false;


DrcDigi = function (layoutId) {
    try {

	drc_pulseColor = d3.scale.ordinal().range(["red", "yellow"]);
	
	var width = 800,
	    height = 350,
	    size = 12.3,
	    msize = 114;

	var svg = d3.select(".svg").append("g").attr("transform", "translate(40,5)");
	var rectm = svg.selectAll("g")
	    .data(d3.merge(d3.range(0, 5*msize, msize)
			   .map(function(x,i) {  return d3.range(0, 3*msize, msize)
						 .map(function(y) {return [x+i*25, 2*msize-y];});
					      })))
	    .enter().append("g")
	    .attr("id", function(d, i){
		if(typeof(layoutId)==='undefined'|| layoutId == 3) return "mcp" + +i; 
		else if (layoutId == 1 || layoutId == 2) return "mcp" + +(i%3*5 + Math.floor(i/3)); })
	    .attr("transform", function(d,i) { 
		var shift = d[0];
		if((i+2) % 3 === 0) shift -= 2 + 20 +5 ; 
		else  shift += 2; 
		return "translate(" + shift + "," + d[1] + ")"; })
	    .attr("width", msize)
	    .attr("height", msize)
	    .attr("height0", msize)
	    .style("stroke", "#333")
	    .style("stroke-width", "1px")
	    .style("fill", "#FFFFFF" );

	var rect = rectm.selectAll("rect")
	    .data(d3.merge(d3.range(0, 8*size, size)
			   .map(function(x) { return d3.range(0, 8*size, size)
					      .map(function(y) { return [x,7*size-y];});
					    })))
	    .enter().append("rect")
	    .attr("id", function(d, i){
		if(typeof(layoutId)==='undefined' || layoutId == 2) return "pix" + +i; 
		else if (layoutId == 1 || layoutId == 3) return "pix"+ +(i%8*8 + Math.floor(i/8)); })
	    .attr("class", "pixel")
	    .attr("transform", function(d) { return "translate(" + d + ")"; })
	    .attr("width", size)
	    .attr("height", size)
	    .style("fill", "#CCEBEB" )  //function(d, i){return colorz(i);}
	    .on("mouseover", pulse)
	    .on("click", drc_clickPulse);
	
	rectm.insert("rect", ":first-child") // append("rect")
	    .attr("transform", "translate(-4,-4)")
	    .attr("width", 8*size+8)
	    .attr("height", 8*size+8)
	    .style("stroke-width", "0.1px")
	    .style("fill", "#99D6D6" );
    }
    catch(err) {
	$('.l-content').prepend("<span  style='color:red;font-size:300%; margine:20px;'> current browser probably is too old</span>");
    }
}

function drc_clickPulse() {
    drc_Block = false;
    var rect = d3.select(this);
    var name = d3.select(this.parentNode).attr("id") + rect.attr("id");
    pulse(name,1);
    drc_Block = true;
    
    if(drc_PreRect) drc_PreRect.transition()
	.duration(500).style("fill", drc_PreColor);
    
    if(drc_PreId == rect.attr("id")) {
	drc_Block = false;
	return;
    }
    drc_PreRect = rect;
    drc_PreColor = rect.style("fill");
    drc_PreId = rect.attr("id");
    (function loop() {
	rect.transition()
	    .duration(200)
	    .style("fill",  function() {drc_pulseColorId++; return  drc_pulseColor(drc_pulseColorId % 2);} )
	    .each("end", function() { if (drc_PreId == rect.attr("id")) loop();});
    })();

}
