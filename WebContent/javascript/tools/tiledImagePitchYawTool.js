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
//tiledImagePitchYawTool.js
//Tool to change pitch and yaw of plane through 3D wlz object tiled image from an iip server
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImagePitchYawTool
//---------------------------------------------------------
//emouseatlas.emap.tiledImagePitchYawTool = new Class ({
var tiledImagePitchYawTool = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {

		this.width = params.toolParams.width;
		this.height = params.toolParams.height;
		this.maxPitch = parseInt(params.toolParams.maxPitch);
		this.maxYaw = parseInt(params.toolParams.maxYaw);
		this.gap = parseInt(params.toolParams.gap);
		this.navImage = params.toolParams.navImage;

		this.newPitch;
		this.newYaw;

		var layerData = this.model.getLayerData();
		var layerNames = this.model.getLayerNames();
		var layer = layerData[layerNames[0]];  // in future we will be able to select which layer provides the navImage
		this.dataPath =  layer.imageDir;
		this.iipServer = this.model.getIIPServer();
		this. nRows = Math.floor(this.maxPitch / this.gap) + 1*1;
		this.nCols = Math.floor(this.maxYaw / this.gap) + 1*1;

		this.textheight = 32;

		this.name = "PitchYaw";
		
		this.parent(params);

		this.imageContainer = new Element( 'div', {
			'id': this.shortName+'-imagecontainer',
			'class': 'imagecontainer'
		});
		this.imageContainer.inject(this.window.win, 'inside');

		this.image = new Element( 'img', {
			'id': this.shortName + '-image',
			'class': 'sectionplane-image',
			'styles': {
				'cursor': 'default',
				'left': '0px',
				'top': '0px'
			}
		});
		this.image.inject(this.imageContainer, 'inside');

		this.imageContainer.addEvent('mousedown', function(e) {
			this.doMouseDown(e);
		}.bind(this));
		/*
      $(this.target).addEvent('mouseup', function(e) {
	 this.doMouseUp(e);
      }.bind(this));
      this.imageContainer.addEvent('mousemove', function(e) {
         this.doMouseMove(e);
      }.bind(this));
		 */

		//console.log("exit tiledImagePitchYawTool.initialize");
		this.window.setToolTip(this.shortName);

	},

	//---------------------------------------------------------------
	doMouseDown: function (event) {
		// prevent default dragging action in Firefox
		if(event.preventDefault) {
			event.preventDefault();
		}
		/*
      this.startX = event.client.x;
      this.startY = event.client.y;
      this.mouseDownInFrame = true;
		 */
	},

	//---------------------------------------------------------------
	doMouseUp: function (e) {

		if(this.mouseDownInFrame === false) {
			return;
		} else {
			this.view.updateWlzRotation();
		}

		this.mouseDownInFrame = false;
		return false;
	},

	//---------------------------------------------------------------
	doMouseMove: function (event) {

		var currentX;
		var currentY;
		var threeD = this.model.getThreeDInfo();
		var pitch = threeD.pitch;
		var yaw = threeD.yaw;
		var damping = 30.0;

		if(this.mouseDownInFrame) {
			//console.log(pitch,yaw);
			currentX = event.client.x;
			this.deltaX = currentX - this.startX;
			this.newYaw = yaw.cur + Math.round(this.deltaX / damping);
			this.newYaw = (this.newYaw > yaw.max) ? yaw.max : this.newYaw;
			this.newYaw = (this.newYaw < yaw.min) ? yaw.min : this.newYaw;
			//console.log("startX %d, currentX %d, deltaX %d",this.startX,currentX,this.deltaX);

			currentY = event.client.y;
			this.deltaY = currentY - this.startY;
			this.newPitch = pitch.cur + Math.round(this.deltaY / damping);
			this.newPitch = (this.newPitch > pitch.max) ? pitch.max : this.newPitch;
			this.newPitch = (this.newPitch < pitch.min) ? pitch.min : this.newPitch;
			//console.log("startY %d, currentY %d, deltaY %d",this.startY,currentY,this.deltaY);

			this.setImageSrc(this.newPitch, this.newYaw);
			this.model.modifyOrientation(this.newPitch, this.newYaw, undefined);
		};
	},

	//---------------------------------------------------------------
	setImageSrc: function (pitch, yaw) {

		//console.log("setImageSrc: %d, %d",pitch,yaw);

		var row = Math.floor(pitch / this.gap);
		row = (row === this.nRows) ? 0 : row; // to handle the pitch = 180deg case
		var col = Math.floor(yaw / this.gap);
		col = (col === this.nCols) ? 0 : col; // to handle the yaw = 360deg case

		/*
       the tile matrix starts at 0,0
       yaw: has images for 0deg to 355deg in 5deg steps ....cols 0 to 71 ==> 72 cols
       pitch: has images for 0deg to 175deg in 5deg steps ....rows 0 to 35 ==> 36 rows
		 */
		var k = row * this.nCols + col;
		var src = this.iipServer + "?fif=" + this.dataPath + this.navImage + "&jtl=0," + k;
		//console.log("col %d, row %d, k %d",col,row,k);
		this.image.src = src;
	},

	//---------------------------------------------------------------
	modelUpdate: function(modelChanges, from) {

		//......................................................
		// this should fire whenever dst or rotation is changed
		//......................................................
		//console.log("tiledImagePitchYaw modelUpdate:");
		if(modelChanges.rotation || modelChanges.initialState || modelChanges.locator) {
			var threeD = this.model.getThreeDInfo();
			this.setImageSrc(threeD.pitch.cur, threeD.yaw.cur);
		}; // modelChanges.fullImgDims

	}, // modelUpdate

	//---------------------------------------------------------------
	viewUpdate: function(viewChanges) {

		//console.log("tiledImagePitchYaw viewUpdate:");
		// do the setting up stuff
		if(viewChanges.initial === true) {
			//console.log("locator: viewChanges.initial %s",viewChanges.initial);
			this.isWlz = this.model.isWlzData();
			this.window.setVisible(true);
			this.window.setDimensions(this.width,this.height);
			var src = this.iipServer + "?fif=" + this.dataPath + this.navImage + "&jtl=0,0";
			this.image.src = src;
		}; // viewChanges.initial

		if(viewChanges.toolbox === true) {
			var viz = this.view.toolboxVisible();
			if(viz === true) {
				this.window.setVisible(true);
			} else if(viz === false) {
				this.window.setVisible(false);
			}
		}

	} // viewUpdate

}); // end of class tiledImagePitchYawTool
//----------------------------------------------------------------------------
