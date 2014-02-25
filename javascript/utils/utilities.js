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
//the 'if' prevents overwriting existing namespace
//---------------------------------------------------------
if(!emouseatlas) {
	var emouseatlas = {};
}
if(!emouseatlas.emap) {
	emouseatlas.emap = {};
}

//---------------------------------------------------------
//encapsulating utilities in an object preserves namespace
//---------------------------------------------------------
if(!emouseatlas.emap.utilities) {

	emouseatlas.emap.utilities = {

			// the DOM node types
			//---------------------------------------------------------
			ELEMENT_NODE:                      1,
			ATTRIBUTE_NODE:                    2,
			TEXT_NODE:                         3,
			COMMENT_NODE:                      8,
			DOCUMENT_NODE:                     9,
			DOCUMENT_FRAGMENT_NODE:           11,
			//---------------------------------------------------------


			//---------------------------------------------------------
			doDebug: function () {
				alert("utilities");
			},

			//---------------------------------------------------------
			whichKeyPressed: function (e) {
				var character = String.fromCharCode(getKeyCode(e));
				alert('Character was ' + character);
			},

			//---------------------------------------------------------
			getKeyCode: function (e) {
				var code;
				if(!e) {
					var e = window.event;
				}
				if(e.keyCode) {
					code = e.keyCode;
				} else if(e.which) {
					code = e.which;
				}
				return code;
			},

			//---------------------------------------------------------
			getEventType: function (e) {
				if (!e) var e = window.event;
				return e.type;
			},

			//---------------------------------------------------------
			getTarget: function (e) {
				var trgt;
				if (!e) var e = window.event;
				if (e.target) {  // firefox
					trgt = e.target;
				} else if (e.srcElement) { // IE
					trgt = e.srcElement;
				}
				if (trgt.nodeType == 3) { // defeat Safari bug for text objects
					trgt = trgt.parentNode;
				}
				return trgt;
			},

			//---------------------------------------------------------
			whichMouseButtons: function (e) {

				var left = false; 
				var middle = false; 
				var right = false; 

				if (!e) {
					var e = window.event;
				}

				if (e.which) { // not supported by IE
					if(e.which === 1) {
						left = true;
					} else if(e.which === 2) {
						middle = true;
					} else if(e.which === 3) {
						right = true;
					}
				} else if (e.button) { // supported by everyone
					if(e.button === 1) {
						left = true;
					} else if(e.button === 4) {
						middle = true;
					} else if(e.button === 2) {
						right = true;
					}
				}
				var buttons = {left:left, middle:middle, right:right};

				return buttons;
			},

			//---------------------------------------------------------
			whichModifierKeys: function (e) {
				if (!e) {
					var e = window.event;
				}
				var shift = e.shiftKey;
				var ctrl = e.ctrlKey;
				var meta = e.metaKey;
				var alt = e.altKey;
				var modifiers = {shift:shift, ctrl:ctrl, meta:meta, alt:alt};

				return modifiers
			},

			//---------------------------------------------------------
			isRightMouse: function (e) {
				var rightclick;
				if (!e) {
					var e = window.event;
				}
				if (e.which) { // not supported by IE
					rightclick = (e.which === 3);
				} else if (e.button) { // supported by everyone
					rightclick = (e.button === 2);
				}
				return rightclick;
			},

			//---------------------------------------------------------
			addEvent: function(obj, evType, fn, useCapture) {
				if(obj === undefined || obj === null) {
					return false;
				}

				if (obj.addEventListener){
					obj.addEventListener(evType, fn, useCapture);
					return true;
				} else if (obj.attachEvent){
					var r = obj.attachEvent("on"+evType, fn);
					return r;
				} else {
					alert("Handler for "+evType+" on "+fn+" could not be attached");
				}
			},

			//---------------------------------------------------------
			removeEvent: function(obj, evType, fn, useCapture) {
				if (obj.removeEventListener){
					obj.removeEventListener(evType, fn, useCapture);
					return true;
				} else if (obj.detachEvent){
					var r = obj.detachEvent("on"+evType, fn);
					return r;
				} else {
					alert("Handler could not be removed");
				}
			},

			//---------------------------------------------------------
			cancelEvent: function (e) {
				if (!e) var e = window.event;
				if(e.stopPropagation) {
					e.stopPropagation();
				} else {
					e.cancelBubble = true;
				}
			},

			//---------------------------------------------------------
			// based on http://www.quirksmode.org/js/events_properties.html#position
			// posx contains the mouse position relative to the document
			getMouseX: function (e) {
				var posx = 0;
				if (!e) {
					var e = window.event;
				}
				if (e.pageX) {
					posx = e.pageX;
				} 
				else if (e.clientX) {
					posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				}
				return posx;
			},

			//---------------------------------------------------------
			// based on http://www.quirksmode.org/js/events_properties.html#position
			// posy contains the mouse position relative to the document
			getMouseY: function (e) {
				var posy = 0;
				if (!e) {
					var e = window.event;
				}
				if (e.pageY) {
					posy = e.pageY;
				} else if (e.clientY) {
					posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				}
				return posy;
			},

			//---------------------------------------------------------
			// from  http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
			getScrollXY: function () {
				var scrOfX = 0, scrOfY = 0;
				if( typeof( window.pageYOffset ) == 'number' ) {
					//Netscape compliant
					scrOfY = window.pageYOffset;
					scrOfX = window.pageXOffset;
				} else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
					//DOM compliant
					scrOfY = document.body.scrollTop;
					scrOfX = document.body.scrollLeft;
				} else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
					//IE6 standards compliant mode
					scrOfY = document.documentElement.scrollTop;
					scrOfX = document.documentElement.scrollLeft;
				}
				return [ scrOfX, scrOfY ];
			},

			//---------------------------------------------------------
			// from http://www.quirksmode.org/js/findpos.html
			//---------------------------------------------------------
			findPos: function (obj) {

				if(obj === null || obj === undefined) {
					return undefined;
				}

				var curleft = curtop = 0;

				//If the browser supports offsetParent we proceed.
				if (obj.offsetParent) {

					//Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.

					do {
						curleft += obj.offsetLeft;
						curtop += obj.offsetTop;

						//Now we get to the tricky bit:
					} while (obj = obj.offsetParent);

					// No, this is not a syntax error. I don't want to use == to compare obj to obj.offsetParent
					// (that doesn't make sense anyhow, since an element is never equal to its offsetParent).
					// Instead, I use the = assignment operator to change the value of obj to obj.offsetParent.

					// The loop continues until the object currently being investigated does not have an offsetParent any more.
					// While the offsetParent is still there, it still adds the offsetLeft of the object to curleft, and the offsetTop to curtop.

					//Finally, when the while loop has quit, we return an array with the calculated coordinates to whichever script asked for it.
				}

				//return [curleft,curtop];
				return {x:curleft, y:curtop};
			},

			//---------------------------------------------------------
			// IE8 reports clientWidth/Height as 0 :^(
			//---------------------------------------------------------
			getViewportDims: function (element) {
				var h = 0;
				var w = 0;

				if(element.clientWidth) {
					w = element.clientWidth;
				} else if(element.innerWidth) {
					w = element.innerWidth;
				} else if(element.offsetWidth) {
					w = element.offsetWidth;
				}

				if(element.clientHeight) {
					h = element.clientHeight;
				} else if(element.innerHeight) {
					h = element.innerHeight;
				} else if(element.offsetTop) {
					h = element.offsetTop;
				}

				return {width:w, height:h};
			},

			//---------------------------------------------------------
			clearSelect: function (sel) {
				sel.options.length = 0;
			},

			//---------------------------------------------------------
			printNodes: function (node, chi, tab, skip) {
				var children = null;
				var len = 0;
				var i = 0;
				var id = null;
				var type = null;
				var indent = tab ? tab : "   ";
				var child = chi ? chi : -1;
				var images;

				//console.log("printNodes\n",skip);
				if(node) {
					type = node.nodeType;

					switch(type) {
					case emouseatlas.emap.utilities.ELEMENT_NODE:
						id = node.id;
						cl = node.className;
						children = node.childNodes;
						if(children) {
							len = children.length;
						}
						if(child === -1) {
							console.log("%sELEMENT_NODE, id %s", indent, id);
						} else {
							console.log("%schild %d: ELEMENT_NODE, id %s, class %s", indent, child, id, cl);
						}
						for(i=0; i<len; i++) {
							if(emouseatlas.emap.utilities.canSkip(children[i].id, skip)) {
								continue;
							} else {
								this.printNodes(children[i], i+1, indent+"\t", skip);
								//console.log(children[i].childNodes);
							}
						}
						break;
					case emouseatlas.emap.utilities.ATTRIBUTE_NODE:
						if(child === -1) {
							console.log("%sATTRIBUTE_NODE", indent);
						} else {
							console.log("%schild #%d ATTRIBUTE_NODE", indent, child);
						}
						break;
					case emouseatlas.emap.utilities.TEXT_NODE:
						if(child === -1) {
							console.log("%sTEXT_NODE = %s", indent, node.data);
						} else {
							console.log("%schild #%d TEXT_NODE = %s", indent, child, node.data);
						}
						break;
					case emouseatlas.emap.utilities.COMMENT_NODE:
						if(child === -1) {
							console.log("%sCOMMENT_NODE", indent);
						} else {
							console.log("%schild #%d COMMENT_NODE", indent, child);
						}
						break;
					case emouseatlas.emap.utilities.DOCUMENT_NODE:
						if(child === -1) {
							console.log("%sDOCUMENT_NODE", indent);
						} else {
							console.log("%schild #%d DOCUMENT_NODE", indent, child);
						}
						break;
					case 11:
						if(child === -1) {
							console.log("%sDOCUMENT_FRAGMENT_NODE", indent);
						} else {
							console.log("%schild #%d DOCUMENT_FRAGMENT_NODE", indent, child);
						}
						break;
					default:
						if(child === -1) {
							console.log("%sunknown nodeType %d", indent, type);
						} else {
							console.log("%schild #%d unknown nodeType %d", indent, child, type);
						}
					break;
					} // switch
				}

				return false;
			}, // printNodes

			//---------------------------------------------------------
			canSkip: function (id, skip) {
				//console.log("canSkip\n");
				for(i in skip) {
					if(skip[i] === id) {
						return true;
					}
				}
				return false;
			}, // canSkip

			//---------------------------------------------------------
			removeChildNodes: function (node) {
				//console.log("removeChildNodes\n");
				if(node) {
					//emouseatlas.emap.utilities.printNodes(node);
					//console.log("innerHTML = ",node.innerHTML);
					node.innerHTML = "";
				}
				return false;
			}, // removeChildNodes

			//---------------------------------------------------------
			/**
			 *   @param options an array of options from a Select object.
			 *   There will be <span> elements for highlighting.
			 *   @param sel if true return the selected options, otherwise return the non-selected ones.
			 *   @return an array of the text value of the selected options.
			 */
			getSelectedOptions: function (options, sel) {

				var len = options.length;
				var invert = sel?!sel:false;  // if this param is omitted assume we want selected ones.
				var selected = [];
				var i = 0;
				var text = null;

				//console.log("invert = ", invert);

				for(i=0; i<len; i++) {
					text = emouseatlas.emap.utilities.getOptionText(options[i]);
					if(invert) {
						if(!options[i].selected) {
							selected.push(text);
						}
					} else {
						if(options[i].selected) {
							selected.push(text);
						}
					}
				}
				return selected;

			}, // getSelectedOptions

			//---------------------------------------------------------
			/**
			 *   @param option an option from a Select object. It may contain <span> elements for highlighting.
			 *   @return the combined text of the option.
			 */
			getOptionText: function (option) {

				var len = -1;
				var i = 0;
				var textNodes = [];
				var children = null;
				var child = null;

				if(option.nodeType !== emouseatlas.emap.utilities.ELEMENT_NODE) {
					//console.log("getOptionText: wrong option type %d", option.nodeType);
					return false;
				}

				children = option.childNodes;
				len = children.length;

				for(i=0; i<len; i++) {
					child = children[i];
					if(child.nodeType === emouseatlas.emap.utilities.TEXT_NODE) {
						textNodes[textNodes.length] = child.nodeValue;
					} else if(child.nodeType === emouseatlas.emap.utilities.ELEMENT_NODE) {
						textNodes[textNodes.length] = child.firstChild.nodeValue;
					}
				}

				//console.log("getOptionText: textNodes =  ", textNodes);

				return textNodes.join("");

			}, // getOptionText

			//---------------------------------------------------------
			/**
			 *   Remove given things from an array.
			 *   @param orig the original array of things.
			 *   @param toRemove an array of things to remove.
			 *   @return the depleted array.
			 */
			removeFromArray: function (orig, toRemove) {

				var len = 0;
				var depleted = orig.slice(); // make a copy of the original to work on
				var indx = -1;
				var i = 0;

				if(orig.length <= 0) {
					return null;
				}
				if(toRemove.length <= 0) {
					return orig;
				}

				len = toRemove.length;
				for(i=0; i<len; i++) {
					// indx = depleted.indexOf(toRemove[i]); // IE doesn't support indexOf for array
					indx = emouseatlas.emap.utilities.getArrayIndexOf(depleted, toRemove[i], true);
					if(indx !== -1) {
						depleted.splice(indx, 1);
					}
				}
				return depleted;
			},

			//---------------------------------------------------------
			/**
			 *   Recursively removes duplicates from an array.
			 *   @param orig the original array of things.
			 *   @return the array with no duplicates.
			 */
			removeDuplicatesFromArray: function (original) {

				var len = 0;
				var depleted = original.slice(); // make a copy of the original to work on
				var indx = -1;
				var lastIndx = -1;
				var i = 0;

				if(original.length <= 0) {
					return null;
				}

				len = original.length;
				for(i=0; i<len; i++) {
					// indx = depleted.indexOf(original[i]);
					indx = emouseatlas.emap.utilities.getArrayIndexOf(depleted, original[i], true);
					if(indx === -1) {
						//console.log(original[i], "not found");
						continue;
					} else {
						// lastIndexOf searches from last to first
						//lastIndex = depleted.lastIndexOf(original[i]);
						lastIndex = emouseatlas.emap.utilities.getArrayIndexOf(depleted, original[i], false);
						if(lastIndex !== indx) {
							//console.log(original[i], "has duplicate which will be removed");
							depleted.splice(lastIndex,1);
							emouseatlas.emap.utilities.removeDuplicatesFromArray(depleted);
						}
					}
				}
				return depleted;
			},

			//---------------------------------------------------------
			/**
			 *   Recursively removes <tags> from a string.
			 *   @param orig the original string.
			 *   @return the string with no tags.
			 */
			removeTagsFromString: function (original) {

				//console.log("removeTagsFromString %s", original);

				var len = 0;
				var stripped = original; // make a copy of the original to work on
				var startIndx = -1;
				var endIndx = -1;
				var tag = "";
				var i = 0;

				if(original.length <= 0) {
					return original;
				}

				len = original.length;
				for(i=0; i<len; i++) {
					startIndx = original.indexOf("<");
					if(startIndx < 0) {
						//console.log(original, "no start tags found");
						return original;
					} else {
						endIndx = original.indexOf(">");
						if(endIndx <= 0) {
							//console.log(original, "no end tags found");
							return original;
						}
						if(endIndx > startIndx && endIndx < len) {
							tag = original.substring(startIndx, endIndx+1);
							//console.log("%s has tag %s which will be removed", original, tag);
							stripped = original.replace(tag, "");
							//console.log("stripped = %s", stripped);
							return emouseatlas.emap.utilities.removeTagsFromString(stripped);
						}
					}
				}
			},

			//--------------------------------------------------------------
			getFilenameFromPath: function (fullpath) {

				if(typeof(fullpath) !== 'string') {
					return undefined;
				}

				var indx = fullpath.lastIndexOf('/');
				if(indx === -1) {
					return fullpath;
				}

				var name = fullpath.substring(indx+1);
				//console.log("getFilenameFromPath: %s",name);
				return name;
			},

			//---------------------------------------------------------
			/**
			 *   Get the index of an object in an array. (indexOf is not supported by IE.)
			 *   @param arr the array.
			 *   @param obj the object whose index we want to find in the array.
			 *   @param ascending is true if we are starting at indx 0.
			 *   @return the index if found or -1 if not.
			 */
			getArrayIndexOf: function (arr, obj, ascending) {

				var len = -0;
				var indx = -1;
				var i = 0;

				//console.log("getArrayIndexOf: %s", obj);

				if(!arr) {
					return -1;
				}
				if(!obj) {
					return -1;
				}

				len = arr.length;
				if(ascending) {
					for(i=0; i<len; i++) {
						if(arr[i] === obj) {
							indx = i;
							break;
						}
					}
				} else {
					for(i=len; i>0; i--) {
						if(arr[i-1] === obj) {
							indx = i-1;
							break;
						}
					}
				}

				return indx;
			},

			//---------------------------------------------------------
			/**
			 *   Trims white-space from a string
			 *   @param str the original string.
			 *   @return the string with no surrounding white-space.
			 */
			trimString: function(str) {
				return str.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
			},

			//---------------------------------------------------------
			/**
			 *   Trims trailing zeros from a string
			 *   @param str the original string.
			 *   @return the string with no trailing zeros.
			 */
			trimTrailingZeros: function(str) {
				return str.replace(/([0-9]*\.[0-9]*[1-9]+)0+$/, "$1");
			},

			//---------------------------------------------------------
			/**
			 *   Sets precision on a string representation of a number.
			 *   @param str the original string.
			 *   @param prec the precision specifier.
			 *   @return the string to the specified precision.
			 */
			setPrecision: function(str, prec) {
				var flt = parseFloat(str);
				return flt.toPrecision(prec);
			},

			//---------------------------------------------------------
			/**
			 *   Sorts alphabetically, ignoring case.
			 *   @param str1 the first string to compare.
			 *   @param str2 the second string to compare.
			 *   Assumes sort in ascending order.
			 *   Internet Explorer doesn't like this (number expected)
			 *   @return the result of the comparison.
			 */
			sortIgnoreCase: function(str1, str2) {
				var ret = 0;
				str1 = str1.toLowerCase();
				str2 = str2.toLowerCase();

				if(str1 === str2) {
					ret = 0;
				} else if(str1 > str2) {
					ret = 1;
				} else if(str1 < str2) {
					ret = -1;
				}

				return ret;
			},

			//---------------------------------------------------------
			/**
			 *   Converts a hex colour value to RGB (0 - 255).
			 *   based on http://www.javascripter.net/faq/hextorgb.htm
			 */
			hexToRGB: function(hexcol) {

				//console.log("hexToRGB: hexcol %s",hexcol);

				var hexnum = (hexcol.charAt(0) === "#") ? hexcol.substring(1,7) : hexcol;

				var R = parseInt(hexnum.substring(0,2),16);
				var G = parseInt(hexnum.substring(2,4),16);
				var B = parseInt(hexnum.substring(4,6),16);

				return {r:R, g:G, b:B};
			},

			//---------------------------------------------------------
			//   Adds 'button' style to a div
			//---------------------------------------------------------
			addButtonStyle: function(buttonDivId) {

				var elem = document.getElementById(buttonDivId);
				var klass = elem.className;
				emouseatlas.emap.utilities.addEvent(elem,
						'mouseover',
						function(){emouseatlas.emap.utilities.addMouseOverStyle(elem, klass)},
						false);
				emouseatlas.emap.utilities.addEvent(elem,
						'mouseout',
						function(){emouseatlas.emap.utilities.addMouseOutStyle(elem, klass)},
						false);
				emouseatlas.emap.utilities.addEvent(elem,
						'mousedown',
						function(){emouseatlas.emap.utilities.addMouseDownStyle(elem, klass)},
						false);
				emouseatlas.emap.utilities.addEvent(elem,
						'mouseup',
						function(){emouseatlas.emap.utilities.addMouseUpStyle(elem, klass)},
						false);
			},

			//---------------------------------------------------------
			addMouseOverStyle: function(elem, klass) {
				elem.className = klass + " over";
			},

			//---------------------------------------------------------
			addMouseOutStyle: function(elem, klass) {
				elem.className = klass + " out";
			},

			//---------------------------------------------------------
			addMouseDownStyle: function(elem, klass) {
				elem.className = klass + " down";
			},

			//---------------------------------------------------------
			addMouseUpStyle: function(elem, klass) {
				elem.className = klass + " up";
			},

			//---------------------------------------------------------
			pause: function(msecs) {
				var start = new Date();
				var actualDelay;
				while (true) {
					var now = new Date();
					actualDelay = now - start;
					if(msecs <= actualDelay) break;
				}
				return actualDelay;
			},

			//---------------------------------------------------------
			testIFrame: function() {
				alert("iframe");
			},

			//---------------------------------------------------------------
			// returns the html anchor text including tags.
			//---------------------------------------------------------------
			textContainsLink: function (txt) {
				var pattern = /<a..*\/a>/;
				var matched = pattern.exec(txt);

				if(matched !== undefined && matched !== null && matched.length > 0) {
					return matched[0];
				} else {
					return undefined;
				}
			},

			//---------------------------------------------------------------
			// returns an object containing pre-anchor string, link text, post-anchor string
			//---------------------------------------------------------------
			getLinkInfo: function (txt, anchor) {
				var anchorStart = txt.indexOf(anchor);
				var len = anchor.length;
				var anchorStop = anchorStart + anchor.length;
				var linkInfo = [];

				linkInfo[0] = txt.substring(0, anchorStart); 
				linkInfo[1] = this.getLinkText(anchor);
				linkInfo[2] = txt.substring(anchorStop); 

				return linkInfo;
			},

			//---------------------------------------------------------------
			// returns the link text of an html anchor string
			//---------------------------------------------------------------
			getLinkText: function (anchor) {
				var pattern = />..*</;
				var matched = pattern.exec(anchor);

				var match = matched[0].substring(1);
				match = match.substring(0, match.length-1);

				return match;
			},

			//---------------------------------------------------------------
			// returns the href part of an anchor.
			//---------------------------------------------------------------
			getLinkHref: function (anchor) {
				var pattern = /'..*'/;
				var matched = pattern.exec(anchor);
				var url = matched[0].substring(1,matched[0].length-1);
				return url;
			},

			//---------------------------------------------------------
			/**
			 * Common code used to initialise MooTools drag classes.
			 */
			getDragOpts: function (container, updateDelay, bind, handle) {

				return {
					container: container,
					snap: 0,
					handle: handle,

					onStart: function() {
						this.dragging = false;
						this.updateDelay = updateDelay;//milliseconds
					}.bind(bind),

					onDrag: function() {
						if (!this.dragging) {
							this.handleDrag(false);
							if (this.updateDelay != 0) {
								this.dragging = true
								setTimeout(function() {
									this.dragging = false;
								}.bind(bind) ,this.updateDelay);
							}
						}
					}.bind(bind),

					onComplete: function() {
						this.handleDrag(true);
					}.bind(bind)
				};

			}, // getDragOpts

			//----------------------------------------------------
			/**
			 * Retrieves absolute offset coordinates of an element on a page 
			 * Example usage: var x = getOffset( documen.getElementById('yourElId') ).left;
			 * @author: nmilyaev
			 */
			getOffset : function (el) {
				var _x = 0;
				var _y = 0;
				while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
					_x += el.offsetLeft - el.scrollLeft;
					_y += el.offsetTop - el.scrollTop;
					el = el.offsetParent;
				}
				return { top: _y, left: _x };
			}// getOffset

			//---------------------------------------------------------

	}; // emouseatlas.emap.utilities
}
