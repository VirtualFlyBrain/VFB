/**
name: Mif.Tree.implement
description: Mif.Tree extension
MifTree extensions for node manipulation specific to VFB project.

All project-specific additions should be implemented here, instead of the main MifTree file 
@author: NM
 */

Mif.Tree.implement({
	/** 
		Overridden version of the function to allow process checkbox action (processCheck)
		and +/- node expansion (processExpand) 
	*/
	toggleClick: function(event){
		if(this.mouse.target == 'checkbox') {
			var y = this.mouse.coords.y;
			var node = this.$index[((y)/this.height).toInt()];
			this.processCheck(event.target.id, event.target.checked);
		};
		if(this.mouse.target != 'gadjet') return;
		this.mouse.node.toggle();
		this.mouse.node.processExpand();
	},
	
	/** 
		Called from Mif.Tree.toggleClick
		displays domains corresponding to selected nodes
	*/ 
	processCheck: function(nodeId, checked){
		//console.log("processCheck " + nodeId + ":"+checked);
		var id = nodeId.replace(/cb_/,'');
		// Automatically select the checkbox and display the domain
		if ($("cb_"+id) && !$("cb_"+id).disabled){
			$("cb_"+id).checked = checked;
		}
		var node = this.root.getNodeById(id);
		node.state.checked = checked;
		var colourBox = "pic_" + id;
		if ($(colourBox) === undefined) return this;
		if (node.state.checked){
			if ($(colourBox) !== undefined && $(colourBox) != null){
				$(colourBox).setStyle("background-color", node.color.rgbToHex());
			}
			var domainList = readCookieAsArray('domainList');
			//alert("including " + node.fbId );
			domainList.include("" + node.fbId);
			saveArrayAsCookie(domainList, 'domainList');			
		}
		else {
			if ($(colourBox) !== undefined && $(colourBox) != null){
				$(colourBox).setStyle("background-color", "#bbbbbb");
			}
			var domainList = readCookieAsArray('domainList');
			//alert("excluding " + node.fbId);
			domainList.erase("" + node.fbId);
			saveArrayAsCookie(domainList, 'domainList');			
		}
		this.root.showSelected();
		return this;
	},
	
	/** 
	Shows all domains in their corresponding colour or 
	Clears all tree selections and hides all visible domains
	To set initial state on/off set $('toggle_domains').set("text", "Clear all Selections/Show all Domains"); 
	*/
	toggleDomains: function(){
		//console.log("toggleDomains:: " + $('toggle_domains').get("text"));
		var tree = this;
		var transparency = 200; //default transparency level
		var values='';
		//Initial set-up
		if ($('toggle_domains').get("text") ==""){
			$('toggle_domains').set("text", "Clear all Selections"); 
		}
		//Get all selected nodes
		var isVisibleNodes = ($('toggle_domains').get("text") != 'Clear all Selections');
		//this.setLabels(isVisibleNodes);
		var allChildren = [];
		if ($('toggle_domains').get("text") == 'Clear all Selections'){
			this.root.collapseAll();
			allChildren.combine(this.root.getSelectedNodes([]));
			allChildren.each(function(el){
				el.showDomain(false);
			});			
//			var saveView = new Element('a', {
//			    href: '/site/stacks/index.htm',
//			    html: 'Save the link to the current view',
//			    alt: 'Rigth/ctrl click then choose "save link" to save the current view'
//			});
//			saveView.inject($(tree_controls));
		}
		else {
			allChildren.combine(this.root.getSignificantNodes([]));
			allChildren.each(function(el){
				el.showDomain(true);
			});
		}
		//Compose and fire URL
		this.view.setSelections(values);
		this.root.showSelected();
		if ($('toggle_domains').get("text") == 'Clear all Selections'){
			this.root.collapseAll();
		}	
		return false;
	},

	/** 
		Sets labels on the "toggle_domains" link as appropriate
		Called from Node.showSelected(); 
	 */
	setLabels:function(isVisibleNodes){
		var tree = this.root.tree;
		(function(){
		if (! isVisibleNodes){
			$('toggle_domains').set('text', 'Show all Domains');
			$('toggle_domains').set('title', 'Select and show all known domains');
		}
		else {
			$('toggle_domains').set('text', 'Clear all Selections');
			$('toggle_domains').set('title', 'Clear all selections and hide all visible domains');
		}
		}).delay(10);
		return false;
	},
	
	/** 
		Called from the anatomy search form
		creates a list of all existing anatomy names as per tree nodes.
		The list has the form: {"value": 0, "text": "Crepine"},
	*/
	getNodeNames: function(){
		var data = [];
		var d = [];
		var nodes = this.root.getDescendants(d);
		nodes.each(function(node){
			var val = {"value": node.id, "text": node.name};
			data.include(val);
		});
		return data;
	}, 
	
	/** 
	Called from the anatomy search form
	finds a node on the tree by id, expands tree to that node and highlights it
	 */
	locateById: function(id){
		var tree = this;
		var d = [];
		var found = [];
		if (this.fbId == id){
			found.include(node);
		}
		var nodes = this.root.getDescendants(d);
		nodes.include(this.root);
		nodes.each(function(node){
			if (node.fbId == id){
				found.include(node);
			}
		});
		found.each(function(node){
			tree.expandTo(node);
			tree.select(node);
			tree.scrollTo(node);
		});
		this.root.processExpand();
		return found;
	},
	
	/** 
	Finds a node on the tree by id, without expanding the tree
	 */
	locateByIdNoExpand: function(id){
		var tree = this;
		var d = [];
		var found = [];
		if (this.fbId == id){
			found.include(node);
		}
		var nodes = this.root.getDescendants(d);
		nodes.include(this.root);
		nodes.each(function(node){
			if (node.fbId == id){
				found.include(node);
			}
		});
		return found;
	},

	/**
	*	Called from tiledImageView.getIndexDataAtMouseCallback
	*	@author NB, NM	
	*/
    processCheckExternal: function(nodeId, checked){
       var node = this.root.getNodeById(nodeId.replace(/cb_/,''));
       this.expandTo(node);
       node.state.checked = (node.state.checked)? false: true;
       node.showDomain(node.state.checked);
       this.scrollTo(node);
       this.root.showSelected();
       this.select(node);
       return this;
    },

	// create autocomplete items and build them into the text box
	autocompleteInit: function(){
    	var tree = this;
		new Meio.Autocomplete($('search_text'), "/do/autocomplete_list_neuropil.html", {
			selectOnTab: false, 
			onNoItemToList: function(elements){
				elements.field.node.highlight('#ff0000');
			},
		    onSelect:function(elements, value){
				tree.locateById(value.id);
		    },
			filter: {
				type: 'itunes',
				path: 'text'
			}
		});
	}, 
	
	// Creates an event on the "Show All/Clear all" link
	toggleDomainsInit: function(){
		var tree = this;
		this.setLabels(false);
		$('toggle_domains').addEvent('click', function(event){
			tree.toggleDomains();
		});
	},
	
	// Togles a domain highlighted in page load
	toggleDomainsOnLoad: function(domainList){
		var tree = this;
		//console.log("toggleDomainsOnLoad : " + selectedNodeId);
		//If a single node id to be expanded is specified
		if (selectedNodeId !== undefined && selectedNodeId != null && selectedNodeId != ''){
			(function(){
				var nodes = tree.locateById(selectedNodeId);
				nodes.each(function(node){
					tree.select(node);
				});		
			}).delay(0);
		}
		//If a list of nodes to be expanded is given
		else{
			(function(){
				domainList.each(function(el){
					var nodes = tree.locateByIdNoExpand(el);
					nodes.each(function(node){
						node.showDomain(true);
						if (node.fbId == domainList.getLast()){
							tree.select(node);
							tree.scrollTo(node);
							//console.log("Adding " + node.fbId + " called with " + window.location);
							if (window.location.href.indexOf("add") > -1){
								node.centre();
								//console.log("Centre " + node.fbId);
							}
						}
					});		
				})
			}).delay(0);
		}
	},
	
	/** 
	If any of the nodes are marked as "checked" in the json file, 
	highlight these nodes by default by adding them to the domainList
	 */
	showDefaultDomains: function(){
		var tree = this;
		var found = [];
		var d = [];
		var domainList = readCookieAsArray('domainList');
		var nodes = this.root.getDescendants(d);
		nodes.include(this.root);
		nodes.each(function(node){
			if (node.checked){
				domainList.include("" + node.fbId);
			}
		});
		saveArrayAsCookie(domainList, 'domainList');
	},
	
});

