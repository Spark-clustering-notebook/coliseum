/*
	bouttonF.onclick = function(e) {
		var reader = new FileReader();
		reader.onload = function() { 
			var csv1 = reader.result
			var parsed = Papa.parse(csv1,configPapaparse)
			console.log(parsed)
			var doubleParsed = prepareForParralelCoordinate(parsed)
			cleanup()
			drawParallelCoordinate(doubleParsed,1800)

		}
		reader.readAsText(boutton1.files[0]);

*/

// Transform a papaparse result with header into Array[Object(Double)]
function prepareForParralelCoordinate(data) {
	var resArray = []
	for (var i = data.length - 1; i >= 0; i--) {
		var obj = {}
    obj["_cardinality"] = data[i]["cardinality"]
    obj["_clusterID"] = data[i]["clusterID"]
    for (var key in data[i].vector) {
			obj[key] = parseFloat(data[i].vector[key])
		};
		resArray.push(obj)
	};
	return resArray
}

// Gives distinct values of an array
Array.prototype.unique = function()
{
	var n = {},r=[];
	for(var i = 0; i < this.length; i++) 
	{
		if (!n[this[i]]) 
		{
			n[this[i]] = true; 
			r.push(this[i]); 
		}
	}
	return r;
}

function speciesSelect(array) {
  var array1 = []
  for (var i = array.length - 1; i >= 0; i--) {
    array1.push(array[i]["_clusterID"])
  };
  return array1
}

function traitSelect(array) {
  var array1 = []
    for (var key in array[0]) {
      if (key!="_clusterID") {
        array1.push(key);
      };
    }
    return array1;
}

// Draw parallelcoordinate visualization
// ww is the width of the draw area
// data is Array[Object[1:float, 2:float,...,n:float, _cardinality, _clusterID]]
function drawParallelCoordinate(data,ww) {

  // Cleanup drawn area in order to make a new one
  cleanupPC()

  var species = speciesSelect(data)
  var traits = traitSelect(data)

  var m = [80, 160, 200, 160],
      //w = 1280 - m[1] - m[3],
      w = ww
      h = 900 - m[0] - m[2];

  var x = d3.scale.ordinal().domain(traits).rangePoints([0, w]),
      y = {};

  var line = d3.svg.line(),
      axis = d3.svg.axis().orient("left"),
      foreground;

  var svg;
  if (d3.select("#visu1")[0][0] == null) {
    svg = d3.select("div.visu").append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
  }
  else {
    svg = d3.select("#visuPC").append("svg:svg")
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .append("svg:g")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
  }


  var accessorD3 = function(d) { return d["_cardinality"];} 
  //console.log(species)
  var strokeWidthScale = d3.scale.linear().domain([d3.min(data,accessorD3),d3.max(data,accessorD3)]).range([1,10])

  var colorScale = d3.scale.ordinal().domain(species).range(["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5","#393b79","#5254a3","#6b6ecf","#9c9ede","#637939","#8ca252","#b5cf6b","#cedb9c","#8c6d31","#bd9e39","#e7ba52","#e7cb94","#843c39","#ad494a","#d6616b","#e7969c","#7b4173","#a55194","#ce6dbd","#de9ed6","#6baed6","#9ecae1","#c6dbef","#e6550d","#fd8d3c","#fdae6b","#fdd0a2","#31a354","#74c476","#a1d99b","#c7e9c0","#756bb1","#9e9ac8","#bcbddc","#dadaeb","#636363","#969696","#bdbdbd","#d9d9d9"])

  // Create a scale and brush for each trait.
  traits.forEach(function(d) {

    y[d] = d3.scale.linear()
        .domain(d3.extent(data, function(p) { return p[d]; }))
        .range([h, 0]);

    y[d].brush = d3.svg.brush()
        .y(y[d])
        .on("brush", brush);
  });

    // Add a legend.
    var legend = svg.selectAll("g.legend")
        .data(species)
      .enter().append("svg:g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 584) + ")"; });

    legend.append("svg:line")
        .attr("class", String)
        .attr("x2", 8)
        .style("stroke",function(d){ return colorScale(d); });

    legend.append("svg:text")
        .attr("x", 12)
        .attr("dy", ".31em")
        .text(function(d) { return "Cluster " + d.substring(1); });

    // Add foreground lines.
    foreground = svg.append("svg:g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(data)
      .enter().append("svg:path")
        .attr("d", path)
        .attr("class", function(d) { return d["_clusterID"]; })
        .style("stroke-width",function(d){ return strokeWidthScale(d["_cardinality"])})
        .style("stroke",function(d){ return colorScale(d["_clusterID"]); });

    // Add a group element for each trait.
    var g = svg.selectAll(".trait")
        .data(traits)
      .enter().append("svg:g")
        .attr("class", "trait")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        .call(d3.behavior.drag()
        .origin(function(d) { return {x: x(d)}; })
        .on("dragstart", dragstart)
        .on("drag", drag)
        .on("dragend", dragend));

    // Add an axis and title.
    g.append("svg:g")
        .attr("class", "axisPC")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
      .append("svg:text")
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(String);

    // Add a brush for each axis.
    g.append("svg:g")
        .attr("class", "brush")
        .each(function(d) { d3.select(this).call(y[d].brush); })
      .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    function dragstart(d) {
      i = traits.indexOf(d);
    }

    function drag(d) {
      x.range()[i] = d3.event.x;
      traits.sort(function(a, b) { return x(a) - x(b); });
      g.attr("transform", function(d) { return "translate(" + x(d) + ")"; });
      foreground.attr("d", path);
    }

    function dragend(d) {
      x.domain(traits).rangePoints([0, w]);
      var t = d3.transition().duration(500);
      t.selectAll(".trait").attr("transform", function(d) { return "translate(" + x(d) + ")"; });
      t.selectAll(".foreground path").attr("d", path);
    }

  // Returns the path for a given data point.
  function path(d) {
    return line(traits.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    var actives = traits.filter(function(p) { return !y[p].brush.empty(); }),
        extents = actives.map(function(p) { return y[p].brush.extent(); });
    foreground.classed("fade", function(d) {
      return !actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      });
    });
  }
}


