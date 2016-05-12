function drawCamambert(data){

/*
	var boutons12 = d3.select("div.legendG2")
							.append("div")
							.classed("boutons12",true);

	var boutons2 = d3.select("div.legendG2")
							.append("div")
							.classed("boutons2",true)
							.attr("id","b2");
	
	var to1,to2;

	to1 = objToAtt(dataUp2[0]);
	to2 = objToAtt(dataUp2[1]);

	//console.log(to1);
	//console.log(to2);

	for (var j in to2) {
		to1[j] = to2[j];
	}
	//console.log(to1);

	var ObjF = to1;
	//console.log(clesF);

	var SumTab = [];
	for (var key in data[0].vector) {
		SumTab.push(d3.sum(data,sumAccessor(key)))
	};

	for (var i in ObjF) {
		SumTab.push(d3.sum(ObjF[i]));
	};
*/
	//console.log(SumTab.length);

	var clesF = d3.keys(data[0].vector);
	clesF.push("cardinality")
	var pie1 = d3.layout.pie();
	var coul1 = ["#393b79" , "#5254a3" , "#6b6ecf" , "#9c9ede" , "#637939" , "#8ca252" , "#b5cf6b" , "#cedb9c" , "#8c6d31" , "#bd9e39" , "#e7ba52" , "#e7cb94" , "#843c39" , "#ad494a" , "#d6616b" , "#e7969c" , "#7b4173" , "#a55194" , "#ce6dbd" , "#de9ed6" , "#3182bd" , "#6baed6" , "#9ecae1" , "#c6dbef" , "#e6550d" , "#fd8d3c" , "#fdae6b" , "#fdd0a2" , "#31a354" , "#74c476" , "#a1d99b" , "#c7e9c0" , "#756bb1" , "#9e9ac8" , "#bcbddc" , "#dadaeb" , "#636363" , "#969696" , "#bdbdbd" , "#d9d9d9" , "#393b79" , "#5254a3" , "#6b6ecf" , "#9c9ede" , "#637939" , "#8ca252" , "#b5cf6b" , "#cedb9c" , "#8c6d31" , "#bd9e39" , "#e7ba52" , "#e7cb94" , "#843c39" , "#ad494a" , "#d6616b" , "#e7969c" , "#7b4173" , "#a55194" , "#ce6dbd" , "#de9ed6" , "#3182bd" , "#6baed6" , "#9ecae1" , "#c6dbef" , "#e6550d" , "#fd8d3c" , "#fdae6b" , "#fdd0a2" , "#31a354" , "#74c476" , "#a1d99b" , "#c7e9c0" , "#756bb1" , "#9e9ac8" , "#bcbddc" , "#dadaeb" , "#636363" , "#969696" , "#bdbdbd" , "#d9d9d9" , "#393b79" , "#5254a3" , "#6b6ecf" , "#9c9ede" , "#637939" , "#8ca252" , "#b5cf6b" , "#cedb9c" , "#8c6d31" , "#bd9e39" , "#e7ba52" , "#e7cb94" , "#843c39" , "#ad494a" , "#d6616b" , "#e7969c" , "#7b4173" , "#a55194" , "#ce6dbd" , "#de9ed6" , "#3182bd" , "#6baed6" , "#9ecae1" , "#c6dbef" , "#e6550d" , "#fd8d3c" , "#fdae6b" , "#fdd0a2" , "#31a354" , "#74c476" , "#a1d99b" , "#c7e9c0" , "#756bb1" , "#9e9ac8" , "#bcbddc" , "#dadaeb" , "#636363" , "#969696" , "#bdbdbd" , "#d9d9d9" , "#393b79" , "#5254a3" , "#6b6ecf" , "#9c9ede" , "#637939" , "#8ca252" , "#b5cf6b" , "#cedb9c" , "#8c6d31" , "#bd9e39" , "#e7ba52" , "#e7cb94" , "#843c39" , "#ad494a" , "#d6616b" , "#e7969c" , "#7b4173" , "#a55194" , "#ce6dbd" , "#de9ed6" , "#3182bd" , "#6baed6" , "#9ecae1" , "#c6dbef" , "#e6550d" , "#fd8d3c" , "#fdae6b" , "#fdd0a2" , "#31a354" , "#74c476" , "#a1d99b" , "#c7e9c0" , "#756bb1" , "#9e9ac8" , "#bcbddc" , "#dadaeb" , "#636363" , "#969696" , "#bdbdbd" , "#d9d9d9"];
	var arc = d3.svg.arc().outerRadius(200).innerRadius(100);

	var tabIndice = [];
	var tabArcs = [];

	//console.log(ObjF);


	var cellsArea = d3.select("#visu").append("div").classed("cellsArea",true);
	var cellsArea2 = cellsArea.append("div").classed("cellsArea2",true);

	var objData = prepareDataForCamambert(data)
	delete objData["clusterID"];

	// For each attributz
	for (var ind2 = 0; ind2 < clesF.length; ind2++) {

		// Create a window
		var fen = cellsArea2.append("div")
				.classed("t"+ind2,true)
				.classed("mapAtt",true)
				.style("top","30px")
				.style("left","30px")
				.style("width","450px")
				.style("height","470px")
				.style("float","left");

		var tab1 = [];
		var tab2 = [];
		for (var i = 0; i < objData[clesF[ind2]].length; i++) {
			var obj = {};
			if (objData[clesF[ind2]][i]) { obj.ind = (i+1);
										obj.val = objData[clesF[ind2]][i];
										tab1.push(objData[clesF[ind2]][i]);
										tab2.push(obj);
										};
		};

		tabIndice.push(tab2);
		var pie2 = pie1(tab1);

		var colorScale = d3.scale.linear().domain([d3.min(objData[clesF[ind2]]),d3.max(objData[clesF[ind2]])]).range(["darkred","lightsteelblue"]);

		// On prépare les données pour le bind avec la DOM
		var dataCercl = [];		// tab des startAngle & endAngle
		for (var i = 0; i < pie2.length; i++) {
			var obj3 = {};
			obj3.startAngle = pie2[i]["startAngle"];
			obj3.endAngle = pie2[i]["endAngle"];
			obj3.indice = tab2[i]["ind"];
			dataCercl.push(obj3);
		 };
		//console.log(dataCercl);

	    var svg1 = fen.append("svg").classed("grrr",true)
	    							.attr("height","450px")
	    							.attr("width","450px")

	    svg1.append("text")
	    		.attr("x","180")
	    		.attr("y","450")
	    		.attr("font-size","20px")
	    		.text(function(){ return clesF[ind2]; });

		var arcs1 = svg1.append("g")
						.attr("transform", "translate(225,225)")
	    				.selectAll("path.arc")
						.data(dataCercl)
						.enter();

		var arcs2 = arcs1.append("path")		// on créer l'objet
						.attr("class", "arc")
						.attr("fill", function(d, i){return colorScale(tab1[i]);});

						arcs2.transition()
								.duration(2000)	// on lui applique une transition
								.attrTween("d", function (d) { 
																var start = {startAngle: 0, endAngle: 0};
																var interpolate = d3.interpolate(start, d);
																return function (t) { return arc(interpolate(t)); };
															});
/*
			arcs2.on("click",function(d){
				foncInfo(ObjF,d.indice-1);	// on lui applique un eventhandler de manière séparer de la transition sinon bog
				});
*/
	};

};