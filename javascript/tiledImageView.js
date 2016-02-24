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
//tiledImageView.js
//High resolution tiled image from an iip server
//Using the 'module' pattern of Crockford, slightly modified by Christian Heilmann into the 'Revealing Module Pattern'
//---------------------------------------------------------

//---------------------------------------------------------
//---------------------------------------------------------
//Dependencies:
//none
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------
if(!emouseatlas) {
	var emouseatlas = {};
}
if(!emouseatlas.emap) {
	emouseatlas.emap = {};
}

//---------------------------------------------------------
//module for tiledImageView
//encapsulating it in a module to preserve namespace
//---------------------------------------------------------
emouseatlas.emap.tiledImageView = function() {

	//---------------------------------------------------------
	// modules
	//---------------------------------------------------------
	var util = emouseatlas.emap.utilities;
	var info = emouseatlas.emap.viewerInfo;

	// private members

	var that = this;
	var registry = []; // allows the view to notify observers of changes to layer, viewport size etc.
	var viewChanges = { 
			initial: false,
			viewport: false,
			maximise: false,
			toolbox: false,
			scale: false,
			focalPoint: false,
			layer: false,
			showProperties: false,
			mode: false,
			selectFixedPoint: false,
			measuringTool: false,
			measuringOrigin: false,
			measuringTarget: false,
			measuring: false,
			HRSection: false,
			visibility: false,
			opacity: false,
			filter: false,
			selections: false,
			wlzUpdated: false,
			locator: false,
			dblClick: false,
			showViewerHelp: false,
			hideViewerHelp: false,
			showViewerInfo: false,
			hideViewerInfo: false,
			hideMenu: false
	};
	var targetContainer;
	var model;
	var eventCapturingContainer;
	var tileFrameContainers = {};
	var image = {};
	var fullImage = {};
	var viewport = {};
	var viewable = {};
	//var resolutionData = {};
	//var locatorData = {};
	//var selectorData = {};
	var resolution;
	var scale = {};
	var focalPoint = {x:0.5, y:0.5};
	var oldDst;
	var xfits;
	var yfits;
	var startx;
	var starty;
	var endx;
	var endy;
	var mouseDownInImage = false;
	var mousewheelIsSupported = false;
	var keepViewerHelpFrame = false;
	var keepViewerInfoFrame = false;
	var imageIsMaximised = false;
	var tileHasBorder = false;
	var tools = {};
	var toolsVisible = true;
	var measuring = false;
	var measuringOrigin = false;
	var measuringTarget = false;
	var indexName = false;
	var overlay = false;
	var initialMousePoint;
	var initialFocalPoint;
	var layerNames = [];
	var numLayers;
	var currentLayer;
	var layerData = {};
	var layerVisibility = {};
	var layerOpacity = {};
	var layerFilter = {};
	var possibleFixedPoint = {};
	var measurementOrigin = {};
	var measurementTarget = {};
	var measurementPoint = {};
	var HRSectionPoint = {};
	var equivalentSectionId;
	var openWindows = [];
	var modes = {
			move:{name:'move', cursor:'move'},
			measuring:{name:'measuring', cursor:'pointer'},
			HRSection:{name:'HRSection', cursor:'pointer'},
			fixedPoint:{name:'fixedPoint', cursor:'crosshair'}
	};
	var mode = {name:'move', cursor:'pointer'};
	var defaultModeName = 'move';
	var indexArray;
	var treeSelections = "";
	var skip = ["locator-container", "selector-container", "layertool-container", "expressionkey-container", "rotationtool-container"];
	var docX; // position of mouse click relative to document.
	var docY;
	var mouseMoveTimeStamp;
	var mouseMoveTimeout;
	var mouseMoveDelay = 200;
	var indexDataToolTip;
	var indexDataToolTipText;

	var imageContextMenu;

	var initialised = false;
	var imagePosition = {};

	//---------------------------------------------------------
	//   private methods
	//---------------------------------------------------------

	var buildTileFrameContainer  = function () {

		//util.printNodes(targetContainer, 1, "   ");
		layerData = model.getLayerData();
		layerNames = model.getLayerNames();
		numLayers = layerNames.length;

		var initialOpacity = 1.0;

		var tileFrameContainer;
		var tileFrame;
		var i,j;


		// Firefox doesn't support the 'mousewheel' event so we have to test for its support.
		// from http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
		//.................................................
		var testDiv = document.createElement('div');
		mousewheelIsSupported = 'mousewheel' in testDiv;
		if(!mousewheelIsSupported) {
			testDiv.setAttribute('onmousewheel', 'return;');
			if(typeof(testDiv.onmousewheel) !== 'undefined') {
				mousewheelIsSupported = true;
			}
		}
		//.................................................

		for(i=0; i<numLayers; i++) {
			if(typeof(layerData[layerNames[i]]) !== 'undefined') {
				// make the tileFrameContainer
				tileFrameContainer = document.createElement("div");
				tileFrameContainer.id = layerNames[i] + "_tileFrameContainer";
				tileFrameContainer.className = "tiledImgLayer";
				//targetContainer.appendChild(tileFrameContainer);

				// make the tileFrame
				tileFrame = document.createElement("div");
				tileFrame.id = layerNames[i] + "_tileFrame";
				tileFrame.className = "tiledImgDiv";
				//tileFrame.id = "tileframe";
				tileFrameContainer.appendChild(tileFrame);

				setLayerVisibility({layer:layerNames[i], value:layerData[layerNames[i]].visible});
				setInitialOpacity(layerNames[i]);
				setInitialFilter(layerNames[i]);

				// set up the event handlers (we need to do it for each layer)
				// only add/remove 'mousemove' on mousedown/mouseup (ie not here)
				util.addEvent(tileFrame, 'click', doMouseClick, false);
				util.addEvent(tileFrame, 'dblclick', doMouseDblClick, false);
				util.addEvent(tileFrame, 'mousedown', doMouseDownInImage, false);
				util.addEvent(tileFrame, 'mouseup', doMouseUpInImage, false);
				util.addEvent(tileFrame, 'mouseover', doMouseOver, false);
				util.addEvent(tileFrame, 'mouseout', doMouseOut, false);
				util.addEvent(tileFrame, 'mousemove', doMouseMove, false);
				//util.addEvent(window, 'mousedown', doMouseDown, false);
				//util.addEvent(window, 'mouseup', doMouseUp, false);
				//var wheel = mousewheelIsSupported ? 'mousewheel' : 'DOMMouseScroll';
				//util.addEvent(window, wheel, doMouseWheel, false);
				//util.addEvent(tileFrame, wheel, doMouseWheel, false);

			}

			if(typeof(tileFrameContainers[layerNames[i]]) === 'undefined') {
				tileFrameContainers[layerNames[i]] = tileFrameContainer;
				//util.printNodes(tileFrameContainer.firstChild, 1, "   ");
			}

		} // for

		var current = model.getInitialCurrentLayer();
		setCurrentLayer(current);

		//util.printNodes(targetContainer, 1, "   ");

	}; // buildTileFrameContainer

	//---------------------------------------------------------
	var buildHelpIconContainer  = function () {
		//..............
		// the HelpFrame icon
		//..............
		var helpFrameIconContainer = document.getElementById("helpFrameIconContainer");

		util.addEvent(helpFrameIconContainer, 'click', doViewerHelpIconClicked, false);
		util.addEvent(helpFrameIconContainer, 'mouseover', showViewerHelpFrame, false);
		util.addEvent(helpFrameIconContainer, 'mouseout', hideViewerHelpFrame, false);

	};

	//---------------------------------------------------------
	var buildInfoIconContainer  = function () {
		//..............
		// the InfoFrame icon
		//..............
		var infoFrameIconContainer = document.getElementById("infoFrameIconContainer");

//		util.addEvent(infoFrameIconContainer, 'click', doViewerInfoIconClicked, false);
//		util.addEvent(infoFrameIconContainer, 'mouseover', showViewerInfoFrame, false);
//		util.addEvent(infoFrameIconContainer, 'mouseout', hideViewerInfoFrame, false);

	};

	//---------------------------------------------------------------
	// called when help icon clicked
	//---------------------------------------------------------------
	var doViewerHelpIconClicked = function (event) {
		if(keepViewerHelpFrame === false) {
			keepViewerHelpFrame = true;
			showViewerHelp();
		} else {
			hideViewerHelp();
		}
	};

	//---------------------------------------------------------------
	// called when info icon clicked
	//---------------------------------------------------------------
	var doViewerInfoIconClicked = function (event) {
		if(keepViewerInfoFrame === false) {
			keepViewerInfoFrame = true;
			showViewerInfo();
		} else {
			hideViewerInfo();
		}
	};

	//---------------------------------------------------------------
	// called on mouseover help icon
	//---------------------------------------------------------------
	var showViewerHelpFrame = function (event) {
		showViewerHelp();
	};

	//---------------------------------------------------------------
	// called on mouseout help icon
	//---------------------------------------------------------------
	var hideViewerHelpFrame = function (event) {
		if(keepViewerHelpFrame) {
			return false;
		}
		hideViewerHelp();
		keepViewerHelpFrame = false;
	};

	//---------------------------------------------------------------
	// called on mouseover info icon
	//---------------------------------------------------------------
	var showViewerInfoFrame = function (event) {
		showViewerInfo();
	};

	//---------------------------------------------------------------
	// called on mouseout info icon
	//---------------------------------------------------------------
	var hideViewerInfoFrame = function (event) {
		if(keepViewerInfoFrame) {
			return false;
		}
		hideViewerInfo();
		keepViewerInfoFrame = false;
	};

	//---------------------------------------------------------
	var setInitialOpacity = function (layer) {

		if(typeof(layerOpacity[layer]) === 'undefined') {
			layerOpacity[layer] = {name:layer, opacity:layerData[layer].initialOpacity};
		} else {
			layerOpacity[layer].opacity = {opacity:layerData[layer].initialOpacity};
		}
		//applyTileFrameOpacity(layer);
	};

	//---------------------------------------------------------
	var setInitialFilter = function (layer) {

		if(typeof(layerFilter[layer]) === 'undefined') {
			layerFilter[layer] = {name:layer, filter:layerData[layer].initialFilter};
		} else {
			layerFilter[layer].filter = {filter:layerData[layer].initialFilter};
		}
	};

	//---------------------------------------------------------
	var printAllImages = function (msg) {
		var i,j;
		var tileFrameContainer;
		var children;
		var numChildren;
		var numImgs;
		var imgs;

		for(i=0; i<numLayers; i++) {
			if(typeof(tileFrameContainers[layerNames[i]]) !== 'undefined') {
				tileFrameContainer = tileFrameContainers[layerNames[i]];
				imgs = tileFrameContainer.getElementsByTagName('img');
			}
		}
	};

	//---------------------------------------------------------
	var printTiles = function (layer) {
		var tileFrameContainer = tileFrameContainers[layer];
		var child = tileFrameContainer.firstChild;
		util.printNodes(child, 1, "   ", skip);
	};

	//---------------------------------------------------------
	var addLayerToView = function (layer) {
		//util.printNodes(targetContainer, 1, "   ", skip);
		var tileFrameContainer = tileFrameContainers[layer];
		targetContainer.appendChild(tileFrameContainer);
		//util.printNodes(targetContainer, 1, "   ", skip);
	};

	//---------------------------------------------------------
	var addAllLayersToView = function () {
		//util.printNodes(targetContainer, 1, "   ", skip);
		var i;

		for(i=0; i<numLayers; i++) {
			addLayerToView(layerNames[i]);
		}
	};

	//---------------------------------------------------------
	var removeLayerFromView = function (layer) {
		var tileFrameContainer = tileFrameContainers[layer];
		//targetContainer.removeChild(tileFrameContainer);
		//util.printNodes(targetContainer, 1, "   ", skip);
	};

	//---------------------------------------------------------
	var setTileFrameVisibility = function(layer, show) {

		var visibility = show ? "visible" : "hidden";
		var tileFrameContainer;
		var containerId;
		var found = false;
		var i;

		for(i=0; i<numLayers; i++) {
			if(layerNames[i] === layer) {
				found = true;
				break;
			}
		}

		if(!found) {
			return false;
		}

		containerId = layer + "_tileFrameContainer";
		if(typeof(document.getElementById(containerId)) !== 'undefined' && document.getElementById(containerId) !== null) {
			tileFrameContainer = document.getElementById(containerId);
			tileFrameContainer.style.visibility = visibility;
		}
	};

	//---------------------------------------------------------
	var getTopVisibleLayer = function() {

		var tileFrameContainer;
		var visibility;
		var containerId;
		var layer;
		var style;
		var i;
		var ret;

		for(i=numLayers; i>0; i--) {
			layer = layerNames[i-1];
			containerId = layer + "_tileFrameContainer";
			if(document.getElementById(containerId) !== 'undefined' && document.getElementById(containerId) !== null) {
				tileFrameContainer = document.getElementById(containerId);
				if(layerVisibility[layer].visible === 'true' || layerVisibility[layer].visible === true) {
					ret = layer;
					break;
				}
			}
		}

		return ret;
	};

	//---------------------------------------------------------
	var setTileFramePosition = function() {

		var tileFrameContainer;
		var tileFrame;
		var containerId;
		var tileFrameId;
		var i;

		var vpleft = 0;
		if (image.width > viewport.width) {
			vpleft = getViewportLeftEdge();
		}
		vpleft = isNaN(vpleft) ? 0 : vpleft;

		var vptop = 0;
		if (image.height > viewport.height) {
			vptop = getViewportTopEdge();
		}
		vptop = isNaN(vptop) ? 0 : vptop;

		for(i=0; i<numLayers; i++) {

			containerId = layerNames[i] + "_tileFrameContainer";
			tileFrameId = layerNames[i] + "_tileFrame";

			if(typeof(document.getElementById(containerId)) !== 'undefined' && document.getElementById(containerId) !== null) {

				tileFrameContainer = document.getElementById(containerId);
				tileFrame= document.getElementById(tileFrameId);

				if (xfits) {
					tileFrameContainer.style.left = (viewport.width - image.width)/2 + 'px';
					tileFrame.style.left = 0 + "px";
				} else {
					tileFrameContainer.style.left = viewport.width - image.width + 'px';
					tileFrame.style.left = -vpleft + image.width - viewport.width + "px";
				}
				if (yfits) {
					tileFrameContainer.style.top = (viewport.height - image.height)/2 + 'px';
					tileFrame.style.top = 0 + "px";
				} else {
					tileFrameContainer.style.top = viewport.height - image.height + 'px';
					tileFrame.style.top = -vptop + image.height - viewport.height + "px";
				}

			} // if

		} // for

	}; // setTileFramePosition

	//---------------------------------------------------------
	// set opacity for currentLayer
	//---------------------------------------------------------
	var setTileFrameOpacity = function(val) {

		var tileFrameContainer;
		var containerId;

		containerId = currentLayer + "_tileFrameContainer";
		if(typeof(document.getElementById(containerId)) !== 'undefined' && document.getElementById(containerId) !== null) {
			tileFrameContainer = document.getElementById(containerId);
			tileFrameContainer.style.opacity = val;
		}
		layerOpacity[currentLayer].opacity = val;
	};

	//---------------------------------------------------------
	// apply opacity for specified layer
	//---------------------------------------------------------
	var applyTileFrameOpacity = function(layerName) {

		var tileFrameContainer;
		var containerId;

		containerId = layerName + "_tileFrameContainer";
		if(typeof(document.getElementById(containerId)) !== 'undefined' && document.getElementById(containerId) !== null) {
			tileFrameContainer = document.getElementById(containerId);
			tileFrameContainer.style.opacity = layerOpacity[layerName].opacity;
		}
	};

	//--------------
	var isSameImagePosition=function() {
		var threeDInfo = model.getThreeDInfo();

		if (imagePosition.x === undefined ||
				1 * imagePosition.x != 1 * threeDInfo.fxp.x) {
			return false;
		}
		if (imagePosition.y === undefined ||
				1 * imagePosition.y != 1 * threeDInfo.fxp.y) {
			return false;
		}
		if (imagePosition.z === undefined ||
				1 * imagePosition.z !=  1 * threeDInfo.fxp.z) {
			return false;
		}
		if (imagePosition.pitch === undefined ||
				1 * imagePosition.pitch != 1 * threeDInfo.pitch.cur) {
			return false;
		}
		if (imagePosition.yaw === undefined ||
				1 * imagePosition.yaw != 1 * threeDInfo.yaw.cur) {
			return false;
		}
		if (imagePosition.dst === undefined ||
				1 * imagePosition.dst != 1 * threeDInfo.dst.cur) {
			return false;
		}
		if (imagePosition.roll === undefined ||
				1 * imagePosition.roll != 1 * threeDInfo.roll.cur) {
			return false;
		}
		if (imagePosition.scale === undefined ||
				1 * imagePosition.scale != 1 * scale.cur) {
			return false;
		}

		return true;
	};

	//---------------------------------------------------------
	var setImagePosition=function() {

		var threeDInfo = model.getThreeDInfo();

		imagePosition.x = threeDInfo.fxp.x;
		imagePosition.y = threeDInfo.fxp.y;
		imagePosition.z = threeDInfo.fxp.z;
		imagePosition.pitch = threeDInfo.pitch.cur;
		imagePosition.yaw = threeDInfo.yaw.cur;
		imagePosition.roll = threeDInfo.roll.cur;
		imagePosition.dst = threeDInfo.dst.cur;
		imagePosition.scale = scale.cur;
	};

	//---------------------------------------------------------
	/**
	 * Load new tiles, remove old ones
	 *
	 * @author Tom Perry
	 */
	var getDraggedTiles = function() {

		var tileSize = model.getTileSize();

		if (!xfits) {
			while (getViewportLeftEdge() + viewport.width > (endx+1) * tileSize.width) {
				getTiles(endx+1, endx+1, starty, endy);
				removeTiles(startx, startx, starty, endy);
				startx++;
				endx++;
			}
			while (getViewportLeftEdge() < startx * tileSize.width) {
				getTiles(startx-1, startx-1, starty, endy);
				removeTiles(endx, endx, starty, endy);
				startx--;
				endx--;
			}
		}

		if (!yfits) {

			while (getViewportTopEdge() + viewport.height > (endy+1) * tileSize.height) {
				getTiles(startx, endx, endy+1, endy+1);
				removeTiles(startx, endx, starty, starty);
				starty++;
				endy++;
			}
			while (getViewportTopEdge() < starty * tileSize.height) {
				getTiles(startx, endx, starty-1, starty-1);
				removeTiles(startx, endx, endy, endy);
				starty--;
				endy--;
			}
		}

	}; // getDraggedTiles

	//---------------------------------------------------------

	/*
	 * If we're requesting a Woolz image, we need to specify
	 * additional parameters
	 *
	 * @author Tom Perry
	 */
	var getTileSrc = function(layerName, k, highQual) {

		var _debug = false;
		//var layerData = model.getLayerData();
		var layer = layerData[layerName];
		if(typeof(layer) === 'undefined') {
			return false;
		}

		var sel = undefined;
		var filter = undefined;

		if(layer.type === 'label') {
			if(typeof(tools.tree) === 'undefined') {
				//sel = getAllSelections(layerName);
			} else {
				sel = getSelections();
			}
		} else if(layer.type === 'greyLevel') {
			var lfilter = layerFilter[layerName];
			filter = "&sel=0," + lfilter.filter.red + "," + lfilter.filter.green + "," + lfilter.filter.blue +",255";
		} else if(layer.type === 'compound') {
			var indexData = model.getIndexData(layerName);
			var col; 
			var i;
			for(i=0; i<numLayers; i++) {
				if(layerName === indexData[i].name) {
					col = indexData[i].colour;
					sel = "&sel=" + indexData[i].domainId + "," + col[0] + "," + col[1] + "," + col[2] + "," + col[3];
					break;
				}
			}
		} 
		else   // try expression layer
			if(layer.type === 'expression') {
				sel = "&sel=1,255,0,0,255";
				sel = sel+"&sel=2,255,255,0,255";
				sel = sel+"&sel=3,0,0,255,255";
				sel = sel+"&sel=4,0,255,0,255";
				sel = sel+"&sel=5,0,255,255,255";
		}
		else   // try expression layer
			if(layer.type === 'expression_layer') {
				// SEL=0&MAP=LINEAR,0,255,0,0,LINEAR,0,255,0,255,LINEAR,0,255,0,255&QLT=50&CVT=jpeg 
				var lfilter = layerFilter[layerName];
				sel = "&sel=0";
				sel = sel+"&map=LINEAR,0,255,0,"+lfilter.filter.red+",LINEAR,0,255,0,"+lfilter.filter.green+",LINEAR,0,255,0,"+lfilter.filter.blue+",LINEAR,0,255,0,255";
				//sel = sel+"&map=LINEAR,0,"+lfilter.filter.red+",0,0,LINEAR,0,"+lfilter.filter.green+",0,255,LINEAR,0,"+lfilter.filter.blue+",0,0,LINEAR,0,255,0,255";
		}

		var src;
		var imgType = (layer.type === 'greyLevel') ? "&jtl=" : "&ptl=";
		var qlt = (highQual) ? model.getImgQuality().cur : 1;

		if (model.isWlzData()) {
			var imgType = (layer.type === 'greyLevel') ? "&jtl=0" : "&ptl=0";
			var threeDInfo = model.getThreeDInfo();
			var selectedIndexes = (typeof(sel) === 'undefined') ? ""  : sel;
			var greyFilter = (typeof(filter) === 'undefined') ? ""  : filter;
			//var sampleRate = resolutionData.sampleRate;
			var sampleRate = 1.0;

			src = model.getIIPServer() + "?wlz=" + layer.imageDir + layer.imageName
			+ selectedIndexes
			+ greyFilter
			+ "&mod=" + threeDInfo.wlzMode
			+ "&fxp=" + (threeDInfo.fxp.x / sampleRate) + ',' + (threeDInfo.fxp.y / sampleRate) + ','+ (threeDInfo.fxp.z / sampleRate)
			+ "&scl=" + (scale.cur * sampleRate)
			+ "&dst=" + threeDInfo.dst.cur * scale.cur
			+ "&pit=" + threeDInfo.pitch.cur
			+ "&yaw=" + threeDInfo.yaw.cur
			+ "&rol=" + threeDInfo.roll.cur
			+ "&qlt=" + qlt
			+ imgType
			+ k;
		} else {
			var imgType = (layer.type === 'greyLevel') ? "&jtl=" : "&ptl=";
			var fullname = model.getFullImgFilename(layerName);
			if(fullname === undefined) {
				src = undefined;
			} else {
				src = model.getIIPServer() + "?fif=" + model.getFullImgFilename(layerName) + "&qlt=" + qlt + imgType + resolution + "," + k;
			}
		}

		if(_debug) {
			console.log("view.getTileSrc: ",src);
		}

		return src;
	}; // getTileSrc

	//---------------------------------------------------------
	var getTiles = function(sx,ex,sy,ey) {

		var _debug = false;
		var layer;
		var tileFrameContainer;
		var tileFrame;
		var tile;
		//var i;
		var j;
		var k;

		var counter = 0;
		if(_debug) {
			console.log("getTiles: sx %d, ex %d, sy %d, ey %d",sx,ex,sy,ey);
		}

		var tileCollection={};
		var y;
		var z;
		var tile;
		var tilenum;
		var tilenumText;

		for(i=0; i<numLayers; i++) {
			layer = layerNames[i];
			if(layerVisibility[layer].visible === 'false' || layerVisibility[layer].visible === false) {
				continue;
			}
			applyTileFrameOpacity(layer);

			tileFrameContainer = tileFrameContainers[layer];
			if(typeof(tileFrameContainer) === 'undefined') {
				return false;
			} else {
				tileFrame = tileFrameContainer.firstChild;

				// different k+sx, j+sy may result in the same tile
				// in order to reduce unnecessary repetition,
				// only append net tile

				tileCollection={};
				for (j=0; j<=ey-sy; j++) {
					for (k=0; k<=ex-sx; k++) {
						y = k+sx + ((j+sy)*xtiles);
						z = ""+y;
						tile = tileCollection[z];
						if (typeof(tile) !== 'undefined' && tile !== 'undefined')
							continue;

						tile = getTile(layer, k+sx, j+sy);
						if(typeof(tile) === 'undefined' || tile === 'undefined')
							continue;

						tileCollection[z] = tile;

						tileFrame.appendChild(tile);
						counter++;
						if(tileHasBorder) {
							tile.style.border = "solid 1px #f0f";
							tilenum = document.createElement('div');
							tilenum.className = "tilenum";
							tilenum.style.left = tile.style.left;
							tilenum.style.top = tile.style.top;
							tilenum.style.border = "solid 1px #7f0";
							tilenumText = document.createTextNode((k+sx)+","+(j+sy));
							tilenum.appendChild(tilenumText);
							tileFrame.appendChild(tilenum);
						} else {
							tile.style.border = "none";
						}
					}
				}

				if(_debug) {
					console.log("getTiles: counter = %d",counter);
				}
				counter = 0;
			} 
		} // for 

		//util.printNodes(targetContainer, 1, "   ", skip);

	}; // getTiles

	//---------------------------------------------------------
	/**
	 * arguments given, sets its absolute position, and other
	 * useful stuff.  See requestImages() for a function that
	 * creates all starting tiles appropriately
	 *
	 * @author Tom Perry
	 */
	var getTile = function(layer, i, j) {

		if (i < 0 || i >= xtiles || j < 0 || j >= ytiles) {
			return;
		}

		var k = i + (j*xtiles);
		var src = getTileSrc(layer, k, true);
		if(src === undefined) {
			//console.log("getTile: src undefined");
			model.updateBusyIndicator({isBusy:false});
			return undefined;
		}

		var tileId = 'x' + i + 'y' + j;
		var dst = model.getDistance();
		var tileSize = model.getTileSize();
		var tileClass = 's' + scale.cur + 'd' + dst.cur;

		var img = document.createElement("img");
		img.id = tileId;
		img.src = src;
		img.className = "tile " + tileClass;
		img.useMap = "#components_" + tileId;
		var left = i * tileSize.width;
		var top = j * tileSize.height;
		img.style.left = i * tileSize.width + "px";
		img.style.top = j * tileSize.height + "px";

		//console.log("zzzz "+img.src);
		return img;

	};

	//---------------------------------------------------------
	var setImageCursor = function(cursor) {

		var layer;
		var tileFrameContainer;
		var tileFrame;
		var tile;
		var i;

		for(i=0; i<numLayers; i++) {
			layer = layerNames[i];
			if(layerVisibility[layer].visible === 'false' || layerVisibility[layer].visible === false) {
				continue;
			}

			tileFrameContainer = tileFrameContainers[layer];
			if(typeof(tileFrameContainer) === 'undefined') {
				return false;
			} else {
				tileFrame = tileFrameContainer.firstChild;
				//console.log("cursor ",cursor);
				tileFrame.style.cursor = cursor;
			} 
		} // for 

	}; // setImageCursor


	//---------------------------------------------------------
	// Called when image is much bigger than viewport and we are moving the visible part around
	var removeTiles = function(sx,ex,sy,ey) {

		for (var j=0; j<=ey-sy; j++) {
			for (var i=0; i<=ex-sx; i++) {
				removeTile(i+sx,j+sy);
			}
		}
	};

	//---------------------------------------------------------

	/**
	 * Deletes an <img> element.  See clearTiles() for a tile frame clearing
	 * function.
	 *
	 * @author Tom Perry
	 */
	var removeTile = function(i, j) {

		var tileId = 'x' + i + 'y' + j;
		var tile = document.getElementById(tileId);
		if (tile) {
			tile.parentNode.removeChild(tile);
		}
	};

	//---------------------------------------------------------
	/* 
	 * Refresh function to avoid the problem of tiles not loading
	 * properly in Firefox/Mozilla
	 *
	 * @author Ruven Pillay
	 */
	var refresh = function() {

		var unloaded = 0;

		if(document.getElementById("tileframe")) {
			var children = document.getElementById("tileframe").getChildren();
			for(var i in children) {
				// If our tile has not yet been loaded, give it a prod 
				if(i.width === 0 || i.height === 0 ){
					i.src = i.src;
					unloaded = 1;
				}
			}
		}

		/*
		 * If no tiles are missing, destroy our refresher timer, fade
		 * out our loading animation and and reset our cursor
		 */
		if(unloaded === 0) {
			//$clear(refresher);
			refresher = null;
			if(document.getElementById("tileframe")) {
				document.getElementById("tileframe").style.cursor = 'move';
			}
		}
	};

	//---------------------------------------------------------
	/**
	 *   Informs registered observers of a change to the view.
	 */
	var notify = function (from) {

		//console.log("enter tiledImageView.notify ",from);

		for (var i = 0; i < registry.length; i++) {
			registry[i].viewUpdate(viewChanges);
		}

		resetViewChanges();
		//console.log("exit tiledImageView.notify ",from);
	}; // notify

	//---------------------------------------------------------
	var getDataAtMouse = function (e, params) {

		var mode = getMode().name;

		measuringOrigin = false;
		measuringTarget = false;
		overlay = false;
		indexName = false;

		if(params.measuringOrigin) {
			measuringOrigin = true;
		}
		if(params.measuringTarget) {
			measuringTarget = true;
		}
		if(params.overlay) {
			overlay = true;
		}
		if(params.tooltip) {
			indexName = true;
		}

		//var indexLayer = layerNames[layerNames.length-1];
		//if(typeof(indexLayer) === 'undefined') {
		//  return false;
		//}
		var tileFrameContainer = tileFrameContainers[currentLayer];

		if(typeof(tileFrameContainer) === 'undefined') {
			//console.log("getDataAtMouse returning, tileFrameContainer undefined");
			return false;
		}
		var left = parseInt(tileFrameContainer.style.left);
		var top = parseInt(tileFrameContainer.style.top);

		var topEdge = getViewportTopEdge();
		var leftEdge = getViewportLeftEdge();
		docX = emouseatlas.emap.utilities.getMouseX(e);
		docY = emouseatlas.emap.utilities.getMouseY(e);
		//console.log("docX %d, docY %d",docX,docY);

		// the position of the div containing the viewer.
		var viewerPos = emouseatlas.emap.utilities.findPos(targetContainer);
		var X = Math.round(docX + leftEdge - viewerPos.x);
		var Y = Math.round(docY + topEdge - viewerPos.y);
		//console.log("X %d, Y %d",X,Y);
		var layerData = model.getLayerData();
		var layer = layerData[currentLayer];
		if(typeof(layer) === 'undefined') {
			console.log("getDataAtMouse returning, layer undefined");
			return false;
		}

		if(mode.name === "draw") {
			console.log("getDataAtMouse: returning, draw mode");
		}

		if (model.isWlzData()) {
			var url;
			var qlt = model.getImgQuality();
			var obj = "&obj=Wlz-foreground-objects";
			if(indexName ||
					mode === "fixedPoint" ||
					mode === "measuring" ||
					mode === "HRSection" ||
					mode === "draw") {

				obj += "&obj=Wlz-coordinate-3D";
			}

			var threeDInfo = model.getThreeDInfo();

			url = model.getIIPServer() + "?wlz=" + layer.imageDir + layer.imageName
			+ "&mod=" + threeDInfo.wlzMode
			+ "&fxp=" + threeDInfo.fxp.x + ',' + threeDInfo.fxp.y + ','+ threeDInfo.fxp.z
			+ "&scl=" + scale.cur
			+ "&dst=" + (threeDInfo.dst.cur * scale.cur)
			+ "&pit=" + threeDInfo.pitch.cur
			+ "&yaw=" + threeDInfo.yaw.cur
			+ "&rol=" + threeDInfo.roll.cur
			+ "&prl=-1,"
			+ X + "," + Y
			+ obj;
			//+ "&obj=Wlz-foreground-objects";
			//+ "&obj=Wlz-grey-value";
			//+ "&obj=Wlz-coordinate-3D";

			//console.log("url ",url);

			var ajaxParams = {
				url:url,
				method:"POST",
				callback:getDataAtMouseCallback,
				async:true
			};
			var ajax = new emouseatlas.emap.ajaxContentLoader();
			var ajaxRetVal = ajax.loadResponse(ajaxParams);
			//console.log("ajax ",ajax);
			//console.log("ajaxParams ",ajaxParams);
			//console.log("ajaxRetVal ",ajaxRetVal);
		} else {
			if(mode === "measuring" && !measuringOrigin && !measuringTarget) {
				measurementPoint = {x:docX, y:docY, z:0};
				viewChanges.measuring = true;
			} else if(mode === "measuring" && measuringOrigin) {
				measurementOrigin = {x:docX, y:docY, z:0};
				viewChanges.measuringOrigin = true;
			} else if(mode === "measuring" && measuringTarget) {
				measurementTarget = {x:docX, y:docY, z:0};
				viewChanges.measuringTarget = true;
			} else if(mode === "draw") {
				drawPoint = {x:docX, y:docY, z:0};
				viewChanges.draw = true;
			}
			notify();
		}

	}; // getDataAtMouse

	//---------------------------------------------------------
	// The indexArray always has 0 as its first entry.
	// Subsequent entries are the index objects under the mouse
	//---------------------------------------------------------
	var getDataAtMouseCallback = function (response) {

		var mode = getMode().name;

		// get rid of white-space in response string
		var response1 = response.replace(/^\s+|\s+$/g, '') ;

		// split response to an array, 1 entry for each object.
		// the first element should always be for index data.
		// the second element, if present will be for coord data.
		var respArr = response1.split("\n");

		//console.log("getDataAtMouseCallback respArr[1] ",respArr[1]);

		var index = respArr[0].indexOf(":");
		if(index === -1) {
			return false;
		} else {
			index++;
		}

		var substr = respArr[0].substring(index);
		var indxstr = substr.replace(/^\s+|\s+$/g, '') ;
		var coordstr;
		indexArray = indxstr.split(" ");

		if(mode === "fixedPoint" ||
				mode === "measuring" ||
				mode === "HRSection" ||
				mode === "draw") {

			if(respArr[1]) {
				index = respArr[1].indexOf(":");
				if(index !== -1) {
					index++;
					substr = respArr[1].substring(index);
					coordstr = substr.replace(/^\s+|\s+$/g, '') ;
					//console.log("substr %s, coordstr %s",substr,coordstr);
				}

				var pArr = coordstr.split(" ");

				if(mode === "fixedPoint") {
					possibleFixedPoint = {x:Math.round(pArr[0]), y:Math.round(pArr[1]), z:Math.round(pArr[2])};
					viewChanges.selectFixedPoint = true;
					notify("getDataAtMouseCallback fixedPoint");
				} else if(mode === "measuring" && !measuringOrigin && !measuringTarget) {
					measurementPoint = {x:pArr[0], y:pArr[1], z:pArr[2]};
					viewChanges.measuring = true;
					notify("getDataAtMouseCallback measuring");
				} else if(mode === "measuring" && measuringOrigin) {
					measurementOrigin = {x:pArr[0], y:pArr[1], z:pArr[2]};
					viewChanges.measuringOrigin = true;
					notify("getDataAtMouseCallback measuringOrigin");
				} else if(mode === "measuring" && measuringTarget) {
					measurementTarget = {x:pArr[0], y:pArr[1], z:pArr[2]};
					viewChanges.measuringTarget = true;
					notify("getDataAtMouseCallback measuringTarget");
				} else if(mode === "HRSection") {
					HRSectionPoint = {x:Math.round(pArr[0]), y:Math.round(pArr[1]), z:Math.round(pArr[2])};
					viewChanges.HRSection = true;
					notify("getDataAtMouseCallback HRSection");
				} else if(mode === "draw") {
					drawPoint = {x:Math.round(pArr[0]), y:Math.round(pArr[1]), z:Math.round(pArr[2])};
					viewChanges.draw = true;
					notify("getDataAtMouseCallback draw");
				}
			}
		}

		if(indexName) {
			showIndexDataToolTip_cb(indexArray);
		}
		if(overlay) {
			viewChanges.dblClick = true;
			notify("getDataAtMouseCallback overlay");
		}
	}; // getDataAtMouseCallback

	//--------------------------------------------------------------
	var setIndexDataToolTip = function () {

		// we only want 1 toolTip
		if(typeof(indexDataToolTip) === 'undefined') {
			var targetId = model.getViewerTargetId();
			if(document.getElementById(targetId)) {
				targetContainer = document.getElementById(targetId);

				indexDataToolTip = document.createElement('div');
				indexDataToolTip.id = 'indexData-ToolTipContainer',
				indexDataToolTip.className = 'toolTipContainer',
				targetContainer.appendChild(indexDataToolTip);
				indexDataToolTipText = document.createTextNode("");
				indexDataToolTip.appendChild(indexDataToolTipText);
			}
		}
	};

	//--------------------------------------------------------------
	var hideIndexDataToolTip = function () {
		indexDataToolTip.style.visibility = 'hidden';
		return false;
	};

	//--------------------------------------------------------------
	// When mouse pauses over 'indexed' data in the image, show a tooltip
	//--------------------------------------------------------------
	var showIndexDataToolTip = function (evt) {
		if(model.hasLabels()) {
			getDataAtMouse(evt, {tooltip:true,
				overlay:false,
				fixedPoint:false,
				measuringOrigin: false,
				measuring:false
			});
		}
	};

	//--------------------------------------------------------------
	// When mouse pauses in 'measurement mode' get the distances
	//--------------------------------------------------------------
	var getMeasurementData = function (evt) {
		if(measuring) {
			getDataAtMouse(evt, {tooltip:false,
				overlay:false,
				fixedPoint:false,
				measuringOrigin: false,
				measuring:true
			});
		}
	};

	//--------------------------------------------------------------
	// Called from callback function
	//--------------------------------------------------------------
	var showIndexDataToolTip_cb = function (indexArr) {

		var treeLayer = model.getFirstTreeLayer();
		var indexData = model.getIndexData(treeLayer);
		if(indexData === undefined) {
			return false;
		}

		var text = "";
		// uses all but background domain
		for (var i=1;i<indexArr.length;i++) {
			if(indexData[indexArr[i]] !== undefined) {
				if (i>1 && text!=""){
					text = text + ", "
				}
				text = text + indexData[indexArr[i]].name;
			}
		}
		if (text == ""){
			text = "not defined";
		}
	
		var viewerPos = emouseatlas.emap.utilities.findPos(targetContainer);
		var X = Math.round(docX - viewerPos.x);
		var Y = Math.round(docY - viewerPos.y);

		var targetId = model.getViewerTargetId();
		if(document.getElementById(targetId)) {
			var VP = document.getElementById(targetId);
		}

		var rightEdgeVP = viewerPos.x + VP.clientWidth;
		var bottomEdgeVP = viewerPos.y + VP.clientHeight;
		var xofs = 20;
		var yofs = 10;

		indexDataToolTipText.nodeValue = text;
		var textlen = getApproxTextLength(indexDataToolTip, text);
		if((docX+textlen+xofs) > rightEdgeVP) {
			indexDataToolTip.style.left = (X-textlen-xofs)+'px';
		} else {
			indexDataToolTip.style.left = (X+xofs)+'px';
		}
		if((docY+indexDataToolTip.clientHeight+yofs) > bottomEdgeVP) {
			indexDataToolTip.style.top = (Y-indexDataToolTip.clientHeight)+'px';
		} else {
			indexDataToolTip.style.top = (Y+yofs)+'px';
		}
		indexDataToolTip.style.visibility = 'visible';

	}; // showIndexDataToolTip_cb

	//--------------------------------------------------------------
	var getApproxTextLength = function (container, text) {
		return container.clientWidth;
	};

	//--------------------------------------------------------------
	// When mouse is double-clicked over 'indexed' data in the image, show data
	//--------------------------------------------------------------
	var showIndexDataInImage = function (evt) {
		getDataAtMouse(evt, {tooltip:false,
			overlay:true,
			fixedPoint:false,
			measuringOrigin: false,
			measuring:false
		});
	};

	//--------------------------------------------------------------
	// Called from callback function
	//--------------------------------------------------------------
	/*
   var showIndexDataInImage_cb = function (indexArr) {

      var treeLayer = model.getFirstTreeLayer();
      var indexData = model.getIndexData(treeLayer);
      if(indexData === undefined) {
         return false;
      }

      // for now we are using just indexArr[1]
      if(indexData[indexArr[1]] !== undefined) {
	 var nodeId = indexData[indexArr[1]].nodeId;
	 nodeId = "cb_" + nodeId;
         var tree = model.getTree(treeLayer);
	 tree.processCheckExternal(nodeId);
      }
   };
	 */

	//--------------------------------------------------------------
	var setTileFrameClass = function (tfclass) {

		var layer;
		var tileFrameContainer;
		var tileFrame;

		for(var i=0; i<numLayers; i++) {
			layer = layerNames[i];
			if(tileFrameContainers[layer] !== undefined) {
				tileFrameContainer = tileFrameContainers[layer];
				tileFrameContainer.firstChild.className = tfclass;
			}
		}
	};

	//---------------------------------------------------------
	// event handlers
	//---------------------------------------------------------
	var setViewportSize = function() {

		//console.log("enter setViewportSize");
		var targetId = model.getViewerTargetId();
		if(document.getElementById(targetId)) {
			var VP = document.getElementById(targetId);
			var VpDims = emouseatlas.emap.utilities.getViewportDims(VP);
			viewport.width = VpDims.width;
			viewport.height = VpDims.height;
		}

		if ((image.width !== null && typeof(image.width) !== 'undefined') && (image.height !== null && typeof(image.height) !== 'undefined')) {
			setWinMinScale();
			handleScaleChange();
		}
		viewChanges.viewport = true;
		notify("setViewportSize");
		//console.log("exit setViewportSize");
	};

	//---------------------------------------------------------
	// Mouse down event on tileFrame
	//---------------------------------------------------------
	var doMouseDownInImage = function (e) {

		//console.log("doMouseDownInImage mode ",mode.name);

		var buttons = emouseatlas.emap.utilities.whichMouseButtons(e);
		var modifiers = emouseatlas.emap.utilities.whichModifierKeys(e);

		viewChanges.hideMenu = true;
		notify("doMouseDownInImage");

		// the following is for context menu only
		if(buttons.right || (buttons.left && modifiers.ctrl)) {
			return false;
		}

		clearTimeout(mouseMoveTimeout);
		hideIndexDataToolTip();

		var evt = e || window.event;

		// prevent default dragging action in Firefox
		if(evt.preventDefault) {
			evt.preventDefault();
		}

		// if we are in 'fixedPoint' mode
		if(mode.name.toLowerCase() === "fixedpoint") {
			getDataAtMouse(evt, {tooltip:false,
				overlay:false,
				fixedPoint:true,
				HRSection:false,
				measuringOrigin:false,
				measuringTarget:false,
				measuring:false
			});
			return false;
		}

		// if we are in 'measuring' mode
		if(mode.name.toLowerCase() === "measuring") {
			if(measuring) {
				getDataAtMouse(evt, {tooltip:false,
					overlay:false,
					fixedPoint:false,
					HRSection:false,
					measuringOrigin:false,
					measuringTarget:true,
					measuring:false
				});
				measuring = false;
			} else {
				getDataAtMouse(evt, {tooltip:false,
					overlay:false,
					fixedPoint:false,
					HRSection:false,
					measuringOrigin:true,
					measuringTarget:false,
					measuring:false
				});
				measuring = true;
			}

			return false;
		}

		// if we are in 'HRSection' mode
		if(mode.name.toLowerCase() === "hrsection") {
			getDataAtMouse(evt, {tooltip:false,
				overlay:false,
				fixedPoint:false,
				measuringOrigin:false,
				measuringTarget:false,
				measuring:false,
				HRSection:true
			});
			return false;
		}


		var layer = getTopVisibleLayer();

		var tileFrameContainer;
		var tileFrameContainerId;

		var viewerPos = emouseatlas.emap.utilities.findPos(targetContainer);

		var x;
		var y;

		// if we are in 'move' mode
		if(mode.name.toLowerCase() === "move") {
			tileFrameContainerId = layer + "_tileFrameContainer";
			if(document.getElementById(tileFrameContainerId) !== 'undefined' && document.getElementById(tileFrameContainerId) !== null) {
				tileFrameContainer = document.getElementById(tileFrameContainerId);

				x = evt.clientX - parseInt(tileFrameContainer.style.left) - viewerPos.x;
				y = evt.clientY - parseInt(tileFrameContainer.style.top) - viewerPos.y;

				initialMousePoint = {x:evt.clientX, y:evt.clientY};
				initialFocalPoint = {x:focalPoint.x, y:focalPoint.y};
				mouseDownInImage = true;
				addMouseDragHandlers(e);

			}

			setTileFrameClass("tiledImgDiv drag");

			return false;
		}

		return false;
	}; // doMouseDownInImage

	//---------------------------------------------------------
	var doMouseUpInImage = function (e) {

		var layer = getTopVisibleLayer();

		var tileFrameContainer;
		var tileFrameContainerId;

		removeMouseDragHandlers(e);
		mouseDownInImage = false;

		clearTimeout(mouseMoveTimeout);
		hideIndexDataToolTip();

		setTileFrameClass("tiledImgDiv");

		preventPropagation(e);

		return false;
	};

	//---------------------------------------------------------
	var doMouseOver = function (e) {
		addMouseWheelHandlers(e);
	};

	//---------------------------------------------------------
	var doMouseOut = function (e) {
		removeMouseWheelHandlers(e);
		if(model.isWlzData()) {
			clearTimeout(mouseMoveTimeout);
			hideIndexDataToolTip();
		}

	};

	//---------------------------------------------------------
	var addMouseWheelHandlers = function (e) {

		var wheel = mousewheelIsSupported ? 'mousewheel' : 'DOMMouseScroll';
		for(i=0; i<numLayers; i++) {
			var evt = e || window.event;
			var tileFrame = tileFrameContainers[layerNames[i]].firstChild;
			util.addEvent(tileFrame, wheel, doMouseWheel, false);
		}
		return false;
	};

	//---------------------------------------------------------
	var removeMouseWheelHandlers = function (e) {

		var wheel = mousewheelIsSupported ? 'mousewheel' : 'DOMMouseScroll';
		for(i=0; i<numLayers; i++) {
			var evt = e || window.event;
			var tileFrame = tileFrameContainers[layerNames[i]].firstChild;
			util.removeEvent(tileFrame, wheel, doMouseWheel, false);
			preventPropagation(e);
		}
		return false;
	};

	//---------------------------------------------------------
	var doMouseDown = function (e) {
		var target = emouseatlas.emap.utilities.getTarget(e);
	};

	//---------------------------------------------------------
	var doMouseUp = function (e) {
		//console.log("View: doMouseUp");
	};

	//---------------------------------------------------------
	var addMouseDragHandlers = function (e) {

		for(i=0; i<numLayers; i++) {
			var evt = e || window.event;
			var tileFrame = tileFrameContainers[layerNames[i]].firstChild;
			util.addEvent(tileFrame, 'mousemove', doMouseDrag, false);
			preventPropagation(e);
		}
		return false;
	};

	//---------------------------------------------------------
	var removeMouseDragHandlers = function (e) {

		for(i=0; i<numLayers; i++) {
			var evt = e || window.event;
			var tileFrame = tileFrameContainers[layerNames[i]].firstChild;
			util.removeEvent(tileFrame, 'mousemove', doMouseDrag, false);
			preventPropagation(e);
		}
		return false;
	};

	//---------------------------------------------------------
	var doMouseMove = function (e) {

		var evt = e || window.event;

		if(!mouseDownInImage) {
			var timeStamp = e.timeStamp;
			if(mouseMoveTimeStamp === undefined) {
				mouseMoveTimeStamp = timeStamp;
			}
			var elapsedTime = timeStamp - mouseMoveTimeStamp;
			if(elapsedTime < mouseMoveDelay) {
				clearTimeout(mouseMoveTimeout);
			}
			mouseMoveTimeStamp = timeStamp;

			if(measuring) {
				mouseMoveTimeout = setTimeout(function() {getMeasurementData(evt);}, 2*mouseMoveDelay);
			} else {
				mouseMoveTimeout = setTimeout(function() {showIndexDataToolTip(evt);}, 2*mouseMoveDelay);
			};

			preventPropagation(e);
			return false;
		}

	}; // doMouseMove

	//---------------------------------------------------------
	var doMouseDrag = function (e) {

		var evt = e || window.event;

		var dx = 0;
		var dy = 0;

		var tileFrame = tileFrameContainers[layerNames[numLayers-1]].firstChild;
		if(typeof(tileFrame) === 'undefined') {
			preventPropagation(e);
			return false;
		}

		var imgFit = getImgFit();

		if (!imgFit.xfits) {
			dx = evt.clientX - initialMousePoint.x;
		}
		if (!imgFit.yfits) {
			dy = evt.clientY - initialMousePoint.y;
		}

		if(!imgFit.xfits || !imgFit.yfits) {
			var x = initialFocalPoint.x - (dx / image.width);
			x = (x > focalPoint.upperX) ? focalPoint.upperX : x;
			x = (x < focalPoint.lowerX) ? focalPoint.lowerX : x;

			var y = initialFocalPoint.y - (dy / image.height);
			y = (y > focalPoint.upperY) ? focalPoint.upperY : y;
			y = (y < focalPoint.lowerY) ? focalPoint.lowerY : y;

			setFocalPoint({x:x, y:y});
		};

		preventPropagation(e);
		return false;

	}; // doMouseDrag

	//---------------------------------------------------------
	var doMouseClick = function (e) {
	};

	//---------------------------------------------------------
	var doMouseDblClick = function (e) {

		showIndexDataInImage(e);

		/*
      if(e.shiftKey === true) {
         //setScale(scale.cur / 2, 'mouse');
      } else {
         //setScale(scale.cur * 2, 'mouse');
      }
		 */
	};

	//---------------------------------------------------------
	var preventPropagation = function (evt) {

		// IE8 doesn't support event.preventDefault()
		if(evt.preventDefault) {
			evt.preventDefault();
		}
		// IE8 doesn't support event.stopPropagation()
		if(evt.stopPropagation) {
			evt.stopPropagation();
		}
		// the IE way
		if(evt.cancelBubble !== undefined) {
			evt.cancelBubble = true;
		}
	};

	//---------------------------------------------------------
	var doMouseWheel = function (e) {

		// Firefox & IE have different events.
		var delta = e.detail? e.detail*(-120) : e.wheelDelta;

		if(delta < 0) {
			setScale(scale.cur / 2, 'mouse');
		} else if(delta > 0) {
			setScale(scale.cur * 2, 'mouse');
		}

	};

	//---------------------------------------------------------
	var setIIPMinScale = function() {
		if(model.isWlzData()) {
			scale.iipmin = 0.0625; // yes completely arbitrary!
		} else {
			var maxiipres = model.getMaxIIPResolution();
			scale.iipmin = Math.pow(2,-maxiipres);
		}

	};

	//---------------------------------------------------------
	var setWinMinScale = function () {
		//console.log("enter view.setWinMinScale");
		fullImage = model.getFullImgDims();

		var xmin = viewport.width / fullImage.width;
		var ymin = viewport.height / fullImage.height;
		var min = (xmin < ymin) ? xmin : ymin;

		// Get minimum scale (as a power of 2) that will allow image to fit within window
		if (model.isWlzData()) {
			scale.winmin = Math.pow(2,Math.floor(Math.log(min) / Math.log(2)));
			//scale.initial = parseFloat(scale.winmin);
		} else {
			scale.winmin = 0.00390625;
			//scale.initial = parseFloat(Math.pow(2,Math.floor(Math.log(min) / Math.log(2))));
		}

		//console.log("exit view.setWinMinScale ",scale.winmin);
	};

	//---------------------------------------------------------
	var setMinScale = function() {
		//console.log("enter view.setMinScale");
		scale.min = (scale.iipmin < scale.winmin) ? scale.iipmin : scale.winmin;
		scale.min = (scale.min < 1) ? scale.min : 1;
		constrainScale();
		//console.log("exit view.setMinScale");
	};

	//---------------------------------------------------------
	var constrainScale = function() {
		//console.log("enter view.constrainScale");
		if (scale.cur === null || typeof(scale.cur) === 'undefined' || scale.cur === 0) {
			scale.cur = scale.initial;
		}
		if (scale.cur < scale.min) {
			scale.cur = scale.min;
		}
		handleScaleChange();
		//console.log("exit view.constrainScale");
	};

	//---------------------------------------------------------
	var setInitialScale = function() {

		//console.log("enter view.setInitialScale");
		fullImage = model.getFullImgDims();

		var mscl = model.getScaleMaxMin();
		scale.max = mscl.max;
		scale.min = mscl.min;

		var initialState = model.getInitialState();
		//console.log("view.setInitialScale ",initialState);
		if(initialState.scale !== undefined) {
			scale.initial = initialState.scale;
		} else {
			scale.initial = 1;
		}

		scale.iipmin = 0;
		scale.winmin = 0;
		scale.cur = 0;
		scale.old = 0;

		if (typeof(fullImage.width) !== 'undefined' && typeof(fullImage.height) !== 'undefined') {
			setIIPMinScale();
			setWinMinScale();
			setMinScale();
			//constrainScale();
			scale.old = scale.cur;
		}

		//console.log("exit view.setInitialScale ",scale);
	};

	//---------------------------------------------------------
	var handleScaleChange = function() {

		//console.log("enter handleScaleChange:");

		fullImage = model.getFullImgDims();
		//console.log("fullImage.width %f, fullImage.height %f",fullImage.width,fullImage.height);
		handleImageSizeChange('handleScaleChange');
		//setResolutionData('handleScaleChange');
		//setLocatorData('handleScaleChange');

		//focalPoint.upperX = 0.5 + (image.width - viewport.width) / (2 * image.width);
		//focalPoint.lowerX = 0.5 - (image.width - viewport.width) / (2 * image.width);
		focalPoint.upperX = 0.5 + Math.abs((image.width - viewport.width) / (2 * image.width));
		focalPoint.lowerX = 0.5 - Math.abs((image.width - viewport.width) / (2 * image.width));
		focalPoint.upperY = 0.5 + Math.abs((image.height - viewport.height) / (2 * image.height));
		focalPoint.lowerY = 0.5 - Math.abs((image.height - viewport.height) / (2 * image.height));

		constrainViewportToImage();

		// Introducing a delay allows the tileframe to be
		// repositioned while no tiles are showing, which looks a
		// lot more neat.

		/* !!!!! at the moment, due to the compliexity/deficiency of MVC model
	  or a bug in the code, one user action may cause the same
	  image to be loaded 1+ times by calling 
	  handleScaleChange, updateDst, and updateWlzRotation.
	  Due to time pressure, it is difficult to guarantee not
	  to call these functions unnecessary. Thus the following code
	  is used to stop some unnecessay image-loading
		 */
		var clearParams = {scale: true, distance: false, rotation: false};
		if (initialised && model.isWlzData()) {
			var same = isSameImagePosition();
			if (!same) {

				clearTiles(clearParams);
				setTimeout("emouseatlas.emap.tiledImageView.requestImages('handleScaleChange')", 10);
				setImagePosition();
			}
		} else {
			clearTiles(clearParams);
			setTimeout("emouseatlas.emap.tiledImageView.requestImages('handleScaleChange')", 10);
		}

		if ((image.width !== null && typeof(image.width) !== 'undefined') && (image.height !== null && typeof(image.height) !== 'undefined')) {
			setTileFramePosition();
		}

		viewChanges.scale = true;
		notify("handleScaleChange ");

		//console.log("exit handleScaleChange:");
	};

	//---------------------------------------------------------
	/*
	 * For very large images (GByte) we need to use a sub-sampled version if the scale is reduced.
	 * Assume that the low res options are in order from least to most sub-sampled, eg 4,16,64
	 */
	/*
   var setResolutionData = function(caller) {

      //console.log("enter view.setResolutionData called from %s",caller);
      var layer = layerData[currentLayer];

      var lowRes;
      var num = 0;
      var i;
      var intRate;

      resolutionData = {imageName:layer.imageName, sampleRate:1.0};

      if(layer.lowResData) {
         lowRes = layer.lowResData;
	 num = lowRes.length;
      }

      for(i=0; i<num; i++) {
         if(scale.cur <= lowRes[i].switchScl) {
	    intRate = parseInt(lowRes[i].sampleRate);
            resolutionData = {imageName:lowRes[i].imageName, sampleRate:intRate};
            //console.log("intRate %d, imageName %s",intRate,lowRes[i].imageName);
	 }
      }
      //console.log("exit view.setResolutionData called from %s",caller);
   };

   //---------------------------------------------------------
   var getResolutionData = function() {
      return resolutionData;
   };
	 */

	//---------------------------------------------------------
	/*
	 * For very large images (GByte) we need to use a sub-sampled version for the locator image.
	 */
	/*
   var setLocatorData = function(caller) {

      // always show reference layer's image in locator  (mmm maybe not always nickb)
      var layer = layerData[layerNames[0]];
      if(layer.locatorData !== 'undefined') {
         locatorData = layer.locatorData;
      } else {
	 locatorData = {imageDir:layer.imageDir, imageName:layer.imageName, sampleRate:1.0};
      }

      //console.log("exit view.setLocatorData called from %s",caller);
   };

   //---------------------------------------------------------
   var getLocatorData = function() {
      //console.log(locatorData);
      return locatorData;
   };
	 */

	//---------------------------------------------------------
	/**
	 * A set of functions that convert between
	 * focalPoint (i.e.  a value between 0 and 1 expressing
	 * the position of the centre of the viewport w.r.t. the image origin) and the position
	 * of the top/left edge of the viewport with respect to the image origin.
	 */

	// was roi2vpl2
	var getViewportLeftEdge = function() {
		var ret = focalPoint.x * image.width - viewport.width/2;
		return ret;
	};
	//---------------------------------------------------------
	// was roi2vpt2
	var getViewportTopEdge = function() {
		//console.log("getViewportTopEdge focalPoint.y %d, image.height %d, viewport.height %d",focalPoint.y,image.height,viewport.height);
		var ret = focalPoint.y * image.height - viewport.height/2;
		//console.log("getViewportTopEdge returning %d",ret);
		return ret;
	};
	//---------------------------------------------------------
	var getFocalPointX = function(leftEdge) {
		//console.log("getFocalPointX: leftEdge ",leftEdge);
		return (leftEdge + viewport.width/2) / image.width;
	};
	//---------------------------------------------------------
	var getFocalPointY = function(topEdge) {
		//console.log("getFocalPointY: topEdge ",topEdge);
		return (topEdge + viewport.height/2) / image.height;
	};

	//---------------------------------------------------------
	var constrainViewportToImage = function () {

		//console.log("enter constrainViewportToImage:");
		//console.log("getViewportLeftEdge() ",getViewportLeftEdge());
		if (xfits) {
			focalPoint.x = 0.5;
		} else if (getViewportLeftEdge() < 0) {
			focalPoint.x = getFocalPointX(0);
		} else if (getViewportLeftEdge() + viewport.width > image.width) {
			focalPoint.x = getFocalPointX(image.width - viewport.width);
		}
		if (yfits) {
			focalPoint.y = 0.5;
		} else if (getViewportTopEdge() < 0) {
			focalPoint.y = getFocalPointY(0);
		} else if (getViewportTopEdge() + viewport.height > image.height) {
			focalPoint.y = getFocalPointY(image.height - viewport.height);
		}
		//console.log("exit constrainViewportToImage:");
	}; // constrainViewportToImage

	//---------------------------------------------------------
	var completeInitialisation = function () {

		//console.log("enter view.completeInitialisation");

		// make sure the window can use scrollbars
		document.body.style.overflow = 'visible';
		document.documentElement.style.overflow = "visible"; /*maze: ie bug fix, some versions of ie have scroll property in <html> instead of <body>*/

		util.addEvent(window, 'resize', setViewportSize, false);
		setViewportSize();

		var targetId = model.getViewerTargetId();
		//console.log("completeInitialisation targetId <%s>",targetId);
		if(document.getElementById(targetId)) {
			targetContainer = document.getElementById(targetId);
			//util.addEvent(targetContainer, 'mousedown', doMouseDown, false);
			buildTileFrameContainer();
			buildHelpIconContainer();
			buildInfoIconContainer();
		} else {
		}

		addAllLayersToView();
		setInitialState();
		addTools();
		setContextMenus();
		setIndexDataToolTip();
		setTitle();
		setTitleTooltip();
		//setMode(modes.move.name);
		document.body.style.cursor = "default";

		// set up info frame
		var infoDetails = model.getInfoDetails();
		if(infoDetails && infoDetails.jso) {
			info.initialise({
				targetId:targetId,
				details:infoDetails,
				view:emouseatlas.emap.tiledImageView
			});
		}

		//console.log("exit view.completeInitialisation");

	}; // completeInitialisation

	//---------------------------------------------------------
	/**
	 *   <Depracated>
	 *   Sets the title for the image.
	 *   Note: previously the title was read in from .json file, now the title
	 *   is in the .php file and the tool-tip is read in from the .json file.
	 */
	var setTitle = function() {

		//..........................
		// depracated way of setting title
		//..........................
		var title = model.getImageTitle();
		if(titleDiv) {
			if(titleDiv.firstChild === undefined || titleDiv.firstChild === null) {
				var tnode = document.createTextNode(title);
				titleDiv.appendChild(tnode);
			} else {
				titleDiv.firstChild.nodeValue = title;
			}
			return false;
		}
		//..........................

		var titleTooltip = model.getImageTitleTooltip();
		var titleDiv = document.getElementById("wlzIIPViewerTitle");
		if(titleDiv === undefined) {
			return false;
		}

	};

	//---------------------------------------------------------
	/**
	 *   Sets tool-tip for mouse over the title of tiled image (if required).
	 *   Note: the tool-tip content is read in from a .json file.
	 */
	var setTitleTooltip = function() {

		var titleTooltip;
		var titleDiv;
		var titleTooltipContainer;
		var titleTooltipTextDiv;
		var titleTooltipText;
		var titleTooltipTextDiv;
		var titleTooltipLogoDiv;
		var titleTooltipLogo;
		var project;
		var src;
		var line;
		var len;
		var i;

		titleTooltip = model.getImageTitleTooltip();
		if(titleTooltip === undefined || titleTooltip === null) {
			return false;
		}

		titleDiv = document.getElementById("wlzIIPViewerTitle");
		if(titleDiv === undefined) {
			return false;
		}
		project = (titleTooltip.project !== undefined) ? titleTooltip.project : "";
		util.addEvent(titleDiv, 'mouseover', showTitleTooltip, false);
		util.addEvent(titleDiv, 'mouseout', showTitleTooltip, false);

		titleTooltipContainer = document.createElement('div');
		titleTooltipContainer.id = "titleTooltipContainerDiv";
		titleTooltipContainer.className = project;
		//titleDiv.appendChild(titleTooltipContainer);

		if(titleTooltip.logo !== undefined) {
			titleTooltipLogoDiv = document.createElement('div');
			titleTooltipLogoDiv.id = "titleTooltipLogoDiv";
			titleTooltipLogoDiv.className = project;
			titleTooltipContainer.appendChild(titleTooltipLogoDiv);
			titleTooltipLogo = document.createElement('img');
			titleTooltipLogo.className = "titleTooltipLogoImg";
			titleTooltipLogo.src = titleTooltip.logo;
			titleTooltipLogoDiv.appendChild(titleTooltipLogo);
		}

		titleTooltipTextContainer = document.createElement('div');
		titleTooltipTextContainer.id = "titleTooltipTextContainer";
		titleTooltipContainer.appendChild(titleTooltipTextContainer);

		len = titleTooltip.text.length;
		for(i=0; i<len; i++) {
			titleTooltipTextDiv = document.createElement('div');
			titleTooltipTextDiv.className = "titleTooltipTextDiv";
			titleTooltipTextContainer.appendChild(titleTooltipTextDiv);
			line = titleTooltip.text[i];
			titleTooltipText = document.createTextNode(line);
			titleTooltipTextDiv.appendChild(titleTooltipText);
		}

	};

	//---------------------------------------------------------
	/**
	 *   Show or hide tool-tip for mouse over the title of tiled image.
	 */
	var showTitleTooltip = function(e) {

		var target = emouseatlas.emap.utilities.getTarget(e);
		var tooltipContainer;

		if(target.id !== "wlzIIPViewerTitle") {
			return false;
		}

		tooltipContainer = document.getElementById("titleTooltipContainerDiv");
		if(e.type === "mouseover") {
			tooltipContainer.style.visibility = "visible";
		} else if(e.type === "mouseout") {
			tooltipContainer.style.visibility = "hidden";
		}
	};

	//---------------------------------------------------------
	/**
	 *   Sets up the context (right-click) menus
	 */
	var setContextMenus = function() {
		imageContextMenu = new emouseatlas.emap.EmapMenu();
		var icmParams = model.getMenuData();
		var imagePath = model.getInterfaceImageDir();
		var params = {
				view: emouseatlas.emap.tiledImageView, 
				structureUrl: icmParams.structureUrl,
				contentUrl: icmParams.contentUrl,
				imagePath: imagePath
		};
		imageContextMenu.initialise(params);
	};

	//---------------------------------------------------------
	/**
	 *   Sets initial scale, distance and viewing angles
	 */
	var setInitialState = function() {
		//console.log("enter view.setInitialState");
		setInitialScale();
		setFocalPoint({x:0.5, y:0.5});
		model.setInitialState();
		//console.log("exit view.setInitialState");
	};

	//---------------------------------------------------------
	/**
	 *   Resets the list of observable changes to the view.
	 */
	var resetViewChanges = function() {
		viewChanges.initial =  false;
		viewChanges.viewport =  false;
		viewChanges.maximise =  false;
		viewChanges.toolbox =  false;
		viewChanges.scale =  false;
		viewChanges.focalPoint =  false;
		viewChanges.layer =  false;
		viewChanges.showProperties =  false;
		viewChanges.mode =  false;
		viewChanges.selectFixedPoint =  false;
		viewChanges.measuringOrigin =  false;
		viewChanges.measuringTarget =  false;
		viewChanges.measuring =  false;
		viewChanges.HRSection = false;
		viewChanges.visibility =  false;
		viewChanges.opacity =  false;
		viewChanges.filter = false;
		viewChanges.selections = false;
		viewChanges.wlzUpdated =  false;
		viewChanges.locator =  false;
		viewChanges.dblClick =  false;
		viewChanges.showViewerHelp =  false;
		viewChanges.hideViewerHelp =  false;
		viewChanges.showViewerInfo =  false;
		viewChanges.hideViewerInfo =  false;
		viewChanges.hideMenu =  false;
	};


	//---------------------------------------------------------
	//   public methods
	//---------------------------------------------------------

	var initialise = function (tiledImageModel) {

		model = tiledImageModel;
		model.register(emouseatlas.emap.tiledImageView);

		registerTools();
		completeInitialisation();
	};

	//---------------------------------------------------------
	// tools registered here will be added in addtools()
	// we have to use the 'associative array' way of referencing properties
	// so we can add new tools using a variable instead of an actual string.
	var registerTools = function () {

		//console.log("registerComponent ",component);
		var toolArr;
		var len;
		var i;

		toolArr = model.getTools();
		if(toolArr && toolArr.length > 0) {
			len = toolArr.length;
			for(i=0; i<len; i++) {
				if(typeof(tools[toolArr[i]]) === 'undefined') {
					tools[toolArr[i]] = {};
				}
			}
		}

	};

	//---------------------------------------------------------
	// Read in tool size, position etc from configuration file.
	var getToolParams = function () {

		var url = model.getToolsMetadataUrl();
		var ajaxParams = {
				url:url,
				method:"POST",
				callback:getToolParamsCallback,
				async:true
		};
		var ajax = new emouseatlas.emap.ajaxContentLoader();
		ajax.loadResponse(ajaxParams);
	};

	//---------------------------------------------------------
	// Callback method for getToolParams
	var getToolParamsCallback = function (response) {

		response = util.trimString(response);
		if(response === null || response === undefined || response === "") {
			return false;
		}

		var json;
		if(emouseatlas.JSON === undefined || emouseatlas.JSON === null) {
			json = JSON.parse(response);
		} else {
			json = emouseatlas.JSON.parse(response);
		}
		if(!json) {
			return false;
		}

		constructTools(json);

	};

	//---------------------------------------------------------
	// Construct all registered tools.
	var constructTools = function (toolData) {

		//console.log("enter constructComponents");

		var model = emouseatlas.emap.tiledImageModel;
		var view = emouseatlas.emap.tiledImageView;

		if(typeof(tools.locator) !== 'undefined') {
			new tiledImageLocatorTool({
				model:model,
				view:view,
				toolParams:toolData.locator
			});
		}

		if(typeof(tools.selector) !== 'undefined') {
			new tiledImageSelectorTool({
				model:model,
				view:view,
				toolParams:toolData.selector
			});
		}

		if(typeof(tools.expression) !== 'undefined') {
			new expressionLevelKey({
				model:model,
				view:view,
				toolParams:toolData.expression
			});
		}

		if(typeof(tools.layer) !== 'undefined') {
			new tiledImageLayerTool({
				model:model,
				view:view,
				toolParams:toolData.layer
			});
		}

		if(typeof(tools.pitchYaw) !== 'undefined') {
			new tiledImagePitchYawTool({
				model:model,
				view:view,
				toolParams:toolData.pitchYaw
			});
			//Saved just in case - NM
//			maxPitch:toolData.pitchYaw.maxPitch,
//			maxYaw:toolData.pitchYaw.maxYaw,
//			gap:toolData.pitchYaw.gap,
//			navImage:toolData.pitchYaw.navImage,
//			thinTopEdge:toolData.pitchYaw.thinTopEdge			
		}

		if(typeof(tools.rotation) !== 'undefined') {
			new tiledImageRotationTool({
				model:model,
				view:view,
				toolParams:toolData.rotation
			});
		}

		if(typeof(tools.distance) !== 'undefined') {
			new tiledImageDistanceTool({
				model:model,
				view:view,
				toolParams:toolData.distance
			});
		}

		if(typeof(tools.scale) !== 'undefined') {
			new tiledImageScaleTool({
				model:model,
				view:view,
				toolParams:toolData.scale
			});
		}

		if(typeof(tools.properties) !== 'undefined') {
			new tiledImagePropertiesTool({
				model:model,
				view:view,
				toolParams:toolData.properties
			});
		}

		if(typeof(tools.fixedPoint) !== 'undefined') {
			new tiledImageFixedPointTool({
				model:model,
				view:view,
				toolParams:toolData.fixedPoint
			});
		}

		if(typeof(tools.measure) !== 'undefined') {
			new tiledImageMeasuringTool({
				model:model,
				view:view,
				toolParams:toolData.measure
			});
		}

		if(typeof(tools.equivalentSection) !== 'undefined') {
			new tiledImageEquivalentSectionTool({
				model:model,
				view:view,
				toolParams:toolData.equivalentSection
			});
		}

		if(typeof(tools.expressionSection) !== 'undefined') {
			new tiledImageExpressionSectionTool({
				model:model,
				view:view,
				sectionName:model.getExpressionSectionName(),
				section:model.getExpressionSection(),
				toolParams:toolData.expressionSection
			});
		}

		var layer = model.getFirstTreeLayer();
		if(typeof(tools.tree) !== 'undefined') {
			new tiledImageTreeTool({
				model:model,
				view:view,
				toolParams:toolData.tree,
				layer: layer
			});
		}

		if(typeof(tools.help) !== 'undefined') {
			new tiledImageHelp({
				targetId: "emapIIPViewerDiv",
				view: view,
				type: "wlzIIPViewer"
			});
		}

		if(typeof(tools.scalebar) !== 'undefined') {
			new tiledImageScalebar({
				model:model,
				view:view,
				toolParams:toolData.equivalentSection
			});
		}

		if(typeof(tools.refresh) !== 'undefined') {
			new tiledImageRefreshTool({
				model:model,
				view:view,
				toolParams:toolData.refresh
			});
		}

		// this is here because it must wait until the ajax call has returned.
		viewChanges.initial = true;
		notify("constructComponents");

		//console.log("exit constructComponents");
	};

	//---------------------------------------------------------
	// Add all registered tools to the view.
	var addTools = function () {
		getToolParams();
	};

	//---------------------------------------------------------
	var handleImageSizeChange = function(caller) {
		image.width = fullImage.width * scale.cur;
		image.height = fullImage.height * scale.cur;
		viewable.width = (viewport.width < image.width) ? viewport.width : image.width;
		viewable.height = (viewport.height < image.height) ? viewport.height : image.height;
		xfits = (viewport.width > image.width);
		yfits = (viewport.height > image.height);
		//console.log("view.handleImageSizeChange (called from %s) image.width %f, image.height %f",caller,image.width,image.height);
	};

	//---------------------------------------------------------
	// these need to be separate cases; not if ... else 
	// Changing rotation or distance sliders 
	// should not update the main image until a 'mouse up' event occurs.
	// Only the locator image should change before that.
	//---------------------------------------------------------
	var modelUpdate = function(modelChanges) {
		if(modelChanges.initial === true) {
			completeInitialisation();
		}
		if(modelChanges.initialState === true) {
			updateDst();
			updateWlzRotation();
			handleImageSizeChange('modelUpdate.initialState');
			updateWlzLocator();
		}
		if(modelChanges.dst === true) {
			updateDst();
		}
		if(modelChanges.rotation === true) {
			updateWlzRotation();
		}
		if(modelChanges.locator === true) {
			// I know handleImageSizeChange() is called in updateWlzLocator()
			// but it is needed here as well.
			handleImageSizeChange('modelUpdate.locator');
			updateWlzLocator();
		}
		if(modelChanges.fxp === true) {
			if (model.isWlzData()) { 
				if (initialised && !isSameImagePosition()) {
					setTimeout("emouseatlas.emap.tiledImageView.requestImages('modelUpdate fxp')", 10);
				}
			}
		}

	};

	//---------------------------------------------------------
	/**
	 * Delete our old image mosaic
	 * Called when scale or dst is changed
	 *
	 * @author Ruven Pillay
	 */
	var clearTiles = function(params) {

		//console.log("view.clearTiles");

		var scale2clear;
		if(params.scale !== undefined &&
				params.scale === true) {
			scale2clear = scale.old;
		} else {
			scale2clear = scale.cur;
		}

		var tileClass = "tile " + "s" + scale2clear + "d" + oldDst;
		var childrenToRemove = [];
		var tileFrameContainer;
		var tileFrame;
		var layer;
		var children;
		var i,j;

		// need to sort out multiple (but not all) layers to clear.
		if(typeof(params.layer) === 'undefined') {
			layerToClear = "all";
		} else {
			layerToClear = params.layer;
		}

		for(i=0; i<numLayers; i++) {
			layer = layerNames[i];
			if(layerToClear === 'all' || layer === layerToClear) {
				childrenToRemove = [];
				tileFrameContainer = tileFrameContainers[layer];
				if(typeof(tileFrameContainer) === 'undefined') {
					continue;
				} else {
					tileFrame = tileFrameContainer.firstChild;
					// uncomment the line below to see what tiles are in this tileFrame
					//util.printNodes(tileFrame, 1, "   ", skip);
					children = tileFrame.childNodes;
					if(typeof(children) !== 'undefined') {
						for (var ch in children) {
							if(typeof(children[ch]) !== 'undefined') {
								if(children[ch].className === tileClass) {
									childrenToRemove[childrenToRemove.length] = children[ch];
								}
								if(children[ch].className === 'tilenum') {
									childrenToRemove[childrenToRemove.length] = children[ch];
								}
							}
						}
						if(childrenToRemove.length > 0) {
							var len = childrenToRemove.length;
							for(j=0; j<len; j++) {
								tileFrame.removeChild(childrenToRemove[j]);
							}
						}
					}
				}
				//util.printNodes(tileFrame, 1, "   ", skip);
			}
		} // for

	}; // clearTiles

	//---------------------------------------------------------
	var refreshImage = function() {

		var clearParams;
		//..........................
		if(model.isWlzData()) {
			clearParams = {scale: false, distance: true, rotation: true};
			clearTiles(clearParams);
			fullImage = model.getFullImgDims();
			handleImageSizeChange('refreshImage wlzData');
		} else {
			clearParams = {scale: false, distance: true, rotation: false};
			clearTiles(clearParams);
			fullImage = model.getFullImgDims();
			handleImageSizeChange('refreshImage');
		}

		//..........................
		resetViewChanges();
		viewChanges.locator = true;
		notify("updateWlzLocator");
		//..........................
		setTimeout("emouseatlas.emap.tiledImageView.requestImages('refreshImage')", 10);
	};


	// only does this once slider has stopped
	// or click off slider knob
	// or click on arrow
	//---------------------------------------------------------
	var updateWlzRotation = function() {
		fullImage = model.getFullImgDims();
		handleImageSizeChange('updateWlzRotation');
		/* !!!!! at the moment, due to the compliexity/deficiency of MVC model
	  or a bug in the code, one user action may cause the same
	  image to be loaded 1+ times by calling 
	  handleScaleChange, updateDst, and updateWlzRotation.
	  Due to time pressure, it is difficult to guarantee not
	  to call these functions unnecessary. Thus the following code
	  is used to stop some unnecessay image-loading
		 */
		var clearParams = {scale: false, distance: false, rotation: true};
		if (initialised && model.isWlzData()) {
			var same = isSameImagePosition();
			if (!same) {

				clearTiles(clearParams);
				setTimeout("emouseatlas.emap.tiledImageView.requestImages('updateWlzRotation')", 10);
				setImagePosition();
			}
		} else {
			clearTiles(clearParams);
			setTimeout("emouseatlas.emap.tiledImageView.requestImages('updateWlzRotation')", 10);
		}
		setTileFramePosition();
	};

	// only does this once slider has stopped
	// or click off slider knob
	// or click on arrow
	//---------------------------------------------------------
	var updateDst = function() {

		//console.log("view.updateDst");
		fullImage = model.getFullImgDims();
		handleImageSizeChange('updateDst');
		/* !!!!! at the moment, due to the compliexity/deficiency of MVC model
	  or a bug in the code, one user action may cause the same
	  image to be loaded 1+ times by calling 
	  handleScaleChange, updateDst, and updateWlzRotation.
	  Due to time pressure, it is difficult to guarantee not
	  to call these functions unnecessary. Thus the following code
	  is used to stop some unnecessay image-loading
		 */
		var clearParams = {scale: false, distance: true, rotation: false};
		if (initialised && model.isWlzData()) {
			var same = isSameImagePosition();
			if (!same) {

				clearTiles(clearParams);
				setTimeout("emouseatlas.emap.tiledImageView.requestImages('updateDst')", 10);
				setImagePosition();
			}
		} else {
			clearTiles(clearParams);
			setTimeout("emouseatlas.emap.tiledImageView.requestImages('updateDst')", 10);
		}

		setTileFramePosition();
	};

	//---------------------------------------------------------
	var updateWlzLocator = function() {
		//console.log("view.updateWlzLocator");
		resetViewChanges();
		viewChanges.locator = true;
		notify("updateWlzLocator");
	};

	//---------------------------------------------------------
	/**
	 * Gets the initial images for the view.
	 *
	 * @author Ruven Pillay, Tom Perry
	 */
	var requestImages = function(caller) {

		var isWlz = model.isWlzData();

		if (isWlz) {
			/* !!!!! at the moment, the initialization cycle calls
	  handleScaleChange, updateDst, updateWlzRotation.
	  All of them will load the image when the image is only needed 
	  to be loaded once.  initialised in introduced to
	  improve performance by loading image only once
			 */

			if (caller === 'updateWlzRotation' &&
					initialised === false) {
				initialised = true;
				// setting initial status
				model.setSectionCallback();
			}

			if (initialised === false)
				return false;
		}

		var _debug = false;

		//console.log("enter view.requestImages called by %s",caller);
		//console.log("sampleRate %d, image %s",resolutionData.sampleRate,resolutionData.imageName);

		if(_debug) {
			console.log("enter view.requestImages");
		}

		model.updateBusyIndicator({isBusy:true, message:"loading tiled image", x:20, y:600});


		var maxiipres = isWlz ? undefined : model.getMaxIIPResolution();
		var tileSize = model.getTileSize();
		var vpleft = 0;

		if(_debug) {
			console.log("image.width  %f, image.height %f",image.width, image.height);
			console.log("viewport.width  %f, viewport.height %f",viewport.width, viewport.height);
		}
		if (image.width > viewport.width) {
			vpleft = getViewportLeftEdge();
		}
		var vptop = 0;
		if (image.height > viewport.height) {
			vptop = getViewportTopEdge();
		}

		if(_debug) {
			if(!isWlz) {
				console.log("maxiipres ",maxiipres);
			}
			console.log("tileSize ",tileSize);
			console.log("vpleft ",vpleft);
			console.log("vptop ",vptop);
		}
		oldDst = model.getDistance().cur;

		if (!(scale.cur >= scale.min && scale.cur <= scale.max)) {
			alert("Error: cannot request image with scale "+scale.cur+"\n" +"Minimum scale: "+scale.min+", Maximum scale: "+scale.max);
			return;
		}

		// Loads tiles around the border
		var hiddenBorder = 1;

		if(!isWlz) {
			resolution = Math.round(maxiipres + Math.log(scale.cur) / Math.log(2));
			if(_debug) {
				console.log("resolution ",resolution);
			}
		}

		startx = Math.floor(vpleft / tileSize.width) - hiddenBorder ;
		starty = Math.floor(vptop / tileSize.height) - hiddenBorder ;
		endx = Math.floor((vpleft + viewable.width) / tileSize.width) + hiddenBorder ;
		endy = Math.floor((vptop + viewable.height) / tileSize.height) + hiddenBorder ;

		var refresh = false;

		// ideally we should get W & H from the image at each resolution (it is an integer).
		// currently it is calculated from the full size image (generally not an integer result).
		/*
      var intW = Math.floor(image.width);
      var intH = Math.floor(image.height);
      //xtiles = Math.ceil(intW / tileSize.width);
      //ytiles = Math.ceil(intH / tileSize.height);
		 */
		xtiles = Math.ceil(image.width / tileSize.width);
		ytiles = Math.ceil(image.height / tileSize.height);

		if(_debug) {
			console.log("intW ",intW);
			console.log("intH ",intH);
			console.log("xtiles ",xtiles);
			console.log("ytiles ",ytiles);
			console.log("---------------------------------------------");
		}

		// Create our image tile mosaic
		getTiles(startx,endx,starty,endy);

		// Get image maps for overlays
		//if ($chk(hasOverlays)) overlay.requestMaps();

		model.updateBusyIndicator({isBusy:false});

		if(_debug) {
			console.log("exit view.requestImages");
		}
		//console.log("exit view.requestImages called by %s",caller);
	}; // requestImages

	//---------------------------------------------------------
	var getScale = function () {
		return scale;
	};

	//---------------------------------------------------------
	var setScale = function (val) {

		scale.old = scale.cur;

		if (val < scale.iipmin) {
			val = scale.iipmin;
		} else if (val > scale.max) {
			val = scale.max;
		}
		// Round to a power of 2
		var val2 = Math.pow(2,Math.round(Math.log(val) / Math.log(2)));
		//console.log("view.setScale val2 %d",val);
		if (val2 === scale.cur) {
			return false;
		}
		scale.cur = val2;
		//console.log("view.setScale scale.cur %d",scale.cur);
		handleScaleChange();
	};

	//---------------------------------------------------------
	var getImgFit = function () {
		return {xfits:xfits, yfits:yfits};
	};

	//---------------------------------------------------------
	var getViewableDims = function () {
		return viewable;
	};

	//---------------------------------------------------------
	var getViewportDims = function () {
		return viewport;
	};

	//---------------------------------------------------------
	var getFocalPoint = function () {
		return focalPoint;
	};

	//---------------------------------------------------------
	var setFocalPoint = function (vals) {
		focalPoint.x = vals.x;
		focalPoint.y = vals.y;
		getDraggedTiles();
		setTileFramePosition();
		viewChanges.focalPoint = true;
		notify("setFocalPoint ");
	};

	//---------------------------------------------------------
	var register = function (observer) {
		registry.push(observer);
	};

	//---------------------------------------------------------
	// Opacity must be between 0 and 1.0 with 1.0 being 'solid'.
	var setOpacity = function(params) {

		var val = params.value;
		// limit the range to sensible values
		val = (val < 0.0) ? 0.0 : val;
		val = (val > 1.0) ? 1.0 : val;

		layerOpacity[currentLayer].opacity = val;
		setTileFrameOpacity(val);

		viewChanges.opacity = true;
		notify("setOpacity");
	};

	//---------------------------------------------------------
	var getOpacity = function(layer) {
		if(typeof(layerOpacity[layer]) === 'undefined') {
			return 1.0;
		} else {
			return layerOpacity[layer].opacity;
		}
	};

	//---------------------------------------------------------
	var setFilter = function(params) {

		var type = params.type;
		var val = params.value;
		// limit the range to sensible values
		val = (val < 0) ? 0 : val;
		val = (val > 255) ? 255 : val;

		if(type === 'red') {
			layerFilter[currentLayer].filter.red = val;
		}
		if(type === 'green') {
			layerFilter[currentLayer].filter.green = val;
		}
		if(type === 'blue') {
			layerFilter[currentLayer].filter.blue = val;
		}

		viewChanges.filter = true;
		setTimeout("emouseatlas.emap.tiledImageView.requestImages('setFilter')", 10);
		notify("setFilter");
	};

	//---------------------------------------------------------
	var getFilter = function(layer) {
		if(typeof(layerFilter[layer]) === 'undefined') {
			return {red:255, green:255, blue:255};
		} else {
			return layerFilter[layer].filter;
		}
	};

	//---------------------------------------------------------
	var getPossibleFixedPoint = function() {
		return possibleFixedPoint;
	};

	//---------------------------------------------------------
	var setPossibleFixedPoint = function(vals) {
		possibleFixedPoint = {x:vals.x, y:vals.y, z:vals.z};
	};

	//---------------------------------------------------------
	var getMeasurementOrigin = function() {
		return measurementOrigin;
	};

	//---------------------------------------------------------
	var getMeasurementTarget = function() {
		return measurementTarget;
	};

	//---------------------------------------------------------
	var getMeasurementPoint = function() {
		return measurementPoint;
	};

	//---------------------------------------------------------
	var stopMeasuring = function() {
		measuring = false;
		return false;
	};

	//---------------------------------------------------------
	var getHRSectionPoint = function() {
		return HRSectionPoint;
	};

	//---------------------------------------------------------
	// returns the position relative to the document (not necessarily the viewer container).
	var getMouseClickPosition = function() {
		return {x:docX, y:docY};
	};

	//---------------------------------------------------------
	var setLayerVisibility = function (data) {

		if(typeof(layerVisibility[data.layer]) === 'undefined') {
			layerVisibility[data.layer] = {name:data.layer, visible:data.value};
		} else {
			layerVisibility[data.layer].visible = data.value;
		}

	};

	//---------------------------------------------------------
	var getLayerVisibility = function () {

		return layerVisibility;
	};

	//---------------------------------------------------------
	var setCurrentLayer = function (layer) {
		currentLayer = layer;
		//setResolutionData('setCurrentLayer');
		//setLocatorData('setCurrentLayer');
		viewChanges.layer = true;
		notify("setCurrentLayer");
	};

	//---------------------------------------------------------
	var getCurrentLayer = function () {
		return currentLayer;
	};

	//---------------------------------------------------------
	var showLayerProperties = function (layer) {
		viewChanges.showProperties = true;
		notify("showLayerProperties");
	};

	//---------------------------------------------------------
	var showFixedPointTool = function (layer) {
		setMode(modes.fixedPoint.name);
	};

	//---------------------------------------------------------
	var getSelections = function () {
		return treeSelections;
	};

	//---------------------------------------------------------
	var getAllSelections = function (layer) {

		var indexData = model.getIndexData(layer);

		if(typeof(indexData) === 'undefined') {
			return "";
		}
		var len = indexData.length;
		var data;
		var i;
		var ret = "";

		for (var domainId in indexData) {
			if (indexData.hasOwnProperty(domainId)) {
				data = indexData[domainId];
				ret = ret + "&sel=" + domainId + "," + data.colour[0] + "," + data.colour[1] + "," + data.colour[2] + "," + data.colour[3];
			}
		}

		return ret;
	};

	//---------------------------------------------------------
	var setSelections = function (vals) {
		//console.log("view.setSelections ",vals);
		treeSelections = vals;
		var clearParams = {scale: false, distance: false, rotation: false, layer: layerNames[numLayers - 1]};
		clearTiles(clearParams);
		setTimeout("emouseatlas.emap.tiledImageView.requestImages('setSelections')", 10);
		viewChanges.dblClick = false; // this is required to stop endless loop
		viewChanges.selections = true;
		notify("setSelections");
	};

	//---------------------------------------------------------
	var getIndexArray = function () {
		return indexArray;
	};

	//---------------------------------------------------------
	var getViewerContainerPos = function () {

		var ret = emouseatlas.emap.utilities.findPos(targetContainer);
		return ret;
	};

	//---------------------------------------------------------
	var getToolContainerPos = function () {

		var ret = emouseatlas.emap.utilities.findPos(targetContainer);
		return ret;
	};

	//---------------------------------------------------------
	var maximiseImage = function () {

		imageIsMaximised = !imageIsMaximised;

		var img = document.getElementById("emapIIPViewerDiv");
		var infoIcon = document.getElementById("infoFrameIconContainer");

		var right;
		if(typeof(tools.tree) === 'undefined') {
			right = "10px";
		} else {
			right = "250px";
		}

		if(imageIsMaximised) {
			img.style.left = "0px";
			img.style.right = "0px";
			img.style.top = "0px";
			img.style.bottom = "0px";
			img.style.border = "none";
			if(infoIcon) {
				infoIcon.style.visibility = "hidden";
			}
		} else {
			img.style.left = "170px";
			img.style.right = right;
			img.style.top = "50px";
			img.style.bottom = "10px";
			img.style.border = "solid 2px #ccc";
			if(infoIcon) {
				infoIcon.style.visibility = "visible";
			}
		}

		viewChanges.maximise = true;
		//notify("maximiseImage");

		setViewportSize();

		return false;
	};

	//---------------------------------------------------------
	var showTileBorders = function () {
		tileHasBorder = !tileHasBorder;
		var clearParams = {scale: false, distance: false, rotation: false};
		clearTiles(clearParams);
		setTimeout("emouseatlas.emap.tiledImageView.requestImages('showTileBorders')", 10);

	};

	//---------------------------------------------------------

	//---------------------------------------------------------
	var setToolboxVisibility = function () {

		var toolbox = targetContainer;
		var treeContainer = document.getElementById("treetool-container");
		var logoContainer = document.getElementById("logoContainer");
		var hintContainer = document.getElementById("contextMenuHintDiv");

		if(toolbox) {
			if(toolbox.style.visibility.toLowerCase() === "visible") {
				toolbox.style.visibility = "hidden";
				hintContainer.style.visibility = "visible";
				toolsVisible = true; // so we know to hide them
				if(logoContainer) {
					if(logoContainer.className === "ema_wlz") {
						logoContainer.style.left = "50px";
					}
					if(logoContainer.className === "ema_sections") {
						logoContainer.style.left = "23px";
					}
				}
			} else {
				toolbox.style.visibility = "visible";
				toolsVisible = false; // so we know to show them
				hintContainer.style.visibility = "hidden";
				if(logoContainer) {
					logoContainer.style.left = "10px";
				}
			}
		}

		if(treeContainer) {
			if(treeContainer.style.visibility.toLowerCase() === "visible") {
				treeContainer.style.visibility = "hidden";
			} else {
				treeContainer.style.visibility = "visible";
			}
		}

		viewChanges.toolbox = true;
		notify("toolbox");
		return false;
	};

	//---------------------------------------------------------
	var setTree = function (viz) {

		//console.log("setTree ",viz);
		var treeContainer = document.getElementById("treetool-container");

		if(treeContainer) {
			if(treeContainer.style.visibility.toLowerCase() === "visible") {
				treeContainer.style.visibility = "hidden";
			} else {
				treeContainer.style.visibility = "visible";
			}
		}
		return false;
	};

	//---------------------------------------------------------
	var toolboxVisible = function () {
		return toolsVisible;
	};

	//---------------------------------------------------------
	var showViewerHelp = function () {
		var closeDiv = document.getElementById("wlzIIPViewerIFrameCloseDiv");
		var div = document.getElementById("wlzIIPViewerIFrameContainer");
		div.style.visibility = "visible";
		if(closeDiv) {
			util.addEvent(closeDiv, 'click', hideViewerHelp, false);
		}
		viewChanges.showViewerHelp = true;
		notify();
	};

	//---------------------------------------------------------
	var hideViewerHelp = function () {
		var closeDiv = document.getElementById("wlzIIPViewerIFrameCloseDiv");
		var div = document.getElementById("wlzIIPViewerIFrameContainer");
		div.style.visibility = "hidden";
		if(closeDiv) {
			util.removeEvent(closeDiv, 'click', hideViewerHelp, false);
		}
		keepViewerHelpFrame = false;
		viewChanges.hideViewerHelp = true;
		notify();
	};

	//---------------------------------------------------------
	var showViewerInfo = function () {
		var infoDetails = model.getInfoDetails();
		var closeDiv = document.getElementById("wlzIIPViewerInfoIFrameCloseDiv");
		var div = document.getElementById("wlzIIPViewerInfoIFrameContainer");
		div.style.visibility = "visible";
		if(closeDiv) {
			util.addEvent(closeDiv, 'click', hideViewerInfo, false);
		}

		if(infoDetails.jso) {
			viewChanges.showViewerInfo = true;
			notify();
		} else {
			var iframe = document.getElementById("staticInfoIFrame");
			iframe.style.visibility = "visible";
		}
	};

	//---------------------------------------------------------
	var hideViewerInfo = function () {
		var infoDetails = model.getInfoDetails();
		var closeDiv = document.getElementById("wlzIIPViewerInfoIFrameCloseDiv");
		var div = document.getElementById("wlzIIPViewerInfoIFrameContainer");
		div.style.visibility = "hidden";
		if(closeDiv) {
			util.removeEvent(closeDiv, 'click', hideViewerInfo, false);
		}
		keepViewerInfoFrame = false;
		if(infoDetails.jso) {
			viewChanges.hideViewerInfo = true;
			notify();
		} else {
			var iframe = document.getElementById("staticInfoIFrame");
			iframe.style.visibility = "hidden";
		}
	};

	// This is a context menu action.
	// Mode choices are radio buttons in the 'mode' group.
	//---------------------------------------------------------
	var setModeNum = function (num) {
		var newmode;
		switch(num) {
		case 0:
			newmode = 'move';
			break;
		case 1:
			newmode = 'measuring';
			break;
		case 2:
			newmode = 'HRSection';
			break;
		case 3:
			newmode = 'fixedPoint';
			break;
		default:
			newmode = 'move';
		}
		setMode(newmode);
	};
	//---------------------------------------------------------
	var setMode = function (newmode) {
		//console.log("setMode current mode %s, newmode %s",mode.name,newmode);
		if(mode.name === newmode) {
			return false;
		}
		mode = modes[newmode];
		if(mode.name === defaultModeName) {
			imageContextMenu.setRadioButton('mode', 0);
		}
		setImageCursor(mode.cursor);
		viewChanges.mode = true;
		notify();
	};

	//---------------------------------------------------------
	var getMode = function () {
		return mode;
	};

	//---------------------------------------------------------
	var getModes = function () {
		return modes;
	};

	//---------------------------------------------------------
	var setCursor = function (cursor) {
		var div = document.getElementById("wlzIIPViewerIFrameContainer");
		if(cursor === undefined) {
			document.body.style.cursor = "default";
		} else {
			document.body.style.cursor = cursor;
		}
	};

	//---------------------------------------------------------
	var getNextWindowName = function () {
		if(equivalentSectionId === undefined) {
			equivalentSectionId = 0;
		}
		equivalentSectionId = 1*equivalentSectionId + 1*1;
		return "wlzIIPViewerPopup_" + equivalentSectionId;
	};

	//---------------------------------------------------------
	var launchEquivalentSection = function (url) {
		var windowName = getNextWindowName();
		//console.log("windowName = ",windowName);
		var windowPars = 'height=700,width=900,scrollbars=yes,toolbar=yes,menubar=yes';
		openWindows[openWindows.length] = window.open(url,windowName,windowPars);
	};

	//---------------------------------------------------------
	// expose 'public' properties
	//---------------------------------------------------------
	// don't leave a trailing ',' after the last member or IE won't work.
	return {
		initialise: initialise,
		register: register,
		modelUpdate:modelUpdate,
		updateDst: updateDst,
		updateWlzRotation: updateWlzRotation,
		requestImages: requestImages,
		getImgFit: getImgFit,
		getScale: getScale,
		setScale: setScale,
		getOpacity: getOpacity,
		setOpacity: setOpacity,
		setFilter: setFilter,
		getFilter: getFilter,
		getPossibleFixedPoint: getPossibleFixedPoint,
		setPossibleFixedPoint: setPossibleFixedPoint,
		getMeasurementOrigin: getMeasurementOrigin,
		getMeasurementTarget: getMeasurementTarget,
		getMeasurementPoint: getMeasurementPoint,
		getHRSectionPoint: getHRSectionPoint,
		setModeNum: setModeNum,
		setMode: setMode,
		getMode: getMode,
		getModes: getModes,
		stopMeasuring: stopMeasuring,
		getSelections: getSelections,
		setSelections: setSelections,
		getIndexArray: getIndexArray,
		setLayerVisibility: setLayerVisibility,
		getLayerVisibility: getLayerVisibility,
		clearTiles: clearTiles,
		setCurrentLayer: setCurrentLayer,
		getCurrentLayer: getCurrentLayer,
		showLayerProperties: showLayerProperties,
		getViewportDims: getViewportDims,
		getViewableDims: getViewableDims,
		getViewerContainerPos: getViewerContainerPos,
		getToolContainerPos: getToolContainerPos,
		getFocalPoint: getFocalPoint,
		setFocalPoint: setFocalPoint,
		getMouseClickPosition: getMouseClickPosition,
		toolboxVisible: toolboxVisible,
		refreshImage: refreshImage,
		maximiseImage: maximiseImage,
		showTileBorders: showTileBorders,
		setToolboxVisibility: setToolboxVisibility,
		launchEquivalentSection: launchEquivalentSection
	};

}(); // end of module tiledImageView
//----------------------------------------------------------------------------
