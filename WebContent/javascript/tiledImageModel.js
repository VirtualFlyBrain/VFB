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
////---------------------------------------------------------
//tiledImageModel.js
//Model for high resolution tiled image from an iip server
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
//module for tiledImageModel
//encapsulating it in a module to preserve namespace
//---------------------------------------------------------
emouseatlas.emap.tiledImageModel = function() {

	//---------------------------------------------------------
	// modules
	//---------------------------------------------------------
	var view = emouseatlas.emap.tiledImageView;
	var util = emouseatlas.emap.utilities;
	var busyIndicator = emouseatlas.emap.busyIndicator;

	//---------------------------------------------------------
	// private members
	//---------------------------------------------------------
	var _debug = false;
	var modelInitialised = false;
	//......................
	var imageTitle;
	var imageTitleTooltip;
	var webServer;
	var iipServerPath;
	var metadataRoot;
	var dataImageDir;
	var imageExtension;
	var fullDepth;
	var interfaceImageDir;
	var stackMetadataFilename;
	var toolsMetadataFilename;
	var tools;
	var fullDataPath;
	var infoDetails;

	var dataImgPaths;
	var viewerTargetId;
	var initialState = {};
	var pixelResolution = {x:1, y:1, z:1, units:["\u03BC\u006D", "\u006D\u006D"]}; // default values
	var layerNames = []; // read in with initModelCallback()
	var layerData = {}; // this must be an object, not an array
	var numberOfTrees = 0;
	var numberOfTreesLoaded = 0;
	var transverseView = {pitch:0, yaw:0, roll:0}; // read in with initModelCallback()
	var sagittalView = {pitch:90, yaw:0, roll:270};
	var coronalView = {pitch:90, yaw:90, roll:270};
	var expressionLevelKey;
	var assayPath;
	var assayID;
	var urlSpecifiedSection;
	var tileframe;
	var imgtitle;
	//......................
	var isWlz = false;
	var isPyrTiff = false;
	var isPyrTiff_origNames = false;
	var isEurexpress = false;
	var hasProperties = false;
	var sectionOrderReversed = false;
	var layerHasLabels = false;
	var arrayStartsFrom0 = true;
	//......................
	var maxiipres;
	//......................
	var registry = [];
	var modelChanges = { 
			initial: false,
			initialState: false,
			layerNames: false,
			rotation: false,
			dst: false,
			distanceRange: false,
			boundingBox: false,
			fxp: false
	};
	var image = {};
	var scale = {};
	var tileSize = {};
	var fullWlzObject = {x:{}, y:{}, z:{}};
	var fullImgDims = {};
	var zsel = {
			fullname: "",
			width: 0,
			height: 0,
			border_tl: 0,
			border_br: 0,
			orientation: "horizontal"
	}

	var threeDInfo = {
			wlzMode: "",
			defaultFxp: {x:0, y:0, z:0},
			fxp: {x:0, y:0, z:0},
			dst: {},
			pitch: {min:0, max:180, cur:0},
			yaw: {min:0, max:360, cur:0},
			roll: {min:0, max:360, cur:0}
	}
	var dst = {};
	var qlt = {min:0, max:100, cur:80};
	var roi = {x:0.5, y:0.5};
	//......................
	var initialCurrentLayer;
	//......................
	var menuStructureUrl;
	var menuContentUrl;

	var greyImg;
	var expressionImg;
	var expressionSectionName = [];
	var expressionSection = {};

	//---------------------------------------------------------
	//   private methods
	//---------------------------------------------------------

	var initModel = function(url) {

		if(_debug) {
			console.log("enter initModel %s",url);
		}

		var ajaxParams = {
				url:url,
				method:"POST",
				callback:initModelCallback,
				async:true
		}
		//console.log(ajaxParams);
		var ajax = new emouseatlas.emap.ajaxContentLoader();
		ajax.loadResponse(ajaxParams);

		if(_debug) {
			console.log("exit initModel");
		}
	}; // initModel

	//---------------------------------------------------------
	var initModelCallback = function(response) {

		if(_debug) {
			console.log("enter initModelCallback");
		}

		// get model data via ajax
		//----------------
		response = util.trimString(response);
		if(response === null || response === undefined || response === "") {
			//console.log("initModelCallback returning: reponse null");
			return false;
		}

		var json;
		if(emouseatlas.JSON === undefined || emouseatlas.JSON === null) {
			json = JSON.parse(response);
		} else {
			json = emouseatlas.JSON.parse(response);
		}
		if(!json) {
			//console.log("initModelCallback returning: json null");
			return false;
		}

		imageTitle = json.imageTitle;
		imageTitleTooltip = json.imageTitleTooltip;
		webServer = "http://" + json.webServer;
		iipServerPath = json.iipServerPath;
		interfaceImageDir = json.interfaceImageDir;
		//console.log("initModelCallback interfaceImageDir %s ",interfaceImageDir);
		metadataRoot = json.metadataRoot;
		if(json.toolsMetadataFilename) {
			toolsMetadataFilename = json.toolsMetadataFilename;
		}
		if(json.stackMetadataFilename) {
			stackMetadataFilename = json.stackMetadataFilename;
		}

		var dataType = json.dataType;
		//console.log("initModelCallback: dataType %s",dataType);
		if(dataType.toLowerCase() === "wlz") {
			isWlz = true;
			//console.log("isWlz true");
		}
		if(dataType.toLowerCase() === "pyrtiff") {
			isPyrTiff = true;
			//console.log("isPyrTiff true");
		}
		if(dataType.toLowerCase() === "pyrtiff_orignames") {
			isPyrTiff_origNames = true;
			//console.log("isPyrTiff_origNames true");
		}
		if(dataType.toLowerCase() === "eurexpress") {
			isEurexpress = true;
			//console.log("isEurexpress true");
		}

		arrayStartsFrom0 = (json.arrayStartsFrom0 === undefined) ? 'true' : json.arrayStartsFrom0;
		arrayStartsFrom0 = (arrayStartsFrom0 === 'true' || arrayStartsFrom0 === true) ? true : false;

		hasProperties = (json.hasProperties === undefined) ? 'true' : json.hasProperties;
		hasProperties = (hasProperties === 'true' || hasProperties === true) ? true : false;

		viewerTargetId = json.viewerTargetId;

		layerNames = json.layerNames;
		var numlayers = layerNames.length;

		var jsonLayerData = json.layerData;
		var opacity;
		var filter;
		var layerType;
		var lowRes;
		var locatadata;
		var selectaName;
		var treeStructureFile; // the the full path to the json file from the web root.
		var treeDataFile; // the the full path to the json file from the web root.
		//console.log("initModelCallback jsonLayerData ",jsonLayerData);

		for(var i=0; i<numlayers; i++) {

			if(jsonLayerData[i].current !== undefined) {
				initialCurrentLayer = layerNames[i];
			}

			opacity = (jsonLayerData[i].opacity === undefined) ? 1.0 : jsonLayerData[i].opacity;
			filter = (jsonLayerData[i].filter === undefined) ? {red:255,green:255,blue:255} : jsonLayerData[i].filter;

			if(jsonLayerData[i].lowResData !== undefined) {
				lowRes = jsonLayerData[i].lowResData;
			}

			if(jsonLayerData[i].locatorData !== undefined) {
				locatadata = jsonLayerData[i].locatorData;
			} else {
				locatadata = {imageDir:jsonLayerData[i].imageDir, imageName:jsonLayerData[i].imageName, sampleRate:1};
			}

			selectaName = (jsonLayerData[i].selectorName !== undefined) ? jsonLayerData[i].selectorName : "zsel.jpg.256.pyr.tif"; 

			if(jsonLayerData[i].treeStructureFile !== undefined) {
				treeStructureFile = jsonLayerData[i].treeStructureFile;
				treeDataFile = jsonLayerData[i].treeDataFile;
				numberOfTrees++;
				//console.log("numberOfTrees ",numberOfTrees);
			}

			if(jsonLayerData[i].type) {
				layerType = jsonLayerData[i].type;
				if(layerType.toLowerCase() === "label") {
					layerHasLabels = true;
				}
			}

			if(layerData[layerNames[i]] === undefined) {
				layerData[layerNames[i]] = {
						layerName:layerNames[i],
						imageDir:jsonLayerData[i].imageDir,
						imageName:jsonLayerData[i].imageName,
						lowResData:lowRes,
						locatorData:locatadata,
						selectorName:selectaName,
						targetId:viewerTargetId,
						visible:jsonLayerData[i].visible,
						type:jsonLayerData[i].type,
						initialFilter:filter,
						initialOpacity:opacity,
						treeStructure:treeStructureFile,
						treeData:treeDataFile
				};
				//console.log("initModelCallback tree ",tree);
			}

			// modify image file location if url indicates dynamic nature
			if ( layerNames[i] === 'grey' &&
					greyImg !== undefined &&
					greyImg != "" &&
					greyImg != null)
				layerData[layerNames[i]].imageName = greyImg;
			else {
				if (layerNames[i] === 'expression' &&
						expressionImg !== undefined &&
						expressionImg != "" &&
						expressionImg != null) {
					layerData[layerNames[i]].imageName = expressionImg;
				}
			}
		}

		if(typeof(json.menuStructureFile) !== 'undefined') {
			var menuStructureFile = json.menuStructureFile;
			menuStructureUrl = webServer + menuStructureFile;
		}

		if(typeof(json.menuContentFile) !== 'undefined') {
			var menuContentFile = json.menuContentFile;
			menuContentUrl = webServer + menuContentFile;
		}

		if(typeof(json.transverseView) !== 'undefined') {
			transverseView = {pitch:parseInt(json.transverseView.pitch),
					yaw:parseInt(json.transverseView.yaw),
					roll:parseInt(json.transverseView.roll)};
		}
		if(typeof(json.sagittalView) !== 'undefined') {
			sagittalView = {pitch:parseInt(json.sagittalView.pitch),
					yaw:parseInt(json.sagittalView.yaw),
					roll:parseInt(json.sagittalView.roll)};
		}
		if(typeof(json.coronalView) !== 'undefined') {
			coronalView = {pitch:parseInt(json.coronalView.pitch),
					yaw:parseInt(json.coronalView.yaw),
					roll:parseInt(json.coronalView.roll)};
		}

		if(typeof(json.expressionLevelKey) !== 'undefined') {
			expressionLevelKey = json.expressionLevelKey;
		}

		if(json.initialState !== undefined) {
			var state = json.initialState;
			if(state.scale) {
				initialState.scale = parseFloat(state.scale);
			}
			// if it has expression sections, use its first section as initial section
			if (expressionSectionName !== undefined &&
					expressionSectionName.length !== undefined &&
					0 < expressionSectionName.length) {
				initialState.distance = expressionSection[expressionSectionName[0]].dst;
				initialState.pitch = expressionSection[expressionSectionName[0]].phi;
				initialState.yaw = expressionSection[expressionSectionName[0]].theta;
			} else {
				// if section has been specified in url params, this overrides
				// initialState.distance read from tiledImageModelData.jso.
				// If neither have been specified, use dst.min
				if(urlSpecifiedSection) {
					initialState.distance = parseFloat(urlSpecifiedSection);
				} else if(state.distance) {
					initialState.distance = parseFloat(state.distance);
				} else {
					initialState.distance = dst.min;
				}

				if(state.pitch) {
					initialState.pitch = parseFloat(state.pitch);
				}
				if(state.yaw) {
					initialState.yaw = parseFloat(state.yaw);
				}
			}
			if(state.roll) {
				initialState.roll = parseFloat(state.roll);
			}
		}

		if(json.pixelResolution !== undefined) {
			var pixres = json.pixelResolution;
			if(pixres.x) {
				pixelResolution.x = parseFloat(pixres.x);
			}
			if(pixres.y) {
				pixelResolution.y = parseFloat(pixres.y);
			}
			if(pixres.z) {
				pixelResolution.z = parseFloat(pixres.z);
			}
			if(pixres.units) {
				pixelResolution.units = pixres.units;
			}
		}
		//console.log(pixelResolution);

		if(json.wlzMode !== undefined) {
			threeDInfo.wlzMode = json.wlzMode;
			//console.log("initModelCallback: wlzMode %s",threeDInfo.wlzMode);
		}

		sectionOrderReversed = (typeof(json.sectionOrderReversed) === 'undefined') ? false : json.sectionOrderReversed; 
		sectionOrderReversed = (sectionOrderReversed === 'true' || sectionOrderReversed === true) ? true : false;

		if(json.infoDetails !== undefined) {
			infoDetails = json.infoDetails;
		}

		if(json.tools !== undefined) {
			tools = json.tools;
		}

		tileframe = json.tileframe;
		imgtitle = json.imgtitle;

		getMetadata();

		if(_debug) {
			console.log("exit initModelCallback");
		}

	}; // initModelCallback

	//---------------------------------------------------------
	// read in the json file that defines a tree structure
	//---------------------------------------------------------
	var loadTreeStructure = function(layerName) {

		var layer = layerData[layerName];
		var url = webServer + layer.treeStructure;

		var ajaxParams = {
				url:url,
				method:"POST",
				callback: loadTreeStructureCallback_1,
				async:true,
				urlParams:layerName
		}
		var ajax = new emouseatlas.emap.ajaxContentLoader();
		var ret = ajax.loadResponse(ajaxParams);
	};

	//---------------------------------------------------------
	var loadTreeStructureCallback_1 = function(response, layerName) {

		response = util.trimString(response);
		if(response === null || typeof(response) === 'undefined' || response === "") {
			alert("Could not loadTreeStructure");
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

		var layer = layerData[layerName];
		layer.treeStructure = json;

		loadTreeData(layerName);

	};

	//---------------------------------------------------------
	// read in the json file that defines tree content
	//---------------------------------------------------------
	var loadTreeData = function(layerName) {

		var layer = layerData[layerName];
		var url = webServer + layer.treeData;

		var ajaxParams = {
				url:url,
				method:"POST",
				callback: loadTreeDataCallback_1,
				async:true,
				urlParams:layerName
		}
		var ajax = new emouseatlas.emap.ajaxContentLoader();
		ajax.loadResponse(ajaxParams);
	};

	//---------------------------------------------------------
	var loadTreeDataCallback_1 = function(response, layerName) {

		response = util.trimString(response);
		if(response === null || typeof(response) === 'undefined' || response === "") {
			alert("Could not loadTreeData");
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

		var layer = layerData[layerName];
		layer.treeData = json;
		numberOfTreesLoaded++;

		if(numberOfTreesLoaded === numberOfTrees) {
			modelChanges.initial = true;
			modelChanges.layerNames = true;
			modelInitialised = true;
			//console.log("finished initialising model");
			if(_debug) {
				printPaths();
			}
			initView();
		}
	};

	//---------------------------------------------------------
	// We should have read in the type of data we are dealing with.
	//---------------------------------------------------------
	var getMetadata = function() {

		if(_debug) {
			console.log("enter getMetadata");
		}

		if(isWlz) {
			getWlzMetadata();
			if(_debug) {
				console.log("exit getMetadata");
			}
			return false;
		} else {
			var layer = layerData[layerNames[0]];
			var assayPath = getAssayPath();

			fullDataPath = layer.imageDir + assayPath + stackMetadataFilename;
			//console.log("fullDataPath ",fullDataPath);
			// we now have to deal with legacy filename formats ...

			var len = fullDataPath.length;
			var pattern;
			var postn;

			pattern = /\.tif\.js/i;  // case insensitive regexp for ".tif.js"
			postn = fullDataPath.search(pattern);   
			if(postn === len - 7) {
				get2DMetadata();
				if(_debug) {
					console.log("exit getMetadata");
				}
				return false;
			}

			pattern = /\.tif/i;
			postn = fullDataPath.search(pattern);   
			if(postn === len - 4) {
				get2DMetadata();
				if(_debug) {
					console.log("exit getMetadata");
				}
				return false;
			}

			pattern = /\.tiff/i;
			postn = fullDataPath.search(pattern);   
			if(postn === len - 5) {
				get2DMetadata();
				if(_debug) {
					console.log("exit getMetadata");
				}
				return false;
			}

			pattern = /\.jso/i;
			postn = fullDataPath.search(pattern);   
			if(postn === len - 4) {
				getStackMetadata();
				if(_debug) {
					console.log("exit getMetadata");
				}
				return false;
			}

			pattern = /\.js/i;
			postn = fullDataPath.search(pattern);   
			if(postn === len - 3) {
				getStackMetadata();
				if(_debug) {
					console.log("exit getMetadata");
				}
				return false;
			}
		}
	};

	//---------------------------------------------------------
	var getWlzMetadata = function() {

		if(_debug) {
			console.log("enter getWlzMetadata");
		}

		// If *.wlz, get metadata from IIP server
		//isWlz = true;
		scale.max = 4;
		scale.min = 0.25;
		getIIPMetadata();

		if(_debug) {
			console.log("exit getWlzMetadata");
		}
	}; // getWlzMetadata

	//---------------------------------------------------------
	var get2DMetadata = function() {

		if(_debug) {
			console.log("enter get2DMetadata");
		}

		// If *.tif, get metadata from IIP server
		isWlz = false;
		scale.max = 1;
		scale.min = 0.00390625;
		getIIPMetadata();

		if(_debug) {
			console.log("exit get2DMetadata");
		}
	}; // get2DMetadata

	//---------------------------------------------------------
	//  Reads info relevant to pyramidal tiff stack.
	//---------------------------------------------------------
	var getStackMetadata = function() {

		if(_debug) {
			console.log("enter getStackMetadata");
		}

		var url = getStackMetadataUrl();
		var ajaxParams = {
				url:url,
				method:"POST",
				callback: getStackMetadataCallback_1,
				async:true
		}
		var ajax = new emouseatlas.emap.ajaxContentLoader();
		ajax.loadResponse(ajaxParams);

		if(_debug) {
			console.log("exit getStackMetadata");
		}
	}; // getStackMetadata

	//---------------------------------------------------------
	var getStackMetadataCallback_1 = function(response) {

		if(_debug) {
			console.log("enter getStackMetadataCallback_1");
		}

		// get metadata via ajax
		//----------------
		//console.log("getStackMetadataCallback_1 ",response);
		response = util.trimString(response);
		if(response === null || typeof(response) === 'undefined' || response === "") {
			alert("Could not load fullDataPath metadata");
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
		//console.log("getStackMetadataCallback_1 json = ",json);

		var meta_ver = "1.02"; //default
		if (typeof(json.metadata_version) !== 'undefined') {
			if(meta_ver !== json.metadata_version) {
				alert("Could not load fullDataPath metadata");
				return;
			}
		}

		if(isEurexpress || isPyrTiff_origNames) {
			imageExtension = json.image_extension;
			if (typeof(json.file_root) !== 'undefined') {
				dataImgPaths = json.file_root;
				//console.log("dataImgPaths ",dataImgPaths);
			} else {
				alert("No images defined in JS file");
				return;
			}

			if (typeof(json.file_root.length) !== 'undefined' && json.file_root.length !== 0) {
				dst.max = json.file_root.length - 1;
			}
		}

		if(isEurexpress) {
			dataImageDir = "images/";
			if (typeof(json.imagepath) !== 'undefined') {
				dataImageDir = json.dataImageDir;
			}
			if (typeof(json.overlaypath) !== 'undefined') {
				hasOverlays = true;
				overlayPath = json.overlaypath;
				overlaySuffix = json.overlaysuffix;
			}
		}

		fullDepth = parseInt(json.fulldepth); // the number of sections in the stack

		var startSection
		var stopSection

		if (typeof(json.startSection) !== 'undefined') {
			startSection = parseInt(json.startSection); // the first section with an image
		} else {
			startSection = 0;
		}
		if (typeof(json.stopSection) !== 'undefined') {
			stopSection = parseInt(json.stopSection); // the last section with an image
		} else {
			stopSection = fullDepth - 1;
		}

		if(!arrayStartsFrom0) {
			startSection++;
			stopSection++;
		}

		if(startSection > stopSection) {
			var tmp = startSection;
			startSection = stopSection;
			stopSection = tmp;
		}

		dst.min = startSection;
		dst.max = stopSection;

		var layer = layerData[layerNames[0]];

		if (typeof(json.zsimgsrc) !== 'undefined' &&
				(typeof(json.zselwidth) !== 'undefined' && json.zselwidth !== 0) &&
				(typeof(json.zselheight) !== 'undefined' && json.zselheight !== 0) &&
				(typeof(json.zsliceorientation) !== 'undefined' && json.zsliceorientation !== 0)) {

			var assayPath = getAssayPath();
			zsel.fullname = layer.imageDir + assayPath + json.zsimgsrc;

			zsel.width = json.zselwidth;
			zsel.height = json.zselheight;
			zsel.border_tl = json.zseldragborderlefttop;
			zsel.border_br = json.zseldragborderrightbottom;
			zsel.orientation = json.zsliceorientation;
			//console.log("getStackMetadataCallback_1 zsel = ",zsel);
		}

		if (typeof(json.domain_mapping) !== 'undefined') {
			var ajaxParams = {
					url:json.domain_mapping,
					method:"POST",
					callback: function(response) {anatomyTerms = eval("("+response+")");},
					async:true
			}
			var ajax = new emouseatlas.emap.ajaxContentLoader();
			ajax.loadResponse(ajaxParams);
		}

		get2DMetadata();

		if(_debug) {
			console.log("exit getStackMetadataCallback_1 %s");
		}
	}; // getStackMetadataCallback_1

	//---------------------------------------------------------
	/**
	 * Requests all relevant data that is accessible via the IIP
	 * server (i.e. not data that is stored in json metadata files,
	 * which is requested by getStackMetadata() )
	 *
	 * @author Ruven Pillay/Tom Perry
	 */
	var getIIPMetadata = function() {

		if(_debug) {
			console.log("enter getIIPMetadata");
		}

		getObjects(["IIP", "IIP-server", "Tile-size"], getIIPMetadataCallback_1, true);

		if(_debug) {
			console.log("exit getIIPMetadata");
		}

	}; // getIIPMetadata

	//---------------------------------------------------------
	/**
	 *   Callback function for 'getIIPMetadata' for ["IIP", "IIP-server", "Tile-size"] objects.
	 */
	var getIIPMetadataCallback_1 = function () {

		if(_debug) {
			console.log("enter getIIPMetadataCallback_1");
		}

		if (isWlz) {
			// Need to get bounding box first so that we can
			// set our fixed point
			getObjects(["Wlz-3d-bounding-box"], getIIPMetadataCallback_2, true);
		} else {
			getObjects(["Max-size", "Resolution-number"], getIIPMetadataCallback_3, true);
		}

		if(_debug) {
			console.log("exit getIIPMetadataCallback_1");
		}
	};

	//---------------------------------------------------------
	/**
	 *   Callback function for 'getIIPMetadata' for ["Wlz-3d-bounding-box"] objects.
	 */
	var getIIPMetadataCallback_2 = function () {

		if(_debug) {
			console.log("enter getIIPMetadataCallback_2");
		}

		// initial status
		if (0 ===  threeDInfo.fxp.x &&
				0 ===  threeDInfo.fxp.y &&
				0 ===  threeDInfo.fxp.z) {
			if (expressionSectionName.length === undefined ||
					1 > expressionSectionName.length) {
				threeDInfo.fxp.x = Math.round(fullWlzObject.x.min + (fullWlzObject.x.max - fullWlzObject.x.min) / 2);
				threeDInfo.fxp.y = Math.round(fullWlzObject.y.min + (fullWlzObject.y.max - fullWlzObject.y.min) / 2);
				threeDInfo.fxp.z = Math.round(fullWlzObject.z.min + (fullWlzObject.z.max - fullWlzObject.z.min) / 2);
			} else {
				// if it has expression sections, use its first section as initial section
				setXValue(expressionSection[expressionSectionName[0]].x);
				setYValue(expressionSection[expressionSectionName[0]].y);
				setZValue(expressionSection[expressionSectionName[0]].z);
			}
		}

		threeDInfo.defaultFxp.x = threeDInfo.fxp.x;
		threeDInfo.defaultFxp.y = threeDInfo.fxp.y;
		threeDInfo.defaultFxp.z = threeDInfo.fxp.z;
		//console.log("getIIPMetadataCallback_2 threeDInfo.fxp ",threeDInfo.fxp);

		getObjects(["Max-size", "Wlz-distance-range"], getIIPMetadataCallback_3, true);

		if(_debug) {
			console.log("exit getIIPMetadataCallback_2");
		}
	};

	//---------------------------------------------------------
	/**
	 *   All 'getObjects()' calls end up here.
	 */
	var getIIPMetadataCallback_3 = function () {

		if(_debug) {
			console.log("enter getIIPMetadataCallback_3");
		}

		if(!modelInitialised) {

			// set up busyIndicator
			busyIndicator.initialise({targetId:viewerTargetId});
			updateBusyIndicator({isBusy:true, message:"loading"});

			if(numberOfTrees > 0) {
				loadTrees();
			} else {
				modelChanges.initial = true;
				modelChanges.layerNames = true;
				modelInitialised = true;
				//console.log("finished initialising model");
				if(_debug) {
					printPaths();
				}
				initView();
			}
		}

		if(_debug) {
			console.log("exit getIIPMetadataCallback_3");
		}
	};

	//---------------------------------------------------------
	/*
	 * Requests IIP objects from an IIP server.
	 *
	 * Object names are passed in an array, an Ajax request is sent
	 * to the server and corresponding values are passed to the
	 * callback function.
	 *
	 * A loading animation will be displayed if the request takes a
	 * while, because Woolz objects may need to be loaded from disk
	 * on the server.
	 *
	 * @author Tom Perry
	 *
	 * @param objs     An array of object names to load.
	 * @param callback The function into which the values
	 *                 corresponding to the requested objects
	 *                 should be fed.
	 * @param async    If true or undefined, the request will be
	 *                 asynchronous.  If false, the request will
	 *                 be synchronous (i.e. will block)
	 */
	var getObjects = function (objects, callback, async) {

		if(_debug) {
			console.log("enter getObjects ",objects);
		}

		var objs = objects;
		if (!objs[0]) {
			//console.log("getObjects: calling callback immediately");
			callback();
		}

		var url;
		var dst = (typeof(threeDInfo.dst.cur) === 'undefined') ? 0 : threeDInfo.dst.cur;

		if (isWlz) {
			var layer = layerData[layerNames[0]];
			url = webServer + iipServerPath + "?wlz=" +  layer.imageDir + layer.imageName
			+ "&mod=" + threeDInfo.wlzMode
			+ "&fxp=" + threeDInfo.fxp.x + ',' + threeDInfo.fxp.y + ','+ threeDInfo.fxp.z
			+ "&dst=" + dst
			+ "&pit=" + threeDInfo.pitch.cur
			+ "&yaw=" + threeDInfo.yaw.cur
			+ "&rol=" + threeDInfo.roll.cur;
		}

		if(isPyrTiff || isPyrTiff_origNames|| isEurexpress) {
			var fullname = getFullImgFilename(layerNames[0]);
			if(fullname === undefined) {
				//console.log("getObjects fullname ",fullname);
				return false;
			}
			url = webServer + iipServerPath + "?fif=" + fullname;
			//console.log("getObjects: url ",url);
		}

		for (var i = 0; i < objs.length; i++) {
			if (objs[i] == "Resolution-number" && isWlz) {
				alert("Error: Resolution-number IIP object not supported for Woolz objects.");
			}
			if (objs[i] == "Wlz-distance-range" && !isWlz) {
				alert("Error: Wlz-distance-range IIP object not supported for non-Woolz objects.");
			}

			url += "&obj=" + objs[i];

			// Hack for 'IIP' object
			if (objs[i] == "IIP") {
				url += ",1.0";
			}
			//console.log("getObjects: url %s",url);
		} // for

		if(_debug) {
			console.log("getObjects: url = ",url);
		}
		var ajaxParams = {
				url:url,
				method:"POST",
				callback: function (response) {
					getObjectsCallback(response, objs, callback);
				},
				contentType:"",
				urlParams:"",
				async:true,
				noCache:false
		}

		var ajax = new emouseatlas.emap.ajaxContentLoader();
		ajax.loadResponse(ajaxParams);

		if(_debug) {
			console.log("exit getObjects ");
		}

	}; // getObjects

	//---------------------------------------------------------
	var getObjectsCallback = function (response, objs, callback) {

		if(_debug) {
			console.log("enter getObjectsCallback ",objs,response);
		}

		// get model data via ajax
		//----------------
		response = util.trimString(response);
		if(response === null || response === undefined || response === "") {
			return false;
		}

		//console.log("getObjectsCallback response = ",response);

		var vals = [objs.length];
		vals[0] = response.split(objs[0]+":")[1];

		// Iteratively chop up the response
		for (var i = 0; i < objs.length-1; i++) {
			if (!vals[i]) {
				if (response.split("\r")[0] == "Error/7:1 3 FIF") {
					alert("Cannot load image data");
				} else if (response.split("\r")[0] == "Error/7:2 2 wlz") {
					alert("Cannot load Woolz data: unsupported by server.");
				} else {
					alert("Unexpected response from IIP server:\n"+response);
				}
				return;
			}
			vals[i+1] = vals[i].split(objs[i+1]+":")[1];
			vals[i] = vals[i].split(objs[i+1]+":")[0].split("\r")[0];
		}
		//console.log("vals ",vals);

		for (var i = 0; i < objs.length; i++) {
			//console.log("getObjectsCallback: i = ",i);
			switch(objs[i]) {
			case "Max-size":
				//console.log("getObjectsCallback Max-size");
				fullImgDims.width  = parseInt( vals[i].split(" ")[0] );
				fullImgDims.height = parseInt( vals[i].split(" ")[1] );
				//console.log("Max-size: now, width %d, height %d",fullImgDims.width,fullImgDims.height);
				break;
			case "Resolution-number":
				//console.log("getObjectsCallback Resolution-number");
				maxiipres = parseInt( vals[i] ) - 1;
				break;
			case "Wlz-distance-range":
				//console.log("getObjectsCallback Wlz-distance-range vals ",vals);
				threeDInfo.dst.min = Math.round( vals[i].split(" ")[0] );
				threeDInfo.dst.max = Math.round( vals[i].split(" ")[1] );
				if(threeDInfo.dst.cur === undefined) {
					threeDInfo.dst.cur = parseInt(threeDInfo.dst.min + (threeDInfo.dst.max - threeDInfo.dst.min)/2);
				}
				if (threeDInfo.dst.cur < threeDInfo.dst.min) {
					threeDInfo.dst.cur = threeDInfo.dst.min;
				}
				if (threeDInfo.dst.cur > threeDInfo.dst.max) {
					threeDInfo.dst.cur = threeDInfo.dst.max;
				}
				//console.log("threeDInfo.dst: now, ",threeDInfo.dst);
				break;
			case "Wlz-3d-bounding-box":
				//console.log("getObjectsCallback Wlz-3d-bounding-box");
				//console.log("i %d, vals[i] %s",i,vals[i]);
				fullWlzObject.z.min = parseInt( vals[i].split(" ")[0] );
				fullWlzObject.z.max = parseInt( vals[i].split(" ")[1] );
				fullWlzObject.y.min = parseInt( vals[i].split(" ")[2] );
				fullWlzObject.y.max = parseInt( vals[i].split(" ")[3] );
				fullWlzObject.x.min = parseInt( vals[i].split(" ")[4] );
				fullWlzObject.x.max = parseInt( vals[i].split(" ")[5] );
				//console.log("Wlz-3d-bounding-box ",fullWlzObject);
				break;
			case "Tile-size":
				//console.log("getObjectsCallback Tile-size");
				//console.log("i %d, vals[i] %s",i,vals[i]);
				tileSize.width  = parseInt( vals[i].split(" ")[0] );
				tileSize.height = parseInt( vals[i].split(" ")[1] );
				break;
			} // switch
		} // for

		if(callback) {
			callback();
		}

		if(_debug) {
			console.log("exit getObjectsCallback ",vals);
		}

	}; // getObjectsCallback

	// It might take a long time to load very big trees and we have to
	// make sure they are loaded before initialising tiledImageView.
	// Because this uses ajax we do it at the end of model initialisation.
	//---------------------------------------------------------
	var loadTrees = function () {

		var layer;
		var layerName;
		var len = layerNames.length;
		var i;

		for(i=0; i<len; i++) {
			layerName = layerNames[i];
			layer = layerData[layerName];
			//console.log("loadTrees: layer ",layer);
			if(layer.treeStructure !== undefined) {
				// treeData is loaded from loadTreeStructureCallback
				loadTreeStructure(layerName);
			}
		}

	}

	//---------------------------------------------------------
	var initView = function () {
		emouseatlas.emap.tiledImageView.initialise(emouseatlas.emap.tiledImageModel);
	}

	//---------------------------------------------------------
	/**
	 *   Informs registered observers of a change to the model.
	 */
	var notify = function () {

		//console.log("registry.length = %d",registry.length);

		//printModelChanges();

		for (var i = 0; i < registry.length; i++) {
			//console.log("notify: registry[%s] = %s",i,registry[i]);
			registry[i].modelUpdate(modelChanges);
		}
		resetModelChanges();
	}; // notify

	//---------------------------------------------------------
	/**
	 *   Prints the state of observable changes to the model.
	 */
	var printModelChanges = function() {
		if(modelChanges.initial) console.log("modelChanges.initial ",modelChanges.initial);
		if(modelChanges.layerNames) console.log("modelChanges.layerNames ",modelChanges.layerNames);
		if(modelChanges.rotation) console.log("modelChanges.rotation ",modelChanges.rotation);
		if(modelChanges.dst) console.log("modelChanges.dst ",modelChanges.dst);
		if(modelChanges.distanceRange) console.log("modelChanges.distanceRange ",modelChanges.distanceRange);
		if(modelChanges.fxp) console.log("modelChanges.fxp ",modelChanges.fxp);
	};

	//---------------------------------------------------------
	/**
	 *   Resets the list of observable changes to the model.
	 */
	var resetModelChanges = function() {
		modelChanges.initial =  false;
		modelChanges.initialState =  false;
		modelChanges.layerNames =  false;
		modelChanges.rotation =  false;
		modelChanges.dst =  false;
		modelChanges.distanceRange =  false;
		modelChanges.boundingBox =  false;
		modelChanges.fxp =  false;
	};

	//---------------------------------------------------------
	/**
	 * Converts a Woolz scale value to an IIP JTL resolution level
	 *
	 * @author Tom Perry
	 *
	 * @param floor If true, the integer part of the resulting
	 * resolution value will be returned.  Otherwise, it will be
	 * rounded to the nearest integer.
	 */
	var scl2res = function(scl, floor) {
		var tmp = maxiipres + Math.log(scl) / Math.log(2);
		if (floor) {
			return Math.floor(tmp);
		} else {
			return Math.round(tmp);
		}
	};

	//---------------------------------------------------------
	/**
	 * Converts an IIP JTL resolution level to a Woolz scale value
	 *
	 * @author Tom Perry
	 */
	var res2scl = function(res) {
		return Math.pow(2,res - maxiipres);
	};

	//---------------------------------------------------------
	/**
	 *  works out where the pyramidal tiff images are.
	 *
	 */
	var getAssayPath = function() {

		var path = "";

		if(isEurexpress) {
			var assaynum = assayID.substring(assayID.lastIndexOf("_")+1);
			//console.log("getEurexpressAssayPath: assaynum %s",assaynum);
			var dirnum = parseInt(assaynum / 100);  // we want mod only
			path = dirnum + '/' + assayID + '/';
			//console.log("getEurexpressAssayPath %s",path);
		}

		//console.log("getAssayPath ",path);
		return path;

	};

	//---------------------------------------------------------
	var printPaths = function() {
		if(typeof(iipServerPath) !== 'undefined') {
			console.log("iipServerPath: %s", iipServerPath);
		}
		if(typeof(webServer) !== 'undefined') {
			console.log("webServer: %s", webServer);
		}
		if(typeof(metadataRoot) !== 'undefined') {
			console.log("metadataRoot: %s", metadataRoot);
		}
		if(typeof(fullDataPath) !== 'undefined') {
			console.log("fullDataPath: %s", fullDataPath);
		}
		if(typeof(interfaceImageDir) !== 'undefined') {
			console.log("interfaceImageDir: %s", interfaceImageDir);
		}
		if(typeof(layerData) !== 'undefined') {
			var num = layerNames.length;
			var i;
			for(i=0; i<num; i++) {
				console.log("layer %s (%s)",i,layerNames[i]);
			}
		}
		if(typeof(zsel) !== 'undefined') {
			console.log("zsel %s",zsel.fullname);
		}
	};

	//---------------------------------------------------------
	var setXValue = function(newX)  {
		if (newX !== undefined &&
				threeDInfo.fxp.x !== newX) {
			threeDInfo.fxp.x = 1 * newX; 
			return 1;
		}
		return 0;
	};

	//---------------------------------------------------------
	var setYValue = function(newY)  {
		if (newY !== undefined &&
				threeDInfo.fxp.y !== newY) {
			threeDInfo.fxp.y = 1 * newY; 
			return 1;
		}
		return 0;
	};

	//---------------------------------------------------------
	var setZValue = function(newZ)  {
		if (newZ !== undefined &&
				threeDInfo.fxp.z !== newZ) {
			threeDInfo.fxp.z = 1 * newZ; 
			return 1;
		}
		return 0;
	};

	//---------------------------------------------------------
	var setPitchValue = function(newPitch)  {
		if (newPitch !== undefined &&
				threeDInfo.pitch.cur !== newPitch) {
			var val = 1* newPitch;
			if  (val > threeDInfo.pitch.max)
				threeDInfo.pitch.cur = threeDInfo.pitch.max;
			else {
				if (val < threeDInfo.pitch.min)
					threeDInfo.pitch.cur = threeDInfo.pitch.min;
				else
					threeDInfo.pitch.cur = val;
			}
			return 1;
		}
		return 0;
	};

	//---------------------------------------------------------
	var setYawValue = function(newYaw)  {
		if (newYaw !== undefined &&
				threeDInfo.yaw.cur !== newYaw) {
			var val = 1* newYaw;
			if  (val > threeDInfo.yaw.max)
				threeDInfo.yaw.cur = threeDInfo.yaw.max;
			else {
				if (val < threeDInfo.yaw.min)
					threeDInfo.yaw.cur = threeDInfo.yaw.min;
				else
					threeDInfo.yaw.cur = val;
			}
			return 1;
		}
		return 0;
	};

	//---------------------------------------------------------
	var setRollValue = function(newRoll)  {
		if (newRoll !== undefined &&
				threeDInfo.roll.cur !== newRoll) {
			var val = 1* newRoll;
			if  (val > threeDInfo.roll.max)
				threeDInfo.roll.cur = threeDInfo.roll.max;
			else {
				if (val < threeDInfo.roll.min)
					threeDInfo.roll.cur = threeDInfo.roll.min;
				else
					threeDInfo.roll.cur = val;
			}
			return 1;
		}
		return 0;
	};

	//---------------------------------------------------------
	var setDstValue = function(newDst)  {
		//console.log("setDstValue ",newDst);
		if (newDst !== undefined &&
				threeDInfo.dst.cur !== newDst) {
			var valf = Math.floor(1 * newDst);
			if (valf > threeDInfo.dst.max)
				threeDInfo.dst.cur = threeDInfo.dst.max;
			else {
				if (valf < threeDInfo.dst.min)
					threeDInfo.dst.cur = threeDInfo.dst.min;
				else
					threeDInfo.dst.cur = valf;
			}
			return 1;
		}
		return 0;
	};

	//---------------------------------------------------------
	//   public methods
	//---------------------------------------------------------

	var initialise = function (params) {
		if(_debug) {
			console.log("enter model.initialise");
		}

		// if url has dynamic information, process such information
		var name;
		if (params.greyImg !== undefined)
			greyImg = params.greyImg;
		if (params.expressionImg !== undefined)
			expressionImg = params.expressionImg;
		if (params.expressionSection !== undefined) {
			// params.expressionSection is like (name, x, y, z, theta, phi, dst);(name, x, y, z, theta, phi, dst) ...
			var token = params.expressionSection.split(";");
			var x, y, z, theta, phi, dst;
			var index = 0;
			var item, j, worker;

			for (var i = 0; i < token.length; i++) {
				j = token[i].indexOf("(");
				if (-1 != j) {
					item = token[i].substring(j + 1);
					token[i] = item;
				}
				j = token[i].indexOf(")");
				if (-1 != j) {
					item = token[i].substring(0, j);
					token[i] = item;
				}
				item = token[i].split(",");
				if (7 != item.length)
					continue;
				name = item[0].trim();
				if (name == "")
					name = "section"+i;
				x = parseFloat(item[1].trim());
				if (x === undefined)
					continue;
				y = parseFloat(item[2].trim());
				if (y === undefined)
					continue;
				z = parseFloat(item[3].trim());
				if (z === undefined)
					continue;
				theta = parseFloat(item[4].trim());
				if (theta === undefined)
					continue;
				phi = parseFloat(item[5].trim());
				if (phi === undefined)
					continue;
				dst = parseFloat(item[6].trim());
				if (dst === undefined)
					continue;

				expressionSectionName[index] = name;
				expressionSection[name] = {x:x, y:y, z:z, theta:theta, phi:phi, dst:dst};

				index++;
			}
		}
		if (_debug) {
			console.log("greyImg = "+greyImg+" expressionImg = "+expressionImg+" number of sections = "+expressionSectionName.length);
			if (0 < expressionSectionName.length) {
				for (var k = 0; k < expressionSectionName.length; k++) {
					name = expressionSectionName[k];
					console.log("name = "+name+" x = "+expressionSection[name].x+"  y = "+expressionSection[name].y+"  z = "+expressionSection[name].z+"  theta = "+expressionSection[name].theta+"  phi = "+expressionSection[name].phi+"  dst = "+expressionSection[name].dst);
				}
			}
		}

		// if urlSpecifiedSection is defined in url string it will override initialState.distance from tiledImageModelData.jso.
		if(params.urlSpecifiedSection !== undefined) {
			if(params.urlSpecifiedSection.length === 0) {
				urlSpecifiedSection = undefined;
			} else {
				// we must convert the string to an integer or sections 09, 08 won't load ???
				urlSpecifiedSection = 1 * params.urlSpecifiedSection;
				//console.log("urlSpecifiedSection ",urlSpecifiedSection);
			}
		}

		if(typeof(params.assayID) !== 'undefined') {
			if(isEurexpress) {
				assayID = (typeof(params.assay) === 'undefined') ? "euxassay_000001" : params.assay;
			}
		}

		initModel(params.modelDataUrl);

		if(_debug) {
			console.log("exit model.initialise");
		}
	};

	//---------------------------------------------------------
	var register = function (observer) {
		//console.log("model: register observer ",observer);
		registry.push(observer);
	};

	//---------------------------------------------------------
	// getters and setters
	//---------------------------------------------------------
	//---------------------------------------------------------
	var getDataImageDir = function () {
		return dataImageDir;
	};

	//---------------------------------------------------------
	var getInterfaceImageDir = function () {
		return interfaceImageDir;
	};

	//---------------------------------------------------------
	var getLayerNames = function () {
		return layerNames;
	};

	//---------------------------------------------------------
	var getLayerData = function () {
		//console.log("model getLayerData ",layerData);
		return layerData;
	};

	//---------------------------------------------------------
	var getIndexData = function (layerName) {
		//console.log("model getIndexData ",layerName);
		var indexData = {};
		var layer = layerData[layerName];
		if(layer === undefined) {
			return undefined;
		}
		var treeData = layer.treeData;
		var node;
		var domainData;
		var len;
		var nodeId;
		var domainId;
		var colour = [];
		var selected = false;

		if(typeof(treeData) === 'undefined') {
			//console.log("model getIndexData treeData ",treeData);
			return undefined;
		}
		//console.log("model getIndexData treeData ",treeData);
		len = treeData.length;
		for(i=0; i<len; i++) {
			node = treeData[i];
			nodeId = node.nodeId;
			name = node.name;
			domainId = node.domainData.domainId;
			if(domainId === undefined) {
				//console.log("ignoring ",name);
				continue;
			}
			colour = node.domainData.domainColour;
			selected = node.domainData.domainSelected;
			if(indexData[domainId] === undefined) {
				indexData[domainId] = {domainId:domainId, name:name, colour:colour, nodeId:nodeId, selected:selected};
			}
			domainId = undefined;
		}

		return indexData;
	};

	//---------------------------------------------------------
	var getZSelectorInfo = function () {
		//console.log("getZSelectorInfo ",zsel);
		return zsel;
	};

	//---------------------------------------------------------
	var getWebServer = function () {
		return webServer;
	};

	//---------------------------------------------------------
	var getMetadataRoot = function () {
		return metadataRoot;
	};

	//---------------------------------------------------------
	var getIIPServer = function () {
		return webServer + iipServerPath;
	};
	//---------------------------------------------------------
	var getImgQuality = function () {
		return qlt;
	};

	//---------------------------------------------------------
	var setInitialOrientation = function () {
		//console.log("enter model.setInitialOrientation");
		if(!isWlz) {
			setInitialOrientationCallback();
			return false;
		}
		if(initialState.pitch !== undefined) {
			setPitchValue(initialState.pitch);
		}
		if(initialState.yaw !== undefined) {
			setYawValue(initialState.yaw);
		}
		if(initialState.roll !== undefined) {
			setRollValue(initialState.roll);
		}
		getObjects(["Max-size", "Wlz-distance-range"],setInitialOrientationCallback,true);
		//console.log("exit model.setInitialOrientation");
	};
	//---------------------------------------------------------
	var setInitialOrientationCallback = function () {
		//console.log("enter model.setInitialOrientationCallback");
		resetModelChanges();
		modelChanges.initialState = true;
		notify();
		//console.log("exit model.setInitialOrientationCallback");
	};

	//---------------------------------------------------------
	var setOrientation = function (newPitch, newYaw, newRoll) {
		var ret1 = setPitchValue(newPitch);
		var ret2 = setYawValue(newYaw);
		var ret3 = setRollValue(newRoll);

		if (ret1 || ret2 || ret3)
			getObjects(["Max-size", "Wlz-distance-range"],setOrientationCallback,true);
	};
	//---------------------------------------------------------
	var setOrientationCallback = function () {
		//console.log("setOrientationCallback");
		resetModelChanges();
		modelChanges.rotation = true;
		modelChanges.locator = true;
		modelChanges.distanceRange = true;
		notify();
	};

	//---------------------------------------------------------
	var modifyOrientation = function (newPitch, newYaw, newRoll) {
		//console.log("modifyOrientation");
		var ret1 = setPitchValue(newPitch);
		var ret2 = setYawValue(newYaw);
		var ret3 = setRollValue(newRoll);

		if (ret1 || ret2 || ret3)
			getObjects(["Max-size", "Wlz-distance-range"],modifyOrientationCallback,true);
	};

	//---------------------------------------------------------
	var modifyOrientationCallback = function () {
		//console.log("modifyOrientationCallback");
		resetModelChanges();
		modelChanges.locator = true;
		modelChanges.distanceRange = true;
		notify();
	};

	//---------------------------------------------------------
	var getViewAngles = function () {
		var ret = ({transverse: {pitch:transverseView.pitch, yaw:transverseView.yaw, roll:transverseView.roll},
			sagittal: {pitch:sagittalView.pitch, yaw:sagittalView.yaw, roll:sagittalView.roll},
			coronal: {pitch:coronalView.pitch, yaw:coronalView.yaw, roll:coronalView.roll}});

		//console.log("getViewAngles ",ret);
		return ret;
	};

	//---------------------------------------------------------
	// When the fixed point is changed, the distance value must be set to 0.
	// If it is set back to the default fixed point, the actual distance will change
	// and the image must be updated.
	//---------------------------------------------------------
	var setFixedPoint = function (val) {
		if(isWlz) {
			var x = Math.round(val.x);
			var y = Math.round(val.y);
			var z = Math.round(val.z);
			//console.log("setFixedPoint %d, %d, %d",x,y,z);
			var ret1 = setXValue(x);
			var ret2 = setYValue(y);
			var ret3 = setZValue(z);
			// fixed point change will affect distance range
			if (ret1||ret2||ret3) {
				modelChanges.distanceRange = true;
			}
			var A = threeDInfo.defaultFxp;
			if(A.x === x && A.y === y && A.z === z) {
				setDistance(0);
			} else {
				setDstValue(0);
			}
		} else {
			return false;
		}
		modelChanges.fxp = true;
		getObjects(["Max-size", "Wlz-distance-range"],setFixedPointCallback,true);
	};

	//---------------------------------------------------------
	var setFixedPointCallback = function () {
		//console.log("setFixedPointCallback");
		resetModelChanges();
		modelChanges.distanceRange = true;
		notify();
	};

	//---------------------------------------------------------
	var setInitialDistance = function () {
		//console.log("setInitialDistance (wlz) max %d, min %d, cur %d",threeDInfo.dst.max,threeDInfo.dst.min,threeDInfo.dst.cur);
		var val = initialState.distance;
		if(isWlz) {
			setDstValue(val);
			getObjArr = ["Max-size"];
		} else {
			dst.cur = (val > dst.max) ? dst.max : val;
			dst.cur = (val < dst.min) ? dst.min : val;
			getObjArr = ["Max-size", "Resolution-number"];
		}
		getObjects(getObjArr, setInitialDistanceCallback, true);
		//console.log("exit model.setInitialDistance");
	};

	//---------------------------------------------------------
	var setInitialDistanceCallback = function () {
		//console.log("enter model.setInitialDistanceCallback");
		setInitialOrientation();
		//console.log("exit model.setInitialDistanceCallback");
	};

	//---------------------------------------------------------
	// called when distance is changed using arrow buttons
	// and on mouseup after dragging slider
	//---------------------------------------------------------
	var setDistance = function (val) {
		//console.log("setDistance");
		var getObjArr = [];
		if(isWlz) {
			setDstValue(val);
			getObjArr = ["Max-size"];
		} else {
			var valf = Math.floor(val);
			dst.cur = (valf >= dst.max) ? dst.max : valf;
			dst.cur = (dst.cur <= dst.min) ? dst.min : dst.cur;
			getObjArr = ["Max-size", "Resolution-number"];
		}
		getObjects(getObjArr, setDistanceCallback, true);
	};

	//---------------------------------------------------------
	var setDistanceCallback = function () {
		//console.log("setDistanceCallback");
		resetModelChanges();
		modelChanges.locator = true;
		modelChanges.dst = true;
		notify();
	};

	//---------------------------------------------------------
	// called when distance is changed by dragging the slider
	// or clicking on the slider bar
	//---------------------------------------------------------
	var modifyDistance = function (val) {
		//console.log("modifyDistance");
		var getObjArr = [];
		if(isWlz) {
			setDstValue(val);
			getObjArr = ["Max-size"];
		} else {
			var valf = Math.floor(val);
			dst.cur = (valf >= dst.max) ? dst.max : valf;
			dst.cur = (dst.cur <= dst.min) ? dst.min : dst.cur;
			getObjArr = ["Max-size", "Resolution-number"];
		}
		getObjects(getObjArr, modifyDistanceCallback, true);
	};

	//---------------------------------------------------------
	var modifyDistanceCallback = function () {
		//console.log("modifyDistanceCallback");
		resetModelChanges();
		modelChanges.locator = true;
		notify();
	};

	//---------------------------------------------------------
	var setSection = function(newX, newY, newZ, newPitch, newYaw, newRoll, newDst) {
		var ret1 = setXValue(newX);
		var ret2 = setYValue(newY);
		var ret3 = setZValue(newZ);
		var ret4 = setPitchValue(newPitch);
		var ret5 = setYawValue(newYaw);
		var ret6 = setRollValue(newRoll);
		var ret7 = setDstValue(newDst);

		if (ret1||ret2||ret3||ret4||ret5||ret6||ret7);
		getObjects(["Max-size", "Wlz-distance-range"],setSectionCallback,true);
	};

	//---------------------------------------------------------
	var setSectionCallback = function () {
		resetModelChanges();
		modelChanges.fxp = true;
		modelChanges.dst = true;
		modelChanges.distanceRange = true;
		modelChanges.rotation = true;
		modelChanges.locator = true;
		notify();
	};

	//---------------------------------------------------------
	var getDistance = function () {
		if(isWlz) {
			return threeDInfo.dst;
		} else {
			return dst;
		}
	};

	//---------------------------------------------------------
	var getScaleMaxMin = function () {
		return scale;
	};

	//---------------------------------------------------------
	var getFullDepth = function () {
		return fullDepth;
	};

	//---------------------------------------------------------
	var getRegionOfInterest = function () {
		return roi;
	};

	//---------------------------------------------------------
	var getMaxIIPResolution = function () {
		return maxiipres;
	};
	//---------------------------------------------------------
	var getTileSize = function () {
		return tileSize;
	};
	//---------------------------------------------------------
	var getFullImgDims = function () {
		return fullImgDims;
	};

	//---------------------------------------------------------
	var setBoundingBox = function () {
		getObjects(["Wlz-3d-bounding-box"], setBoundingBoxCallback, true);
	};
	//---------------------------------------------------------
	var setBoundingBoxCallback = function () {
		resetModelChanges();
		modelChanges.boundingBox = true;
		notify();
	};
	//---------------------------------------------------------
	var getBoundingBox = function () {
		return fullWlzObject;
	};

	//---------------------------------------------------------
	// this is for pyramidal tiff stacks (eg Eurexpress)
	//---------------------------------------------------------
	var getFullImgFilename = function (layername) {

		if(_debug) {
			console.log("enter getFullImgFilename for '%s' layer",layername);
		}

		var imgFilename;
		var fullImgFilename;
		var layer = layerData[layername];

		if(typeof(dst.cur) === 'undefined') {
			var cur = (typeof(initialState.distance) !== 'undefined') ? initialState.distance : dst.min;
			dst = {max:dst.max, min:dst.min, cur:cur};
		}

		if(isEurexpress) {
			var assayPath = getAssayPath();
			imgFilename = dataImgPaths[Math.round(dst.cur - 1)];
			fullImgFilename = layer.imageDir + assayPath + dataImageDir + imgFilename + imageExtension;
		} else if(isPyrTiff) {
			imgFilename = layer.imageName;
			var slice = "section" + dst.cur + "/";
			fullImgFilename = layer.imageDir + slice + imgFilename;
		} else if(isPyrTiff_origNames) {
			var indx = Math.round(dst.cur);
			imgFilename = dataImgPaths[indx];
			if(imgFilename === undefined) {
				fullImgFilename = undefined;
				return undefined;
			}

			fullImgFilename = layer.imageDir + imgFilename + imageExtension;
		}

		if(_debug) {
			console.log("exit getFullImgFilename %s",fullImgFilename);
		}
		return fullImgFilename;
	};

	//---------------------------------------------------------
	var isWlzData = function() {
		return isWlz;
	};
	//---------------------------------------------------------
	var isPyrTiffData = function() {
		return isPyrTiff;
	};
	//---------------------------------------------------------
	var isEurexpressData = function() {
		return isEurexpress;
	};

	//---------------------------------------------------------
	var getViewerTargetId = function() {
		//console.log("model.getViewerTargetId:");
		return viewerTargetId;;
	};

	//---------------------------------------------------------
	var getTools = function() {
		//console.log("model.getTools:");
		return tools;;
	};

	//---------------------------------------------------------
	var getThreeDInfo = function() {
		//console.log("model.getThreeDInfo: ",threeDInfo);
		return threeDInfo;;
	};

	//---------------------------------------------------------
	var getFullExpressionLevelKeyName = function () {
		return interfaceImageDir + expressionLevelKey;
	};

	//---------------------------------------------------------
	var updateBusyIndicator = function (data) {
		busyIndicator.update(data);
	};

	//---------------------------------------------------------
	var getInfoDetails = function () {
		return infoDetails;
	};

	//---------------------------------------------------------
	var getToolsMetadataUrl = function () {
		return webServer + metadataRoot + toolsMetadataFilename;
	};

	//---------------------------------------------------------
	var getStackMetadataUrl = function () {
		return webServer + metadataRoot + stackMetadataFilename;
	};

	//---------------------------------------------------------
	var isArrayStartsFrom0 = function () {
		return arrayStartsFrom0;
	};

	//---------------------------------------------------------
	// Don't call it the same name as the boolean
	var modelReady = function () {
		return modelInitialised;
	};

	//---------------------------------------------------------
	// Get the json object that describes a tree
	var getTreeData = function (layerName) {

		var TreeJSON = {};
		TreeJSON.json = [];
		var layer;
		var name;
		var structure;
		var structureNode;
		var treeNode;
		var numLayers = layerNames.length;
		var i;

		layer = layerData[layerName];
		structure = layer.treeStructure;
		data = layer.treeData;

		for(var node in structure) {
			if(typeof(structure[node]) === 'undefined') {
				return undefined;
			} else {
				structureNode = structure[node];
			}
			treeNode = Mif.Tree.NodeData.getTreeNodeData(layerName, structureNode, layerData);
			TreeJSON.json[TreeJSON.json.length] = treeNode;
		}

		return TreeJSON.json;
	};

	//---------------------------------------------------------
	// Get the tree associated with a layer
	var getTree = function (layerName) {
		//console.log("getTree for ",layerName);
		layer = layerData[layerName];
		return layer.tree;
	};

	//---------------------------------------------------------
	// Set the tree associated with a layer
	var setTree = function (layerName, tree) {
		layer = layerData[layerName];
		layer.tree = tree;
	};

	//---------------------------------------------------------
	// Get the first layer that has a tree associated with it
	var getFirstTreeLayer = function () {

		var layer;
		var numLayers = layerNames.length;
		var found = false;
		var i;

		for(i=0; i<numLayers; i++) {
			layer = layerData[layerNames[i]];
			if(layer.treeStructure === undefined || layer.treeData === undefined) {
				continue;
			} else {
				found = true;
				break;
			}
		}

		if(found) {
			return layer.layerName;
		} else {
			return undefined;
		}
	};

	//---------------------------------------------------------
	// Get the initial currentLayer. Defaults to first layer.
	var getInitialCurrentLayer = function () {
		if(initialCurrentLayer === undefined) {
			//return layerNames.length[0];
			return layerNames[0];
		} else {
			return initialCurrentLayer;
		}
	};

	//---------------------------------------------------------
	// Get the initial viewer state.
	var getInitialState = function () {
		return initialState;
	};

	//---------------------------------------------------------
	// Set the initial viewer state.
	// (control passes to callback functions)
	var setInitialState = function () {
		setInitialDistance();
		return false;
	};

	//---------------------------------------------------------
	// Get the pixel resolution for the image.
	var getPixelResolution = function () {
		return pixelResolution;
	};

	//---------------------------------------------------------
	// sectionOrderReversed affects the equivalent section calculation.
	var getSectionOrderReversed = function () {
		return sectionOrderReversed;
	};

	//---------------------------------------------------------
	// Get the title for the image.
	var getImageTitle = function () {
		return imageTitle;
	};

	//---------------------------------------------------------
	// Get the title tooltip for the image.
	var getImageTitleTooltip = function () {
		return imageTitleTooltip;
	};

	//---------------------------------------------------------
	// True if Layer tool can spawn properties tool
	var hasPropertiesTool = function () {
		return hasProperties;
	};

	//---------------------------------------------------------
	// True if any Layer is of type 'label'
	var hasLabels = function () {
		return layerHasLabels;
	};

	//---------------------------------------------------------
	// Get the structure and content urls.
	var getMenuData = function () {
		return ({structureUrl:menuStructureUrl, contentUrl:menuContentUrl});
	};

	var getExpressionSection=function() {
		return expressionSection;
	};
	var getExpressionSectionName=function() {
		return expressionSectionName;
	};

	//---------------------------------------------------------
	// expose 'public' properties
	//---------------------------------------------------------
	// don't leave a trailing ',' after the last member or IE won't work.
	return {
		initialise: initialise,
		modelReady: modelReady,
		register: register,
		setSectionCallback:setSectionCallback,
		getWebServer: getWebServer,
		getMetadataRoot: getMetadataRoot,
		getIIPServer: getIIPServer,
		getDataImageDir: getDataImageDir,
		getInterfaceImageDir: getInterfaceImageDir,
		getZSelectorInfo: getZSelectorInfo,
		getFullDepth: getFullDepth,
		getLayerNames: getLayerNames,
		getLayerData: getLayerData,
		getIndexData: getIndexData,
		getFullImgDims: getFullImgDims,
		setBoundingBox: setBoundingBox,
		getBoundingBox: getBoundingBox,
		getExpressionSection: getExpressionSection,
		setSection: setSection,
		getExpressionSectionName: getExpressionSectionName,
		getFullImgFilename: getFullImgFilename,
		getFullExpressionLevelKeyName: getFullExpressionLevelKeyName,
		getToolsMetadataUrl: getToolsMetadataUrl,
		updateBusyIndicator: updateBusyIndicator,
		getInfoDetails: getInfoDetails,
		getImgQuality: getImgQuality,
		isWlzData: isWlzData,
		isPyrTiffData: isPyrTiffData,
		isEurexpressData: isEurexpressData,
		hasPropertiesTool: hasPropertiesTool,
		hasLabels: hasLabels,
		getViewerTargetId: getViewerTargetId,
		getTools: getTools,
		getThreeDInfo: getThreeDInfo,
		getDistance: getDistance, // for convenience when you don't need all the 3D stuff
		setDistance: setDistance,
		modifyDistance: modifyDistance,
		setFixedPoint: setFixedPoint,
		setOrientation: setOrientation,
		modifyOrientation: modifyOrientation,
		getViewAngles: getViewAngles,
		getScaleMaxMin: getScaleMaxMin,
		getRegionOfInterest: getRegionOfInterest,
		getMaxIIPResolution: getMaxIIPResolution,
		getTileSize: getTileSize,
		isArrayStartsFrom0: isArrayStartsFrom0,
		getFirstTreeLayer: getFirstTreeLayer,
		getInitialCurrentLayer: getInitialCurrentLayer,
		getInitialState: getInitialState,
		setInitialState: setInitialState,
		getPixelResolution: getPixelResolution,
		getSectionOrderReversed: getSectionOrderReversed,
		getImageTitle: getImageTitle,
		getImageTitleTooltip: getImageTitleTooltip,
		getTree: getTree,
		setTree: setTree,
		getMenuData: getMenuData,
		getTreeData: getTreeData
	};

}(); // end of module tiledImageModel