// Enable to user to choose which cluster or features he want to visualize
function selectClusterFeaturesPC(data) {
 
  // div.menu1 is outside the visu, see http://www.beckgael.fr/Clustering_Visualisation_Tool2/
  // If we can propose a form inside the notebook to the user instead of using this way, it would be better i guess
  socle = d3.select("div.menu1");
  // select button to choose cluster
  var clusterChoice = socle.append("select")
                .attr("id","clusterChoice")
                .attr("multiple",true)
                .attr("size","8");
  // select button to choose features
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

  // we update the visualisation from our select cluster button
  clusterChoice.on("change",function() {

    var cluster = document.getElementById("clusterChoice");
    var tabElemSelect = []; // Tab des options selectionnées
    for (var i = 0; i < cluster.options.length; i++) {
      //si l'option est selectionnée, on met son indice dans le tableau des options selectionnées
      if (cluster.options[i].selected) { 
        tabElemSelect.push(cluster.options[i].value) };
    };
    var features = document.getElementById("featuresSelected");
    var tabElemSelect2 = [];  // Tab des options selectionnées
    for (var i = 0; i < features.options.length; i++) {
      //si l'option est selectionnée, on met son indice dans le tableau des options selectionnées
      if (features.options[i].selected) { 
        tabElemSelect2.push(features.options[i].value) };
    };
    var data1 = chooseClusterIDsScatter(data,tabElemSelect)
    var data2 = chooseFeatures0Scatter(data1,tabElemSelect2)
    var data3 = prepareForParralelCoordinate(data2)
    infoCluster(data2)
    drawParallelCoordinate(data3,( Object.size(data3[0]) - 2 )*100 )
  });

  // we update the visualisation from our select features button
  featuresChoice.on("change",function() {

    var lol = document.getElementById("clusterChoice");
    var tabElemSelect = []; // Tab des options selectionnées
    for (var i = 0; i < lol.options.length; i++) {
      //si l'option est selectionnée, on met son indice dans le tableau des options selectionnées
      if (lol.options[i].selected) { 
        tabElemSelect.push(lol.options[i].value) };
    };
    var features = document.getElementById("featuresSelected");
    var tabElemSelect2 = [];  // Tab des options selectionnées
    for (var i = 0; i < features.options.length; i++) {
      //si l'option est selectionnée, on met son indice dans le tableau des options selectionnées
      if (features.options[i].selected) { 
        tabElemSelect2.push(features.options[i].value) };
    };
    var data1 = chooseClusterIDsScatter(data,tabElemSelect)
    var data2 = chooseFeatures0Scatter(data1,tabElemSelect2)
    var data3 = prepareForParralelCoordinate(data2)
    infoCluster(data2)
    drawParallelCoordinate(data3,( Object.size(data3[0]) - 2 )*100 )
  });
}
