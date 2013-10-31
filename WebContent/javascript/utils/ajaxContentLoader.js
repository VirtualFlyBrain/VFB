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
//   Ajax content loader based on 'Ajax in Action' listing 3.1
//   We can't use a singleton (module) for this as multiple ajax asynchronous calls may be made.
//---------------------------------------------------------

//---------------------------------------------------------
//   Namespace:
//---------------------------------------------------------
if(!emouseatlas) {
   var emouseatlas = {};
}
if(!emouseatlas.emap) {
   emouseatlas.emap = {};
}

//---------------------------------------------------------
// AjaxContentLoader
//---------------------------------------------------------
emouseatlas.emap.ajaxContentLoader = function () {

   //---------------------------------------------------------
   //   private members
   //---------------------------------------------------------
   var READY_STATE_UNINITIALIZED = 0;
   var READY_STATE_LOADING = 1;
   var READY_STATE_LOADED = 2;
   var READY_STATE_INTERACTIVE = 3;
   var READY_STATE_COMPLETE = 4;

   var req = null;
   var ready = null;
   var httpStatus = null;
   var url = null;
   var urlParams = null;
   var callback = null;
   var onError = null;
   var method = null;
   var params = null;
   var contentType = null;

   var responseText = null;
   var loadResponseParams = null;

   //---------------------------------------------------------
   //   private methods
   //---------------------------------------------------------
   var readyState = function() {
      if(req) {
         ready = req.readyState;
	 try {
	    httpStatus = req.status;
	 }
	 catch(e) {
	    //console.log("readyState: problem with status");
	 }
	 if(ready === READY_STATE_COMPLETE) {
	    if(httpStatus === 200 | httpStatus === 0) {
	       //console.log("readyState: calling callback with response = "+req.responseText);
	       callback(req.responseText, urlParams);
	    } else {
	       defaultError();
	    }
	 }
      }
   } // readyState

   //---------------------------------------------------------
   var defaultError = function() {
      //console.log("ERROR fetching data!\n\n","readyState: ",req.readyState,"\nstatus: ",req.status.statusText,"\nheaders: ",req.getAllResponseHeaders());
   }

   //---------------------------------------------------------
   var myload = function() {
      responseText = req.responseText;
      //console.log("fetching data!\n\n",req.responseText,"\n\nreadyState: ",req.readyState,"\nstatus: ",req.status,"\nheaders: ",req.getAllResponseHeaders());
   }

   //---------------------------------------------------------
   //   privileged methods
   //---------------------------------------------------------
   /**
    *   @param loadResponseParams is an object of the form
    *   {
    *    url:myUrl,
    *    method:myMethod,
    *    callback:myCallback,
    *    contentType:myContentType,
    *    urlParams:myUrlParams,
    *    async:true,
    *    noCache:false
    *   } 
    */
   this.loadResponse = function (loadResponseParams) {

      //console.log("enter loadResponse");
      if(req === null || req === undefined) {
	 url = loadResponseParams.url;
	 // set up default values
	 method = (typeof loadResponseParams.method === 'undefined') ? "POST" : loadResponseParams.method;
	 callback = (typeof loadResponseParams.callback === 'undefined') ? myload : loadResponseParams.callback;
	 async = (typeof loadResponseParams.async === 'undefined') ? false : loadResponseParams.async;
	 noCache = (typeof loadResponseParams.noCache === 'undefined') ? false : loadResponseParams.noCache;
	 contentType = (typeof loadResponseParams.contentType === 'undefined') ? "application/x-www-form-urlencoded" : loadResponseParams.contentType;
	 urlParams = (typeof loadResponseParams.urlParams === 'undefined') ? "" : loadResponseParams.urlParams;
      } else {
         if(req.readyState !== READY_STATE_UNINITIALIZED) {
	    //console.log("loadResponse can't do ajax request for ",loadResponseParams.url);
	    return false;
	 }
      }

      if(window.XMLHttpRequest) {
         req = new XMLHttpRequest();
      } else if(window.ActiveXObject) {
         req = new ActiveXObject("Microsoft.XMLHTTP");
      }

      if(req) {
         try{
	    req.onreadystatechange = function () {
	       readyState();
	    }
	    req.open(method, url, async);
	    req.setRequestHeader("Content-Type", contentType);
	    req.send(urlParams);
	 }
	 catch(err) {
	    //console.log("loadResponse: error");
	 }
      }

      //console.log("exit loadResponse");
      return req;
   };

   //---------------------------------------------------------

} // end of function emouseatlas.emap.ajaxContentLoader
