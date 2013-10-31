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
//tiledImageScaleTool.js
//Tool to adjust scale in a High resolution tiled image from an iip server
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImageScaleTool
//---------------------------------------------------------
//emouseatlas.emap.tiledImageScaleTool = new Class ({
var tiledImageScaleTool = new Class ({
	Extends: tiledImageTool,
	
	initialize: function(params) {

		this.name = "ScaleTool";
		
		this.parent(params);
		
		var mode = (this.isHorizontal) ? "horizontal" : "vertical";

		this.isWlz = this.model.isWlzData();

		this.imageRoot = 'images/';

		var sliderLength = (this.isHorizontal) ? this.width : this.height;

		this.slider = new SliderComponent({
			initiator: this,
			targetId:this.shortName + '-win',
			model:this.model,
			view:this.view,
			sliderLength: sliderLength, 
			mode: mode
		});

		this.sliderRange = this.slider.getSliderRange();
		//console.log("this.sliderRange ",this.sliderRange);

		this.sliderTextContainer = new Element('div', {
			'class': 'sliderTextContainer'
		});

		this.sliderTextDiv = new Element('div', {
			'class': 'sliderTextDiv'
		});

		var topEdge = $(this.shortName + '-topedge');

		this.sliderTextDiv.inject(this.sliderTextContainer, 'inside');
		this.sliderTextContainer.inject(topEdge, 'inside');

		this.slider.setUserChange(false);
		var curstep = this.getStepFromScale();
		this.slider.setStep(curstep);
		this.slider.setUserChange(true);

		//console.log("exit tiledImageScaleTool.initialize");

	}, // initialize

	//---------------------------------------------------------------
	doStepChanged: function(step) {

		//console.log("scale: doStepChanged: step %s",step);
		if(step === NaN) {
			return false;
		}

		var newscale = this.getScaleFromStep(step);

		this.view.setScale(newscale, 'scaletool');

	}, // doStepChanged

	//---------------------------------------------------------------
	doSliderCompleted: function(step,type) {

	}, // doSliderCompleted

	//---------------------------------------------------------------
	getStepFromScale: function() {

		var cur = this.getCurStep();
		var num = this.getNumScaleSteps();
		var interval = (this.sliderRange.max - this.sliderRange.min) / num;

		var sliderStep = interval * cur;
		//console.log("interval %d, sliderStep %d",interval,sliderStep);

		return sliderStep;
	},

	//---------------------------------------------------------------
	getScaleFromStep: function(step) {

		var scl = this.view.getScale();
		var log2Max = Math.log(scl.max) / Math.log(2); // should be 0 but you never know

		var num = this.getNumScaleSteps();
		var interval = (this.sliderRange.max - this.sliderRange.min) / num;

		var sclStep = Math.round(step / interval);

		var newScale = Math.pow(2, (sclStep - num + log2Max))
		//console.log("log2Max %d, sclStep %d, newScale %d",log2Max,sclStep, newScale);

		return newScale;
	},

	//---------------------------------------------------------------
	getNumScaleSteps: function() {

		var scl = this.view.getScale();
		var scaleMin = scl.min;
		var scaleMax = scl.max;
		var log2Min = Math.log(scaleMin) / Math.log(2);
		var log2Max = Math.log(scaleMax) / Math.log(2);

		//console.log("getNumScaleSteps scaleMax %d, scaleMin %d, log2Max %d, log2Min %d",scaleMax,scaleMin,log2Max,log2Min);
		return (log2Max - log2Min);
	},

	//---------------------------------------------------------------
	getCurStep: function() {

		var scl = this.view.getScale();
		var numSteps = this.getNumScaleSteps();
		var scaleCur = scl.cur;
		var scaleMax = scl.max;
		//console.log("getCurStep: scaleMax %d",scaleMax);
		var log2Cur = Math.log(scaleCur) / Math.log(2);
		var log2Max = Math.log(scaleMax) / Math.log(2);

		var num = (log2Max - log2Cur);
		var curStep = numSteps - num;
		//console.log("numSteps %d, num %d, curStep %d",numSteps,num,curStep);
		return curStep;
	},

	//---------------------------------------------------------------
	getSclText: function() {

		var cur = this.view.getScale().cur;
		//console.log("getSclText: scaleMax %d",this.view.getScale().max);
		var inv;
		var txt;

		if(cur < 1.0) {
			inv = (1 / cur);
			txt = "1:" + inv;
		} else {
			txt = cur + ":1";
		}
		//console.log("txt %s",txt);
		return txt;
	},

	
	//---------------------------------------------------------------
	modelUpdate: function(modelChanges) {
		// a placeholder method; do nothing
	},
	//---------------------------------------------------------------
	viewUpdate: function(viewChanges, from) {

		if(viewChanges.initial === true || viewChanges.scale === true) {
			//console.log("scale.min %d, scale.max %d",scl.min, scl.max);
			this.slider.setUserChange(false);
			var sclTxt = this.getSclText();
			this.sliderTextDiv.set('text', 'magnification: ' + sclTxt);
			this.slider.setUserChange(true);
			if (viewChanges.initial === true) {
				this.window.setVisible(true);
			}
		}

		if(viewChanges.toolbox === true) {
			var viz = this.view.toolboxVisible();
			if(viz === true) {
				this.window.setVisible(true);
			} else if(viz === false) {
				this.window.setVisible(false);
			}
		}

	} // viewUpdate

});
