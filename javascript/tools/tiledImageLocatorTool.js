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
//tiledImageLocatorTool.js
//Tool to allow navigation around a High resolution tiled image from an iip server
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImageLocatorTool
//---------------------------------------------------------
//emouseatlas.emap.tiledImageLocatorTool = new Class ({
var tiledImageLocatorTool = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {
		this.name = "Locator";

		this.parent(params);

		this.zoneBorder = 1;

		//this.window.win.style.position = 'absolute';

		this.imageContainer = new Element( 'div', {
			'id': this.shortName+'-imagecontainer',
			'class': 'imagecontainer'
		});
		this.imageContainer.inject( this.window.win , 'inside');

		this.image = new Element( 'img', {
			id: this.shortName+'-image'
		});
		this.image.inject( this.imageContainer , 'inside');

		this.zone = new Element( 'div', {
			'id': this.shortName+'-zone',
			'class': 'zone',
			'styles': {
				'border': this.zoneBorder + 'px solid blue'
			}
		});
		this.zone.inject( this.imageContainer , 'inside');
		this.zone.makeDraggable(emouseatlas.emap.utilities.getDragOpts(this.shortName+'-imagecontainer',0,this));

		//console.log("exit tiledImageLocatorTool.initialize");
	},

	//---------------------------------------------------------------
	handleDrag: function(done) {
		//console.log("enter tiledImageLocatorTool.handleDrag:");
		var x = 0.5;
		var y = 0.5;
		var imgFit = this.view.getImgFit();

		if (!imgFit.xfits) {
			x = (this.zone.offsetLeft + this.zonewidth / 2) / this.navwidth;
		}
		if (!imgFit.yfits) {
			y = (this.zone.offsetTop  + this.zoneheight / 2) / this.navheight;
		}
		//console.log("Locator x %d, y %d",x,y);

		this.view.setFocalPoint({x:x, y:y});
		//console.log("exit tiledImageLocatorTool.handleDrag:");
	},


	//---------------------------------------------------------------
	modelUpdate: function(modelChanges, from) {

		//......................................................
		// this should fire whenever dst or rotation is changed
		//......................................................
		//console.log("tiledImageLocator modelUpdate:");
		if(modelChanges.dst === true || modelChanges.rotation === true) {
			//console.log("tiledImageLocator.modelUpdate: dst | locator");
			this.setNavDims();
			this.window.setDimensions(this.navwidth + 4,this.navheight + 4);
			this.setLocatorImage('modelUpdate.dst or modelUpdate.rotation');
			this.isWlz = this.model.isWlzData();
			this.setLocatorZone();
		} // modelChanges.fullImgDims

	}, // modelUpdate

	//---------------------------------------------------------------
	viewUpdate: function(viewChanges) {

		//console.log("tiledImageLocator viewUpdate:");
		// do the setting up stuff
		if(viewChanges.initial === true) {
			//console.log("locator: viewChanges.initial %s",viewChanges.initial);
			this.isWlz = this.model.isWlzData();
			this.window.setVisible(true);
			this.setNavDims();
			this.window.setDimensions(this.navwidth + 4,this.navheight + 4);
			this.setLocatorImage('viewUpdate.initial');
			this.setLocatorZone();
		} // viewChanges.initial

		//.................................
		if(viewChanges.scale === true) {
			//console.log("tiledImageLocator.viewUpdate: scale");
			this.setNavDims();
			this.window.setDimensions(this.navwidth + 4,this.navheight + 4);
			this.setLocatorImage('viewUpdate.scale');
			this.setLocatorZone();
		} // viewChanges.scale

		//.................................
		if(viewChanges.focalPoint === true) {
			//console.log("locator: viewChanges.focalPoint %s",viewChanges.focalPoint);
			this.setLocatorZone();
		} // viewChanges.focalPoint

		//.................................
		if(viewChanges.locator === true) {
			//console.log("tiledImageLocator.viewUpdate: locator");
			this.setNavDims();
			this.window.setDimensions(this.navwidth + 4,this.navheight + 4);
			this.setLocatorImage('viewUpdate.locator');
			this.setLocatorZone();
		} // viewChanges.wlzUpdated

		//.................................
		if(viewChanges.toolbox === true) {
			var viz = this.view.toolboxVisible();
			if(viz === true) {
				this.window.setVisible(true);
			} else if(viz === false) {
				this.window.setVisible(false);
			}
		}

	}, // viewUpdate

	//--------------------------------------------------------------
	setNavDims: function () {

		//console.log("locator: setNavDims");
		var fullImgDims = this.model.getFullImgDims();
		var w = this.maxWidth / fullImgDims.width;
		var h = this.maxHeight / fullImgDims.height;
		this.navscale = (w < h) ? w : h;
		this.navscale = (Math.round(this.navscale * 10000))/10000;
		//console.log("this.navscale ",this.navscale);

		this.navwidth  = (this.navscale * fullImgDims.width);
		this.navheight = (this.navscale * fullImgDims.height);

		//console.log("maxW %d, fullwidth %d, navwidth %d, navscale %f",this.maxWidth,fullImgDims.width, this.navwidth,this.navscale);
	}, // setNavDims

	//--------------------------------------------------------------
	getNavSrc: function () {

		//console.log("enter locator.getNavSrc:");

		var quality = this.model.getImgQuality();
		var server = this.model.getIIPServer();
		var layerData = this.model.getLayerData();
		var layerNames = this.model.getLayerNames();
		var layer = layerData[layerNames[0]];  // in future we will be able to select which layer provides the locator image
		var imgDir =  layer.imageDir;
		var imgName =  layer.imageName;
		var sampleRate = 1.0;  // this will have to be sorted out with Richard & Bill

		/*
      // for very large images the locator image must be sub-sampled.
      var locatorData = this.view.getLocatorData();
      var imgName = locatorData.imageName;
      var imgDir = locatorData.imageDir;
      var sampleRate = locatorData.sampleRate;
		 */

		if (this.isWlz) {
			var threeDInfo = this.model.getThreeDInfo();
			//console.log("threeDInfo: ",threeDInfo);

			//var navsrc = server + '?wlz=' +  this.model.getFileSystemRoot() + this.model.getDataRoot()+imgDir + imgName
			var navsrc = server + '?wlz=' +  imgDir + imgName
			+ "&mod=" + threeDInfo.wlzMode
			+ "&fxp=" + (threeDInfo.fxp.x / sampleRate) + ',' + (threeDInfo.fxp.y / sampleRate) + ','+ (threeDInfo.fxp.z / sampleRate)
			+ "&scl=" + (this.navscale * sampleRate)
			+ "&dst=" + threeDInfo.dst.cur * this.navscale
			+ "&pit=" + threeDInfo.pitch.cur
			+ "&yaw=" + threeDInfo.yaw.cur
			+ "&rol=" + threeDInfo.roll.cur
			+ "&qlt=" + quality.cur
			+ '&cvt=png';
			//console.log("navsrc %s",navsrc);
		} else {
			//console.log("not wlz:");
			var navsrc = server + '?fif=' + this.model.getFullImgFilename(layerNames[0])
			//var navsrc = server + '?fif=' + imgName
			+ '&wid=' + this.navwidth * 2
			+ '&qlt=' + quality.cur
			+ '&cvt=png';
			//console.log("navsrc %s",navsrc);
		}

		//console.log("exit locator.getNavSrc:",navsrc);
		return navsrc;
	}, // getNavSrc

	//--------------------------------------------------------------
	setLocatorImage: function (caller) {

		//console.log("enter locator.setLocatorImage, called from %s",caller);
		if (!this.isWlz) {
			//console.log("not wlz");
			this.image.style.width = this.navwidth + 'px';
			this.image.style.height = this.navheight + 'px';
			this.imageContainer.style.width = this.navwidth + 'px';
			this.imageContainer.style.height = this.navheight + 'px';
		}

		this.imageContainer.style.left = '2px';
		this.imageContainer.style.top = '2px';

		var src = this.getNavSrc();

		// do not know how browser fetches new image.src,
		//  make sure it does not fetch uncessary
		if (this.oldImg === undefined ||
				this.oldImg != src) {
			this.image.src = src;
			this.oldImg = src;
		}

		//console.log("exit locator.setLocatorImage, called from %s",caller);
	}, // setLocatorImage

	//--------------------------------------------------------------
	setLocatorZone: function () {

		//console.log("enter locator.setLocatorZone");
		var focalPoint = this.view.getFocalPoint();
		var viewable = this.view.getViewableDims();
		var imgFit = this.view.getImgFit();
		var scale = this.view.getScale();

		this.zonewidth =  this.navscale * viewable.width  / scale.cur;
		this.zoneheight = this.navscale * viewable.height / scale.cur;

		// previously used $chk
		if (this.zonewidth || this.zonewidth === 0) {
			this.zone.style.width = this.zonewidth - 2 * this.zoneBorder + 'px';
		}
		// previously used $chk
		if (this.zoneheight || this.zoneheight === 0) {
			this.zone.style.height = this.zoneheight - 2 * this.zoneBorder + 'px';
		}

		// centres the 'zone'
		var x = focalPoint.x * this.navwidth - this.zonewidth/2;
		var y = focalPoint.y * this.navheight - this.zoneheight/2;

		if (x < 0) {
			x = 0;
		} else if (imgFit.xfits) {
			x = 0;
		} else if (x > this.navwidth - this.zonewidth) {
			x = this.navwidth - this.zonewidth;
		}

		if (y < 0) {
			y = 0;
		} else if (imgFit.yfits) {
			y = 0;
		} else if (y > this.navheight - this.zoneheight) {
			y = this.navheight - this.zoneheight;
		}

		// previously used $chk
		if (x || x === 0) {
			this.zone.style.left = x + 'px';
		}
		// previously used $chk
		if (y || y === 0) {
			this.zone.style.top = y + 'px';
		}
		//console.log("exit locator.setLocatorZone");

	} // setLocatorZone

}); // end of class tiledImageLocatorTool
//----------------------------------------------------------------------------
