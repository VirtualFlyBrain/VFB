/*
 * Copyright (C) 2010 Medical research Council, UK.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be
 * useful but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
 * PURPOSE.  See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301, USA.
 *
 */
//---------------------------------------------------------
//tiledImageTreeTool.js
//Tool to select domains in a High resolution tiled image from an iip server
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImageTreeTool
//---------------------------------------------------------
//emouseatlas.emap.tiledImageTreeTool = new Class ({
var tiledImageTreeTool = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {

		this.name = "TreeTool";
		this.parent(params);
		this.toolBarHeight = 110;

		this.width = (this.width === NaN)?0:this.width;
		this.height = (this.height === NaN)?0:this.height;

		this.layer = params.layer;

		var win = $(this.shortName + '-win');
		win.setStyles({
			'width':'100%',
			'height':($(this.targetId).getSize().y-this.toolBarHeight-8),
			background : 'inherit'
		});

		//----------------------------------------
		// container for treeTool title
		//----------------------------------------
		this.titleContainer = new Element('div', {
			'id': 'treeToolTitleContainer'
		});

		this.treeToolTitleText = new Element('div', {
			'id': 'treeToolTitleText'
		});
		this.treeToolTitleText.appendText('Anatomy Ontology');

		var topEdge = $(this.shortName + '-topedge');

		this.treeToolTitleText.inject(this.titleContainer, 'inside');
		this.titleContainer.inject(topEdge, 'inside');

		//----------------------------------------
		// container for additional controls
		//----------------------------------------
		this.treeControlContainer = new Element('div', {
			'id': 'tree_controls'
		});

		this.treeControlContainer.inject(win, 'inside');

		this.searchHeader = new Element("h2", {
			"id": "search_header",
			"class":"panel_header",
			"text":"Anatomy Tree",
			"style":"margin-top:0"
		});
		this.searchHeader.inject(this.treeControlContainer, 'inside');

		this.searchTextBox = new Element("input", {
			"type":"text",
			"id": "search_text",
			"text":"start typing here",
			"placeholder": "Search for a neuropil"
		});
		this.searchTextBox.inject(this.treeControlContainer, 'inside');
		//----------------------------------------
		// Select All button
		//----------------------------------------
		this.toggleDomains = new Element('button', {
			'id': 'toggle_domains'
		});

		//this.toggleDomains.set("text", "Clear all Selections");
		this.toggleDomains.inject(this.treeControlContainer, 'inside');

		//----------------------------------------
		// container for the tree
		//----------------------------------------
		var treeContainerHeight = win.getParent().getSize().y - this.treeControlContainer.getSize().y - 2;
		treeContainerHeight = "height:" + treeContainerHeight;

		this.treeContainer = new Element('div', {
			id: 'tree_container',
			styles:{
				height: treeContainerHeight
			}
		});

		this.treeContainer.inject(win, 'inside');

		this.treeComponent = new Mif.Tree({
			view:this.view,
			model: this.model,
			id:"",
			container:this.treeContainer,
			types: {// node types
				folder:{
					openIcon: 'mif-tree-open-icon',//css class open icon
					closeIcon: 'mif-tree-close-icon'// css class close icon
				}
			},
			dfltType:'folder',//default node type
			height: 11//node height
		});

		var treeJson = this.model.getTreeData(this.layer);
		this.treeComponent.load({json: treeJson});

	},
	//---------------------------------------------------------------
	modelUpdate: function(modelChanges) {

		//console.log("enter tiledImageOpacityTool modelUpdate:",modelChanges);

		//if(modelChanges.initial === true) {
		//}

		//console.log("exit tiledImageOpacityTool modelUpdate:");
	}, // modelUpdate

	//---------------------------------------------------------------
	// if the opacity has been changed, update the slider text
	viewUpdate: function(viewChanges, from) {

		//console.log("enter tiledImageOpacityTool viewUpdate:",viewChanges);
		var currentLayer = this.view.getCurrentLayer();

		if(viewChanges.initial === true) {
			this.window.setVisible(true);
		}

		if(viewChanges.dblClick === true) {
			this.showIndexDataInImage();
		}

		//console.log("exit tiledImageOpacityTool viewUpdate:");
	}, // viewUpdate

	//--------------------------------------------------------------
	showIndexDataInImage: function () {

		var indexArr = this.view.getIndexArray(this.layer); // layer ignored just now
		var indexData = this.model.getIndexData(this.layer);
		if(indexData === undefined) {
			alert("indexData undefined");
			return false;
		}

		// for now we are using just indexArr[1]
		if(indexData[indexArr[1]] !== undefined) {
			var nodeId = indexData[indexArr[1]].nodeId;
			nodeId = "cb_" + nodeId;
			this.treeComponent.processCheckExternal(nodeId);
		}
	}

});
