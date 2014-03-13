/*
UvumiTools ColorSphere v1.0.0 http://uvumi.com/tools/sphere.html

Copyright (c) 2008 Uvumi LLC

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

/*
Based on Conversion Algorithm from DHTML Color Sphere : v1.0.2 : 2008/04/17 from http://www.colorjack.com/software/dhtml+color+sphere.html 
We used their sphere-to-color convertion algorithm, but beside this, it has been fully recoded and improved for mootools
*/

var UvumiSphere = new Class({

	Implements: [Options,Events],
	
	options: {
		defaultColor: '#ffffff',					//the default color if no color is set in the active source input
//		specterImage:'../images/tree/circle.jpg',		//url to the circle image
//		cursorImage:'../images/tree/miniCurr.gif',	//url to cursor image
		buttonText:'',
		onChange:function() {},						//function fired when you drag the cursor or when you type a color in the picker's input. Recieves the active input element and the color hex value
		onComplete:function() {}						//fired when you're done dragging. also receive the active input and the color value
	},

	initialize: function(elements,options){
		this.setOptions(options);
		var preload = new Asset.images([this.options.specterImage,this.options.cursorImage]);
		window.addEvent('domready',this.build.bind(this,elements));
	},
	
	build: function(elements){
		//uses a css selector to select the inputs, set each type to hidden, and create a button next that will open the picked
		$$(elements).each(function(el){
			if(el.get('tag')=='input'){
				el.addEvents({'click':this.toggle.bind(this)});
				//Ugly fix for IE, because exploder doesn't let you change an input's type after it has been rendered.
				//So you must clone the input, set the new one to hidden and replace the original with it. another way would be to set display style to none, but whatever
				//you can try to comment this line out to see how original inputs are affected				
//				el = el.clone().set('type','text').set('id',el.get('id')).replaces(el);				
//				var button = new Element('button',{
//					'class':'colorSphereButton',
//					'html':this.options.buttonText,
//					'type':'button',
//					'events':{
//						'click':this.toggle.bind(this)
//					}
//				}).inject(el,'after');
			}
		},this);
		
		//building the picker
		this.container = new Element('div',{
			'class':'colorSphere',
			'styles':{
				'display':'none',
				'position': 'absolute',
				'z-index': 999
			}
		}).inject(document.body);
	
		this.topbar = new Element('div',{
			'class':'topbar'
		}).inject(this.container);
		
		this.closeButton = new Element('div',{
			'class':'closeButton',
			'html':'X',
			'events':{
				'click':this.toggle.bind(this),
				'mousedown':function(e){new Event(e).stopPropagation();}
			},
			'styles':{
				'float': 'right'
			}
		}).inject(this.topbar);
		
		this.hex = new Element('input',{
			'class':'hexa',
			'value':this.options.defaultColor,
			'type':'text',
			'size':7,
			'name':'color',
			'events':{
				'keyup':this.setColor.bind(this),
				'mousedown':function(e){new Event(e).stopPropagation();}
			}
		}).inject(this.topbar);

		this.spectrum = new Element('div',{
			'class':'spectrum',
			'events':{
				'mousedown':this.colorDown.bind(this)
			},
			'styles':{
				'padding':0,
				'position':'relative'
				
			}
		}).inject(this.container);
		
		this.selector = new Element('div',{
			'class':'selector',
			'styles':{
				'margin':0,
				'padding':0,
				'line-height':0,
				'font-size':0,
				'position': 'absolute',
				'z-index': 101
			}
		}).inject(this.spectrum);
		
		//makes the cursor draggable
		this.drag = this.selector.makeDraggable({
			snap:1,
			onDrag:this.calculateColor.bind(this),
			onComplete:function(){this.fireEvent('onComplete',[this.activeInput,this.activeInput.get('value')])}.bind(this)
		});
		
		//makes the picker draggable
		this.container.makeDraggable({
			handle:this.topbar,
			onComplete:function(){
				this.spectrumCoords = this.spectrum.getPosition();
			}.bind(this)
		});
		
		//set flags
		this.showing=false;
		this.activeInput=false;
		this.offset=(Browser.ie?6:4);
	},
	
	//display the picker if not visible,
	//hides it if source button, or X is pushed, moves it if another button
	//if the source input has a color, it will set the picker to this color, or the default one
	toggle: function(e){
		var event = new Event(e).stop();
		if($(event.target)==this.closeButton || !this.activeInput || this.activeInput.getNext() == $(event.target)){
			this.showing=!this.showing;
		}
		if(this.showing){
			var coords = $(e.target).getCoordinates();
			this.container.setStyles({
				'top':coords.bottom+5,
				'left':coords.left-50,
				'display':'block'
			});
			this.spectrumCoords = this.spectrum.getPosition();
			this.W = this.spectrum.getSize().x;
			this.W2 = this.W/2; 
			this.W3 = this.W2/2;
			this.activeInput = $(event.target);			
			var hex = this.activeInput.getStyle('background-color') || this.options.defaultColor;
			this.setColor(hex);
		}else{
			this.container.setStyle('display','none');
			this.activeInput=false;
		}
	},

	//on mouse down, move the cursor to mouse position, calculate the new value, and start dragging
	colorDown: function(e){
		this.selector.setStyles({
			'top':e.page.y-this.spectrumCoords.y-this.offset,
			'left':e.page.x-this.spectrumCoords.x-this.offset
		});
		this.calculateColor();
		this.drag.start(e);
	},
	
	//calculate color value from cursor position
	calculateColor: function() { 
		v = this.selector.getPosition(this.spectrum);
		var x=v.x-this.W2+4; 
		var y=this.W-v.y-4-this.W2;
		var SV=Math.sqrt(Math.pow(x,2)+Math.pow(y,2)); 
		var hue=Math.atan2(x,y)/(Math.PI*2);
		var hsv=[
			hue>0?(hue*360):((hue*360)+360),
			SV<this.W3?(SV/this.W3)*100:100, 
			SV>=this.W3?Math.max(0,1-((SV-this.W3)/(this.W2-this.W3)))*100:100
		];
		var hexVal = hsv.hsbToRgb().rgbToHex();
		$$(this.activeInput,this.hex).setStyle('background-color',hexVal);
		if(hsv[2]<1){
			this.moveCursor(hsv);
		}
		this.hex.value=hexVal;
		this.fireEvent('onChange',[this.activeInput,hexVal]);
	},
	
	//reposition cursor from color value
	moveCursor:function(hsv){
		var rad=(hsv[0]/360)*(Math.PI*2); 
		var hyp=(hsv[1]+(100-hsv[2]))/100*(this.W2/2);
		this.selector.setStyles({
			left: Math.round(Math.abs(Math.round(Math.sin(rad)*hyp)+this.W2))-4, 
			top: Math.round(Math.abs(Math.round(Math.cos(rad)*hyp)-this.W2))-4
		});
	},
	
	//set a color manually, update both input and cursor position
	setColor:function(hex){
		if(!this.showing){return;}
		if(typeOf(hex)!='string'){
			var hex = this.hex.get('value');
		}else{
			this.hex.set('value',hex);
		}
		var hsv=hex.hexToRgb(true);
		if(hsv === null){return;}
		this.activeInput.setStyle('background-color',hex);
		this.hex.setStyle('background-color',hex);
		hsv = hsv.rgbToHsb();
		this.moveCursor(hsv);
	}
});

//temporary fix for opera until the mootools is fixed
Element.implement({
	getPosition: function(relative){
		if ((/^(?:body|html)$/i).test(this.tagName)) return {x: 0, y: 0};
		var offset = this.getOffsets(), scroll = this.getScrolls();
		var position = {x: offset.x - scroll.x, y: offset.y - scroll.y};
		var relativePosition = (relative && (relative = $(relative))) ? relative.getPosition() : {x: 0, y: 0};

        if (Browser.opera) {
            var position = {x: offset.x, y: offset.y};
        }

		return {x: position.x - relativePosition.x, y: position.y - relativePosition.y};
	}
});
