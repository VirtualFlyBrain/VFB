/*
 * Copyright (C) 2011 Medical research Council, UK.
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
//tiledImageExpressionSectionTool.js
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//tiledImageExpressionSectionTool
//---------------------------------------------------------
//emouseatlas.emap.tiledImageExpressionSectionTool = new Class ({
var tiledImageExpressionSectionTool = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {

		this.name = "ExpressionSectionTool";
		
		this.parent(params);
		
		this.title = params.toolParams.title;

		//console.log("tiledImageExpressionSectionTool: this.height %s",this.height);

		if (this.section !== undefined) {
			var win = $(this.shortName + '-win');

			this.sectionTitle = new Element('div', {
				'id':'sectionDiv',
				'class':'sectionToolTitleText',
				'text':params.toolParams.title
			});

			this.sectionTitle.inject(win, 'inside');

			//----------------------------------------
			// div for selection combobox
			//----------------------------------------
			this.sectionContainer = new Element('div');
			this.sectionComboBox = new Element( 'select');

			var item=' ';
			for (var i = 0; i < this.sectionName.length; i++)
				item += '<option value="'+i+'">'+this.sectionName[i]+'</option>';

			this.sectionComboBox.set('html', item);
			this.sectionComboBox.inject(this.sectionContainer, 'inside');
			this.sectionContainer.inject(win, 'inside');

			//----------------------------------------
			// add the events
			//----------------------------------------
			this.sectionComboBox.addEvent('mouseup',function() {
				this.setSelection();
			}.bind(this));
		}

		//-----------------------------------------
		this.window.setDimensions(this.width, this.height);
		this.windiw.setToolTip(this.toolTipText);

		this.layerNames = [];

	}, // initialize

	//---------------------------------------------------------------
	modelUpdate: function(modelChanges) {

	}, // modelUpdate

	//---------------------------------------------------------------
	viewUpdate: function(viewChanges) {

		if(viewChanges.initial === true) {
			this.window.setVisible(true);
		}
	},

	//---------------------------------------------------------------
	setSelection: function() {
		var index = this.sectionComboBox.selectedIndex;
		if (index !== undefined && 
				this.sectionName !== undefined &&
				index < this.sectionName.length ) {
			var pos = this.sectionName[index];
			var vals = {x:this.section[pos].x, y:this.section[pos].y, z:this.section[pos].z};
			this.model.setSection(this.section[pos].x, this.section[pos].y, this.section[pos].z, this.section[pos].phi, this.section[pos].theta, undefined, this.section[pos].dst, "sectiontool");
		}
	}

});
