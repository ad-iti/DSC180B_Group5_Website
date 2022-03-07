// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 40},
width = (5000/5) - margin.left - margin.right,
height = (5000/5) - margin.top - margin.bottom;

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
// try removing svg or g and reading json from reset function
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
        //d.source = nodes[cont[1]]
        //d.target = nodes[sub[1]]
        links.push(d)
      }
    })
    console.log(links)
    console.log(nodes)
  }
  createNetwork(cutoff);

  //function updateNetwork(n, l) {
    //link = svg.select("g")
  //  .attr("class", "link")
  //  .selectAll("line").data(l);

  //  link.exit().remove();

  //  link.enter().append("line")
  //  .attr("x1", function(d) { return d.source.x; })
  //  .attr("y1", function(d) { return d.source.y; })
  //  .attr("x2", function(d) { return d.target.x;  })
  //  .attr("y2", function(d) { return d.target.y; })
  //  .style("stroke", linkColor);

  //  node = svg.select("g")
  //  .attr("class", "node")
   // .selectAll("circle").data(n);

  //  node.exit().remove();

  //  node.enter().append("circle")
  //  .attr("r", function(d) {return d.size})
  //  .style("fill", function(d) {return d.color})
  //  .attr("cx", function(d){return d.x})
  //  .attr("cy", function(d){return d.y });

    //node.append("title")
    //.text(function(d){return d.name});
 // }

//  function updateGraph() {
//    cutoff = document.getElementById("postCutoff").value;
//    console.log(cutoff)
//    createNetwork(cutoff);
//    updateNetwork(nodes, links)
//  }
//  d3.select('#updateButton').on('click', updateGraph);
  

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
      .text("Info: " + d.posts)
      .attr("dy", "2em")
      .attr("x", 5);

    var bbox = tip.node().getBBox();
    rect.attr("width", bbox.width + 5)
        .attr("height", bbox.height + 5)
    }

    function dragged(d) {
      d.x = d3.event.x, d.y = d3.event.y;
      d3.select(this).attr("cx", d.x).attr("cy", d.y);
      link.filter(function(l) { return l.source === d; }).attr("x1", d.x).attr("y1", d.y);
      link.filter(function(l) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
    }
  
// Let's list the force we wanna apply on the network
//var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
//    .force("link", d3.forceLink()                               // This force provides links between nodes
//          .id(function(d) { return d.name; })                     // This provide  the id of a node
//          .links(data.links)                                    // and this the list of links
//    )
//    .force("charge", d3.forceManyBody().strength(-200))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
//    .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
//    .on("end", ticked);

// This function is run at each iteration of the force algorithm, updating the nodes position.
//function ticked() {
//  link
//      .attr("x1", function(d) { return d.source.x; })
//      .attr("y1", function(d) { return d.source.y; })
//      .attr("x2", function(d) { return d.target.x; })
//      .attr("y2", function(d) { return d.target.y; });

//  node
//       .attr("cx", function (d) { return d.x; })
//       .attr("cy", function(d) { return d.y; });
//}

});
}