/*
---
name: Mif.Tree.Draw.implement
Mif.Tree.Draw extensions for node manipulation specific to VFB project.

All project-specific additions should be implemented here, instead of the main MifTree file 
@author: NM
*/
/** 
	@TODO: 	implement generic version of the Tree.Draw, and put the override here
	Renders tree nodes in HTML
 */

Mif.Tree.Draw.getHTML = function(node,html){
		var prefix = node.tree.DOMidPrefix;
		if(node.domainId !== undefined){
			//if (!node.hasCheckbox) node.state.checked=false;
		    //DomainId should be "" for clickable nodes with defined children, 
			// and it should be undefined (undeclared) for nodes with no domains associated (black nodes)
			var isDisabled = "";
			if (node.domainId === undefined) isDisabled = "disabled";
			var isChecked = "";
			if (node.domainId !== undefined && node.state.checked !== undefined && node.state.checked) isChecked = "checked";
			var domainCentre = "";
			if (node.domainCentre !== undefined) {
				domainCentre = '&nbsp;<a class="centre" id="centre_'+node.id+'" title="show center of the domain">centre</a>';
			}
			var colorPic = '<input class="pick" type="text" id="pic_'+ node.id + '"style="background-color: #bbbbbb;" title="Click to change colour"' + isDisabled + '/>' ;
			var checkbox='<input class="mif-tree-checkbox mif-tree-node-' + node.state.checked + '" type="checkbox" name="'+node.name + '" id="cb_'+ node.id + '" UID='+ node.id + ' style="vertical-align:middle;"' + isDisabled + ' ' + isChecked + '/>';
		}
		else{
			var checkbox='<input class="mif-tree-checkbox mif-tree-node-' + node.state.checked + '" type="checkbox" name="'+node.name + '" id="cb_'+ node.id + '" UID='+ node.id + '" style="vertical-align:middle;" disabled/>';
		}
		var html = html||[];
		html.push(
		'<div class="mif-tree-node ',(node.isLast() ? 'mif-tree-node-last' : ''),'"'+(node.hidden ? ' style="display:none"' : '')+' id="',prefix,node.UID,'">',				
			'<span class="',node.cls,(node.state.selected ? ' mif-tree-node-selected' : ''),'" uid="',node.UID,'">',
				'<span class="mif-tree-gadjet mif-tree-gadjet-',node.getGadjetType(),'" uid="',node.UID,'">',Mif.Tree.Draw.zeroSpace,'</span>',
				'<span class="mif-tree-icon" uid="',node.UID,'">','</span>',
					'<span style="text-align:center"> ',checkbox,colorPic, '</span>',
					'<span id="',node.id,'" class="mif-tree-name" uid="',node.UID,'" title="Click for more actions">', node.name, domainCentre,
				'</span>',
			'</span>',
			'<div class="mif-tree-children" style="display:none"></div>',
		'</div>'
		);
		return html;
},

