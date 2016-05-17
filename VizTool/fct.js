//Fonction de base pour avoir le nombre d'élement d'un objets <=> sont nombre de clé
//
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/*
function jqueryHideMenu() {
	$("#menuSocle").hide();
	$("#magic").hide();
	d3.select("#visuSocle").style("width","100%")
						.append("button")
						.attr("id","magic2").text("Menu")
						.on("click",function(){jqueryShowMenu()});

}

function jqueryShowMenu() {
	d3.select("#magic2").remove()
	d3.select("#visuSocle").style("width","80%")
	$("#menuSocle").show();
	$("#magic").show();
	
}
*/

function upload() {

	var menu11 = d3.select("div.menu1")

	menu11.append("p").text("Zone d'Upload")

	menu11.append("input").attr("id","file1")
							.classed("file1",true)
							.attr("type","file")	// on indique qu'on cherche un fichier
							.attr("accept","text/csv");

	menu11.append("button")
						.attr("id","validF")
						.text("Apply")


	var bouttonF = document.querySelector('#validF');
	var boutton1 = document.querySelector('#file1');

	var configPapaparse = {
		delimiter: "",	// auto-detect
		newline: "",	// auto-detect
		header: true,
		dynamicTyping: false,
		preview: 0,
		encoding: "",
		worker: false,
		comments: false,
		step: undefined,
		complete: undefined,
		error: undefined,
		download: false,
		skipEmptyLines: false,
		chunk: undefined,
		fastMode: undefined,
		beforeFirstChunk: undefined,
		withCredentials: undefined
	}

	bouttonF.onclick = function(e) {
		var reader = new FileReader();
		reader.onload = function() { 
			var csv1 = reader.result
			var parsed = Papa.parse(csv1,configPapaparse)
			var doubleParsed = csvStringtoFloat(parsed)
			cleanup()
			//slider()
			gridChoice(doubleParsed)
		}
		try { reader.readAsText(boutton1.files[0]);	}
		catch(err) { console.log("No File 1 : " + err)}
	}
}

function slider() {
	var slider = d3.select("div.menu2").append("input")
							.attr("type","range")
							.attr("id","slider")
							.attr("min",1)
							.attr("max",10)
							.attr("step",0.01)
							.attr("value","4")

	slider.on("mousemove",function(){console.log(d3.select("#slider")[0][0]["value"])})

}

function crossfiltertest(data) {
	var data0 = parseDataToCrossFilter(data)
	//console.log(data0)
	var test1 = crossfilter(data0)
	//console.log(test1)
	//console.log(test1.size())
	var t1bycard = test1.dimension(function(d){return d["cardinality"]})
	//console.log(t1bycard)
	//console.log(t1bycard.top(5))

}

function parseDataToCrossFilter(data) {
	console.log(data)
	var resArray = []
	for (var i = data.length - 1; i >= 0; i--) {
		var obj = {"clusterID":data[i]["clusterID"],"cardinality":data[i]["cardinality"]}
		for (var key in data[i].vector) {
			obj[key] = data[i].vector[key]
		}
		resArray.push(obj)
	};
	return resArray;
}

function csvStringtoFloat(array) {
	var array0 = new Array()
	for (var i = array.data.length - 1; i >= 0; i--) {
		var obj1 = array.data[i];
		var clusterID = "_"+obj1["clusterID"]
		var cardinality = parseFloat(obj1["cardinality"])
		var obj2 = {}
		for (var key in obj1) {
			if (key != "clusterID" && key != "cardinality") {
				obj2[key] = parseFloat(obj1[key])
			};
		};
		array0.push({"clusterID":clusterID, "cardinality":cardinality, "vector":obj2})
	};
	return array0;
}


