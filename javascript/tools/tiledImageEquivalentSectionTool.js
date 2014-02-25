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
//tiledImageEquivalentSectionTool.js
//Tool to manipulate Measure in a High resolution tiled image from an iip server
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImageEquivalentSectionTool
//---------------------------------------------------------
//emouseatlas.emap.tiledImageEquivalentSectionTool = new Class ({
var tiledImageEquivalentSectionTool = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {

		this.name = "equivalentSectionTool";
		
		this.parent(params);

		this.sliderLength = this.width - 25;

		this.boundingBox;

		this.visible = true;

		this.layerNames = [];

		this.createElements();

	}, // initialize

	//---------------------------------------------------------------
	createElements: function(modelChanges) {

		var win = $(this.shortName + '-win');

		this.titleTextContainer = new Element('div', {
			'class': 'sliderTextContainer'
		});

		this.titleTextDiv = new Element('div', {
			'class': 'sliderTextDiv'
		});
		this.titleTextDiv.set('text', 'High Resolution Section');

		var topEdge = $(this.shortName + '-topedge');

		this.titleTextDiv.inject(this.titleTextContainer, 'inside', 'inside');
		this.titleTextContainer.inject(topEdge, 'inside', 'inside');

		//----------------------------------------
		// the info container
		//----------------------------------------
		this.infoDiv = new Element('div', {
			'id':'equivalentSectionToolInfoDiv'
		});

		this.infoText = new Element('div', {
			'id':'equivalentSectionToolInfoText'
		});
		this.infoText.appendText('click on image then <OK> to get high-res section through this point');

		//----------------------------------------
		// the container for the buttons
		//----------------------------------------
		this.buttonContainer = new Element('div', {
			'id': 'equivalentSectionToolButtonContainer'
		});

		this.okButton = new Element('div', {
			'id': 'equivalentSectionToolOKButton',
			'class': 'equivalentSectionToolButton ok'
		});
		this.okButton.appendText('OK');

		this.cancelButton = new Element('div', {
			'id': 'equivalentSectionToolCancelButton',
			'class': 'equivalentSectionToolButton cancel'
		});
		this.cancelButton.appendText('Cancel');

		//----------------------------------------
		// add them to the tool
		//----------------------------------------

		this.infoText.inject(this.infoDiv, 'inside');
		this.infoDiv.inject(win, 'inside');

		this.okButton.inject(this.buttonContainer, 'inside');
		this.cancelButton.inject(this.buttonContainer, 'inside');
		this.buttonContainer.inject(win, 'inside');
		emouseatlas.emap.utilities.addButtonStyle('equivalentSectionToolOKButton');
		emouseatlas.emap.utilities.addButtonStyle('equivalentSectionToolCancelButton');

		//----------------------------------------
		// event handlers
		//----------------------------------------
		this.okButton.addEvent('click',function() {
			this.doOK();
		}.bind(this));

		this.cancelButton.addEvent('click',function() {
			this.doClosed();
		}.bind(this));

		//----------------------------------------
		// the equivalentSection marker
		//----------------------------------------
		this.markerContainer = new Element('div', {
			'id': 'equivalentSectionMarkerContainer',
			'class': 'markerContainer'
		});
		this.markerContainer.inject($('emapIIPViewerDiv'), 'inside');

		this.markerArm0 = new Element('div', {
			'id': 'equivalentSectionMarkerArm0',
			'class': 'markerArm zero'
		});
		this.markerArm90 = new Element('div', {
			'id': 'equivalentSectionMarkerArm90',
			'class': 'markerArm ninety'
		});
		this.markerArm180 = new Element('div', {
			'id': 'equivalentSectionMarkerArm180',
			'class': 'markerArm oneEighty'
		});
		this.markerArm270 = new Element('div', {
			'id': 'equivalentSectionMarkerArm270',
			'class': 'markerArm twoSeventy'
		});

		this.markerArm0.inject(this.markerContainer, 'inside');
		this.markerArm90.inject(this.markerContainer, 'inside');
		this.markerArm180.inject(this.markerContainer, 'inside');
		this.markerArm270.inject(this.markerContainer, 'inside');

	}, // createElements

	//---------------------------------------------------------------
	modelUpdate: function(modelChanges) {

		//console.log("enter tiledImageOpacityTool modelUpdate:",modelChanges);

		if(modelChanges.initial === true) {
		}

		if(modelChanges.boundingBox === true) {
			this.boundingBox = this.model.getBoundingBox();
			//console.log('tiledImageEquivalentSectionTool  BB ',this.boundingBox);
		}

		if(modelChanges.dst === true) {
			this.setMarkerVisible(false);
		}

		//console.log("exit tiledImageOpacityTool modelUpdate:");
	}, // modelUpdate

	//---------------------------------------------------------------
	// if the opacity has been changed, update the slider text
	viewUpdate: function(viewChanges, from) {

		//console.log("enter tiledImageEquivalentSectionTool viewUpdate:",viewChanges);

		var dx;
		var dy;
		var dz;
		var dist;
		var origin;
		var point;
		var scale;
		var unit;

		if(viewChanges.initial) {
			this.setEquivalentSectionToolVisible(false);
		}

		//...................................
		if(viewChanges.mode) {
			var mode = this.view.getMode();
			//console.log("mode ",mode);
			if(mode.name === 'HRSection') {
				this.setEquivalentSectionToolVisible(true);
				this.setMarkerVisible(false);
			} else {
				this.setMarkerVisible(false);
				this.setEquivalentSectionToolVisible(false);
			}
		}

		if(viewChanges.HRSection) {
			var clickPos = this.view.getMouseClickPosition();
			var viewerPos = this.view.getViewerContainerPos();
			var left = clickPos.x - viewerPos.x -12;
			var top = clickPos.y - viewerPos.y -12;
			//console.log("clickPos.x %d, clickPos.y %d, viewerPos.x %d, viewerPos.y %d",clickPos.x,clickPos.y,viewerPos.x,viewerPos.y);
			this.markerContainer.setStyles({'left': left, 'top': top});
			this.setMarkerVisible(true);
			this.model.setBoundingBox();
		}

		if(viewChanges.scale) {
			this.setMarkerVisible(false);
		}

		//console.log("exit tiledImageEquivalentSectionTool viewUpdate:");
	}, // viewUpdate

	//--------------------------------------------------------------
	// launch the high-res section
	//--------------------------------------------------------------
	doOK: function () {
		//console.log("launch the high-res section through ");
		var section = this.calcEquivSection();
		var url = this.getSectionUrl();
		var fullUrl = url + '?section=' + section;
		this.view.launchEquivalentSection(fullUrl);
	},

	//--------------------------------------------------------------
	calcEquivSection: function () {
		var HRPoint = this.view.getHRSectionPoint();
		var fxPt = this.model.getThreeDInfo().fxp;
		var sectionOrderReversed = this.model.getSectionOrderReversed();
		var section;

		//console.log("calcEquivSection: HRPoint ",HRPoint);
		//console.log("calcEquivSection: fxPt ",fxPt);
		//console.log("calcEquivSection: this.boundingBox.z.max %d, this.boundingBox.z.min %d, HRPoint.z %d",this.boundingBox.z.max,this.boundingBox.z.min,HRPoint.z);
		if(sectionOrderReversed) {
			section = Math.abs(this.boundingBox.z.min - HRPoint.z);
		} else {
			section = Math.abs(this.boundingBox.z.max - HRPoint.z);
		}
		//console.log("calcEquivSection: section ",section);
		return section;
	},

	//--------------------------------------------------------------
	getSectionUrl: function () {
		var metadataRoot = this.model.getMetadataRoot();
		var webServer = this.model.getWebServer();
		var reg = /data/;  // case sensitive regexp for "data"
		var path1 = metadataRoot.replace(reg, 'php');
		reg = /wlz/;
		var path2 = path1.replace(reg, 'sections');
		var indx = path2.lastIndexOf('/');
		var len = path2.length;
		var url = webServer + path2.substring(0,len-1) + '.php';
		//console.log(url);
		return url;
	},

	//---------------------------------------------------------------
	doClosed: function() {
		//console.log("%s doClosed:",this.name);
		this.setMarkerVisible(false);
		this.setEquivalentSectionToolVisible(false);
		var modes = this.view.getModes();
		this.view.setMode(modes.move.name);
	},

	//---------------------------------------------------------------
	setEquivalentSectionToolVisible: function(viz) {
		this.window.setVisible(viz);
	},

	//--------------------------------------------------------------
	setMarkerVisible: function (visible) {
		var viz = (visible) ? 'visible' : 'hidden';
		if(this.markerContainer) {
			this.markerArm0.setStyle('visibility', viz);
			this.markerArm90.setStyle('visibility', viz);
			this.markerArm180.setStyle('visibility', viz);
			this.markerArm270.setStyle('visibility', viz);
		}
	}

});
