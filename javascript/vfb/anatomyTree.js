	var nodeIndex = [];
    var network = null;
    var graphData = null;
    var visData = {};
    var anatomyStart = "FBbt_00005095";

    var AUTHORIZATION = "Basic " + btoa("neo4j:vfb");
    /**
     * Uses JQuery to post an ajax request on Neo4j REST API
     */
    function restPost(data) {
        var strData = JSON.stringify(data);
        return $.ajax({
            type: "POST",
            beforeSend: function (request) {
                if (AUTHORIZATION != undefined) {
                    request.setRequestHeader("Authorization", AUTHORIZATION);
                }
            },
            url: "http://pdb.virtualflybrain.org/db/data/transaction/commit",
            contentType: "application/json",
            data: strData
        });
    }
    function anatomyDestroy() {
      if (network !== null) {
        network.destroy();
        network = null;
      }
    }
    function displayAnatomyGraph() {
        if (network == null || anatomySelected !== JSON.stringify(parent.$("body").data(parent.$("body").data("current").template).selected)){
            if (network !== null && anatomyStart == cleanIdforV2(parent.$("body").data("current").template)) {
                anatomySelected = JSON.stringify(parent.$("body").data(parent.$("body").data("current").template).selected);
		var nodes = convertNodes(graphData.nodes);
                var edges = visData.edges;
                visData = {
                    nodes: nodes,
                    edges: edges
                };
                anatomyDestroy();
                displayVisJsData(visData);
            }else{
                anatomyDestroy();
                anatomyStart = cleanIdforV2(parent.$("body").data("current").template);
                anatomySelected = JSON.stringify(parent.$("body").data(parent.$("body").data("current").template).selected);
                // Create the authorization header for the ajax request.
                AUTHORIZATION = "Basic " + btoa("neo4j:vfb");
                // Show loading elements.
                $("#anatomyLoading").show();
                $("#anatomyLoadingBar").show();
                document.getElementById('anatomyText').innerHTML = '0%';
                document.getElementById('anatomyBar').style.width = '0';
                document.getElementById('anatomyLoadingBar').style.opacity = 1;
                // Post Cypher query to return node and relations and return results as graph.
                restPost({
                    "statements": [
                        {
                            "statement": "MATCH (root:Class)<-[:INSTANCEOF]-(t:Individual { short_form : '" + anatomyStart + "'})<-[:depicts]-(tc:Individual)<-[ie:in_register_with]-(c:Individual)-[:depicts]->(image:Individual)-[:INSTANCEOF]->(ac:Class) WHERE has(ie.index) WITH root, COLLECT (ac.short_form) as tree_nodes, COLLECT (DISTINCT{ image: image.short_form, anat_ind: image.short_form, type: ac.short_form}) AS domain_map MATCH p=allShortestPaths((root)<-[:SUBCLASSOF|part_of*..]-(anat:Class)) WHERE anat.short_form IN tree_nodes RETURN p, domain_map",
                            "resultDataContents": ["graph"]
                        }
                    ]
                }).done(function (data) {
                    $("#loading").hide();
                    // Parse results and convert it to vis.js compatible data.
                    graphData = parseGraphResultData(data);
                    var nodes = convertNodes(graphData.nodes);
                    var edges = convertEdges(graphData.edges);
                    visData = {
                        nodes: nodes,
                        edges: edges
                    };
                    displayVisJsData(visData);
                });
            }
        }
    }
    
    function displayVisJsData(data) {
        var container = document.getElementById('vis');
        var options = {
            nodes: {
                shape: 'icon',
                icon: {
                  face: 'FontAwesome',
                  code: '\uf05a',
                  size: 20,
                  color: '#222222'
                },
                mass: 5
            },
            edges: {
                smooth: {
                    type: 'cubicBezier',
                    forceDirection: 'horizontal',
                    roundness: 0.4
                },
				shadow:{
      				enabled: false,
                    color: 'rgba(0,0,0,0.5)',
                    size:1,
                    x:1,
                    y:1
				}
            },
            layout: {
                hierarchical: {
                    enabled: true,
                    levelSeparation: 150,
                    nodeSpacing: 100,
                    treeSpacing: 200,
                    blockShifting: true,
                    edgeMinimization: false,
                    parentCentralization: false
                }
            },
            physics: {
                enabled: true,
                hierarchicalRepulsion: {
                  centralGravity: 0.0,
                  springLength: 200,
                  springConstant: 0.01,
                  nodeDistance: 150,
                  damping: 0.09
                }
            }
        };
        // initialize the network!
        network = new vis.Network(container, data, options);
        network.on("stabilizationProgress", function (params) {
            var maxWidth = 496;
            var minWidth = 20;
            var widthFactor = params.iterations / params.total;
            var width = Math.max(minWidth, maxWidth * widthFactor);
            document.getElementById('anatomyBar').style.width = width + 'px';
            document.getElementById('anatomyText').innerHTML = Math.round(widthFactor * 100) + '%';
        });
        network.once("stabilizationIterationsDone", function () {
            document.getElementById('anatomyText').innerHTML = '100%';
            document.getElementById('anatomyBar').style.width = '496px';
            document.getElementById('anatomyLoadingBar').style.opacity = 0;
            // really clean the dom element
            setTimeout(function () {
                $("#anatomyLoadingBar").hide();
            }, 500);
        });
        network.on("click", function (params) {
          params.event = "[original event]";
          openFullDetails(nodeIndex[params.nodes[0]]);
      	});
    }
    
    function parseGraphResultData(data) {
        var nodes = {}, edges = {};
        data.results[0].data.forEach(function (row) {
            row.graph.nodes.forEach(function (n) {
                if (!nodes.hasOwnProperty(n.id)) {
                    nodes[n.id] = n;
                }
            });
            row.graph.relationships.forEach(function (r) {
                if (!edges.hasOwnProperty(r.id)) {
                    edges[r.id] = r;
                }
            });
        });
        var nodesArray = [], edgesArray = [];
        for (var p in nodes) {
            if (nodes.hasOwnProperty(p)) {
                nodesArray.push(nodes[p]);
            }
        }
        for (var q in edges) {
            if (edges.hasOwnProperty(q)) {
                edgesArray.push(edges[q])
            }
        }
        return {nodes: nodesArray, edges: edgesArray};
    }
    
    function convertNodes(nodes) {
        var convertedNodes = [];
        nodes.forEach(function (node) {
            var nodeLabel = node.properties['short_form'];
            var displayedLabel = node.properties['label'];
	        var displayColor = '#000000';
            if (parent.$("body").data(parent.$("body").data("current").template).available.indexOf(nodeLabel) > -1){
                var rgb = [];
                for (x in parent.$("body").data(parent.$("body").data("current").template).selected){
                    if (parent.$("body").data(parent.$("body").data("current").template).selected[x].extid && parent.$("body").data(parent.$("body").data("current").template).selected[x].extid == nodeLabel){
                        if (parent.$("body").data(parent.$("body").data("current").template).selected[x].colour == "auto"){
                            rgb = parent.$("body").data("colours")[x].split(',');
                        }else{
                            rgb = parent.$("body").data(parent.$("body").data("current").template).selected[x].colour.split(',');
                        }
                        for (y in rgb){
                            rgb[y] = Number(rgb[y]).toString(16);
                            if (rgb[y].length < 2){
                                rgb[y] = "0" + rgb[y];
                            }
                        }
                        displayColor = "#" + rgb[0] + rgb[1] + rgb[2];
                        break;
                    }
                }
            }
            convertedNodes.push({
                id: node.id,
                label: displayedLabel,
                group: nodeLabel,
                icon: {
                    color: displayColor
                }
            })
            nodeIndex[node.id]=nodeLabel;
        });
        return convertedNodes;
    }
    
    function convertEdges(edges) {
        var convertedEdges = [];
        edges.forEach(function (edge) {
        		var relatType = edge.type.replace("_"," ");
            if (relatType.indexOf("Related")>-1){
            	relatType = edge.properties['label'].replace("_"," ");
            }
            convertedEdges.push({
                from: edge.startNode,
                to: edge.endNode,
                label: relatType
            })
        });
        return convertedEdges;
    }