/*
---
name: Mif.Tree.Node.implement
description: Mif.Tree.Node extension
MifTree.Node extensions for node manipulation specific to VFB project.

All project-specific additions should be implemented here, instead of the main MifTree file 
@author: NM

 */

Mif.Tree.Node.implement({
	
	/** Makes corresponding domain visible/hidden by setting node.state.checked value
	 *  Also ticks/unticks corresponding checkbox.
	 *  !!!!!! Must be followed by this.root.showSelected(); call to apply changes !!!!!!!!!!
	 *  @param value - booleaan value indicating if the domain should be visible or hidden
	 */ 
	showDomain:function(value){
		//console.log("showDomain " + this.name +" > " +value);
		if (value && (this.getParent() !== undefined) && !this.getParent().state.open){
			this.tree.expandTo(this);
		}	
		this.state.checked = value;
		this.tree.processCheck(this.id, value);
	},
	
	/** Collapses all nodes starting with current node	 */
	collapseAll:function(){
		var d = [];
		var nodes = this.getDescendants(d);
		nodes.each(function(node){
			if (node.hasChildren() && !node.getParent().isRoot()){
				node.toggle(false);
			}
		});
	},
	
	/** 
		Called from Mif.Tree.implement.toggleClick
		displays domains corresponding to selected nodes
	*/
	processExpand: function(state){
		if(this.state.open) {
			this.children.each(function(node){
				// Need the delay to make sure the parent node is fully expanded
				//console.log("processExpand " + node.name + " : "+ node.state.open);
				node.processExpand(node.state.open);
				(function(){node.addFunctions();}).delay(1);
			});
			//createMenu(this.tree, { x:-80, y:-10});		
		}
	},
	
	/** Adds extra functionality to a node, eg colour picker, menu, etc
	 * @param: node - node to be embellished 
	 */
	addFunctions:function(){
		this.cpInit();
		this.centreInit();
	},
	
	/** Adds colour picker */ 
	cpInit: function(){
		var root = this.tree.root;
		var sphere = new UvumiSphere("#pic_"+this.id,{
			onChange:function(input,hex){
				var id = input.id;
				id = id.substr(id.indexOf('_')+1);
				$(input).setStyle('background-color',hex);
				var node = root.getNodeById(id);
				node.color = hex.hexToRgb(true);		
			}
		});
	},
	
	// create centre function for the centre link
	centreInit: function(){
		var node = this;
		var centreLinks = $$('#centre_'+this.id);
		//There should be exactly 1 link found with given id
		if (centreLinks.length>0){	
			el = centreLinks[0];
			el.addEvent('click', function(){
				id = el.id.substr(el.id.indexOf('_')+1);
			    node.centre();
			});
		}
	},
	
	/** 
		Called from MifTree.Node.centreInit()
		sets current section(distance) to that corresponding to the middle section of a given domain
	 */
	centre: function(){
		var node = this;
		var threeDInfo = this.tree.model.getThreeDInfo();
		if (typeof(node.domainCentre)!=='undefined' && node.domainCentre.length==3){
			var val = {'x':node.domainCentre[0], 'y':node.domainCentre[1], 'z':node.domainCentre[2]};;
			this.tree.model.setFixedPoint(val);
			this.tree.model.setDistance(0);
		}
		node.showDomain(true);
		this.tree.root.showSelected();
		return this;
	}, 

	//---------------------------------------------------------
	// Returns the list of checked nodes in the form of a url parameters
	//---------------------------------------------------------
	showSelected: function (nodeId) {
		var transparency = 200; //default transparency level
		var groupTransparency = 150; //default group transparency level
		var values='&sel=0,0,0,0,0';
		//Get all selected nodes
		var allChildren = [];
		allChildren.combine(this.tree.root.getSelectedNodes([]));
		var isVisibleNodes = allChildren.length > 0;
		allChildren.each(function(el){
			//If a current selected node has children - add them all in parent's colour
			if (el.hasChildren()){ 
				var descendants = el.getDescendants([]);
				var color = el.color;
				descendants.each(function(item){
					if (item.domainId !== undefined && item.domainId != ""){
						values = values + "&sel=" + item.domainId + "," + color + ","+ groupTransparency;
					}
				});
			}
			if (el.domainId !== undefined && el.domainId != ""){
				values = values + "&sel=" + el.domainId + "," + el.color + ","+ transparency;
			}
		});
		//Compose and fire URL
		this.tree.view.setSelections(values);
		this.tree.setLabels(isVisibleNodes);
		return true;
	},

	//---------------------------------------------------------
	// Returns the list of all selected (checked) children nodes of a node
	//---------------------------------------------------------
	getSelectedNodes: function (allChildren) {
	//	console.log("getSelectedNodes "+ this.id + " : "+ this.domainId);  
		if (this.state.checked) {
			allChildren.include(this);
		}
		this.children.each(function(node){
			node.getSelectedNodes(allChildren);
		});
		return allChildren;
	},
	
	//---------------------------------------------------------
	// Returns the list of all children nodes of a node
	//---------------------------------------------------------
	getDescendants: function (children) {
		var list = this.getChildren();//list of all child checkboxes
		children.combine(list);
		this.children.each(function(node){
			node.getDescendants(children);
		});
		return children;
	},
	
	//---------------------------------------------------------
	// Returns the list of all selected children nodes that 
	// are significant, ie domainId is not empty and is defined
	//---------------------------------------------------------
	getSignificantNodes: function (allChildren) {
		var list = this.getChildren();//list of all child checkboxes
		list.each(function(item){
			if (item.domainId !== undefined && item.domainId != "") {
				allChildren.include(item);
			}
		});
		this.children.each(function(node){
			node.getSignificantNodes(allChildren);
		});
		return allChildren;
	},   
	
	//---------------------------------------------------------
	// Returns a node by id
	//---------------------------------------------------------
	getNodeById: function (nodeId) { 
		var foundNode = null;
		if (this.id == nodeId) {
			foundNode = this;
			return foundNode;
		}
		var list =this.getChildren();   
		list.each(function(node){
			var tmp = node.getNodeById(nodeId);
			if (tmp) {
				foundNode = tmp;
			}
		});
		return foundNode;
	},
	
	/**
	 *  Invoked from MIf.Tree.Node.Implement.select()
	 *  Displays annotation info for the node in the annotation div. 
	 */
	processSelection: function (){
		$('search_header').set('text', "Focus term: "+ this.name);
		$('search_header').set('style', 'font-weight:bold');
		if ($('annotation_content')!=null){
			$('annotation_content').load('/do/ont_bean.html?fbId='+this.fbId);
		}
	},
	
	/** 
		Overridden version of the function to allow processSelectionss
		@param:state
	 */
	select: function(state) {
		//console.log("select: " + this.name);
		this.state.selected = true;
		this.processSelection();
		if(!Mif.Tree.Draw.isUpdatable(this)) return;
		var wrapper=this.getDOM('wrapper');
		wrapper[(state ? 'add' : 'remove')+'Class'](this.selectClass||'mif-tree-node-selected');
		this.tree.root.showSelected();
	}

});

