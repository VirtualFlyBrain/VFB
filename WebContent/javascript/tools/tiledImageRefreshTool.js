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
//tiledImageRefreshTool.js
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImageRefreshTool
//---------------------------------------------------------
var tiledImageRefreshTool = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {

		this.name = "RefreshTool";
		
		this.parent(params);
		
		this.createElements();

	}, // initialize

	//---------------------------------------------------------------
	createElements: function () {

		var topEdge = $(this.shortName + '-topedge');
		var win = $(this.shortName + '-win');

		//----------------------------------------
		// the refresh div
		//----------------------------------------
		this.refreshButton = new Element('div', {
			'id': 'refreshButton'
		});

		//----------------------------------------
		// the text button
		//----------------------------------------
		this.refreshTextContainer = new Element('div', {
			'id': 'refreshTextContainer'
		});

		this.refreshTextDiv = new Element('div', {
			'id': 'refreshTextDiv'
		});

		this.refreshTextDiv.appendText('reload image');

		this.refreshTextDiv.inject(this.refreshTextContainer, 'inside');
		this.refreshTextContainer.inject(this.refreshButton, 'inside');
		this.refreshButton.inject(win, 'inside');

		emouseatlas.emap.utilities.addButtonStyle("refreshButton");

		//----------------------------------------
		// add the events
		//----------------------------------------
		this.refreshButton.addEvent('click',function() {
			this.view.refreshImage();
		}.bind(this));

		return false;
	},

	//---------------------------------------------------------------
	modelUpdate: function (modelChanges) {
		return false;

	},

	//---------------------------------------------------------------
	viewUpdate: function (viewChanges) {

		if(viewChanges.initial === true) {
		}

		if(viewChanges.toolbox === true) {
			var viz = this.view.toolboxVisible();
			if(viz === true) {
				this.window.setVisible(true);
			} else if(viz === false) {
				this.window.setVisible(false);
			}
		}
	}
	
});
