// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
width = (1000) - margin.left - margin.right,
height = (1200) - margin.top - margin.bottom;

var cutoff = 100

function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
      if (list[i] === obj) {
          return [true, i];
      }
  }

  return [false, -1];
}

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom);

var expanded = false;

function showCheckboxes() {
  var checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}

var links = [];
var nodes = [];
var sel_subs = [];

function updateGraph() {
  
  cutoff = document.getElementById("postCutoff").value;
  console.log(cutoff)
  d3.selectAll("g > *").remove()
  createGraph()
}
d3.select('#updateButton').on('click', updateGraph);
createGraph();

function createGraph() {
  
  d3.json("graph.json", function(error, data) {
    if (error) throw error;
  
  sel_subs.length = 0;
  var boxes = d3.selectAll("input.checkbox:checked");
      boxes.each(function() {sel_subs.push(this.value)})
    console.log(sel_subs)

  var inc_nodes = [];
  data.links.forEach(function(d) {
    d.source = data.nodes[d.source];
    d.target = data.nodes[d.target];
    if (sel_subs.includes(d.target.name)) {
        inc_nodes.push(d.source.name)
    }
  });

  function createNetwork(cutoff) {
    links.length = 0;
    nodes.length = 0;
    data.nodes.forEach(function(d) {
      if (d.posts >= cutoff && d.sub == 0 && inc_nodes.includes(d.name)) {
          nodes.push(d)
      } else if (d.sub == 1 && sel_subs.includes(d.name)) {
          nodes.push(d)
      }
    })

    data.links.forEach(function(d) {
      var cont = containsObject(d.source, nodes)
      var sub = containsObject(d.target, nodes)
      if (cont[0] && sub[0]) {
        links.push(d)
      }
    })
    console.log(links)
    console.log(nodes)
  }
  createNetwork(cutoff);

  console.log(data);
// Initialize the links
var link = svg.append("g")
  .attr("class", "link")
  .selectAll("line")
  .data(links)
  .enter()
  .append("line")
    .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x;  })
      .attr("y2", function(d) { return d.target.y; })
      .style("stroke", linkColor);

function linkColor(d) {
  if (d.mis == 1) {
      return '#FF7F24'
  } else {
    return '#3D59AB'
  }
}

// Initialize the nodes
var node = svg.append("g")
  .attr("class", "node")
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
    .attr("r", function(d) {return d.size})
    .style("fill", function(d) {return d.color})
    .attr("cx", function(d){return d.x})
    .attr("cy", function(d){return d.y })
    .call(d3.drag().on("drag", dragged));

node.append("title")
    .text(function(d){return d.name});

node.on("click", clicked)

    var tip
    function clicked(d){
      if (tip) tip.remove();

      tip  = svg.append("g")
      .attr("transform", "translate(" + d.x  + "," + d.y + ")");

    var rect = tip.append("rect")
      .style("fill", "white")
      .style("stroke", "steelblue");

    tip.append("text")
      .text("Name: " + d.name)
      .attr("dy", "1em")
      .attr("x", 5);

    tip.append("text")
      .text("Total Posts: " + d.posts)
      .attr("dy", "2em")
      .attr("x", 5);

    tip.append("text")
      .text("Misinfo Posts: " + d.mis)
      .attr("dy", "3em")
      .attr("x", 5);

    tip.append("text")
      .text("% Misinfo: " + Math.round((((d.mis / d.posts) * 100) + Number.EPSILON) * 100) / 100  + '%')
      .attr("dy", "4em")
      .attr("x", 5);
    if (d.sub == 0){
      tip.append("text")
        .text("Subs posted to: ")
        .attr("dy", "5em")
        .attr("x", 5);
      for (let i = 0; i < Math.floor((d.subs.length + 1) / 2); i++) {
        if (i == 0){
          tip.append("text")
          .text("          " + d.subs.slice(0,2).toString().replace(',', '   '))
          .attr("dy", (i+6).toString() +"em")
          .attr("x", 20);
        } else {
        tip.append("text")
        .text("          " + d.subs.slice((i*2), (i*2)+2).toString().replace(',', '   '))
        .attr("dy", (i+6).toString() +"em")
        .attr("x", 20);
        }
      }
    }
    var bbox = tip.node().getBBox();
    rect.attr("width", bbox.width + 10)
        .attr("height", bbox.height + 10)
    }

    function dragged(d) {
      d.x = d3.event.x, d.y = d3.event.y;
      d3.select(this).attr("cx", d.x).attr("cy", d.y);
      link.filter(function(l) { return l.source === d; }).attr("x1", d.x).attr("y1", d.y);
      link.filter(function(l) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
    }

});
}
