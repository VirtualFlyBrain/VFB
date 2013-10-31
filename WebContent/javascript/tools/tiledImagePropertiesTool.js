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
//tiledImagePropertiesTool.js
//Tool to manipulate Layer Properties in a High resolution tiled image from an iip server
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImagePropertiesTool
//---------------------------------------------------------
//emouseatlas.emap.tiledImagePropertiesTool = new Class ({
var tiledImagePropertiesTool = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {
		
		this.name = "PropertiesTool";
		
		this.parent(params);
		
		this.sliderLength = this.width - 25;

		this.layerNames = [];

		//.................................................
		// spacer to move feedback text away from left edge
		//.................................................
		this.spacer = new Element('div', {
			'class': 'sliderTextContainer_spacer5'
		});

		var win = $(this.shortName + '-win');
		var topEdge = $(this.shortName + '-topedge');
		this.spacer.inject(topEdge, 'inside');

		this.titleTextContainer = new Element('div', {
			'class': 'titleTextContainer'
		});

		this.titleTextDiv = new Element('div', {
			'class': 'titleTextDiv'
		});
		this.titleTextDiv.set('text', 'layer properties');

		this.titleTextDiv.inject(this.titleTextContainer, 'inside');
		this.titleTextContainer.inject(topEdge, 'inside');

		//----------------------------------------
		// the container for layer opacity
		//----------------------------------------
		var opacityLabelContainer = new Element('div', {
			'id': 'opacityLabelContainer',
			'class':'properties label'
		});

		this.opacityValueContainer = new Element('div', {
			'id': 'opacityValueContainer',
			'class':'properties value'
		});

		opacityLabelContainer.set('text', 'opacity');
		this.opacityValueContainer.set('text', '-');

		//----------------------------------------
		// add them to the tool
		//----------------------------------------

		//opacityContainer.inject(win, 'inside');
		opacityLabelContainer.inject(win, 'inside');
		this.opacityValueContainer.inject(win, 'inside');

		//----------------------------------------
		// the slider for layer opacity
		//----------------------------------------

		this.opacityRange = {min:0, max:100};
		this.opacitySlider = new SliderComponent({
			initiator: this,
			targetId:this.shortName + '-win',
			model:this.model,
			view:this.view,
			sliderLength: this.sliderLength,
			isHorizontal: this.isHorizontal,
			type:"opacity",
			range: {min:this.opacityRange.min, max:this.opacityRange.max}
		});

		//----------------------------------------
		// a spacer element
		//----------------------------------------
		var propertySpacerContainer = new Element('div', {
			'id': 'propertySpacerContainer',
			'class':'propertySpacer'
		});

		propertySpacerContainer.inject(win, 'inside');

		//----------------------------------------
		// the red filter container
		//----------------------------------------
		var redLabelContainer = new Element('div', {
			'id': 'redLabelContainer',
			'class':'properties label'
		});
		redLabelContainer.set('text', 'red filter');

		this.redValueContainer = new Element('div', {
			'id': 'redValueContainer',
			'class':'properties value'
		});
		this.redValueContainer.set('text', '-');

		redLabelContainer.inject(win, 'inside');
		this.redValueContainer.inject(win, 'inside');

		//----------------------------------------
		// the red filter slider
		//----------------------------------------

		this.filterRange = {min:0, max:255};
		this.redSlider = new SliderComponent({
			initiator: this,
			targetId:this.shortName + '-win',
			model:this.model,
			view:this.view,
			sliderLength: this.sliderLength,
			isHorizontal: this.isHorizontal,
			type:"redFilter",
			range: {min:this.filterRange.min, max:this.filterRange.max}
		});

		//----------------------------------------
		// the green filter container
		//----------------------------------------
		var greenLabelContainer = new Element('div', {
			'id': 'greenLabelContainer',
			'class':'properties label'
		});
		greenLabelContainer.set('text', 'green filter');

		this.greenValueContainer = new Element('div', {
			'id': 'greenValueContainer',
			'class':'properties value'
		});
		this.greenValueContainer.set('text', '-');

		greenLabelContainer.inject(win, 'inside');
		this.greenValueContainer.inject(win, 'inside');

		//----------------------------------------
		// the green filter slider
		//----------------------------------------

		this.greenSlider = new SliderComponent({
			initiator: this,
			targetId:this.shortName + '-win',
			model:this.model,
			view:this.view,
			sliderLength: this.sliderLength,
			isHorizontal: this.isHorizontal,
			cursorColour: "green",
			type:"greenFilter",
			range: {min:this.filterRange.min, max:this.filterRange.max}
		});


		//----------------------------------------
		// the blue filter container
		//----------------------------------------
		var blueLabelContainer = new Element('div', {
			'id': 'blueLabelContainer',
			'class':'properties label'
		});
		blueLabelContainer.set('text', 'blue filter');

		this.blueValueContainer = new Element('div', {
			'id': 'blueValueContainer',
			'class':'properties value'
		});
		this.blueValueContainer.set('text', '-');

		blueLabelContainer.inject(win, 'inside');
		this.blueValueContainer.inject(win, 'inside');

		//----------------------------------------
		// the blue filter slider
		//----------------------------------------

		this.blueSlider = new SliderComponent({
			initiator: this,
			targetId:this.shortName + '-win',
			model:this.model,
			view:this.view,
			sliderLength: this.sliderLength,
			isHorizontal: this.isHorizontal,
			cursorColour: "blue",
			type:"blueFilter",
			range: {min:this.filterRange.min, max:this.filterRange.max}
		});

	}, // initialize

	//---------------------------------------------------------------
	doStepChanged: function(step, type) {

		//console.log("%s doStepChanged: type %s, step %d",this.shortName,type,step);

		if(type === "opacity") {
			var opacity = this.getOpacityFromStep(step);
			this.view.setOpacity({value:opacity.toFixed(2), fromSlider:true});
		}

		var val = this.getFilterValueFromStep(step);
		if(type === "redFilter") {
			this.view.setFilter({value:val, type:'red'});
		}
		if(type === "greenFilter") {
			this.view.setFilter({value:val, type:'green'});
		}
		if(type === "blueFilter") {
			this.view.setFilter({value:val, type:'blue'});
		}

	}, // doStepChanged

	//---------------------------------------------------------------
	doSliderCompleted: function(step,type) {

		//console.log("%s: doSliderCompleted: %d",type,step);

	}, // doSliderCompleted

	//---------------------------------------------------------------
	// opacity ranges from 0 to 1.0
	getOpacityFromStep: function(step) {
		var range = this.opacityRange.max - this.opacityRange.min;
		return (step / range);
	},

	//---------------------------------------------------------------
	// filter value ranges from 0 to 255
	getFilterValueFromStep: function(step) {
		var cursorW = this.redSlider.getCursorWidth(); // all the filters will have same width cursor
		var range = (this.filterRange.max - cursorW) - this.filterRange.min;
		var val =  Math.round((step / range) * 255);
		//console.log("getFilterValueFromStep: range %d, val %d",range,val);

		return val;
	},

	//---------------------------------------------------------------
	modelUpdate: function(modelChanges) {
		if(modelChanges.initial === true) {
		}
	}, // modelUpdate

	//---------------------------------------------------------------
	// if the opacity has been changed, update the slider text
	viewUpdate: function(viewChanges, from) {

		//console.log("enter tiledImagePropertiesTool viewUpdate:",viewChanges);

		if(viewChanges.initial === true) {
			this.setPropertiesVisible(false);
			this.setToCurrentLayer();
		}

		//...................................
		if(viewChanges.opacity === true) {
			var currentLayer = this.view.getCurrentLayer();
			if(typeof(this.layerNames) === 'undefined') {
				//console.log("tiledImagePropertiesTool viewUpdate: this.layerNames undefined");
				return false;
			}
			var opacity = this.view.getOpacity(currentLayer);
			this.opacityValueContainer.set('text', (Math.round(opacity * 100) / 100));
		}

		//...................................
		if(viewChanges.filter === true) {
			if(typeof(this.layerNames) === 'undefined') {
				//console.log("tiledImagePropertiesTool viewUpdate: this.layerNames undefined");
				return false;
			}
			var currentLayer = this.view.getCurrentLayer();
			var filter = this.view.getFilter(currentLayer);
			this.redValueContainer.set('text', filter.red);
			this.greenValueContainer.set('text', filter.green);
			this.blueValueContainer.set('text', filter.blue);
		}

		//...................................
		if(viewChanges.showProperties === true) {
			this.setPropertiesVisible(true);
			this.setToCurrentLayer();
		}

		//...................................
		if(viewChanges.layer === true) {
			this.setToCurrentLayer();
		}

		//console.log("exit tiledImagePropertiesTool viewUpdate:");
	}, // viewUpdate

	//--------------------------------------------------------------
	setToCurrentLayer: function () {
		//console.log("properties.viewUpdate: currentLayer %s",currentLayer);
		var step;
		var currentLayer = this.view.getCurrentLayer();
		var opacity = this.view.getOpacity(currentLayer);
		var filter = this.view.getFilter(currentLayer);
		this.titleTextDiv.set('text', currentLayer);

		step = Math.round(opacity * 100);
		this.opacitySlider.setUserChange(false);
		this.opacitySlider.setStep(step);
		this.opacityValueContainer.set('text', (opacity));
		this.opacitySlider.setUserChange(true);

		step = filter.red;
		this.redSlider.setUserChange(false);
		this.redSlider.setStep(step);
		this.redValueContainer.set('text', step);
		this.redSlider.setUserChange(true);

		step = filter.green;
		this.greenSlider.setUserChange(false);
		this.greenSlider.setStep(step);
		this.greenValueContainer.set('text', step);
		this.greenSlider.setUserChange(true);

		step = filter.blue;
		this.blueSlider.setUserChange(false);
		this.blueSlider.setStep(step);
		this.blueValueContainer.set('text', step);
		this.blueSlider.setUserChange(true);
	},

	//---------------------------------------------------------------
	doClosed: function() {
		//console.log("%s doClosed:",this.name);
		this.setPropertiesVisible(false);
	},

	//---------------------------------------------------------------
	setPropertiesVisible: function(show) {
		//console.log("properties setPropertiesVisible: ",show);
		this.window.setVisible(show);
	}

});
