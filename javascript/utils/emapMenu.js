//---------------------------------------------------------
//emapMenu.js
//---------------------------------------------------------

//---------------------------------------------------------
//Dependencies:
//uses MooTools
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
//function EmapMenu, can be instantiated with 'new' keyword
//---------------------------------------------------------
emouseatlas.emap.EmapMenu = function() {

	//---------------------------------------------------------
	// modules
	//---------------------------------------------------------

	// private members
	var view;
	var menuStructureUrl;
	var menuContentUrl;
	var menuTarget = [];
	var menuStructure = {};
	var menuContent = {};
	var contentIndx = 0;
	var subMenuOffset = 3; // added to item width to position subMenu
	var defaultItemWidthPx = 100;
	var defaultItemHeightPx = 20;
	var imagePath;

	//---------------------------------------------------------
	//   private methods
	//---------------------------------------------------------

	//---------------------------------------------------------
	// event handlers
	//---------------------------------------------------------

	//---------------------------------------------------------
	//   public methods
	//---------------------------------------------------------

	var initialise = function (params) {
		view = params.view;
		view.register(this);
		imagePath = params.imagePath;
		menuStructureUrl = params.structureUrl;
		menuContentUrl = params.contentUrl;
		readMenuStructure();
	};

	//---------------------------------------------------------
	var readMenuStructure = function () {

		var ajaxParams = {
				url:menuStructureUrl,
				method:"POST",
				callback: readMenuStructureCallback,
				contentType:"",
				urlParams:"",
				async:true,
				noCache:false
		};

		var ajax = new emouseatlas.emap.ajaxContentLoader();
		ajax.loadResponse(ajaxParams);
	};

	//---------------------------------------------------------
	var readMenuStructureCallback = function (response) {

		var json;
		if(emouseatlas.JSON === undefined || emouseatlas.JSON === null) {
			json = JSON.parse(response);
		} else {
			json = emouseatlas.JSON.parse(response);
		}
		if(!json) {
			return false;
		}

		var len = json.length;
		var target;
		var structure;
		var type;
		var itemWidthPx;
		var itemHeightPx;
		var itemDims;
		var i=0;
		for(i=0; i<len; i++) {
			target = json[i].target;
			structure = json[i].structure;
			type = json[i].type;
			itemWidthPx = (json[i].itemWidthPx === undefined) ? defaultItemWidthPx : json[i].itemWidthPx;
			itemHeightPx = (json[i].itemHeightPx === undefined) ? defaultItemHeightPx : json[i].itemHeightPx;
			itemDims = {width:itemWidthPx, height:itemHeightPx};

			params = {
					target:target,
					structure:structure,
					type:type,
					itemDims:itemDims
			};

			//addStructure(target, type, json[i].structure, itemDims);
			addStructure(params);
		}

		readMenuContent();

	};

	//---------------------------------------------------------
	// If target is an 'id' just add the structure for this id.
	// If it is a 'class' add it for all the target ids of this class.
	//---------------------------------------------------------
	var addStructure = function (params) {

		var target = params.target;
		var structure = params.structure;
		var targetDiv = $(target);
		var targetId
		var klass = '.' + target;
		var allTargetsOfClass;
		var len;
		var i;

		if(targetDiv === undefined || targetDiv === null) {
			// assume it was a class rather than an id.
			allTargetsOfClass = $$(klass);
			len = allTargetsOfClass.length;
			for(i=0; i<len; i++) {
				targetId = allTargetsOfClass[i].id;
				menuTarget[menuTarget.length] = targetId;
				if(menuStructure[targetId] === undefined) {
					menuStructure[targetId] = {
							target: targetId,
							type: params.type,
							structure: structure,
							itemDims: params.itemDims
					}
				}
			}
		} else {
			menuTarget[menuTarget.length] = target;
			if(menuStructure[target] === undefined) {
				menuStructure[target] = {
						target: target,
						type: params.type,
						structure: structure,
						itemDims: params.itemDims
				}
			}
		}
	};

	//---------------------------------------------------------
	var readMenuContent = function () {

		var ajaxParams = {
				url:menuContentUrl,
				method:"POST",
				callback: readMenuContentCallback,
				contentType:"",
				urlParams:"",
				async:true,
				noCache:false
		};

		var ajax = new emouseatlas.emap.ajaxContentLoader();
		ajax.loadResponse(ajaxParams);
	};

	//---------------------------------------------------------
	var readMenuContentCallback = function (response) {

		var json;
		if(emouseatlas.JSON === undefined || emouseatlas.JSON === null) {
			json = JSON.parse(response);
		} else {
			json = emouseatlas.JSON.parse(response);
		}
		if(!json) {
			return false;
		}

		var len = json.length;
		var target;
		var content;
		var i=0;
		for(i=0; i<len; i++) {
			target = json[i].target;
			content = json[i].content
			addContent(target, content);
		}

		addRightMouseDownHandler();
		buildMenus();
		emouseatlas.emap.utilities.addEvent(document, 'mouseup', doMouseUp, false);
		emouseatlas.emap.utilities.addEvent(document, 'mousedown', doMouseDown, false);

	};

	//---------------------------------------------------------
	// If target is an 'id' just add the content for this id.
	// If it is a 'class' add it for all the target ids of this class.
	//---------------------------------------------------------
	var addContent = function (target, content) {

		var targetDiv = $(target);
		var targetId
		var klass = '.'+target;
		var allTargetsOfClass;
		var len;
		var i;

		if(targetDiv === undefined || targetDiv === null) {
			// assume it was a class rather than an id.
			allTargetsOfClass = $$(klass);
			len = allTargetsOfClass.length;
			for(i=0; i<len; i++) {
				targetId = allTargetsOfClass[i].id;
				if(menuContent[targetId] === undefined) {
					menuContent[targetId] = {
							"target": targetId,
							"content": content
					}
				}
			}
		} else {
			if(menuContent[target] === undefined) {
				menuContent[target] = {
						"target": target,
						"content": content
				}
			}
		}
	};

	//---------------------------------------------------------
	var addRightMouseDownHandler = function () {

		var len = menuTarget.length;
		var i=0;
		var target;
		var targetDiv;
		var structure;
		var content;

		for(i=0; i<len; i++) {
			target = menuTarget[i];
			targetDiv = $(target)
			emouseatlas.emap.utilities.addEvent(targetDiv, 'contextmenu', rightMouseDownHandler, false);
		}
	};

	//---------------------------------------------------------
	var rightMouseDownHandler = function (e) {
		if(e.preventDefault) {
			e.preventDefault();
		}
		if(e.stopPropagation) {
			e.stopPropagation();
		}
		return false;
	};

	//---------------------------------------------------------
	var makeMenuVisible = function (target, position) {
		var id = target.id;
		var type = getMenuType(id);
		var len = menuTarget.length;
		var i=0;
		var menuContainer;

		//var targetLeft = parseInt(target.getStyle('left'));
		//var targetTop = parseInt(target.getStyle('top'));
		var targetOffset = emouseatlas.emap.utilities.getOffset($(id));
		var leftpx;
		var toppx;

		if(position) {
			leftpx = (position.x - targetOffset.left) +'px';
			toppx = (position.y - targetOffset.top) +'px';
		}

		hideMenus(-1);

		for(i=0; i<len; i++) {
			if(id === menuTarget[i]) {
				menuContainer = $(id + ':emapMenuContainer');
				menuContainer.firstChild.setStyle('visibility', 'visible');
				if(position) {
					menuContainer.firstChild.setStyles({'left':leftpx, 'top':toppx});
				}
				return;
			}
		}
		// can't find it
		return false;
	};

	//---------------------------------------------------------
	var getTargetWithMenu = function (target) {

		var len = menuTarget.length;
		var found = false;
		var i=0;
		var ret;

		if(target === undefined || target === null || target.id === "") {
			return undefined;
		}

		for(i=0; i<len; i++) {
			if(target.id === menuTarget[i]) {
				found = true;
			}
		}

		if(found) {
			return target;
		} else {
			return getTargetWithMenu(target.parentNode);
		}

	};


	//---------------------------------------------------------
	var doMouseDown = function (e) {

		var buttons = emouseatlas.emap.utilities.whichMouseButtons(e);
		var modifiers = emouseatlas.emap.utilities.whichModifierKeys(e);
		var target = emouseatlas.emap.utilities.getTarget(e);
		var X = emouseatlas.emap.utilities.getMouseX(e);
		var Y = emouseatlas.emap.utilities.getMouseY(e);
		var targetWithMenu = getTargetWithMenu(target);
		var id;
		var type;

		if(targetWithMenu === undefined) {
			hideMenus(-1);
			return;
		}

		var isForContext = false;
		if(buttons.right || (buttons.left && modifiers.ctrl)|| (buttons.left && modifiers.meta)) {
			isForContext = true;
		}

		id = targetWithMenu.id;
		type = getMenuType(id);

		var highestLevel = getHighestMenuLevel(id);

		var targetWithMenu = $(id);
		if(targetWithMenu) {
			if(type.toLowerCase() === "rightclick" && isForContext) {
				makeMenuVisible(targetWithMenu, {x:X, y:Y});
			}
		}

		if(e.preventDefault) {
			e.preventDefault();
		}
		if(e.stopPropagation) {
			e.stopPropagation();
		}

		return false;
	};

	//---------------------------------------------------------
	var doMouseUp = function (e) {

		//console.log("doMouseUp");

		if(e.preventDefault) {
			e.preventDefault();
		}
		if(e.stopPropagation) {
			e.stopPropagation();
		}

		var target = emouseatlas.emap.utilities.getTarget(e);
		var id = target.id;
		if(id === undefined || id === null || id === "") {
			hideMenus(-1);
			return;
		}
		var type = getMenuType(id);
		if(type === undefined) {
			hideMenus(-1);
			return;
		}

		var targetType = getTargetType(id);
		var highestLevel = getHighestMenuLevel(id);

		if(target && target.hasClass("emapMenuItem")) {

			if(!hasSubMenu(id)) {
				if(targetType === "emapMenuItem") {
					chkbx = getMenuItemCheckbox(target);
					if(chkbx) {
						chkbx.checked = !chkbx.checked;
					} else {
						radio = getMenuItemRadio(target);
						if(radio) {
							manageRadioButtonGroup(radio);
						}
					}
				}

				hideMenus(highestLevel);
				doActionFor(id);
			}
		}

		return false;
	};

	//---------------------------------------------------------
	var getTargetType = function (targetId) {
		var subs = targetId.split(":");
		var ret = undefined;
		if(subs && subs.length > 0) {
			ret = subs[subs.length - 1];
		}
		return ret;
	};

	//---------------------------------------------------------
	var getMenuItemCheckbox = function (target) {

		var chkbx = target.getElementById(target.id + ':chkbx');
		if(chkbx) {
			return chkbx;
		} else {
			return undefined;
		}
	};

	//---------------------------------------------------------
	var getMenuItemRadio = function (target) {

		var radio = target.getElementById(target.id + ':radio');
		if(radio) {
			return radio;
		} else {
			return undefined;
		}
	};

	//---------------------------------------------------------
	var manageRadioButtonGroup = function (radio) {

		var groupId = radio.name;
		var group = document.getElementsByName(groupId);
		var len = group.length;
		var i;
		var tmp;

		for(i=0; i<len; i++) {
			tmp = group[i];
			if(tmp.id === radio.id) {
				if(tmp.checked) {
					return false;
				}
			}
		}
		for(j=0; j<len; j++) {
			tmp = group[j];
			if(tmp.id === radio.id) {
				tmp.checked = true;
			} else {
				tmp.checked = false;
			}
		}
	};


	//---------------------------------------------------------
	var hideMenusFrom = function (thisLevel, highestLevel) {

		var i;
		var from = 1*thisLevel + 1*1;
		var to = 1*(highestLevel - thisLevel) + 1*2;

		for(i=from; i<to; i++) {
			hideMenusAtLevel(i);
		}
	};

	//---------------------------------------------------------
	var hideMenus = function (highestLevel) {

		var len = 1*highestLevel + 1*1;
		var i=0;

		if(highestLevel === -1) {
			hideMenusAtLevel(0);
		}

		for(i=0; i<len; i++) {
			hideMenusAtLevel(i);
		}
	};

	//---------------------------------------------------------
	var hideMenusAtLevel = function (level) {

		var len
		var i=0;
		var klass;

		if(level === 0) {
			klass = '.emapMenuList';
		} else {
			klass = '.emapMenuList.level' + level;
		}

		var menus = $$(klass);

		len = menus.length;
		for(i=0; i<len; i++) {
			menus[i].setStyle('visibility', 'hidden');
		}
	};

	//---------------------------------------------------------
	var buildMenus = function () {

		var len = menuTarget.length;
		var i=0;
		var target;
		var targetDiv;
		var struct;
		var structure;
		var itemDims;
		var content;
		var menuId;
		var type;
		var itemId;
		var params;
		var id;
		var menuContainer;
		var menuList;
		var klass;

		for(i=0; i<len; i++) {
			target = menuTarget[i];
			struct = menuStructure[target];
			targetDiv = $(target);
			structure = struct.structure;
			type = struct.type;
			klass = "emapMenuContainer " + type;
			itemDims = struct.itemDims;
			content = menuContent[target].content;

			menuId = target + ":emapMenuContainer";
			menuContainer = new Element('div', {
				"id": menuId,
				"class": klass
			});
			menuContainer.inject(targetDiv, 'inside');

			menuId = target + ":emapMenuList";
			menuList = new Element('ul', {
				"id": menuId,
				"class": "emapMenuList"
			});
			menuList.inject(menuContainer, 'inside');

			params = {
					target:target,
					structure:structure,
					content:content,
					menuId:menuId,
					itemDims:itemDims,
					type:type
			};

			buildMenuItems(params);
		}
	};

	//---------------------------------------------------------
	var buildMenuItems = function (params) {

		var target = params.target;
		var menuId = params.menuId;
		var structure = params.structure;
		var content = params.content;
		var itemDims = params.itemDims;
		var type = params.type;

		var subMenuParams;
		var menuList = $(menuId);
		var len = structure.length;
		var id;
		var itemId;
		var itemName;
		var state;
		var spacer;
		var menuSpacer;
		var menuItem;
		var moreImg;
		var chkbx;
		var chk;
		var grp;
		var radio;
		var moreImgSrc = imagePath + "more_10.png";
		var children;
		var itemWidth = parseInt(itemDims.width) + "px";
		var itemHeight = parseInt(itemDims.height) + "px";
		var leftOffset = (1*itemDims.width + 1*subMenuOffset) + "px";
		var i;
		var nextLevel = 1;
		var nextLevelClass =  "level1";

		contentIndx = 0;

		for(i=0; i<len; i++) {
			if(contentIndx === 0) {
				contentIndx = i;
			} else {
				contentIndx = (1*contentIndx + 1*1);
			}
			id = structure[i].id;
			spacer = structure[i].spacer;
			if(spacer === undefined) {
				children = structure[i].children;
				itemId = target + ":" + id + ":emapMenuItem";
				itemName = content[contentIndx].name[0];
				state = (content[contentIndx].enabled.toLowerCase() === "true") ? " enabled" : " disabled";
				menuItem = new Element('li', {
					"id": itemId,
					"class": "emapMenuItem " + type + state,
					"styles": {
						"width": itemWidth,
						"height": itemHeight
					}
				});
				menuItem.set('text', itemName);
				menuItem.inject(menuList, 'inside');
				emouseatlas.emap.utilities.addEvent(menuItem, 'mouseover', doMouseOverItem, false);
				emouseatlas.emap.utilities.addEvent(menuItem, 'mouseout', doMouseOutItem, false);
				emouseatlas.emap.utilities.addEvent(menuItem, 'mousedown', doMouseDownItem, false);

				if(children === undefined || children.length < 1) {
					if(content[contentIndx].checkbox) {
						chk = content[contentIndx].checked;
						chk = (chk === "true") ? true : false;
						chkbx = new Element('input', {
							"type": "checkbox",
							"checked": chk,
							"id": itemId + ":chkbx",
							"name": itemId + ":chkbx",
							"class": "emapMenuItem chkbx"
						});
						chkbx.inject(menuItem, 'inside');
						emouseatlas.emap.utilities.addEvent(chkbx, 'mouseup', doMouseUp, false);
					}
					if(content[contentIndx].radio) {
						//console.log("buildMenuItems %s chk ",content[contentIndx].name[0],chk);
						chk = content[contentIndx].checked;
						chk = (chk === "true") ? true : false;
						grp = content[contentIndx].radioGroup;
						radio = new Element('input', {
							"type": "radio",
							"checked": chk,
							"id": itemId + ":radio",
							"name": grp,
							"class": "emapMenuItem radio"
						});
						radio.inject(menuItem, 'inside');
						emouseatlas.emap.utilities.addEvent(radio, 'mouseup', doMouseUp, false);
					}
				} else {
					moreImg = new Element('img', {
						"id": itemId + ":moreImg",
						"class": "emapMoreImg",
						"src": moreImgSrc
					});
					moreImg.inject(menuItem, 'inside');

					var subMenuId = target + ":" + id + ":emapMenuList";
					var subMenuList = new Element('ul', {
						"id": subMenuId,
						"class": "emapMenuList " + nextLevelClass,
						"styles": {
							"left": leftOffset 
						}
					});
					subMenuList.inject(menuList, 'inside');

					subMenuParams = {
							target:target,
							content:content,
							children:children,
							subMenuId:subMenuId,
							itemDims:itemDims,
							nextLevel:nextLevel,
							type:type
					};

					buildSubMenuItems(subMenuParams);
				}
			} else {
				menuSpacer = new Element('hr', {
					"class": "emapMenuSpacer"
				});
				menuSpacer.inject(menuList, 'inside');
			}
		}
	};

	//---------------------------------------------------------
	var buildSubMenuItems = function (params) {

		var target = params.target;
		var content = params.content;
		var children = params.children;
		var subMenuId = params.subMenuId;
		var itemDims = params.itemDims;
		var currentLevel = params.nextLevel;
		var type = params.type;

		var subMenuParams;
		var subMenuList = $(subMenuId);
		var len = children.length;
		var id;
		var itemId;
		var itemName;
		var menuItem;
		var chkbx;
		var chk;
		var grp;
		var radio;
		var spacer;
		var menuSpacer;
		var state;
		var moreImg;
		var nextLevel = (1*currentLevel + 1*1);
		var nextLevelClass =  "level" + nextLevel;
		var grandChildren;
		var itemWidth = parseInt(itemDims.width) + "px";
		var itemHeight = parseInt(itemDims.height) + "px";
		var leftOffset = (1*itemDims.width + 1*subMenuOffset) + "px";
		var i;


		for(i=0; i<len; i++) {
			contentIndx = 1*contentIndx + 1*1;
			id = children[i].id;
			spacer = children[i].spacer;
			if(spacer === undefined) {
				grandChildren = children[i].children;
				itemId = target + ":" + id + ":emapMenuItem";
				itemName = content[contentIndx].name[0];
				state = (content[contentIndx].enabled.toLowerCase() === "true") ? " enabled" : " disabled";
				menuItem = new Element('li', {
					"id": itemId,
					"class": "emapMenuItem " + type,
					"styles": {
						"width": itemWidth,
						"height": itemHeight
					}
				});
				menuItem.set('text', itemName);
				menuItem.inject(subMenuList, 'inside');
				emouseatlas.emap.utilities.addEvent(menuItem, 'mouseover', doMouseOverItem, false);
				emouseatlas.emap.utilities.addEvent(menuItem, 'mouseout', doMouseOutItem, false);
				emouseatlas.emap.utilities.addEvent(menuItem, 'mousedown', doMouseDownItem, false);

				if(grandChildren === undefined || grandChildren.length < 1) {
					if(content[contentIndx].checkbox) {
						chk = content[contentIndx].checked;
						chk = (chk === "true") ? true : false;
						chkbx = new Element('input', {
							"type": "checkbox",
							"checked": chk,
							"id": itemId + ":chkbx",
							"name": itemId + ":chkbx",
							"class": "emapMenuItem chkbx"
						});
						chkbx.inject(menuItem, 'inside');
						emouseatlas.emap.utilities.addEvent(chkbx, 'mouseup', doMouseUp, false);
					}
					if(content[contentIndx].radio) {
						chk = content[contentIndx].checked;
						chk = (chk === "true") ? true : false;
						grp = content[contentIndx].radioGroup;
						radio = new Element('input', {
							"type": "radio",
							"checked": chk,
							"id": itemId + ":radio",
							"name": grp,
							"class": "emapMenuItem radio"
						});
						radio.inject(menuItem, 'inside');
						emouseatlas.emap.utilities.addEvent(radio, 'mouseup', doMouseUp, false);
					}
				} else {
					moreImg = new Element('img', {
						"id": itemId + ":moreImg",
						"class": "emapMoreImg",
						"src": "./images/more_10.png"
					});
					moreImg.inject(menuItem, 'inside');

					var subSubMenuId = target + ":" + id + ":emapMenuList";
					var subSubMenuList = new Element('ul', {
						"id": subSubMenuId,
						"class": "emapMenuList " + nextLevelClass,
						"styles": {
							"left": leftOffset 
						}
					});
					subSubMenuList.inject(subMenuList, 'inside');

					subMenuParams = {
							target:target,
							content:content,
							children:grandChildren,
							subMenuId:subSubMenuId,
							itemDims:itemDims,
							nextLevel:nextLevel,
							type:type
					};

					//buildSubMenuItems(target, subSubMenuId, grandChildren, content, itemDims, nextLevel);
					buildSubMenuItems(subMenuParams);
				}
			} else {
				menuSpacer = new Element('hr', {
					"class": "emapMenuSpacer"
				});
				menuSpacer.inject(subMenuList, 'inside');
			}
		}
	};

	//---------------------------------------------------------
	//  Mouse over a menu item will cause the following:
	//  i) the menu item is highlighted (in blue)
	//  ii) if there is a sub-menu it will be made visible
	//  iii) if a previous sub-menu was visible it will be hidden.
	//---------------------------------------------------------
	var doMouseOverItem = function (e) {

		if(e.preventDefault) {
			e.preventDefault();
		}
		if(e.stopPropagation) {
			e.stopPropagation();
		}

		var target = emouseatlas.emap.utilities.getTarget(e);
		var id = target.id;
		var item = $(id);
		var oldKlass = item.get('class');
		var klass = oldKlass + ' mouseover';
		var position;
		var level;
		var highestLevel;
		var indx;
		var itemHeight = parseInt(item.getStyle('height'));
		var topOffset;

		if(!item.hasClass('emapMenuItem')) {
			return false;
		}

		// set style to highlight this item
		item.set('class', klass);

		position = getItemPosition(id);
		level = position.level;
		highestLevel = getHighestMenuLevel(id);

		// hide the appropriate menus
		hideMenusFrom(1*level, highestLevel);

		// if there is a sub-menu make it visible
		var submenu = getSubMenuOf(id, level);
		if(submenu) {
			indx = position.indx;
			topOffset = (indx * itemHeight) + "px";
			submenu.setStyles({
				'visibility': 'visible',
				'top': topOffset
			});
		}
		return false;
	};

	//---------------------------------------------------------
	// Remove the 'mouseover' class from this item.
	//---------------------------------------------------------
	var doMouseOutItem = function (e) {
		var target = emouseatlas.emap.utilities.getTarget(e);
		var id = target.id;
		var item = $(id);
		var oldKlass = item.get('class');
		var klass;

		if(!item.hasClass('emapMenuItem')) {
			return false;
		}

		index = oldKlass.indexOf(" mouseover");
		if(index === -1) {
			return false;
		}

		klass = oldKlass.substring(0,index);
		item.set('class', klass);
	};

	//---------------------------------------------------------
	//  Mouse down on the menu item would normally cause the text to be highlighted.
	//  We want to disable this behaviour.
	//---------------------------------------------------------
	var doMouseDownItem = function (e) {

		var target = emouseatlas.emap.utilities.getTarget(e);
		var targetWithMenu = getTargetWithMenu(target);
		var id = targetWithMenu.id;
		var type;
		var item = $(id);
		var klass = item.get('class');

		if(klass !== "emapMenuItem") {
			//hideMenus(-1);
			return;
		}

		type = getMenuType(id);
		if(type === undefined) {
			return;
		}

		if(type.toLowerCase() === "rightclick" && emouseatlas.emap.utilities.isRightMouse(e)) {
			makeMenuVisible(e);
		}
		if(type.toLowerCase() === "normal") {
			makeMenuVisible(e);
		}

		if(e.preventDefault) {
			e.preventDefault();
		}
		if(e.stopPropagation) {
			e.stopPropagation();
		}
		return false;
	};

	//---------------------------------------------------------
	var getSubMenuOf = function (id, level) {

		if(id === undefined) {
			return false;
		}

		var item = $(id);
		var klass = item.get('class');
		var submenus;

		var indx = id.indexOf('emapMenu');
		var substr = id.substring(0,indx);
		var submenu;
		var len;
		var i;
		var found = false;

		switch(level) {
		case 0:
			submenus = $$('.emapMenuList.level1');
			break;
		case 1:
			submenus = $$('.emapMenuList.level2');
			break;
		case 2:
			submenus = $$('.emapMenuList.level3');
			break;
		default:
			return undefined;
		}

		len = submenus.length;

		for(i=0; i<len; i++) {
			submenu = submenus[i];
			if(submenu.id.substring(0,indx) === substr) {
				found = true;
				break;
			}
		}

		if(found) {
			return submenu;
		} else {
			return undefined;
		}

	};

	//---------------------------------------------------------
	//  Given the css id return the relevant menu structure.
	var getStructureFromId = function (id) {

		if(id === undefined) {
			return undefined;
		}
		var idArr = id.split(':', 3);

		var target = idArr[0];
		var structure;

		if(menuStructure[target]) {
			structure = menuStructure[target].structure;
		}

		if(structure) {
			return structure;
		} else {
			return undefined;
		}
	};

	//---------------------------------------------------------
	//  Given the css id return the relevant menu content.
	var getContentFromId = function (id) {

		if(id === undefined) {
			return false;
		}
		var idarr = id.split(':', 3);

		var content = menuContent[idarr[0]].content;

		if(content) {
			return content;
		} else {
			return undefined;
		}
	};

	//  Given the css id return the menu id.
	//---------------------------------------------------------
	var getItemIdFromId = function (id) {

		if(id === undefined) {
			return false;
		}

		var idarr = id.split(':', 3);

		if(idarr[1]) {
			return idarr[1];
		} else {
			return undefined;
		}
	};

	//---------------------------------------------------------
	// if you click on menu item with sub-menu, or on a 'more' arrow
	//---------------------------------------------------------
	var hasSubMenu = function (id) {

		var item = $(id);
		var ret = false;
		var children;

		if(item.hasClass('emapMoreImg')) {
			ret = true;
		} else {
			if(item.children !== undefined && item.children.length > 0) {
				children = item.children;
				if(children[0].hasClass('emapMoreImg')) {
					ret = true;
				}
			}
		}
		return ret;
	};

	//---------------------------------------------------------
	// Given the css id of a menu item, return its position in the menu.
	var getItemPosition = function (id) {

		var position = undefined;
		var item;
		var itemId;
		var structure;
		var child;
		var len;
		var i;


		itemId = getItemIdFromId(id);

		structure = getStructureFromId(id);
		len = structure.length;

		// look at all the level 0 items for a match
		for(i=0; i<len; i++) {
			item = structure[i];
			if(item.id === itemId) {
				position = {level:0, indx:i};
				break;
			}
			if(item.children !== undefined && item.children.length > 0) {
				position = getItemPositionFromChildren(itemId, item.children, 0); 
				if(position) {
					break;
				}
			}
		}

		if(position) {
			return position;
		} else {
			return undefined;
		}
	};

	//---------------------------------------------------------
	// Given the item id of a menu item, return its position in the menu.
	var getItemPositionFromChildren = function (itemId, children, currentLevel) {

		var position = undefined;
		var level;
		var child;
		var len;
		var i;

		len = children.length;
		for(i=0; i<len; i++) {
			child = children[i];
			if(child.id === itemId) {
				level = 1*currentLevel + 1*1;
				position = {level:level, indx:i};
				break;
			}
			// if this level child has children, look at them for a match
			if(child.children !== undefined && child.children.length > 0) {
				level = 1*currentLevel + 1*1;
				position = getItemPositionFromChildren(itemId, child.children, level); 
				if(position) {
					break;
				}
			}
		}

		if(position) {
			return position;
		} else {
			return undefined;
		}
	};

	//---------------------------------------------------------
	// Given a css id get the menu type (rightClick / normal).
	var getMenuType = function (id) {

		var structure;

		if(id === undefined) {
			return undefined;
		}
		var idArr = id.split(':', 3);

		var target = idArr[0];

		if(menuStructure[target]) {
			structure = menuStructure[target];
			return structure.type;
		}

		return undefined

	};


	//---------------------------------------------------------
	// Given the css id of a menu item, return the number of levels in this menu.
	var getHighestMenuLevel = function (id) {

		var highestLevel = 0;
		var nextLevel = 1;
		var item;
		var structure;
		var child;
		var len;
		var i;

		structure = getStructureFromId(id);
		if(structure === undefined || structure === null) {
			return -1;
		}

		len = structure.length;

		// look at all the level 0 items for a match
		for(i=0; i<len; i++) {
			item = structure[i];
			if(item.children !== undefined && item.children.length > 0) {
				highestLevel = getHighestMenuLevelFromChildren(item.children, nextLevel); 
				if(highestLevel > nextLevel) {
					break;
				}
			}
		}

		return highestLevel;
	};

	//---------------------------------------------------------
	// Return the number of the deepest level in the given children.
	var getHighestMenuLevelFromChildren = function (children, currentLevel) {

		var highestLevel = currentLevel;
		var nextLevel = 1*currentLevel + 1*1;
		var child;
		var len;
		var i;

		len = children.length;
		for(i=0; i<len; i++) {
			child = children[i];
			// if this level child has children, look at them
			if(child.children !== undefined && child.children.length > 0) {
				highestLevel = getHighestMenuLevelFromChildren(child.children, nextLevel); 
				if(highestLevel > currentLevel) {
					break;
				}
			}
		}

		return highestLevel;
	};

	//---------------------------------------------------------
	// Given the css id of a menu item, perform its action.
	var doActionFor = function (id) {

		var allContent = getContentFromId(id);
		var content;
		var itemId = getItemIdFromId(id);
		var found = false;
		var len = allContent.length;
		var i;

		for(i=0; i<len; i++) {
			content = allContent[i];
			if(content.id === itemId) {
				found = true;
				break;
			}
		}

		if(found) {
			eval(content.action);
		}

	};

	//---------------------------------------------------------
	var setRadioButton = function (group, index) {

		//console.log("setRadioButton %s, %s",group,index);
		var inputs = document.getElementsByTagName('input');
		var tmp;
		var radios = [];
		var len = inputs.length;
		var i;

		for(i=0; i<len; i++) {
			tmp = inputs[i];
			if(tmp.name === group) {
				radios[radios.length] = tmp;
			}
		}

		if(radios.length > index) {
			manageRadioButtonGroup(radios[index]);
		}

	};

	//---------------------------------------------------------
	var viewUpdate = function (changes) {

		if(changes.hideMenu) {
			hideMenus(-1);
		}
	};

	//---------------------------------------------------------
	// expose 'public' properties
	//---------------------------------------------------------
	// don't leave a trailing ',' after the last member or IE won't work.
	return {
		initialise: initialise,
		viewUpdate: viewUpdate,
		setRadioButton: setRadioButton,
		readMenuStructureCallback: readMenuStructureCallback,
		readMenuContentCallback: readMenuContentCallback,
		makeMenuVisible: makeMenuVisible
	};

}; // end of module emapMenu
//----------------------------------------------------------------------------
