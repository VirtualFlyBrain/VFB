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
       $("body").data(key, val);
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

 function initWlzDisplay() {
   if (!jQuery.cookie('displaying')) {
     loadTemplateMeta("VFBt_001");
     $("body").data("current", { template: "VFBt_001",
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
     $("body").data("VFBt_001", { selected: {
       0: { id: "VFBt_00100000", colour: "255,0,255", visible: true }<c:if test="${empty param.add}">,
       1: { id: "${param.add}", colour: "0,255,0", visible: true }</c:if>
     }});
     $.cookie("displaying", JSON.stringify($("body").data()), { path: '/' });
   };
   $("body").data(JSON.parse($.cookie("displaying")));
   $("body").bind('changeData', function(e){
     alert("change in data");
     $.cookie("displaying", JSON.stringify($("body").data()), { path: '/' });
   });
   loadTemplateMeta($("body").data("current").template);
   $("#right_panel").text($("body").data("meta").center);
   var disp = $("body").data();
   $("#emapIIPViewerDiv").text(JSON.stringify(disp));
 }
