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
 }
