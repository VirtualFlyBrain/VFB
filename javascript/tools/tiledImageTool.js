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
var tiledImageTool = new Class ({

	initialize: function(params) {

		//console.log("enter %s initialize",this.name);
		this.model = params.model;
		this.view = params.view;

		this.model.register(this);
		this.view.register(this);

		this.maxWidth = params.toolParams.width;
		this.maxHeight = params.toolParams.height;

		// we are reading in the params from a json file so they will be strings.
		this.width = parseInt(params.toolParams.width);
		this.height = parseInt(params.toolParams.height);

		//this.isHorizontal = (typeof(params.params.isHorizontal) === 'undefined') ? true : params.params.isHorizontal;
		this.isHorizontal = (params.isHorizontal === undefined) ? true : params.isHorizontal;
		this.isHorizontal = (this.isHorizontal === "true") ? true : this.isHorizontal;
		this.isHorizontal = (this.isHorizontal === "false") ? false : this.isHorizontal;

		this.shortName = this.name.toLowerCase().split(" ").join("");

		this.targetId = params.toolParams.targetId;

		this.drag = params.toolParams.drag;
		this.transparent = params.toolParams.transparent;

		var imagePath = this.model.getInterfaceImageDir();

		this.window = new DraggableWindow({
			toolParams:params.toolParams,
			view:this.view,
			imagePath: imagePath,
			initiator:this,
			title:this.shortName
		});
		this.window.setDimensions(this.width, this.height);
		this.window.setPosition(params.toolParams.x, params.toolParams.y);

		this.window.handle.addEvent('mouseover', function(){
			this.ttchain = new Chain();
			var showTip = function () {
				this.showToolTip(true);
			}.bind(this);
			this.ttchain.chain(showTip);
			this.ttchain.callChain.delay(500, this.ttchain);
		}.bind(this));
		this.window.handle.addEvent('mouseout', function(){
			if(typeof(this.ttchain) === 'undefined') {
				this.showToolTip(false);
			} else {
				this.ttchain.clearChain();
				this.showToolTip(false);
			}
		}.bind(this));

		//console.log("exit tiledImageLocatorTool.initialize");
		this.setToolTip(this.shortName);

	},
	//--------------------------------------------------------------
	setToolTip: function (shortName) {
		//console.log("%s setToolTip",shortName);
		// we only want 1 toolTip
		this.shortName = shortName;
		if(typeof(this.toolTip === 'undefined')) {
			this.toolTip = new Element('div', {
				'id': shortName + '-toolTipContainer',
				'class': 'toolTipContainer'
			});
			this.toolTip.inject($(document.body), 'inside');
		}
		$(this.shortName + '-toolTipContainer').set('text', this.shortName);
	},

	//--------------------------------------------------------------
	showToolTip: function (show) {
		//console.log("Tooltip!!!");
		var containerPos = this.view.getToolContainerPos();
		var left = emouseatlas.emap.utilities.getOffset($(this.shortName + '-container')).left;
		var top = emouseatlas.emap.utilities.getOffset($(this.shortName + '-container')).top;
		if(show === true) {
			$(this.shortName + '-toolTipContainer').setStyles({'left': left, 'top': top, 'visibility': 'visible' });
		} else {
			$(this.shortName + '-toolTipContainer').setStyles({'left': left, 'top': top, 'visibility': 'hidden'});
		}
	},

	// Currently not used code. Kept here in case we need it later on...
	//---------------------------------------------------------------
	doCollapsed: function() {
		//console.log("%s doCollapsed:",this.name);
		this.isCollapsed = true;
		var left = $(this.shortName + '-container').getPosition().x + 45;
		var top = $(this.shortName + '-container').getPosition().y - 5;
		var viz = $(this.shortName + '-container').getStyle('visibility');
		$(this.shortName + '-toolTipContainer').setStyles({'left': left, 'top': top, 'visibility': viz});
	},
	// Currently not used code. Kept here in case we need it later on...
	//---------------------------------------------------------------
	doExpanded: function() {
		//console.log("%s doExpanded:",this.name);
		this.isCollapsed = false;
		var left = $(this.shortName + '-container').getPosition().x + this.width + 10;
		var top = $(this.shortName + '-container').getPosition().y - 5;
		var viz = $(this.shortName + '-container').getStyle('visibility');
		$(this.shortName + '-toolTipContainer').setStyles({'left': left, 'top': top, 'visibility': viz});
	}


}); // end of class tiledImageTool
//----------------------------------------------------------------------------