function gridChoice(data) {
	var menu = d3.select("div.menu1")

	var ChoixDeroulant = menu.append("select")
								.attr("id","visuChoice")
								.attr("multiple",true);

	var optGroup0 = ChoixDeroulant
								.append("optgroup")
								.attr("label","Veuillez selectionner une visualisation");

		optGroup0.append("option")
					.classed("opt0",true)
					.attr("selected",false)
					.text("Scatter Plot");

		optGroup0.append("option")
					.classed("opt0",true)
					.attr("selected",false)
					.text("Spider Chart");
		
		optGroup0.append("option")
					.classed("opt0",true)
					.attr("selected",false)
					.text("Parallel Coordinate");

		optGroup0.append("option")
					.classed("opt0",true)
					.attr("selected",false)
					.text("Camambert");

	ChoixDeroulant.on("change",function() {

		var selectChoice = document.getElementById("visuChoice");
		var tabElemSelect = [];	// Tab des options selectionnées

		for (var i = 0; i < selectChoice.options.length; i++) {
			//si l'option est selectionnée, on met son indice dans le tableau des options selectionnées
			if (selectChoice.options[i].selected) { 
				tabElemSelect.push(selectChoice.options[i].innerHTML) };
		};
		if (tabElemSelect.length >= 2) {
			d3.select("div.visu").remove()
			d3.select("#visuSocle").append("div").attr("id","visu1")
		};
		for (var i = 0; i < tabElemSelect.length; i++) {
			if ( tabElemSelect[i] == "Scatter Plot" ) {
				launchScatter(data)
			}
			else if ( tabElemSelect[i] == "Spider Chart" ) {
				launchSpiderChart(data)
			}
			else if ( tabElemSelect[i] == "Parallel Coordinate" ) {
				launchParallelCoordinate(data)
			}
			else if ( tabElemSelect[i] == "Camambert" ) {
				launchCamambert(data)
			}
		};
	});
}

function prepareDataToFitScatter(data) {
	var resArray = []
	for (var i = data.length - 1; i >= 0; i--) {
		resArray.push(data[i].vector)
	};
	return resArray;
}

function launchScatter(data) {
	cleanup2()
	scatterPlot(data)
	selectClusterFeaturesScatter(data)
}

function launchParallelCoordinate(data) {
	cleanup2()
	var doubleParsed = prepareForParralelCoordinate(data)
	drawParallelCoordinate(doubleParsed,( Object.size(doubleParsed[0]) - 2 )*100 )
	selectClusterFeaturesPC(data)
}
/*
function launchCamambert(data) {
	cleanup2()
	drawCamambert(data)
}
*/
function launchSpiderChart(data,config) {
	cleanup2()
	var mycfg = {
		  w: 900,
		  h: 900,
		  maxValue: 0.6,
		  levels: 6,
		  ExtraWidthX: 300
		}
	var readyData = prepareDataToFitSpiderChart(data)
	console.log(readyData)
	RadarChart.draw("#visu", readyData, mycfg);
	selectClusterFeaturesSpider(data,mycfg);
}


/*
function loadedDataToCamambertData(data) {
	var resArray = []
	for (var i = data.length - 1; i >= 0; i--) {
		data[i]
	};
}

function prepareDataForCamambert(data) {
	var resObj = {"clusterID":[],"cardinality":[]}
	var keys = d3.keys(data[0].vector)
	for (var i = keys.length - 1; i >= 0; i--) {
		resObj[keys[i]] = []
	};

	for (var i = data.length - 1; i >= 0; i--) {
		for (var key in data[i].vector) {
			resObj[key].push(data[i].vector[key])
		}
		resObj["clusterID"].push(data[i]["clusterID"])
		resObj["cardinality"].push(data[i]["cardinality"])
	};
	sumCamambert(resObj);
	return resObj;
}
*/
/**
 * Compute the sum of each attribute of data which is an object{""}
 */
 /*
function sumCamambert(data) {
	var keys = d3.keys(data)
	var idx = keys.indexOf("clusterID");
	keys.splice(idx, 1);
	var sumObj = {}
	for (var i = keys.length - 1; i >= 0; i--) {
		var sum = 0
		for (var j = data[keys[i]].length - 1; j >= 0; j--) {
			sum += data[keys[i]][j]
		};
		sumObj[keys[i]] = sum
	};
	console.log(sumObj)
}

*/

function infoCluster(data) {
	console.log(data)
}