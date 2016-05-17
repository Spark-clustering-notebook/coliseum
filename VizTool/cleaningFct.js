function cleanup() {
	d3.select("#socle").remove()
	d3.select("div.visu").remove()
	d3.select("div.menu").remove()

	var body = d3.select("body").append("div").attr("id","socle");
	var visuSocle = body.append("div").attr("id","visuSocle");
	var menuSocle = body.append("div").attr("id","menuSocle");
	var visu = visuSocle.append("div").classed("visu",true).attr("id","visu");
	var menu = menuSocle.append("div").classed("menu",true).attr("id","menu");

	//Button 
	visu.append("button").attr("id","magic").text("Hide menu");
	d3.select("#magic").on("click",function(){$(document).ready(function(){jqueryHideMenu()})})

	menu.append("div").classed("menu1",true).append("a").attr("href","data.csv").text("Data Example");
	menu.append("div").classed("menu2",true);
	upload()

}

function cleanup2() {
	d3.select("div.visu").remove()
	d3.select("div.menu2").remove()

	d3.select("#clusterChoice").remove()
	d3.select("#featuresSelected").remove()

	var visu = d3.select("#visuSocle").append("div").classed("visu",true).attr("id","visu");

	//Button 
	visu.append("button").attr("id","magic").text("Hide menu");
	d3.select("#magic").on("click",function(){$(document).ready(function(){jqueryHideMenu()})})

	d3.select("div.menu").append("div").classed("menu2",true);
}


function cleanupScatter() {

	d3.select("div.visu").remove()

	var visu = d3.select("#visuSocle").append("div").classed("visu",true).attr("id","visu");

	//Button 
	visu.append("button").attr("id","magic").text("Hide menu");
	d3.select("#magic").on("click",function(){$(document).ready(function(){jqueryHideMenu()})})
}

function cleanupPC() {

	d3.select("div.visu").remove()

	var visu = d3.select("#visuSocle").append("div").classed("visu",true).attr("id","visu");

	//Button 
	visu.append("button").attr("id","magic").text("Hide menu");
	d3.select("#magic").on("click",function(){$(document).ready(function(){jqueryHideMenu()})})
}