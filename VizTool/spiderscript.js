function prepareDataSpider(array) {
	var array0 = [];
	for (var i = array.length - 1; i >= 0; i--) {
		var array1 = [{"axis":"cardinality","value":array[i]["cardinality"]}];
		for (var key in array[i].vector) {
			var obj = {}
			obj["axis"] = key
			obj["value"] = array[i].vector[key]
			array1.push(obj);
		};
		array0.push(array1);
	};
	return array0;
}

function getClusterIDs(array) {
	var array1 = [];
	for (var i = array.length - 1; i >= 0; i--) {
		array1.push(array[i]["clusterID"]);
	};
	return array1;
}

function getFeatures(data) {
	var resArray = []
	for (var key in data[0].vector) {
		resArray.push(key);
	};
	return resArray;
}

function chooseClusterIDs(array,IDsArray) {
	var array1 = [];
	for (var i = array.length - 1; i >= 0; i--) {
		var ind = 0
		while (array[i]["clusterID"] != IDsArray[ind] && IDsArray.length > ind) { ind++; }
		if (ind < IDsArray.length) {array1.push(array[i].vector)};		
	};
	return array1;
}

function chooseFeatures0(data,choosenFeatures) {
	var resArray = [];
	for (var i = data.length - 1; i >= 0; i--) {
		var obj = {}
		//obj["clusterID"] = data[i]["clusterID"]
		//obj["cardinality"] = data[i]["cardinality"]
		//obj["vector"] = {}
		for (var key in data[i]) {
			//if (choosenFeatures.indexOf(key) != -1) { obj["vector"][key] = data[i].vector[key]};
			if (choosenFeatures.indexOf(key) != -1) { obj[key] = data[i][key] };
		}
		resArray.push(obj);
	};
	console.log(resArray)
	return resArray;
}





// Select clusters by their ID
function chooseClusterIDsScatter(array,IDsArray) {
	var array1 = [];
	for (var i = array.length - 1; i >= 0; i--) {
		var ind = 0
		while (array[i]["clusterID"] != IDsArray[ind] && IDsArray.length > ind) { ind++; }
		if (ind < IDsArray.length) {array1.push(array[i])};		
	};
	return array1;
}

// Select features by their ID
// To apply after chooseClusterIDsScatter
function chooseFeatures0Scatter(data,choosenFeatures) {
	var resArray = [];
	for (var i = data.length - 1; i >= 0; i--) {
		var obj = {}
		obj["clusterID"] = data[i]["clusterID"]
		obj["cardinality"] = data[i]["cardinality"]
		obj["vector"] = {}
		for (var key in data[i].vector) {
			if (choosenFeatures.indexOf(key) != -1) { obj["vector"][key] = data[i].vector[key]};
		}
		resArray.push(obj);
	};
	return resArray;
}

function prepareDataToFitSpiderChart(data) {
	var resArray = []
	for (var i = data.length - 1; i >= 0; i--) {
		var array = []
		for (var key in data[i].vector) {
			var obj1 = {}
			obj1["axis"] = key
			obj1["value"] = data[i].vector[key]
			array.push(obj1)
		}
		resArray.push(array)
	};
	console.log(resArray)
	return resArray;
}

//	data = tab d'obj ou obj{clustID,card,ObjVect}
// Let user chose which clusters/features he want to show.
function selectClusterFeaturesSpider(data,mycfg) {

	console.log(data)

	socle = d3.select("div.menu1");
	var clusterChoice = socle.append("select")
								.attr("id","clusterChoice")
								.attr("multiple",true)
								.attr("size","8");

	var featuresChoice = socle.append("select")
								.attr("id","featuresSelected")
								.attr("multiple",true)
								.attr("size","8");

	var opt = clusterChoice.append("optgroup")
					.classed("optgroup0",true)
					.attr("label","Cluster to show");

	var opt2 = featuresChoice.append("optgroup")
							.classed("optgroup0",true)
							.attr("label","Features to show");

	var featuresIDs = getFeatures(data)
	var clusterIDs = getClusterIDs(data)

	// On construit les boutons pour afficher les clusters souhaités
    for (var ind1=0; ind1<clusterIDs.length; ind1++) {
			opt.append("option")
					.classed("attsButtons",true)
					.attr("id","yolo")
					.attr("value",function(){ return ""+clusterIDs[ind1];})
					.attr("selected",false)
					.text(function(){ return clusterIDs[ind1].substring(1);});
	}


	// On construit les boutons pour afficher les attributs souhaités
    for (var ind1=0; ind1<featuresIDs.length; ind1++) {
			opt2.append("option")
					.classed("attsButtons",true)
					.attr("id","yolo")
					.attr("value",function() { return featuresIDs[ind1];} )
					.attr("selected",false)
					.text(function(){ return featuresIDs[ind1];});
	}

	clusterChoice.on("change",function() {

		var cluster = document.getElementById("clusterChoice");
		var tabElemSelect = [];	// Tab des options selectionnées
		for (var i = 0; i < cluster.options.length; i++) {
			//si l'option est selectionnée, on met son indice dans le tableau des options selectionnées
			if (cluster.options[i].selected) { 
				tabElemSelect.push(cluster.options[i].value) };
		};
		var features = document.getElementById("featuresSelected");
		var tabElemSelect2 = [];	// Tab des options selectionnées
		for (var i = 0; i < features.options.length; i++) {
			//si l'option est selectionnée, on met son indice dans le tableau des options selectionnées
			if (features.options[i].selected) { 
				tabElemSelect2.push(features.options[i].value) };
		};
		var data1 = chooseClusterIDsScatter(data,tabElemSelect)
		var data2 = chooseFeatures0Scatter(data1,tabElemSelect2)
		var data0 = prepareDataSpider(data2)
		infoCluster(data2)
		RadarChart.draw("#visu", data0, mycfg);
	});

	featuresChoice.on("change",function() {

		var lol = document.getElementById("clusterChoice");
		var tabElemSelect = [];	// Tab des options selectionnées
		for (var i = 0; i < lol.options.length; i++) {
			//si l'option est selectionnée, on met son indice dans le tableau des options selectionnées
			if (lol.options[i].selected) { 
				tabElemSelect.push(lol.options[i].value) };
		};
		var features = document.getElementById("featuresSelected");
		var tabElemSelect2 = [];	// Tab des options selectionnées
		for (var i = 0; i < features.options.length; i++) {
			//si l'option est selectionnée, on met son indice dans le tableau des options selectionnées
			if (features.options[i].selected) { 
				tabElemSelect2.push(features.options[i].value) };
		};
		var data1 = chooseClusterIDsScatter(data,tabElemSelect)
		var data2 = chooseFeatures0Scatter(data1,tabElemSelect2)
		var data0 = prepareDataSpider(data2)
		infoCluster(data2)
		RadarChart.draw("#visu", data0, mycfg);
	});
}
