
//Fonction de base pour avoir le nombre d'élement d'un objets <=> sont nombre de clé
//
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function objToAtt(tab){
  var res = {}
  var attNames = d3.keys(tab[0]);
  for (var i = 0; i < attNames.length; i++) {

    res[attNames[i]] = [];
    
    for (var j = 0; j < tab.length; j++) {
        res[attNames[i]].push(tab[j][attNames[i]]);
      };  

  };
  return res;
}


// Début du tracer du force layout

function plotForceLayout(nodesLinksData2,dataComp) {

	var tabVall = objToAtt(dataComp);

	plotForceLayoutInside(nodesLinksData2,0,tabVall,false,false,false,false,35);


}



// 2nd part du force layout

function plotForceLayoutInside(data2,numAtt,dataComp1,gravity0,friction0,chargeParam0,linkDistance0,rayMaxNeur0) {

	//On teste les paramètres de force
	var chargeParam1 = chargeParam0;
	var linkDistance1 = linkDistance0;
	var friction1 = friction0;
	var gravity1 = gravity0;
	//Si ce param a pour valeur faux, on lui attribut une val par defaut
	if (!chargeParam1) {chargeParam1 = -300};
	if (!linkDistance1) {linkDistance1 = 100};
	if (!friction1) {friction1 = 0.7};
	if (!gravity1) {gravity1 = 0.1};

	var tabValParamForceLay = [gravity1,friction1,chargeParam1,linkDistance1,rayMaxNeur0];





	//Initialisation visu
	var width = 1500,
	    height = 800;

	//Début zone diag force
	var svg = d3.select("div.visu")
				.append("svg")
				.classed("forceLayout",true);

	// On initialise le diag de force
	var force = d3.layout.force()
	    .charge(chargeParam1)
	    .linkDistance(linkDistance1)
	    .friction(friction1)
	    .gravity(gravity1)
	    .size([width, height]);



	//On prépare les données qui serviront à influencer le graph
	var clesAtt = d3.keys(dataComp1);
	
	//console.log(dataComp1);
	//console.log(clesAtt);
	//console.log(dataComp1[clesAtt[numAtt]]);
	
	var color = d3.scale.linear().domain([d3.min(dataComp1[clesAtt[numAtt]]),d3.max(dataComp1[clesAtt[numAtt]])]).range(["red","blue"]);
	var rayMaxNeur = rayMaxNeur0;
	var cardScale = d3.scale.linear().domain([d3.min(dataComp1["card"]),d3.max(dataComp1["card"])]).range([3,rayMaxNeur]);
	//console.log(data2.nodes)



	//Zone de selection des attributs à visualiser
	var selecteurAttributAVisu = d3.select("div.menu12")
									.append("div")
									.classed("divChoixDeroulantMatAdj",true);

	//Début du select
	var ChoixDeroulant = selecteurAttributAVisu.append("select")
												.attr("id","choice0");

	//Sous titre des options disponibles
	var optGroup0 = ChoixDeroulant
								.append("optgroup")
								.attr("label","Veuillez selectionner un attribut");


	//On créer les options en fonction du nb d'attributs
		for (var i = 0; i < Object.size(dataComp1); i++) {

		var id1 = "Attribut"+i;

		optGroup0.append("option")
					.classed("opt0","true")
					.attr("id",id1)
					.attr("value",i)
					.attr("selected",false)
					.text(function(){ return clesAtt[i];});
		};

	//On va chercher l'option selectionnner
	var choice00 = document.getElementById("choice0");

	choice00.addEventListener("click",function(e){

		//console.log(choice00.selectedIndex);
		d3.layout.force().stop();
		//d3.select("svg").remove();
		plotForceLayoutInside(data2,choice00.selectedIndex,dataComp1,gravity1,friction1,chargeParam1,linkDistance1,rayMaxNeur);
	});







	//Zone de modification des paramètre

	var modifParam = d3.select("div.menu12")
						.append("div")
						.classed("modifParamForceLay",true);

	var linkDist = modifParam.append("input")
								.classed("paramForceLay",true)
								.attr("type","text")
								.attr("value","Gravity 0<x<1");

	var linkDist = modifParam.append("input")
								.classed("paramForceLay",true)
								.attr("type","text")
								.attr("value","Friction 0<x<1");

	var linkDist = modifParam.append("input")
								.classed("paramForceLay",true)
								.attr("type","text")
								.attr("value","Charge -500<x<500");

	var linkDist = modifParam.append("input")
								.classed("paramForceLay",true)
								.attr("type","text")
								.attr("value","linkDistance 0<x<200");

	var linkDist = modifParam.append("input")
								.classed("paramForceLay",true)
								.attr("type","text")
								.attr("value","Rmax Neurone 1<x<60");


	modifParam.append("button")
				.attr("id","ValidChoiceForceLay")
				.text("Effectuer les changements");

	//Tab des val pour le forceLayout
	var tabValBase = [data2,choice00.selectedIndex,dataComp1];

	document.querySelector("#ValidChoiceForceLay").addEventListener("click",function(){ ModifParamForceLay(tabValBase,tabValParamForceLay); });


  force
      .nodes(data2.nodes)
      .links(data2.links)
      .start();

	function dblclick(d) {
	  d3.select(this).classed("fixed", d.fixed = false);
	}

	function dragstart(d) {
	  d3.select(this).classed("fixed", d.fixed = true);
	}

	var drag = force.drag()
    .on("dragstart", dragstart);


  var link = svg.selectAll(".link")
      .data(data2.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width",2);
      //.style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(data2.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", function(d,i){return cardScale(dataComp1["card"][i])})	//fixe la taille du noeud en fonction de la taille du cluster associé
      .style("fill", function(d,i) { return color(dataComp1[clesAtt[numAtt]][i]); })
      .on("dblclick",dblclick)
      .on("click",function(d,i){foncInfo(dataComp1,i);})
      .call(drag);

  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
};



//	Permet de modifier les paramètre du force layout

function ModifParamForceLay(tabValBase,tabValParamForceLay) {

	var valInTab = document.querySelectorAll("input.paramForceLay");

	var inputVal;
	var tabBoolToChange = tabValBase;
	
	for (var i = 0; i < valInTab.length; i++) {
		inputVal = valInTab[i].value;
		inputVal = +inputVal;
		if (!isNaN(inputVal)) {
			tabBoolToChange.push(inputVal)
		}
		else {
			tabBoolToChange.push(tabValParamForceLay[i])
		};
	};

	plotForceLayoutInside(tabBoolToChange[0],tabBoolToChange[1],tabBoolToChange[2],tabBoolToChange[3],tabBoolToChange[4],tabBoolToChange[5],tabBoolToChange[6],tabBoolToChange[7])
}




function parseMatrix(textMatrix) {

	var parse = Papa.parse(textMatrix)
	//console.log(parse)
	var array1 = matrixToArray(parse)
	var noeuds = arrayToJsonForceLayout(array1)
	var array0 = [{"1":5,"card":10},{"1":5,"card":10},{"1":5,"card":10},{"1":5,"card":10}]

	//plotForceLayout(noeuds,array0)
	return noeuds;

}

// Transform parseObject by papaparse into array for network
function matrixToArray(obj) {
	var array = obj.data
	var arrayRes = []
	for (var i = 0; i < array.length; i++) {
		var arrayRes1 = []
		for (var j = 0; j < array[i].length; j++) {
			arrayRes1.push(parseFloat(array[i][j]))
		};
		arrayRes.push(arrayRes1)
	};
	//console.log(arrayRes)
	return arrayRes;
}

function arrayToJsonForceLayout(array) {

	var nodesLinksData = {"nodes":[],"links":[]};

	for (var i = 0; i < array.length; i++) {
		nodesLinksData["nodes"].push({"index1":i});
		for (var j = 0; j < array[i].length; j++) {
			if (array[i][j] != 0) {
				nodesLinksData["links"].push({"source":i,"target":j});
			};
		};
	};
	//console.log(nodesLinksData)
	return nodesLinksData;
}