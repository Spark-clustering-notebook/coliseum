function histo1(dataUp) {

var tous = []
	boolAffParLigne = true;

histoIn(tous,10,dataUp,boolAffParLigne);

}

function histoIn(toto,dimMap,dataUp2,boolLigne) {



	// Préparation data pour fonction foncInfo
	var to1,to2;
	to1 = objToAtt(dataUp2[0]);
	to2 = objToAtt(dataUp2[1]);

	for (var j in to2) {
		to1[j] = to2[j];
	}

	var ObjF = to1;


	var attrNamesd2 = d3.keys(dataUp2[1][0]);
	//console.log(attrNamesd2);

	var dataRezz = [];

	for (var i = 0; i < dataUp2[0].length; i++) {
		var obj6 = dataUp2[0][i];
		//console.log(obj6);
		for (var j = 0; j < attrNamesd2.length; j++) {
			obj6[attrNamesd2[j]] = dataUp2[1][j][attrNamesd2[j]];
		};
		dataRezz.push(obj6);
	};


	var attrNames2 = Object.keys(ObjF);
	var nbAtt2 = Object.size(dataRezz[0]);




  var size = 150,		// taille rect et ...
      padding = 10;		// espacement

  var 	data2 = [],	// tableau de tableau des valeurs des attributs
  		nbAtt,	// nombre d'attributs des objets
  		nbObj,	// nopmbre d'objets
  		scaleTab,	// tableau des echelles associé à chaque attribut
  		attrNames,	// tableau des noms des attributs
  		strIndex,	// tableau des indices des attributs de type string
		rectTaille = size - padding,
		rectTaill = size - padding,
		rectHistoWidth = 15,	// largeur d'une barre histogramme
		dimY = dimMap,
		dimX = Math.floor(100/dimY),
		cellMargin = 1,
		bigCellWidthMarg = 20,
		bigCellHeightMarg = 20,
		bigCellWidth = (2*cellMargin)+(dimX*rectTaill)+((dimX-1)*(2*cellMargin))+bigCellWidthMarg,
		bigCellHeight = (2*cellMargin)+(dimY*rectTaill)+((dimY-1)*(2*cellMargin))+bigCellHeightMarg,
		rectPadding =  (11+bigCellWidthMarg)/2;


	if (nbAtt2<=10) {
		var coul = d3.scale.category10();
	}
	else {
		var coul = d3.scale.category20();
	}


	//console.log(dataUp2);
	//console.log(dataUp2[0]);

	var dataTemp = objToAtt(dataUp2[0]);
	for (var i in dataTemp) {
		data2.push(dataTemp[i]);
	};

	//data2 est un tableau de tableaux, ou chacun rpz l'ensemble des valeurs d'un att

	attrNames = Object.keys(dataUp2[0][0]);
	nbAtt = data2.length;

	//On efface pour mieux redessiner
	commeNeuf();
	legendCircle(nbAtt2);

	d3.selectAll("div.butAttributs button").remove();
	d3.select("div.boutons1").remove();

	var cellsArea = d3.select("div.dessein").append("div").classed("cellsArea",true);
	var cellsArea2 = cellsArea.append("div").classed("cellsArea2",true);

							
	var svg = cellsArea2.append("svg")			// on ajoute un espace SVG
						.attr("id","circles")
						.attr("width", bigCellWidth)
						.attr("height", bigCellHeight)
						.call(	d3.behavior.zoom()
						            .scaleExtent([0.1, 30]) 
						            .on("zoom", zoom1All)
						       )
						.on("dblclick.zoom", null)
						.append("g")
						.classed("gZoom",true);


		//Zone de boutons


	d3.select("div.boutonsSup").append("input")
			.attr("id","dimYY")
			.attr("type","text")
			.attr("value","Entrez la dimension désirée  1<x");
			//.attr("size","80%");

			//.attr("onchange","ModifDimSizeCircles()");

	document.querySelector("#dimYY").onchange = function(){ ModifDimSizeHisto(dataUp2,boolLigne); };



	d3.select("div.boutonsSup").append("button")
								.classed("lignCol",true)
								.on("dblclick",function(){ histoIn([],dimY,dataUp2,true);})
								.text("dblclick : By Column");
	d3.select("div.boutonsSup").append("button")
								.classed("lignCol",true)
								.on("dblclick",function(){ histoIn([],dimY,dataUp2,false);})
								.text("dblclick : By Raw");

 var boutonsAtt = d3.select(".boutonsSup").append("div")
 							.classed("butAttributs",true);


		//On crée les cellules
		var cell = svg.selectAll("g.cellCircles")
  				.data(dataRezz)
			    .enter()
			    .append("g")
			    .classed("cellCircles",true)
			    .attr("transform", function(d,i) { //console.log(d);
			    	var posId = posInd(i,dimY)	// retourne les indices de pos
			    	return inversLigneColonHisto(boolLigne,posId,rectTaill,cellMargin,nbAtt2,rectHistoWidth,padding); });

			//Background cellules
		    cell.append("rect")
		        .attr("class", "frame")		    
		        .attr("x", padding / 2)
		        .attr("y", padding / 2)
		        .attr("width", rectHistoWidth*nbAtt2 + padding)
		        .attr("height", 90)
				.on("dblclick",function(d,i){foncInfo(ObjF,i);});

	        cell.append("text")
	        	.attr("transform","translate(7,19)")
	        	.attr("font-size","20px")
	        	.text(function(d,i){ return i+1;});



		// On construit les echelles adaptées aux intervalles des attributs
		scaleTab = tabScale(data2,68,nbAtt2);
		scaleTab2 = tabScaleGen(ObjF,attrNames2,68,nbAtt2);


	    for (var indo1=0; indo1<nbAtt2; indo1++) {
	    	if (typeof ObjF[attrNames2[indo1]][0] !== "number") {}
	    	else {


// On initialise les cercles avec r=0
var trans1 = cell.append("rect")
		    	.attr("class",attrNames2[indo1])	    	
		    	.attr("width",rectHistoWidth)
		    	.attr("height",0)
		    	.attr("fill","none");

//On donne la bonne valeur du rayon avec transition
    	trans1.transition()
		    	.duration(1500)
		    	.ease("bounce")
		    	.attr("x",function(){return 8+indo1*15;})
		    	.attr("y",19)
		    	.attr("fill",function() { return coul(indo1);})
		    	.attr("height",function(d){ 
		    		//console.log(d);
		    		//console.log(d[attrNames[indo1]]);
		    		return scaleTab2[indo1](d[attrNames2[indo1]]); });    	
		

		//Création légend suite
		d3.select("svg.legLine").append("line")
			.attr("x1",10)
			.attr("x2",60)
			.attr("y1", indo1*20+20)
			.attr("y2", indo1*20+20)
			.attr("stroke",coul(indo1))
			.attr("stroke-width",5);

		d3.select("svg.legLine").append("text")
			.attr("font-size","20px")
			.attr("transform", function() {	return "translate(75,"+(indo1*20 + 23)+")";		})
			.text(attrNames2[indo1]);
			    
	    			}		    
			    	


			    								}



	// Suprime les cercles non selectionnés
if (toto.length == 0) {}
else if (toto != null) {
    for (var indo1=0; indo1<nbAtt2; indo1++) {
		if (typeof ObjF[attrNames2[indo1]][0] !== "number") {}
		else if (toto.indexOf(indo1) != -1) {}	// si on trouve l'att n° indo1 dans le tableau on le laisse
    	else {				//sinon on supprime les cercles corespondants

			var aSupp = "."+attrNames2[indo1]
			d3.selectAll(aSupp).remove();
			}
											}
			};





	var divChoixAttVisible = d3.select("div.butAttributs").append("div").classed("divChoixAttVisible",true);

	var ChoixAttVisible = divChoixAttVisible.append("select")
												.attr("id","AttVisible")
												.attr("multiple",true);

	var butAct =  d3.select("div.butAttributs").append("button").attr("class","b1")
													.attr("size","5")
													.attr("id","Activation");
		butAct.text("Activer selection");

		var selectAtt2 = ChoixAttVisible.append("optgroup")
										.classed("optgroup0",true)
										.attr("label","Attributs à afficher");


	// On construit les boutons pour afficher un attribut unique
    for (var indo1=0; indo1<nbAtt2; indo1++) {
		if (typeof ObjF[attrNames2[indo1]][0] !== "number") {}
    	else{

    		var id1 = "circleA"+indo1;

			selectAtt2.append("option")
					.classed("attsButtons",true)
					.attr("id",id1)
					.attr("value",indo1)
					.attr("selected",false)
					.text(function(){ return attrNames2[indo1];});

			id1 = "#"+id1;
			//document.querySelector(id1).onclick = function(){ maj4(this.value,dimY,dataUp2); };
	
			}	
	}

	butAct.on("click",function() {

		var lol = document.getElementById("AttVisible");
		var tabElemSelect = [];

		for (var i = 0; i < lol.options.length; i++) {
			if (lol.options[i].selected) { 
				tabElemSelect.push(i) };
		};
		//console.log(tabElemSelect);
		histoIn(tabElemSelect,dimY,dataUp2,boolLigne);
	});
	
	//Help button
	d3.select("#help0").remove();
	d3.select("div.div2Buttons").append("button").attr("id","help0").text("Help");
	document.querySelector("#help0").addEventListener("click",function(){helpUserHisto();});
	
};





function ModifDimSizeHisto(dataUp3,lignOrCol){

	var htmlElem = document.getElementById("dimYY");
	var val1 = htmlElem.value;
	val1 = +val1;

	histoIn([],val1,dataUp3,lignOrCol);

};






// range les cellules par colonne si vrai, par ligne si faux
function inversLigneColonHisto(unBool,lesPosistionSurGrille,recTail,celMarg,nbAtt2,rectHistoWidth2,padding2) {
	if (unBool) {
		return "translate(" + (lesPosistionSurGrille[0] * (nbAtt2*rectHistoWidth2+padding2+2)) + "," + (lesPosistionSurGrille[1] * (95)+5) + ")"
	}

	else {
		return "translate(" + (lesPosistionSurGrille[1] * (nbAtt2*rectHistoWidth2+padding2+2)) + "," + (lesPosistionSurGrille[0] * (95)+5) + ")"
	}

}
