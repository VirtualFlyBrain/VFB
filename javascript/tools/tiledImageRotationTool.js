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
//tiledImageRotationTool.js
//Tool to adjust Rotation in a High resolution tiled image from an iip server
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImageRotationTool
//---------------------------------------------------------
//emouseatlas.emap.tiledImageRotationTool = new Class ({
var tiledImageRotationTool = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {

		//console.log("enter tiledImageRotationTool.initialize: ",params.toolParams);
		this.name = "RotationTool";
		
		this.parent(params);

		this.pitchMax = this.model.getThreeDInfo().pitch.max;
		this.pitchMin = this.model.getThreeDInfo().pitch.min;
		this.yawMax = this.model.getThreeDInfo().yaw.max;
		this.yawMin = this.model.getThreeDInfo().yaw.min;
		this.rollMax = this.model.getThreeDInfo().roll.max;
		this.rollMin = this.model.getThreeDInfo().roll.min;

		//----------------------------------------
		// containers for the slider & up/down arrows
		//----------------------------------------
		this.pitchSliderDiv = new Element('div', {
			'id': 'pitchSliderDiv',
			'class': 'sliderDiv'
		});
		this.pitchArrowsDiv = new Element( 'div', {
			'id': 'pitchArrowsDiv',
			'class': 'arrowsDiv',
			'styles': {
				'left' : this.width - 30
			}
		});

		this.yawSliderDiv = new Element('div', {
			'id': 'yawSliderDiv',
			'class': 'sliderDiv'
		});
		this.yawArrowsDiv = new Element( 'div', {
			'id': 'yawArrowsDiv',
			'class': 'arrowsDiv',
			'styles': {
				'left' : this.width - 30
			}
		});

		this.rollSliderDiv = new Element('div', {
			'id': 'rollSliderDiv',
			'class': 'sliderDiv'
		});
		this.rollArrowsDiv = new Element( 'div', {
			'id': 'rollArrowsDiv',
			'class': 'arrowsDiv',
			'styles': {
				'left' : this.width - 30
			}
		});

		//.................................................
		// to move feedback text away from left edge
		this.spacer = new Element('div', {
			'class': 'sliderTextContainer_spacer30'
		});

		var win = $(this.shortName + '-win');
		var topEdge = $(this.shortName + '-topedge');
		//this.spacer.inject(topEdge, 'inside');

		//--------------------------------------------------------------------------
		var sliderLength = (this.isHorizontal) ? this.width - 30 : this.height - 30;
		//----------------------------------------
		// the slider for pitch
		//----------------------------------------
		var pitch = this.model.getThreeDInfo().pitch;
		this.sliderTarget = this.shortName + '-win';
		this.pitchSlider = new SliderComponent({
			initiator: this,
			targetId: this.sliderTarget,
			model:this.model,
			view:this.view,
			sliderLength: sliderLength, 
			isHorizontal: this.isHorizontal,
			type:"pitch",
			cursorCompensation: 2,
			range: {min:this.pitchMin, max:this.pitchMax}
		});

		this.pitchSliderTextContainer = new Element('div', {
			'class': 'sliderTextContainer'
		});

		this.pitchSliderTextDiv = new Element('div', {
			'class': 'sliderTextDiv'
		});
		this.pitchSliderTextDiv.set('text', 'p: -');

		this.pitchSliderTextDiv.inject(this.pitchSliderTextContainer, 'inside');
		this.pitchSliderTextContainer.inject(topEdge, 'inside');

		//----------------------------------------
		// the up/down arrows for pitch
		//----------------------------------------
		this.pitchIncDiv = new Element( 'div', {
			'class': 'incDiv'
		});

		this.pitchIncDiv.addEvent('click',function() {
			var val = (pitch.cur === 'undefined') ? 1 : 1 * pitch.cur;
			this.model.setOrientation(val + 1, undefined, undefined);
			this.updateSlider('pitch');
		}.bind(this));

		this.pitchDecDiv = new Element( 'div', {
			'class': 'decDiv'
		});

		this.pitchDecDiv.addEvent('click',function() {
			var val = (pitch.cur === 'undefined') ? 1 : 1 * pitch.cur;
			this.model.setOrientation(val - 1, undefined, undefined);
			this.updateSlider('pitch');
		}.bind(this));

		this.pitchIncDiv.inject(this.pitchArrowsDiv, 'inside');
		this.pitchDecDiv.inject(this.pitchArrowsDiv, 'inside');
		this.pitchArrowsDiv.inject($('pitch_sliderContainer'), 'inside');

		//--------------------------------------------------------------------------
		//----------------------------------------
		// the slider for yaw
		//----------------------------------------
		var yaw = this.model.getThreeDInfo().yaw;
		//console.log("yaw ",yaw);
		this.yawSlider = new SliderComponent({
			initiator: this,
			targetId: this.sliderTarget,
			model:this.model,
			view:this.view,
			sliderLength: sliderLength, 
			isHorizontal: this.isHorizontal,
			type:"yaw",
			cursorCompensation: 4,
			range: {min:this.yawMin, max:this.yawMax}
		});

		this.yawSliderTextContainer = new Element('div', {
			'class': 'sliderTextContainer'
		});

		this.yawSliderTextDiv = new Element('div', {
			'class': 'sliderTextDiv'
		});
		this.yawSliderTextDiv.set('text', 'y: -');

		this.yawSliderTextDiv.inject(this.yawSliderTextContainer, 'inside');
		this.yawSliderTextContainer.inject(topEdge, 'inside');

		//----------------------------------------
		// the up/down arrows for yaw
		//----------------------------------------
		this.yawIncDiv = new Element( 'div', {
			'class': 'incDiv'
		});

		this.yawIncDiv.addEvent('click',function() {
			var val = (yaw.cur === 'undefined') ? 1 : 1 * yaw.cur;
			this.model.setOrientation(undefined, val + 1, undefined);
			this.updateSlider('yaw');
		}.bind(this));

		this.yawDecDiv = new Element( 'div', {
			'class': 'decDiv'
		});

		this.yawDecDiv.addEvent('click',function() {
			var val = (yaw.cur === 'undefined') ? 1 : 1 * yaw.cur;
			this.model.setOrientation(undefined, val - 1, undefined);
			this.updateSlider('yaw');
		}.bind(this));

		this.yawIncDiv.inject(this.yawArrowsDiv, 'inside');
		this.yawDecDiv.inject(this.yawArrowsDiv, 'inside');
		this.yawArrowsDiv.inject($('yaw_sliderContainer'), 'inside');

		//--------------------------------------------------------------------------
		//----------------------------------------
		// the slider for roll
		//----------------------------------------
		var roll = this.model.getThreeDInfo().roll;
		//console.log("roll ",roll);
		this.rollSlider = new SliderComponent({
			initiator: this,
			targetId: this.sliderTarget,
			model:this.model,
			view:this.view,
			sliderLength: sliderLength, 
			isHorizontal: this.isHorizontal,
			type:"roll",
			cursorCompensation: 4,
			range: {min:this.rollMin, max:this.rollMax}
		});

		this.rollSliderTextContainer = new Element('div', {
			'class': 'sliderTextContainer'
		});

		this.rollSliderTextDiv = new Element('div', {
			'class': 'sliderTextDiv'
		});
		this.rollSliderTextDiv.set('text', 'r: -');

		this.rollSliderTextDiv.inject(this.rollSliderTextContainer, 'inside');
		this.rollSliderTextContainer.inject(topEdge, 'inside');

		//--------------------------------------------------------------------------
		$(this.targetId).addEvent('mouseup', function(e) {
			this.doMouseUp(e);
		}.bind(this));
		//--------------------------------------------------------------------------

		//----------------------------------------
		// the up/down arrows for roll
		//----------------------------------------
		this.rollIncDiv = new Element( 'div', {
			'class': 'incDiv'
		});

		this.rollIncDiv.addEvent('click',function() {
			var val = (roll.cur === 'undefined') ? 1 : 1 * roll.cur;
			this.model.setOrientation(undefined, undefined, val + 1);
			this.updateSlider('roll');
		}.bind(this));

		this.rollDecDiv = new Element( 'div', {
			'class': 'decDiv'
		});

		this.rollDecDiv.addEvent('click',function() {
			var val = (roll.cur === 'undefined') ? 1 : 1 * roll.cur;
			this.model.setOrientation(undefined, undefined, val - 1);
			this.updateSlider('roll');
		}.bind(this));

		this.rollIncDiv.inject(this.rollArrowsDiv, 'inside');
		this.rollDecDiv.inject(this.rollArrowsDiv, 'inside');
		this.rollArrowsDiv.inject($('roll_sliderContainer'), 'inside');

		//----------------------------------------
		// the container for orthogonal buttons
		//----------------------------------------
		this.orthogonalContainer = new Element( 'div', {
			'id': 'orthogonalContainer'
		});
		this.transverseDiv = new Element( 'div', {
			'id': 'transverseButtonDiv',
			'class': 'orthogonalButtonDiv transverse'
		});
		this.transverseDivText = new Element('div', {
			'id': 'transverseButtonText',
			'class': 'orthogonalButtonText'
		});
		this.transverseDivText.appendText('Front');

		this.sagittalDiv = new Element( 'div', {
			'id': 'sagittalButtonDiv',
			'class': 'orthogonalButtonDiv sagittal'
		});
		this.sagittalDivText = new Element('div', {
			'id': 'sagittalButtonText',
			'class': 'orthogonalButtonText'
		});
		this.sagittalDivText.appendText('Horiz');

		this.coronalDiv = new Element( 'div', {
			'id': 'coronalButtonDiv',
			'class': 'orthogonalButtonDiv coronal'
		});
		this.coronalDivText = new Element('div', {
			'id': 'coronalButtonText',
			'class': 'orthogonalButtonText'
		});
		//this.coronalDivText.appendText('Coron');
		this.coronalDivText.appendText('Sagit');

		this.orthogonalContainer.inject(win, 'inside');
		this.transverseDivText.inject(this.transverseDiv, 'inside');
		this.transverseDiv.inject(this.orthogonalContainer, 'inside');
		this.sagittalDivText.inject(this.sagittalDiv, 'inside');
		this.sagittalDiv.inject(this.orthogonalContainer, 'inside');
		this.coronalDivText.inject(this.coronalDiv, 'inside');
		this.coronalDiv.inject(this.orthogonalContainer, 'inside');

		//----------------------------------------
		// the container for fixed point button
		//----------------------------------------
		this.fixedPointButtonDiv = new Element( 'div', {
			'id': 'fixedPointButtonDiv',
			'class': 'fixedPointButtonDiv'
		});
		this.fixedPointButtonText = new Element('div', {
			'id': 'fixedPointButtonText',
			'class': 'fixedPointButtonText'
		});
		this.fixedPointButtonText.appendText('Fx Pt');

		this.fixedPointButtonDiv.inject(win, 'inside');
		this.fixedPointButtonText.inject(this.fixedPointButtonDiv, 'inside');

		//----------------------------------------
		// add the events
		//----------------------------------------
		this.transverseDiv.addEvent('click',function() {
			this.setTransverse();
		}.bind(this));
		this.coronalDiv.addEvent('click',function() {
			this.setCoronal();
		}.bind(this));
		this.sagittalDiv.addEvent('click',function() {
			this.setSagittal();
		}.bind(this));

		this.fixedPointButtonDiv.addEvent('click',function() {
			this.doFixedPointButtonDivClicked();
		}.bind(this));

		emouseatlas.emap.utilities.addButtonStyle("transverseButtonDiv");
		emouseatlas.emap.utilities.addButtonStyle("sagittalButtonDiv");
		emouseatlas.emap.utilities.addButtonStyle("coronalButtonDiv");
		emouseatlas.emap.utilities.addButtonStyle("fixedPointButtonDiv");


		//-----------------------------------------
		if(this.model.modelReady()) {
			var threeDInfo = this.model.getThreeDInfo();
			var pitch = threeDInfo.pitch;
			this.pitchSlider.setUserChange(false,"initialize");
			//this.pitchSlider.setPosition(pitch.cur);
			this.pitchSliderTextDiv.set('text', 'p: ' + pitch.cur);
			this.pitchSlider.setUserChange(true,"initialize");

			var yaw = threeDInfo.yaw;
			this.yawSlider.setUserChange(false,"initialize");
			//this.yawSlider.setPosition(yaw.cur);
			this.yawSliderTextDiv.set('text', 'y: ' + yaw.cur);
			this.yawSlider.setUserChange(true,"initialize");

			var roll = threeDInfo.roll;
			this.rollSlider.setUserChange(false,"initialize");
			//this.rollSlider.setPosition(roll.cur);
			this.rollSliderTextDiv.set('text', 'r: ' + roll.cur);
			this.rollSlider.setUserChange(true,"initialize");
		}

		this.layerNames = [];

	}, // initialize

	//---------------------------------------------------------------
	doStepChanged: function(step,type) {

		//console.log("%s: doStepChanged: %d",type,step);

		this.stepChanged = true;

		if(type.toLowerCase() === "pitch") {
			this.model.modifyOrientation(step, undefined, undefined);
			this.updateSlider('pitch');
		}
		if(type.toLowerCase() === "yaw") {
			this.model.modifyOrientation(undefined, step, undefined);
			this.updateSlider('yaw');
		}
		if(type.toLowerCase() === "roll") {
			this.model.modifyOrientation(undefined, undefined, step);
			this.updateSlider('roll');
		}

	}, // doStepChanged

	//---------------------------------------------------------------
	doSliderCompleted: function(step,type) {
	}, // doSliderCompleted

	//---------------------------------------------------------------
	doMouseUp: function(e) {

		if(this.stepChanged === false) {
			return;
		} else {
			this.view.updateWlzRotation();
		}

		this.stepChanged = false;
		return;

	}, // doMouseUp

	//---------------------------------------------------------------
	doFixedPointButtonDivClicked: function() {
		var modes = this.view.getModes();
		this.view.setMode(modes.fixedPoint.name);
	},

	//---------------------------------------------------------------
	modelUpdate: function(modelChanges) {

		//console.log("rotation: modelUpdate");
		var threeDInfo = this.model.getThreeDInfo();

		if(modelChanges.initial === true || modelChanges.initialState === true || modelChanges.locator === true) {
			var pitch = threeDInfo.pitch;
			this.pitchSlider.setUserChange(false,"modelUpdate");
			this.pitchSlider.setStep(pitch.cur);
			this.pitchSliderTextDiv.set('text', 'p: ' + pitch.cur);
			this.pitchSlider.setUserChange(true,"modelUpdate");

			var yaw = threeDInfo.yaw;
			this.yawSlider.setUserChange(false,"modelUpdate");
			this.yawSlider.setStep(yaw.cur);
			this.yawSliderTextDiv.set('text', 'y: ' + yaw.cur);
			this.yawSlider.setUserChange(true,"modelUpdate");

			var roll = threeDInfo.roll;
			this.rollSlider.setUserChange(false,"modelUpdate");
			this.rollSlider.setStep(roll.cur);
			this.rollSliderTextDiv.set('text', 'r: ' + roll.cur);
			this.rollSlider.setUserChange(true,"modelUpdate");
		}

		//console.log("exit tiledImageRotationTool modelUpdate:");
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

		var threeDInfo = this.model.getThreeDInfo();

		if(from === 'pitch' || from === 'all') {
			var pitch = threeDInfo.pitch;
			this.pitchSlider.setUserChange(false,"updateSlider pitch");
			this.pitchSlider.setStep(pitch.cur);
			this.pitchSliderTextDiv.set('text', 'p: ' + pitch.cur);
			this.pitchSlider.setUserChange(true,"updateSlider pitch");
		}

		if(from === 'yaw' || from === 'all') {
			var yaw = threeDInfo.yaw;
			this.yawSlider.setUserChange(false,"updateSlider yaw");
			this.yawSlider.setStep(yaw.cur);
			this.yawSliderTextDiv.set('text', 'y: ' + yaw.cur);
			this.yawSlider.setUserChange(true,"updateSlider yaw");
		}

		if(from === 'roll' || from === 'all') {
			var roll = threeDInfo.roll;
			this.rollSlider.setUserChange(false,"updateSlider roll");
			this.rollSlider.setStep(roll.cur);
			this.rollSliderTextDiv.set('text', 'r: ' + roll.cur);
			this.rollSlider.setUserChange(true,"updateSlider roll");
		}
	},

	//---------------------------------------------------------------
	setTransverse: function() {
		//console.log("setTransverse:");
		var viewAngles = this.model.getViewAngles();
		this.model.setOrientation(viewAngles.transverse.pitch, viewAngles.transverse.yaw, viewAngles.transverse.roll);
		this.updateSlider('all');
	},

	//---------------------------------------------------------------
	setSagittal: function() {
		//console.log("setSagittal:");
		var viewAngles = this.model.getViewAngles();
		this.model.setOrientation(viewAngles.sagittal.pitch, viewAngles.sagittal.yaw, viewAngles.sagittal.roll);
		this.updateSlider('all');
	},

	//---------------------------------------------------------------
	setCoronal: function() {
		//console.log("setCoronal:");
		var viewAngles = this.model.getViewAngles();
		this.model.setOrientation(viewAngles.coronal.pitch, viewAngles.coronal.yaw, viewAngles.coronal.roll);
		this.updateSlider('all');
	}


});
