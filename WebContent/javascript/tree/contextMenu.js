var ContextMenu = new Class({

	//implements
	Implements: [Options,Events],

	//options
	options: {
		actions: {},
		menu: 'contextmenu',
		stopEvent: true,
		targets: 'body',
		trigger: 'contextmenu',
		offsets: { x:0, y:0 },
		onShow: null,
		onHide: null,
		onClick: null,
		fadeSpeed: 200
	},
	
	//initialization
	initialize: function(options) {
		//set options
		this.setOptions(options);
		
		//option diffs menu
		this.menu = $(this.options.menu);
		this.targets = $$(this.options.targets);
		
		//fx
		this.fx = new Fx.Tween(this.menu, { property: 'opacity', duration:this.options.fadeSpeed });
		
		//hide and begin the listener
		this.hide().startListener();
		
		//hide the menu
		this.menu.setStyles({ 'position':'absolute','top':'-900000px', 'display':'block' });
	},
	
	//get things started
	startListener: function() {
		/* all elements */
		this.targets.each(function(el) {
			// => Array of links with given class. Provide target in the form: 'a.external', where 'external' is a class name
			matchingTargets = $$(el); 
			/* show the menu */
			matchingTargets.addEvent(this.options.trigger,function(e) {
				//enabled?
				if(!this.options.disabled) {
					//prevent default, if told to
					if(this.options.stopEvent) { e.stop(); }
					//record this as the trigger
					this.options.element = $(el);
					//position the menu
					this.menu.setStyles({
						top: (e.page.y + this.options.offsets.y),
						left: (e.page.x + this.options.offsets.x),
						position: 'absolute',
						'z-index': '100'
					});
					//show the menu
					this.show();
				}
			}.bind(this));
		},this);
		
		/* menu items */
		this.menu.getElements('a').each(function(item) {
			item.removeEvents();
			item.addEvent('click',function(e) {
				if(!item.hasClass('disabled')) {
					this.execute(item.get('name'),$(this.options.element));
					this.fireEvent('click',[item,e]);
				}
			}.bind(this));
		},this);
		
		//hide on body click
		$(document.body).addEvent('click', function() {
			this.hide();
		}.bind(this));
		
		//hide on esc key
		$(document.body).addEvent('keydown', function(e) {
			if (e.key == 'esc'){
				this.hide();
			}
		}.bind(this));
	},
	
	//show menu
	show: function(trigger) {
		//this.menu.fade('in');
		this.fx.start(1);
		this.fireEvent('show');
		this.shown = true;
		return this;
	},
	
	//hide the menu
	hide: function(trigger) {
		if(this.shown)
		{
			this.fx.start(0);
			//this.menu.fade('out');
			this.fireEvent('hide');
			this.shown = false;
		}
		return this;
	},
	
	//disable an item
	disableItem: function(item) {
		this.menu.getElements('a[href$=' + item + ']').addClass('disabled');
		return this;
	},
	
	//enable an item
	enableItem: function(item) {
		this.menu.getElements('a[href$=' + item + ']').removeClass('disabled');
		return this;
	},
	
	//diable the entire menu
	disable: function() {
		this.options.disabled = true;
		return this;
	},
	
	//enable the entire menu
	enable: function() {
		this.options.disabled = false;
		return this;
	},
	
	//execute an action
	execute: function(action,element) {
		if(this.options.actions[action]) {
			this.options.actions[action](element,this);
		}
		return this;
	}
	
});