/*
---
name: Mif.Tree.NodeData 
description: Mif.Tree.NodeData class - used to obtain node's data for the model.
@author: NM
 */
Mif.Tree.NodeData = {
		
	/**
	 *  Invoked from emouseatlas.emap.tiledImageModel.getTreeData()
	 *  Displays annotation info for the node in the annotation div. 
	 */	
		//---------------------------------------------------------
		// Populates a tree node with data
		getTreeNodeData : function (layerName, structureTreeNode, layerData) {

			//console.log("getTreeNodeData: structureTreeNode ",structureTreeNode);
			var nodeId = structureTreeNode.nodeId;
			//console.log("getTreeNodeData: nodeId ",nodeId);
			var children = (structureTreeNode.children === undefined) ? undefined : structureTreeNode.children;
			//console.log("getTreeNodeData: children ",children);

			var data = layerData[layerName].treeData;
			var nodeData = data[nodeId];
			var nodeName = nodeData.name;
			var domainData = nodeData.domainData;
			var domainId = (typeof(domainData.domainId) === 'undefined') ? undefined : domainData.domainId;
			var domainColour = (typeof(domainData.domainColour) === 'undefined') ? undefined : domainData.domainColour;
			var domainSelected = (domainData.domainSelected === 'true' || domainData.domainSelected === true) ? true : false;
			var domainCentre = (typeof(domainData.domainCentre) === 'undefined') ? undefined : domainData.domainCentre;
			// the undefined case should be undefined not [0,0,0]
			var rgb = (domainData.domainColour === undefined) ? [220,220,220] : [domainColour[0],domainColour[1],domainColour[2]];
			var nodeState = nodeData.nodeState;
			var open = (nodeState.open === 'true' || nodeState.open === true) ? true : false;
			var extId = (typeof(nodeData.extId) === 'undefined') ? undefined : nodeData.extId;

			var treeNodeWithData = {};
			treeNodeWithData.property = {"name": nodeName, "color": rgb, 'fbId':extId, 'id':nodeId, 'domainId':domainId, 'domainCentre': domainCentre};	
			treeNodeWithData.state = {"open": open, "checked": domainSelected};
			treeNodeWithData.children = [];
			//console.log("getTreeNodeData: treeNodeWithData ",treeNodeWithData);

			if(children === undefined) {
				//console.log("getTreeNodeData no children");
				return treeNodeWithData;
			}

			var len = children.length;
			var i;
			for(i=0; i<len; i++) {
				var child = children[i];
				//console.log("getTreeNodeData child",child);
				var childNode = Mif.Tree.NodeData.getTreeNodeData(layerName, child.node, layerData);
				treeNodeWithData.children[treeNodeWithData.children.length] = childNode;
				//console.log("getTreeNodeData: childNode ",childNode);
			}

			return treeNodeWithData;
		}
		
};
