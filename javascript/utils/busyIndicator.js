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
//busyIndicator.js
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
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
//module for tiledImage
//encapsulating it in a module to preserve namespace
//---------------------------------------------------------
emouseatlas.emap.busyIndicator = function() {

	//---------------------------------------------------------
	// modules
	//---------------------------------------------------------
	var util = emouseatlas.emap.utilities;

	// private members
	var isBusy = false;
	var isReady = false;
	var busyIndicatorContainer;
	var busyIndicatorImageDiv;
	var busyIndicatorImage;
	var busyIndicatorMessageDiv;
	var busyIndicatorMessage;
	var targetId;

	//---------------------------------------------------------
	//   private methods
	//---------------------------------------------------------

	//---------------------------------------------------------
	var buildBusyIndicator  = function () {

		if(document.getElementById("busyIndicatorContainer")) {
			busyIndicatorContainer = document.getElementById("busyIndicatorContainer");
		} else {
			busyIndicatorContainer = document.createElement("div");
			busyIndicatorContainer.id = "busyIndicatorContainer";
		}

		busyIndicatorImageDiv = document.createElement("div");
		busyIndicatorImageDiv.id = "busyIndicatorImageDiv";

		busyIndicatorMessageDiv = document.createElement("div");
		busyIndicatorMessageDiv.id = "busyIndicatorMessageDiv";

		busyIndicatorMessage = document.createTextNode("I'm busy");

		busyIndicatorMessageDiv.appendChild(busyIndicatorMessage);

		busyIndicatorContainer.appendChild(busyIndicatorImageDiv);
		busyIndicatorContainer.appendChild(busyIndicatorMessageDiv);


		if(document.getElementById(targetId)) {
			var targetContainer = document.getElementById(targetId);
			targetContainer.appendChild(busyIndicatorContainer);
		}

		// set up the event handlers

	}; // buildBusyIndicator

	//---------------------------------------------------------
	var show = function (params) {
		//console.log("enter show");
		if(document.getElementById("busyIndicatorContainer")) {
			var container = document.getElementById("busyIndicatorContainer");
			container.style.visibility = "visible";
		}
		//console.log("exit show");
	};

	//---------------------------------------------------------
	var hide = function (layer) {
		//console.log("enter hide");
		if(document.getElementById("busyIndicatorContainer")) {
			var container = document.getElementById("busyIndicatorContainer");
			container.style.visibility = "hidden";
		}
		//console.log("exit hide");
	};

	//---------------------------------------------------------
	var setBusyMessage = function (txt) {
		//console.log("enter setBusyMessage");
		if(document.getElementById("busyIndicatorMessageDiv")) {
			var message = document.getElementById("busyIndicatorMessageDiv");
			message.innerHTML = txt;
		}
		//console.log("exit setBusyMessage");
	};

	//---------------------------------------------------------
	var setImageSrc  = function (src) {
		//console.log(src);
		busyIndicatorImage.src = src;
	};

	//---------------------------------------------------------
	var setDims  = function (params) {
		var w = (params.w === undefined) ? "130px" : params.w + "px";
		var h = (params.h === undefined) ? "30px" : params.h + "px";
		busyIndicatorContainer.style.width = w;
		busyIndicatorContainer.style.height = h;
	};

	//---------------------------------------------------------
	var setPosition  = function (params) {
		var left = (params.left === undefined) ? "300px" : params.left + "px";
		var top = (params.top === undefined) ? "300px" : params.top + "px";
		busyIndicatorContainer.style.left = left;
		busyIndicatorContainer.style.top = top;
	};

	//---------------------------------------------------------
	// event handlers
	//---------------------------------------------------------

	//---------------------------------------------------------
	//   public methods
	//---------------------------------------------------------

	var initialise = function (data) {
		targetId = data.targetId;
		buildBusyIndicator();
		isReady = true;
	};

	//---------------------------------------------------------
	var isInitialised = function () {
		return isReady;
	};

	//---------------------------------------------------------
	var update = function (params) {
		//console.log("enter busyIndicator.update ",params);

		if(!isBusy && params.isBusy) {
			isBusy = true;
			setBusyMessage(params.message);
			show({x:params.x, y:params.y});
		}
		if(isBusy && !params.isBusy) {
			isBusy = false;
			hide();
		}
		//console.log("exit update");
	};

	//---------------------------------------------------------
	// expose 'public' properties
	//---------------------------------------------------------
	// don't leave a trailing ',' after the last member or IE won't work.
	return {
		initialise: initialise,
//		setImageSrc: setImageSrc,
//		setDims: setDims,
//		setPosition: setPosition,
		update: update,
		isInitialised: isInitialised
	};

}(); // end of module busyIndicator
//----------------------------------------------------------------------------
