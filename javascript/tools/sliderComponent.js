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
//sliderComponent.js
//A generic slider which can be used horizontally or vertically

//See http://www.consideropen.com/blog/2008/09/30-days-of-mootools-12-tutorials-day-15-sliders/
//and http://demos.mootools.net/Slider
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//SliderComponent
//---------------------------------------------------------
/*
 *   The slider knob can move from 0 to (sliderWidth - knobWidth) pixels.
 *   The internal slider range is from 0 to 100 (ie internally it has 100 steps).
 *
 *   If 'snap' is specified and you specify a number of steps, 
 *   then the knob will snap to (your) successive steps as it is dragged.
 *   But for us snap is always false :^)
 *
 *   You can't get the knob position (px) after dragging, only the current step
 *   (assuming you have changed step, if you haven't the 'completed' event won't fire).
 *
 *   We will only be using 'step changes' with the default number of steps (100).
 *   It is up to the caller to sort out what this means.
 *
 */
var SliderComponent = new Class ({

	initialize: function(params) {

		this.view = params.view;
		this.model = params.model;
		this.initiator = params.initiator; // so we can update the appropriate quantity
		this.name = this.initiator.shortName + "_sliderComponent";
		this.shortName = this.initiator.shortName + "_sliderComponent";

		this.type = (params.type === undefined) ? this.shortName : params.type;
		//console.log("SliderComponent %s",this.type);

		this.userChange = false;

		this.currentPosition = 0;

		this.targetId = params.targetId;

		this.mode = (params.mode === undefined) ? "horizontal" : params.mode;
		if(this.mode === "horizontal") {
			this.bigDim = "width:";
		} else {
			this.bigDim = "height::";
		}

		this.sliderLength = (params.sliderLength === undefined) ? 171 : params.sliderLength;
		var cursorCompensation = (params.cursorCompensation === undefined) ? 0 : params.cursorCompensation;

		this.sliderMin = (params.range === undefined) ? 0 : params.range.min;
		this.sliderMax = (params.range === undefined) ? 100 : params.range.max + cursorCompensation;

		this.offset = (params.offset === undefined) ? 0 : params.offset;
		var cursorColour = (params.cursorColour === undefined) ? "red" : params.cursorColour;

		var imagePath = this.model.getInterfaceImageDir();

		this.knob = new Element('div', {
			'class': 'knob ' + cursorColour
		});

		this.sliderContainer = new Element('div', {
			'id': this.type + '_sliderContainer',
			'class': this.mode
		});

		this.sliderBody = new Element('div', {
			'id': this.type + '_sliderBody',
			'class': this.mode + ' sliderTrack'
		});

		if(this.mode === "horizontal") {
			this.sliderBody.setStyle("width", this.sliderLength + 'px');
		} else {
			this.sliderBody.setStyle("height", this.sliderLength + 'px');
		}


		this.knob.inject(this.sliderBody, 'inside');
		this.sliderBody.inject(this.sliderContainer, 'inside');
		this.sliderContainer.inject($(this.targetId), 'inside');

		// Create the new slider instance
		this.createNewSlider();

	}, // initialize

	//---------------------------------------------------------------
	createNewSlider: function() {
		this.slider = new Slider(this.sliderBody, this.sliderBody.getElement('.knob'),
		{
			snap: false,
			range: [this.sliderMin, this.sliderMax],
			wheel: false,
			mode: this.mode,
			offset: this.offset,

			//onchange fires when the value of step changes
			//it will pass the current step as a parameter
			onChange: function(step){
				//console.log("onChange: step %s",step);
				this.doStepChanged(step);
			}.bind(this),

			//oncomplete fires when 'you're done dragging'
			//it will pass the current step as a parameter
			onComplete: function(step){
				//console.log("onComplete: step %s",step);
				this.doCompleted(step);
			}.bind(this)
		});
	},

	//---------------------------------------------------------------
	/*
	 *   If snap true or false: event fires while dragging the knob and step changes.
	 *   If snap true or false: event fires on mouse down (not on knob).
	 */
	doStepChanged: function(step) {
		//console.log("enter doStepChanged: step = %s",step);
		if(this.userChange) {
			this.initiator.doStepChanged(step, this.type);
		}
	},

	//---------------------------------------------------------------
	/*
	 *   If snap true or false: event fires while dragging the knob and step changes.
	 *   If snap true or false: event fires on mouse down (not on knob).
	 */
	doCompleted: function(step) {
		//console.log("%s slider: doCompleted, userChange %s",this.type,this.userChange);
		//if(this.userChange) {
		//console.log("%s slider: doCompleted",this.type);
		this.initiator.doSliderCompleted(step, this.type);
		//}
	},

	//---------------------------------------------------------------
	setStep: function(step) {
		//console.log("setSliderStep: step %s",step);
		this.slider.set(step);
	},

	//---------------------------------------------------------------
	getSliderRange: function() {
		return ({min:this.sliderMin, max:this.sliderMax});
	},

	//---------------------------------------------------------------
	setNewRange: function(range) {
		this.slider.detach();
		this.sliderMin = range.min;
		this.sliderMax = range.max;
		this.createNewSlider();
		this.slider.attach();
	},

	//---------------------------------------------------------------
	getCursorWidth: function() {
		var w = $$('.knob')[0].getStyle('width');
		return parseFloat(w);
	},

	//---------------------------------------------------------------
	setUserChange: function(bool, from) {
		//console.log("%s slider: setUserChange from %s, %s",this.type,from,bool);
		this.userChange = bool;
	}

});
