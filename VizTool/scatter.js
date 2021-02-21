function getClass(data) {
  var resArray = [];
  for (var i = data.length - 1; i >= 0; i--) {
    resArray.push(data[i]["clusterID"]);
  };
  return resArray;
}

function getFeatures(data) {
  var resArray = [];
  for (var key in data[0].vector) {
    resArray.push(key);
  }
  return resArray;
}

// Draw scatter PLot
// Where data is : Array[Object[cardinality,clusterID,vector[1,2,...,n]]]
function scatterPlot(data) {

  cleanupScatter()

  var dataClass = getClass(data)
  var dataFeatures = getFeatures(data)
  var colorOrdinalColor = d3.scale.category20()


  // Size parameters.
  var size = 140,
      padding = 10,
      //n = 4,
      //traits = ["sepal length", "sepal width", "petal length", "petal width"],
      n = dataFeatures.length,
      traits = dataFeatures;


  // Position scales.
  var x = {}, y = {}, rr;

  // Accessor for d3 min/max
  var cardValue = function(d) { return d["cardinality"]}
  var cardDomain = [d3.min(data, cardValue), d3.max(data, cardValue)]
  rr = d3.scale.linear().domain(cardDomain).range([3,18])

  traits.forEach(function(trait) {
    var value = function(d) { return d.vector[trait] };
    var domain = [d3.min(data, value), d3.max(data, value)];
    var range = [padding / 2, size - padding / 2];
    x[trait] = d3.scale.linear().domain(domain).range(range);
    y[trait] = d3.scale.linear().domain(domain).range(range.reverse());    
  });

  // Axes.
  var axis = d3.svg.axis()
      .ticks(5)
      .tickSize(size * n);

  // Brush.
  var brush = d3.svg.brush()
      .on("brushstart", brushstart)
      .on("brush", brush)
      .on("brushend", brushend);

  var svg;

  if (d3.select("#visu1")[0][0] == null) {
    // Root panel.
    svg = d3.select("#visu").append("svg:svg")
        .attr("width", function() {return 140*traits.length + 200 +"px"})
        .attr("height", function() {return 140*traits.length + 200 +"px"})
        .append("svg:g")
        .attr("transform", "translate(50.5,69.5)");
  }
  else {
    // Root panel.
    var svg = d3.select("#visuScatter").append("svg:svg")
        .attr("width", function() {return 140*traits.length + 200 +"px"})
        .attr("height", function() {return 140*traits.length + 200 +"px"})
        .append("svg:g")
        .attr("transform", "translate(50.5,69.5)");
  };

  // Legend.
  var legend = svg.selectAll("g.legend")
      .data(dataClass)
    .enter().append("svg:g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(-179," + (i * 20 + 594) + ")"; });

  legend.append("svg:circle")
      .attr("class", String)
      .attr("r", 3);

  legend.append("svg:text")
      .attr("x", 12)
      .attr("dy", ".31em")
      .text(function(d) { return "Iris " + d; });

  // X-axis.
  svg.selectAll("g.x.axis")
      .data(traits)
    .enter().append("svg:g")
      .attr("class", "x axisScatter")
      .attr("transform", function(d, i) { return "translate(" + i * size + ",0)"; })
      .each(function(d) { d3.select(this).call(axis.scale(x[d]).orient("bottom")); });

  // Y-axis.
  svg.selectAll("g.y.axis")
      .data(traits)
    .enter().append("svg:g")
      .attr("class", "y axisScatter")
      .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
      .each(function(d) { d3.select(this).call(axis.scale(y[d]).orient("right")); });

  // Cell and plot.
  var cell = svg.selectAll("g.cell")
      .data(cross(traits, traits))
    .enter().append("svg:g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + d.i * size + "," + d.j * size + ")"; })
      .each(plot);

  // Titles for the diagonal.
  cell.filter(function(d) { return d.i == d.j; }).append("svg:text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", ".71em")
      .text(function(d) { return d.x; });

  function plot(p) {
    var cell = d3.select(this);

    // Plot frame.
    cell.append("svg:rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    // Plot dots.
    cell.selectAll("circle")
        .data(data)
      .enter().append("svg:circle")
        .attr("class", function(d) { return d.clusterID; })
        .attr("cx", function(d) { return x[p.x](d.vector[p.x]); })
        .attr("cy", function(d) { return y[p.y](d.vector[p.y]); })
        .attr("r", function(d) { return rr(d["cardinality"])});
        //.style("fill",function(d) {return colorOrdinalColor(d.clusterID)});

    // Plot brush.
    cell.call(brush.x(x[p.x]).y(y[p.y]));
  }

  // Clear the previously-active brush, if any.
  function brushstart(p) {
    if (brush.data !== p) {
      cell.call(brush.clear());
      brush.x(x[p.x]).y(y[p.y]).data = p;
    }
  }

  // Highlight the selected circles.
  function brush(p) {
    var e = brush.extent();
    svg.selectAll(".cell circle").attr("class", function(d) {
      return e[0][0] <= d.vector[p.x] && d.vector[p.x] <= e[1][0]
          && e[0][1] <= d.vector[p.y] && d.vector[p.y] <= e[1][1]
          ? d.clusterID : null;
    });
  }

  // If the brush is empty, select all circles.
  function brushend() {
    if (brush.empty()) svg.selectAll(".cell circle").attr("class", function(d) {
      return d.clusterID;
    });
  }

  function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
  }

}



// Add select button to choose which clusters/features to show and apply the choice
function selectClusterFeaturesScatter(data) {

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


  // Executes user choice at each change
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
    // format data
    var data1 = chooseClusterIDsScatter(data,tabElemSelect)
    var data2 = chooseFeatures0Scatter(data1,tabElemSelect2)
    infoCluster(data2)
    scatterPlot(data2)
  });

  // Executes user choice at each change
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
    // format data
    var data1 = chooseClusterIDsScatter(data,tabElemSelect)
    var data2 = chooseFeatures0Scatter(data1,tabElemSelect2)
    infoCluster(data2)
    scatterPlot(data2)
  });
}
