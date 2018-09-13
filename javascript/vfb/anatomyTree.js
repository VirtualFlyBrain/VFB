	var nodeIndex = [];
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
    /**
     * Function to call to display a new graph.
     */
    function displayAnatomyGraph() {
        // Create the authorization header for the ajax request.
        AUTHORIZATION = "Basic " + btoa("neo4j:vfb");
        // Show loading elements.
        $("#anatomyLoading").show();
        $("#anatomyLoadingBar").show();
        document.getElementById('anatomyText').innerHTML = '0%';
        document.getElementById('anatomyBar').style.width = '0';
        document.getElementById('anatomyLoadingBar').style.opacity = 1;
        var start = cleanIdforV2(parent.$("body").data("current").template);
        // Post Cypher query to return node and relations and return results as graph.
        restPost({
            "statements": [
                {
                    "statement": "MATCH (t:Individual { short_form : '" + start + "'})<-[:depicts]-(tc:Individual)<-[ie:in_register_with]-(c:Individual)-[:depicts]->(image:Individual)-[:INSTANCEOF]->(ac:Class) WHERE has(ie.index) WITH  COLLECT (ac.short_form) as tree_nodes, COLLECT (DISTINCT{ image: image.short_form, anat_ind: image.short_form, type: ac.short_form}) AS domain_map MATCH p=allShortestPaths((root:Class { label : 'brain'})<-[:SUBCLASSOF|part_of*..]-(anat:Class)) WHERE anat.short_form IN tree_nodes RETURN p, domain_map",
                    "resultDataContents": ["graph"]
                }
            ]
        }).done(function (data) {
            $("#loading").hide();
            // Parse results and convert it to vis.js compatible data.
            var graphData = parseGraphResultData(data);
            var nodes = convertNodes(graphData.nodes);
            var edges = convertEdges(graphData.edges);
            var visData = {
                nodes: nodes,
                edges: edges
            };
            displayVisJsData(visData);
        });
    }
    
    function displayVisJsData(data) {
        var container = document.getElementById('vis');
        var options = {
            nodes: {
                shape: 'icon',
                icon: {
                  face: 'FontAwesome',
                  code: '\uf05a',
                  size: 50,
                  color: '#aa00ff'
                },
                mass: 1
            },
            layout: {
            		hierarchical: {
                		enabled: true,
                    direction: 'LR',
                    levelSeparation: 350                    
                }
            }
        };
        // initialize the network!
        var network = new vis.Network(container, data, options);
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
            convertedNodes.push({
                id: node.id,
                label: displayedLabel,
                group: nodeLabel
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
