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
//tiledImageMeasuringTool.js
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
//tiledImageMeasuringTool
//---------------------------------------------------------
//emouseatlas.emap.tiledImageMeasuringTool = new Class ({
var tiledImageMeasuringTool = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {

		this.name = "measuringTool";
		
		this.parent(params);
		
		this.sliderLength = this.width - 25;

		this.layerNames = [];

		var pixres = this.model.getPixelResolution();
		this.mu = pixres.units;
		//console.log("this.mu ",this.mu);
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
		this.titleTextDiv.set('text', 'distance');

		var topEdge = $(this.shortName + '-topedge');

		this.titleTextDiv.inject(this.titleTextContainer, 'inside');
		this.titleTextContainer.inject(topEdge, 'inside');

		//----------------------------------------
		// the container for distance
		//----------------------------------------
		this.distContainer = new Element('div', {
			'id':'measuringToolDistCoordDiv',
			'class':'measuringToolCoordDiv'
		});

		this.distValueContainer = new Element('div', {
			'id':'measuringToolValueContainerDiv',
			'class':'measuringToolCoordDiv'
		});

		this.distValueText = new Element('div', {
			'class':'measuringToolValueText'
		});
		this.distValueText.appendText('0 ' + this.mu[0]);

		//----------------------------------------
		// add them to the tool
		//----------------------------------------

		this.distValueText.inject(this.distValueContainer, 'inside');
		this.distValueContainer.inject(this.distContainer, 'inside');
		this.distContainer.inject(win, 'inside');

		//----------------------------------------
		// the measurement origin marker
		//----------------------------------------
		this.originMarkerContainer = new Element('div', {
			'id': 'measurementOriginMarkerContainer',
			'class': 'markerContainer'
		});
		this.originMarkerContainer.inject($('emapIIPViewerDiv'), 'inside');

		this.originMarkerArm0 = new Element('div', {
			'id': 'measurementOriginMarkerArm0',
			'class': 'markerArm zero'
		});
		this.originMarkerArm90 = new Element('div', {
			'id': 'measurementOriginMarkerArm90',
			'class': 'markerArm ninety'
		});
		this.originMarkerArm180 = new Element('div', {
			'id': 'measurementOriginMarkerArm180',
			'class': 'markerArm oneEighty'
		});
		this.originMarkerArm270 = new Element('div', {
			'id': 'measurementOriginMarkerArm270',
			'class': 'markerArm twoSeventy'
		});

		this.originMarkerArm0.inject(this.originMarkerContainer, 'inside');
		this.originMarkerArm90.inject(this.originMarkerContainer, 'inside');
		this.originMarkerArm180.inject(this.originMarkerContainer, 'inside');
		this.originMarkerArm270.inject(this.originMarkerContainer, 'inside');

		//----------------------------------------
		// the measurement target marker
		//----------------------------------------
		this.targetMarkerContainer = new Element('div', {
			'id': 'measurementTargetMarkerContainer',
			'class': 'markerContainer'
		});
		this.targetMarkerContainer.inject($('emapIIPViewerDiv'), 'inside');

		this.targetMarkerArm0 = new Element('div', {
			'id': 'measurementTargetMarkerArm0',
			'class': 'markerArm zero'
		});
		this.targetMarkerArm90 = new Element('div', {
			'id': 'measurementTargetMarkerArm90',
			'class': 'markerArm ninety'
		});
		this.targetMarkerArm180 = new Element('div', {
			'id': 'measurementTargetMarkerArm180',
			'class': 'markerArm oneEighty'
		});
		this.targetMarkerArm270 = new Element('div', {
			'id': 'measurementTargetMarkerArm270',
			'class': 'markerArm twoSeventy'
		});

		this.targetMarkerArm0.inject(this.targetMarkerContainer, 'inside');
		this.targetMarkerArm90.inject(this.targetMarkerContainer, 'inside');
		this.targetMarkerArm180.inject(this.targetMarkerContainer, 'inside');
		this.targetMarkerArm270.inject(this.targetMarkerContainer, 'inside');

	}, // createElements

	//---------------------------------------------------------------
	doClosed: function() {
		//console.log("%s doClosed:",this.name);
		this.setOriginMarkerVisible(false);
		this.setTargetMarkerVisible(false);
		this.setMeasuringToolVisible(false);
		var modes = this.view.getModes();
		this.view.setMode(modes.move.name);
	},

	//---------------------------------------------------------------
	modelUpdate: function(modelChanges) {

		//console.log("enter tiledImageOpacityTool modelUpdate:",modelChanges);

		if(modelChanges.initial === true) {
		}

		//console.log("exit tiledImageOpacityTool modelUpdate:");
	}, // modelUpdate

	//---------------------------------------------------------------
	// if the opacity has been changed, update the slider text
	viewUpdate: function(viewChanges, from) {

		//console.log("enter tiledImageMeasuringTool viewUpdate:",viewChanges);

		var dx;
		var dy;
		var dz;
		var dist;
		var origin;
		var point;
		var scale;
		var unit;

		if(viewChanges.initial) {
			this.setMeasuringToolVisible(false);
			this.setOriginMarkerVisible(false);
			this.setTargetMarkerVisible(false);
		}

		//...................................
		if(viewChanges.mode) {
			var mode = this.view.getMode();
			//console.log("mode ",mode);
			if(mode.name === 'measuring') {
				this.setMeasuringToolVisible(true);
				this.setOriginMarkerVisible(false);
				this.setTargetMarkerVisible(false);
			} else {
				this.setMeasuringToolVisible(false);
				this.setOriginMarkerVisible(false);
				this.setTargetMarkerVisible(false);
			}
		}

		if(viewChanges.measuringOrigin) {
			var pixres = this.model.getPixelResolution();
			this.setOriginMarkerVisible(false);
			this.setTargetMarkerVisible(false);
			var clickPos = this.view.getMouseClickPosition();
			var viewerPos = this.view.getViewerContainerPos();
			var left = clickPos.x - viewerPos.x -12;
			var top = clickPos.y - viewerPos.y -12;
			//console.log("clickPos.x %d, clickPos.y %d, viewerPos.x %d, viewerPos.y %d",clickPos.x,clickPos.y,viewerPos.x,viewerPos.y);
			this.originMarkerContainer.setStyles({'left': left, 'top': top});
			this.setOriginMarkerVisible(true);
			this.distValueText.set('text', '0 ' + this.mu[0]);
		}

		if(viewChanges.measuringTarget) {
			var isWlz = this.model.isWlzData();
			var pixres = this.model.getPixelResolution();
			var clickPos = this.view.getMouseClickPosition();
			var viewerPos = this.view.getViewerContainerPos();
			var left = clickPos.x - viewerPos.x - 12;
			var top = clickPos.y - viewerPos.y - 12;
			//console.log("clickPos.x %d, clickPos.y %d, viewerPos.x %d, viewerPos.y %d",clickPos.x,clickPos.y,viewerPos.x,viewerPos.y);
			this.targetMarkerContainer.setStyles({'left': left, 'top': top});
			this.setTargetMarkerVisible(true);
			origin = this.view.getMeasurementOrigin();
			point = this.view.getMeasurementTarget();
			if(isWlz) {
				dx = (point.x - origin.x) * pixres.x;
				dx = (Math.round(dx * 100))/100;
				dy = (point.y - origin.y) * pixres.y;
				dy = (Math.round(dy * 100))/100;
				dz = (point.z - origin.z) * pixres.z;
				dz = (Math.round(dz * 100))/100;
				dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
				dist = (Math.round(dist * 100))/100;
				//console.log("distb targ %d",dist);
			} else {
				scale = this.view.getScale();
				dx = point.x - origin.x;
				dx = dx * pixres.x / scale.cur;
				dx = (Math.round(dx * 100))/100;
				dy = point.y - origin.y;
				dy = dy * pixres.y / scale.cur;
				dy = (Math.round(dy * 100))/100;
				dist = Math.sqrt(dx*dx + dy*dy);
				//dist = (Math.round(dist * 100))/100;
				dist = Math.round(dist);
			}
			if(dist < 1000) {
				unit = this.mu[0];
			} else {
				unit = this.mu[1];
				dist = (Math.round(dist / 10))/100;
			}
			this.distValueText.set('text', dist + ' ' + unit);
		}

		if(viewChanges.measuring) {
			var isWlz = this.model.isWlzData();
			var pixres = this.model.getPixelResolution();
			origin = this.view.getMeasurementOrigin();
			point = this.view.getMeasurementPoint();
			if(isWlz) {
				dx = (point.x - origin.x) * pixres.x;
				dx = (Math.round(dx * 100))/100;
				dy = (point.y - origin.y) * pixres.y;
				dy = (Math.round(dy * 100))/100;
				dz = point.z - origin.z;
				dz = (point.z - origin.z) * pixres.z;
				dz = (Math.round(dz * 100))/100;
				//console.log("dx %d, dy %d, dz %d",dx,dy,dz);
				dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
				dist = (Math.round(dist * 100))/100;
			} else {
				scale = this.view.getScale();
				dx = point.x - origin.x;
				dx = dx * pixres.x / scale.cur;
				dx = (Math.round(dx * 100))/100;
				dy = point.y - origin.y;
				dy = dy * pixres.y / scale.cur;
				dy = (Math.round(dy * 100))/100;
				dist = Math.sqrt(dx*dx + dy*dy);
				//dist = (Math.round(dist * 100))/100;
				dist = Math.round(dist);
			}
			if(dist < 1000) {
				unit = this.mu[0];
			} else {
				unit = this.mu[1];
				dist = (Math.round(dist / 10))/100;
			}
			this.distValueText.set('text', dist + ' ' + unit);
		}

		if(viewChanges.scale) {
			this.setOriginMarkerVisible(false);
			this.setTargetMarkerVisible(false);
		}

		//console.log("exit tiledImageMeasuringTool viewUpdate:");
	}, // viewUpdate

	//---------------------------------------------------------------
	setMeasuringToolVisible: function(visible) {
		this.window.setVisible(visible);
	},

	//--------------------------------------------------------------
	setOriginMarkerVisible: function (visible) {
		var viz = (visible) ? 'visible' : 'hidden';
		if(this.originMarkerContainer) {
			this.originMarkerArm0.setStyle('visibility', viz);
			this.originMarkerArm90.setStyle('visibility', viz);
			this.originMarkerArm180.setStyle('visibility', viz);
			this.originMarkerArm270.setStyle('visibility', viz);
		}
	},

	//--------------------------------------------------------------
	setTargetMarkerVisible: function (visible) {
		var viz = (visible) ? 'visible' : 'hidden';
		if(this.targetMarkerContainer) {
			this.targetMarkerArm0.setStyle('visibility', viz);
			this.targetMarkerArm90.setStyle('visibility', viz);
			this.targetMarkerArm180.setStyle('visibility', viz);
			this.targetMarkerArm270.setStyle('visibility', viz);
		}
	}

});
