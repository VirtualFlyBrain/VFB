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
//tiledImageSelectorTool.js
//Tool to allow slice selection in a High resolution tiled image from an iip server
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImageSelectorTool
//---------------------------------------------------------
//emouseatlas.emap.tiledImageSelectorTool = new Class ({
var tiledImageSelectorTool = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {

		this.name = "Selector";

		this.parent(params);

		this.maxDim = params.toolParams.maxdim;

		this.invertArrows = (params.toolParams.invert === undefined) ? false : params.toolParams.invert;
		this.invertArrows = (this.invertArrows === 'true' || this.invertArrows === true) ? true : false;

		this.useFilename = (params.toolParams.useFilename === undefined) ? false : params.toolParams.useFilename;
		this.useFilename = (this.useFilename === 'true' || this.useFilename === true) ? true : false;

		this.cursorBarWidth = 1; // the width of the line that indicated the current section

		this.imageContainer = new Element( 'div', {
			id: 'selector-imageContainer'
		});
		this.imageContainer.inject( this.window.win , 'inside');

		this.image = new Element('img', {
			'class': 'selector-image'
		});
		this.image.inject( this.imageContainer , 'inside');

		this.cursorBarContainer = new Element( 'div', {
			id: 'selector-cursorBarContainer',
			'class': 'selector-cursor'
		});
		this.cursorBarContainer.inject( this.imageContainer , 'inside');
		this.cursorBarContainer.makeDraggable(emouseatlas.emap.utilities.getDragOpts('selector-imageContainer',100,this));

		this.cursorBar = new Element( 'div', {
			id: 'selector-cursorBar',
			'class': 'selector-cursor'
		});
		this.cursorBar.inject( this.cursorBarContainer , 'inside');

		//------------------------------------
		var dragTarget = this.shortName + '-win';
		$(dragTarget).addEvent('mouseup', function(e) {
			this.doMouseUp(e);
		}.bind(this));
		//------------------------------------

		this.feedback = new Element( 'div', {
			'id': 'selector-feedbackContainer'
		});
		this.feedback.inject( this.window.win , 'inside');

		this.feedbackText = new Element( 'div', {
			'id': 'selector-feedbackText'
		});
		this.feedbackText.inject( this.feedback , 'inside');

		this.incDiv = new Element( 'div', {
			'id': 'selector-incDiv'
		});

		var uparr = imagePath + "upArrow_10.png";
		var downarr = imagePath + "downArrow_10.png";

		this.incImg = new Element( 'img', {
			'id': 'selector-incImg',
			'src': uparr
		});

		this.incImg.inject(this.incDiv, 'inside');
		this.incDiv.inject(this.feedback, 'inside');
		this.incImg.addEvent('click',function() {
			var dst = this.model.getDistance();
			if(this.invertArrows) {
				this.model.setDistance(1 * dst.cur  - 1);
			} else {
				this.model.setDistance(1 * dst.cur  + 1);
			}
		}.bind(this));

		this.decDiv = new Element( 'div', {
			'id': 'selector-decDiv'
		});
		this.decImg = new Element( 'img', {
			'id': 'selector-incImg',
			'src': downarr
		});

		this.decImg.inject(this.decDiv, 'inside');
		this.decDiv.inject(this.feedback, 'inside');
		this.decImg.addEvent('click',function() {
			var dst = this.model.getDistance();
			if(this.invertArrows) {
				this.model.setDistance(1 * dst.cur  + 1);
			} else {
				this.model.setDistance(1 * dst.cur  - 1);
			}
		}.bind(this));

	}, // initialize

	//---------------------------------------------------------------
	handleDrag: function(done) {
		var distance = this.model.getDistance();
		var fullDepth = this.model.getFullDepth();
		var offset = this.getSliceOffset();
		var newDist = offset * fullDepth;
		//console.log("distance ",distance);
		//console.log("offset ",offset);
		newDist = newDist > distance.max ? distance.max : newDist;
		newDist = newDist < distance.min ? distance.min : newDist;
		this.model.modifyDistance(newDist);
	},

	//---------------------------------------------------------------
	doMouseUp: function(e) {

		var target = emouseatlas.emap.utilities.getTarget(e);
		var klass = target.get('class');
		var pattern = /(selector-cursor|selector-image|edge)/i;
		if(klass.match(pattern) != null) {
			//console.log("tiledImageDistanceTool: %s doMouseUp",klass);
			this.view.updateDst();
		} else {
			//console.log("tiledImageDistanceTool: doMouseUp on unkown target ",klass);
		}

	}, // doMouseUp


	//---------------------------------------------------------------
	getSliceOffset: function() {

		var zsel = this.model.getZSelectorInfo();
		var ofs;

		if (zsel.orientation == 'vertical') {
			ofs = this.cursorBarContainer.offsetLeft / (this.dragWidth - this.cursorBarWidth);
		} else if (zsel.orientation == 'horizontal') {
			ofs = this.cursorBarContainer.offsetTop / (this.dragHeight - this.cursorBarWidth);
		} else {
			alert("Error: selector orientation "+zsel.orientation+" is invalid or undefined");
			//console.log("getSliceOffset: selector orientation ",zsel.orientation," is invalid or undefined");
		}
		//console.log("getSliceOffset: %f",ofs);
		return ofs;
	},

	//---------------------------------------------------------------
	setSliceOffset: function(val) {

		//console.log("setSliceOffset: %f",val);
		var zsel = this.model.getZSelectorInfo();

		if(this.model.getFullDepth() === 1) {
			val = 0.5;
		}

		if (zsel.orientation == 'vertical') {
			this.cursorBarContainer.style.left = val * (this.dragWidth) + this.leftDragOffset + 'px';
		} else if (zsel.orientation == 'horizontal') {
			this.cursorBarContainer.style.top = val * (this.dragHeight) + this.topDragOffset + 'px';
		} else {
			alert("Error: selector orientation "+zsel.orientation+" is invalid or undefined");
			//console.log("getSliceOffset: selector orientation ",zsel.orientation," is invalid or undefined");
		}
	},

	//--------------------------------------------------------------
	getSelectorSrc: function (zsel) {

		//console.log("enter selector.getSelectorSrc:");

		var quality = this.model.getImgQuality();
		var server = this.model.getIIPServer();
		var layerData = this.model.getLayerData();
		var layerNames = this.model.getLayerNames();
		var layer = layerData[layerNames[0]];  // in future we will be able to select which layer provides the selector Image
		var dataPath =  layer.imageDir;
		var selectorName = layer.selectorName;


		var selectorSrc = server + '?fif=' + dataPath + selectorName
		+ '&wid='
		+ zsel.width
		+ '&qlt='
		+ quality.cur
		+ '&cvt=png';

		//console.log("exit selector.getSelectorSrc:",selectorSrc);
		return selectorSrc;

	}, // getSelectorSrc

	//--------------------------------------------------------------
	setSelectorImage: function () {

		//console.log("enter selector.setSelectorImage");
		var zsel = this.model.getZSelectorInfo();

		this.image.style.width = zsel.width + 'px';
		this.image.style.height = zsel.height + 'px';
		this.imageContainer.style.width = zsel.width + 'px';
		this.imageContainer.style.height = zsel.height + 'px';

		this.imageContainer.style.left = '2px';
		this.imageContainer.style.top = '2px';

		this.image.src = this.getSelectorSrc(zsel);

		//console.log("exit selector.setSelectorImage");
	}, // setSelectorImage

	//---------------------------------------------------------------
	modelUpdate: function(modelChanges) {

		//console.log("enter Selector modelUpdate:",modelChanges);

		if(modelChanges.dst) {
			//console.log("this.model.isArrayStartsFrom0 ",this.model.isArrayStartsFrom0());
			var distance = this.model.getDistance();
			var cur = distance.cur;
			var cur2 = (this.model.isArrayStartsFrom0()) ? cur : cur - 1;

			var fullDepth = this.model.getFullDepth();
			var sliceOffset = cur2 / fullDepth;
			this.setSliceOffset(sliceOffset);

			if(this.useFilename) {
				var layerNames = this.model.getLayerNames();
				var fullname = this.model.getFullImgFilename(layerNames[0]); // in future we will be able to select the appropriate layer
				var name = emouseatlas.emap.utilities.getFilenameFromPath(fullname);
				var indx = name.indexOf('.');
				var shortname = name.substring(0, indx);
				this.feedbackText.innerHTML = shortname;
			} else {
				var cur3 = (this.model.isPyrTiffData()) ? cur - 1 : cur;
				this.feedbackText.innerHTML = "Section: "+ (cur3).toString();
			}
		}

		//console.log("exit Selector modelUpdate:");
	}, // modelUpdate

	//---------------------------------------------------------------
	viewUpdate: function(viewChanges) {

		//console.log("enter Selector viewUpdate:",viewChanges);

		if(viewChanges.initial || viewChanges.locator) {
			var distance = this.model.getDistance();
			var cur = distance.cur;
			var zsel = this.model.getZSelectorInfo();

			this.setSelectorImage();

			if(this.useFilename) {
				var layerNames = this.model.getLayerNames();
				var fullname = this.model.getFullImgFilename(layerNames[0]); // in future we will be able to select the appropriate layer
				var name = emouseatlas.emap.utilities.getFilenameFromPath(fullname);
				var indx = name.indexOf('.');
				var shortname = name.substring(0, indx);
				this.feedbackText.innerHTML = shortname;
			} else {
				var cur3 = (this.model.isPyrTiffData()) ? cur - 1 : cur;
				this.feedbackText.innerHTML = "Section: "+ (cur3).toString();
			}

			this.window.setVisible(true);

			// make sure the zsel image fits the max dimension specified
			var scaleFactor = (zsel.width > zsel.height) ? this.maxDim / zsel.width : this.maxDim / zsel.height;
			if (scaleFactor > 1) {
				scaleFactor = 1;
			}

			this.scaledSelectorWidth = (scaleFactor * zsel.width);
			this.scaledSelectorHeight = (scaleFactor * zsel.height);
			//console.log("scaleFactor %f, scaledSelectorWidth %f, scaledSelectorHeight %f",scaleFactor,this.scaledSelectorWidth,this.scaledSelectorHeight);

			// if the selector image has borders we must allow for them
			var tl = 0;
			var br = 0;
			if (zsel.border_tl !== undefined) {
				tl = scaleFactor * zsel.border_tl;
			}
			if (zsel.border_br !== undefined) {
				br = scaleFactor * zsel.border_br;
			}

			// the actual usable image dimensions (not including borders).
			this.dragWidth = this.scaledSelectorWidth - (tl + br);
			this.dragHeight = this.scaledSelectorHeight - (tl + br)
			//console.log("dragWidth %f, tl %f, br %f",this.dragWidth,tl,br);

			// ----maze------- Offsets of drag constraint div relative to image
			this.topDragOffset = 0;
			this.leftDragOffset = 0;

			if (zsel.orientation == 'horizontal') {
				/*
	    this.dragHeight = this.dragHeight - tl - br + this.cursorBarWidth;
	    this.topDragOffset = tl - this.cursorBarWidth / 2;
				 */
				this.cursorBarContainerHeight = 5;
				this.topDragOffset = tl - (this.cursorBarContainerHeight / 2);
				this.cursorBarContainer.style.width = this.scaledSelectorWidth + 'px';
				this.cursorBarContainer.style.height = this.cursorBarContainerHeight + 'px';
				this.cursorBar.style.left = '0px';
				this.cursorBar.style.top = (this.cursorBarContainerHeight / 2) + 'px';
				this.cursorBar.style.width = this.scaledSelectorWidth + 'px';
				this.cursorBar.style.height = this.cursorBarWidth + 'px';
			} else if (zsel.orientation == 'vertical') {
				this.cursorBarContainerWidth = 5;
				this.leftDragOffset = tl - (this.cursorBarContainerWidth / 2);
				this.cursorBarContainer.style.width = this.cursorBarContainerWidth + 'px';
				this.cursorBarContainer.style.height = this.scaledSelectorHeight + 'px';
				this.cursorBar.style.left = (this.cursorBarContainerWidth / 2) + 'px';
				this.cursorBar.style.top = '0px';
				this.cursorBar.style.width = this.cursorBarWidth + 'px';
				this.cursorBar.style.height = this.scaledSelectorHeight + 'px';
			}
			//console.log("leftDragOffset %f",this.leftDragOffset);

			this.imageContainer.style.width = this.scaledSelectorWidth + 'px';
			this.imageContainer.style.height = this.scaledSelectorHeight + 'px';
			this.image.style.width = this.scaledSelectorWidth + 'px';
			this.image.style.height = this.scaledSelectorHeight + 'px';

			var cur2 = (this.model.isArrayStartsFrom0()) ? distance.cur : distance.cur - 1;
			//var sliceOffset = cur2 / (distance.max - distance.min);
			var fullDepth = this.model.getFullDepth();
			var sliceOffset = cur2 / fullDepth;
			this.setSliceOffset(sliceOffset);

			this.totWidth = (this.dragWidth > this.scaledSelectorWidth) ? this.dragWidth : this.scaledSelectorWidth;
			var totHeight = (this.dragHeight > this.scaledSelectorHeight) ? this.dragHeight : this.scaledSelectorHeight;
			if (this.leftDragOffset < 0) {
				this.totWidth = this.scaledSelectorWidth - this.leftDragOffset * 2;
			}
			if (this.topDragOffset < 0) {
				totHeight = this.scaledSelectorHeight - this.topDragOffset * 2;
			}

			var feedbackWidth = $('selector-feedbackContainer').getWidth();
			var feedbackHeight = $('selector-feedbackContainer').getHeight();

			this.totWidth = (this.totWidth < feedbackWidth) ? feedbackWidth : this.totWidth;
			//console.log("feedbackWidth %s, this.totWidth %s",feedbackWidth,this.totWidth);

			this.window.setDimensions(this.totWidth, totHeight + feedbackHeight + 4);

			var imageContainerLeftOffset = Math.floor((this.totWidth - this.scaledSelectorWidth) / 2);
			//console.log("imageContainerLeftOffset %s",imageContainerLeftOffset);
			this.imageContainer.style.left = imageContainerLeftOffset + 'px';

			this.feedback.style.top = totHeight + 2 + 'px';

			var imageOffset = $('selector-imageContainer').style.left;
			//console.log("imageOffset = ", imageOffset);

		} // initial

		//console.log("exit Selector viewUpdate:");

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
