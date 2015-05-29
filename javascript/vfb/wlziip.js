/**
 * Interface tools for interfacing with the WlzIIPsrv
 *
 * @author rcourt1977
 * @param template
 */

 function loadTemplateMeta(id) {
   file = "/data/" + fileFromId(id).replace("composite.wlz","meta.json");
   $.getJSON( file, function( data ) {
     var items = [];
     $.each( data, function( key, val ) {
       alert(key);
       parent.$("body").data(key,val);
       alert(JSON.stringify(parent.$("body").data()))
     });
   });
 }

 function fileFromId(id) {
   id = id.replace(":","_");
   var file = "";
   if (id.indexOf("VFBt_") > -1){
     file = id.replace("00000", "").replace("VFBt_","VFB/t/") + "/composite.wlz";
   }else if (id.indexOf("VFBi_") > -1){
     file = "VFB/i/" + id.substr(5,9) + "/" + id.substr(9,13) + "/volume.wlz";
   }else if (id.indexOf("VFB_") > -1){
     file = "VFB/i/" + id.substr(4,8) + "/" + id.substr(8,12) + "/volume.wlz";
   }
   return file;
 }

 function initWlzDisplay(ids) {
   if (!jQuery.cookie('displaying')) {
     loadTemplateMeta("VFBt_001");
     var count = 0;
     parent.$("body").data("current", { template: "VFBt_001",
                                  scl: 1.0,
                                  mod: "zeta",
                                  dst: 0,
                                  pit: 0,
                                  yaw: 0,
                                  rol: 0,
                                  qlt: 80,
                                  cvt: "png",
                                  fxp: "0.0,0.0,0.0"
                                });
     parent.$("body").data("VFBt_001", { selected: {
       0: { id: "VFBt_00100000", colour: "255,0,255", visible: true }
     }});
     if (ids !== undefined && ids !== null) {
       var id;
       var text = "";
       for (id in ids) {
         count ++;
         text = '{ selected: { " + count + ": { id: "' + id + '", colour: "0,255,0", visible: true }}}';
         parent.$("body").data("VFBt_001", text);
       }
     }
     $.cookie("displaying", JSON.stringify(parent.$("body").data()), { path: '/' });
   }
   parent.$("body").data(JSON.parse($.cookie("displaying")));
   parent.$("body").bind('changeData', function(e){
     alert("change in data");
     $.cookie("displaying", JSON.stringify($("body").data()), { path: '/' });
   });
   loadTemplateMeta(parent.$("body").data("current").template);
   var disp = $("body").data();
   $("#emapIIPViewerDiv").text(JSON.stringify(disp));
 }
