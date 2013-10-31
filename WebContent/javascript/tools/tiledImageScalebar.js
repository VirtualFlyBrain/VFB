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
//tiledImageScalebar.js
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImageScalebar
//---------------------------------------------------------
var tiledImageScalebar = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {

		this.name = "Scalebar";
		
		this.parent(params);
		
		this.currentPosition = 0;

		this.mu = ' \u03BCm';
		this.createElements();

	}, // initialize

	//---------------------------------------------------------------
	createElements: function () {

		var topEdge = $(this.shortName + '-topedge');
		var win = $(this.shortName + '-win');

		//----------------------------------------
		// the text div
		//----------------------------------------
		this.scalebarTextContainer = new Element('div', {
			'id': 'scalebarTextContainer'
		});

		this.scalebarTextDiv = new Element('div', {
			'id': 'scalebarTextDiv'
		});

		this.scalebarTextDiv.inject(this.scalebarTextContainer, 'inside');
		this.scalebarTextContainer.inject(win, 'inside');

		//----------------------------------------
		// the scalebars
		//----------------------------------------
		this.scalebarDiv = new Element('div', {
			'id': 'scalebarDiv'
		});

		this.scalebarDiv.inject(win, 'inside');

		return false;
	},

	//---------------------------------------------------------------
	modelUpdate: function (modelChanges) {
		return false;

	},

	//---------------------------------------------------------------
	viewUpdate: function (viewChanges) {

		if(viewChanges.initial === true || viewChanges.scale === true) {
			var scale = this.view.getScale();
			var pixres = this.model.getPixelResolution();
			var numpix = 100 / pixres.x;
			$("scalebarDiv").setStyle("width",numpix + "px");
			this.width = numpix + 20;
			this.window.setDimensions(this.width, this.height);
			var txt = 100 / scale.cur;
			this.scalebarTextDiv.set('text', txt + this.mu);
		}
	}
	
});
