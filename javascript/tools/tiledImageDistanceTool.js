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
//tiledImageDistanceTool.js
//Tool to adjust Distance in a High resolution tiled image from an iip server
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImageDistanceTool
//---------------------------------------------------------
//emouseatlas.emap.tiledImageDistanceTool = new Class ({
var tiledImageDistanceTool = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {

		this.name = "DistanceTool";

		this.parent(params);
		//----------------------------------------
		// containers for the slider & up/down arrows
		//----------------------------------------
		this.dstSliderDiv = new Element('div', {
			'id': 'dstSliderDiv',
			'class': 'sliderDiv'
		});
		this.dstArrowsDiv = new Element( 'div', {
			'id': 'dstArrowsDiv',
			'class': 'arrowsDiv',
			'styles': {
				'left' : this.width - 30
			}
		});
		//.................................................
		var win = $(this.shortName + '-win');
		var topEdge = $(this.shortName + '-topedge');

		//--------------------------------------------------------------------------
		var sliderLength = (this.isHorizontal) ? this.width - 30 : this.height - 30;

		var mdst = this.model.getDistance();
		//console.log("distance tool: dst = ",mdst);
		//----------------------------------------
		// the slider for distance
		//----------------------------------------
		var sliderTarget = this.shortName + '-win';
		$(this.targetId).addEvent('mouseup', function(e) {
			this.doMouseUp(e);
		}.bind(this));
		//--------------------------------------------------------------------------
		this.slider = new SliderComponent({initiator: this,
			targetId:sliderTarget,
			model:this.model,
			view:this.view,
			sliderLength: sliderLength, 
			isHorizontal: this.isHorizontal,
			type:"dst",
			range: {min:mdst.min, max:mdst.max}});

		this.sliderTextContainer = new Element('div', {
			'class': 'sliderTextContainer'
		});

		this.sliderTextDiv = new Element('div', {
			'class': 'sliderTextDiv'
		});
		this.sliderTextDiv.set('text', 'distance: -');

		var topEdge = $(this.shortName + '-topedge');

		this.sliderTextDiv.inject(this.sliderTextContainer, 'inside');
		this.sliderTextContainer.inject(topEdge, 'inside');

		//----------------------------------------
		// the up/down arrows for distance
		//----------------------------------------
		this.dstIncDiv = new Element( 'div', {
			'class': 'incDiv'
		});

		this.dstIncDiv.addEvent('click', function() {
			this.doIncDst();
		}.bind(this));

		this.dstDecDiv = new Element( 'div', {
			'class': 'decDiv'
		});

		this.dstDecDiv.addEvent('click', function() {
			this.doDecDst();
		}.bind(this));

		this.dstIncDiv.inject(this.dstArrowsDiv, 'inside');
		this.dstDecDiv.inject(this.dstArrowsDiv, 'inside');
		this.dstArrowsDiv.inject($('dst_sliderContainer'), 'inside');

		//-------------------------------------------
		if(this.model.modelReady()) {
			//console.log("dst: initialize modelReady");
			var mdst = this.model.getDistance();
			var step = parseInt(mdst.cur);
			this.slider.setUserChange(false);
			this.slider.setStep(step);
			this.sliderTextDiv.set('text', 'dst: ' + step);
			this.slider.setUserChange(true);
		}

		this.layerNames = [];

	}, // initialize

	//---------------------------------------------------------------
	getSampleRate: function() {

		/*
      var resData;
      var sampleRate = 1;

      resData = this.view.getResolutionData();
      if(resData) {
         if(resData.sampleRate) {
	    sampleRate = resData.sampleRate;
	 }
      }

      return sampleRate;
		 */

		return 1.0;

	}, // getSampleRate

	//---------------------------------------------------------------
	doIncDst: function() {

		var rate = this.getSampleRate();
		var delta = (rate === undefined) ? 1*1 : rate;

		this.model.setDistance(1* this.model.getDistance().cur + delta);
		this.updateSlider('dstTool');

	}, // doIncDst

	//---------------------------------------------------------------
	doDecDst: function() {

		var rate = this.getSampleRate();
		var delta = (rate === undefined) ? 1*1 : rate;

		this.model.setDistance(1* this.model.getDistance().cur - delta);
		this.updateSlider('dstTool');

	}, // doDecDst

	//---------------------------------------------------------------
	doStepChanged: function(step) {

		//console.log("distance: doStepChanged: step %s",step);

		this.stepChanged = true;

		this.model.modifyDistance(step, 'dstTool');
		this.updateSlider('dstTool');

	}, // doStepChanged

	//---------------------------------------------------------------
	doSliderCompleted: function(step) {
		//console.log("doSliderCompleted");
	}, // doSliderCompleted

	//---------------------------------------------------------------
	doMouseUp: function(e) {

		if(this.stepChanged === false) {
			return;
		} else {
			this.model.setDistance(1* this.model.getDistance().cur);
		}

		this.stepChanged = false;
		return;

	}, // doMouseUp

	//---------------------------------------------------------------
	modelUpdate: function(modelChanges) {

		if(modelChanges.initial === true) {
			//console.log("dst: modelUpdate.initial");
			var mdst = this.model.getDistance();
			var step = parseInt(mdst.cur);
			//this.slider.setUserChange(false);
			this.slider.setPosition(step);
			this.sliderTextDiv.set('text', 'dst: ' + step);
			//this.slider.setUserChange(true);
		}

		if(modelChanges.dst === true) {
			var mdst = this.model.getDistance();
			this.sliderTextDiv.set('text', 'dst: ' + mdst.cur);
		}

		if(modelChanges.distanceRange === true) {
			var mdst = this.model.getDistance();
			var step = parseInt(mdst.cur);
			this.slider.setNewRange({max:mdst.max, min:mdst.min});
			//this.slider.setUserChange(false);
			this.slider.setStep(step);
			this.sliderTextDiv.set('text', 'dst: ' + step);
			//this.slider.setUserChange(true);
		}

	}, // modelUpdate

	//---------------------------------------------------------------
	viewUpdate: function(viewChanges) {

		if(viewChanges.initial === true) {
			this.window.setVisible(true);
		}

		if(viewChanges.toolbox === true) {
			var viz = this.view.toolboxVisible();
			if(viz === true) {
				this.window.setVisible(true);
			} else if(viz === false) {
				this.window.setVisible(false);
			}
		}
	},

	//---------------------------------------------------------------
	updateSlider: function(from) {

		//console.log("dst: updateSlider");

		if(from === 'dstTool') {
			//console.log("dst: updateSlider %s",from);
			var mdst = this.model.getDistance();
			this.slider.setUserChange(false);
			this.slider.setStep(mdst.cur);
			this.sliderTextDiv.set('text', 'dst: ' + mdst.cur);
			this.slider.setUserChange(true);
		}
	}

});
