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
//expressionLevelKey.js
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//Uses MooTools
//---------------------------------------------------------

//---------------------------------------------------------
//Namespace:
//---------------------------------------------------------

//---------------------------------------------------------
//expressionLevelKey
//---------------------------------------------------------
//emouseatlas.emap.expressionLevelKey = new Class ({
var expressionLevelKey = new Class ({
	Extends: tiledImageTool,

	initialize: function(params) {

		this.name = "expressionKey";
		
		this.parent(params);
		
		this.window.container.style.visibility = 'hidden';

		//----------------------------------------
		// the expression key image stuff
		//----------------------------------------

		this.image = new Element( 'img', {
			'id': this.shortName + '-image',
			'styles': { }
		});
		this.image.inject( this.window.win , 'inside');

		this.window.setDimensions(this.width, this.height);
		this.window.setToolTip(this.shortName);

		this.layerNames = [];

		this.expressionTextContainer = new Element('div', {
			'id': 'textContainer_expression'
		});

		this.expressionTextDiv = new Element('div', {
			'id': 'textDiv_expression'
		});
		this.expressionTextDiv.set('text', 'expression level');

		var topEdge = $(this.shortName + '-topedge');

		this.expressionTextDiv.inject(this.expressionTextContainer, 'inside');
		this.expressionTextContainer.inject(topEdge, 'inside');

		if(this.model.modelReady()) {
			this.image.src = this.model.getFullExpressionLevelKeyName();
			this.image.addEvent('click',function() {
				this.doKeyClicked();
			}.bind(this));
			//console.log("expressionLevelKey modelUpdate: %s",this.image.src);
		}

		//----------------------------------------
		// containers for the layer selectors
		//----------------------------------------

		var win = $(this.shortName + '-win');
		var layerNames = this.model.getLayerNames();
		var numlayers = layerNames.length;
		var layerVisibility = this.view.getLayerVisibility();
		var i;
		var selected = '';

		for(i=0; i<numlayers; i++) {
			//if(i === numlayers - 1) {
			if(i === 0) {
				selected = ' selected';
			} else {
				selected = '';
			}
			var left = 1 + i*175;
			var layerDiv = new Element('div', {
				'id': layerNames[i] + '_keyLayerDiv',
				'class': 'layerDiv_key' + selected,
				'styles': {
					'left': left + 'px'
				}
			});

			var layerTextContainer = new Element('div', {
				'id': layerNames[i] + '_layerTextContainer',
				'class': 'layerTextContainer_key'
			});

			var layerTextDiv = new Element('div', {
				'id': layerNames[i] + '_layerTextDiv',
				'class': 'layerTextDiv_key'
			});

			if(i === 0) {
				layerTextDiv.set('text', 'raw data');
			} 
			if(i === numlayers - 1) {
				layerTextDiv.set('text', 'expression level');
			} 

			if(layerVisibility[layerNames[i]].visible === true || layerVisibility[layerNames[i]].visible === 'true') {
				checked = 'checked';
			} else {
				checked = '';
			}

			var layerRadioDiv = new Element('div', {
				'class': 'layerRadioDiv_key'
			});

			var layerRadio = new Element( 'input', {
				'id': layerNames[i] + '_layerRadio',
				'name': 'layerRadio',
				'type': 'radio',
				'checked': checked
			});


			//----------------------------------------
			// add them to the tool
			//----------------------------------------

			layerDiv.inject(win, 'inside');
			layerTextDiv.inject(layerTextContainer, 'inside');
			layerRadio.inject(layerRadioDiv, 'inside');
			layerRadioDiv.inject(layerDiv, 'inside');
			layerTextContainer.inject(layerDiv, 'inside');

			//----------------------------------------
			// add event handlers
			//----------------------------------------

			layerRadio.addEvent('change', function(e){
				this.doRadioChanged(e);
			}.bind(this));

			layerDiv.addEvent('click', function(e){
				this.doLayerClicked(e);
			}.bind(this));
		}

	}, // initialize

	//---------------------------------------------------------------
	doRadioChanged: function(e) {

		//console.log("enter expressionLevelKey doRadioChanged:");
		if (!e) {
			var e = window.event;
		}
		var target = emouseatlas.emap.utilities.getTarget(e);
		//console.log("expressionLevelKey target ",target);

		var layerNames = this.model.getLayerNames();
		var numlayers = layerNames.length;
		var i;

		for(i=0; i<numlayers; i++) {
			if(target.id.indexOf(layerNames[i]) >= 0) {
				this.view.setLayerVisibility({layer:layerNames[i], value: true});
			} else {
				this.view.setLayerVisibility({layer:layerNames[i], value: false});
			}
		}

		var clearParams = {scale: false, distance: false};
		this.view.clearTiles(clearParams);
		setTimeout("emouseatlas.emap.tiledImageView.requestImages()", 10);
	},

	//---------------------------------------------------------------
	doLayerClicked: function(e) {
		//console.log("enter expressionLevelKey doLayerClicked:");
		if (!e) {
			var e = window.event;
		}
		var target = emouseatlas.emap.utilities.getTarget(e);
		//console.log("expressionLevelKey target ",target);

		// the radio button is in the layer div so ignore radio button events
		if(target.id.indexOf("_layerRadio") >= 0) {
			//console.log("doLayerClicked returning: event from radio button ",target.id);
			return;
		}

		var layerNames = this.model.getLayerNames();
		var numlayers = layerNames.length;
		var layerVisibility = this.view.getLayerVisibility();
		var i;
		var layerToClick;

		for(i=0; i<numlayers; i++) {
			if(target.id.indexOf(layerNames[i]) >= 0) {
				if(layerVisibility[layerNames[i]].visible === false || layerVisibility[layerNames[i]].visible === 'false') {
					$(layerNames[i] + '_layerRadio').click();
					break;
				}
			}
		}
	},

	//---------------------------------------------------------------
	doKeyClicked: function() {
		//console.log("enter expressionLevelKey doKeyClicked:");
		var layerNames = this.model.getLayerNames();
		var numlayers = layerNames.length;
		var layerVisibility = this.view.getLayerVisibility();

		for(i=0; i<numlayers; i++) {
			if(layerVisibility[layerNames[i]].visible === false || layerVisibility[layerNames[i]].visible === 'false') {
				$(layerNames[i] + '_layerRadio').click();
				break;
			}
		}
	},

	//---------------------------------------------------------------
	modelUpdate: function(modelChanges, trigger) {

		//console.log("enter expressionLevelKey modelUpdate:");
		if(modelChanges.initial === true) {
			//console.log("expressionLevelKey modelUpdate: initial");
			this.image.src = this.model.getFullExpressionLevelKeyName();
			//console.log("expressionLevelKey modelUpdate: %s",this.image.src);
		}
		if(modelChanges.layerNames === true) {
			//console.log("expressionLevelKey modelUpdate: layerNames");
			this.layerNames = this.model.getLayerNames();
		}
		//console.log("exit expressionLevelKey modelUpdate:");
	}, // modelUpdate

	//---------------------------------------------------------------
	viewUpdate: function(viewChanges) {

		//console.log("enter expressionLevelKey viewUpdate:",viewChanges);

		if(viewChanges.initial === true) {
			this.window.container.style.visibility = 'visible';
			this.window.win.style.visibility = 'visible';
			this.window.win.style.background = 'transparent';
		}

		//console.log("exit expressionLevelKey viewUpdate:");
	} // viewUpdate

});
