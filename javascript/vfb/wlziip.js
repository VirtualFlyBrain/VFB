/**
 * Interface tools for interfacing with the WlzIIPsrv
 *
 * @author rcourt1977
 * @param template
 */



 function loadTemplateMeta(id) {
   if (id){
     file = "/data/" + fileFromId(id).replace("composite.wlz","meta.json");
     $.getJSON( file, function( data ) {
       $.each( data, function( key, val ) {
         parent.$("body").data(key,val);
       });
       if (parent.$("body").data("meta").center !== undefined && (parent.$("body").data("current") === undefined || parent.$("body").data("current").fxp == "0.0,0.0,0.0" || parent.$("body").data("current").fxp == "0,0,0")){
         parent.$("body").data("current").fxp = parent.$("body").data("meta").center;
         alert(parent.$("body").data("meta").center);
       }
       updateWlzDisplay();
     });
   }
 }

 function fileFromId(id) {
   var file = "";
   if (id){
     id = id.replace(":","_");
     if (id.indexOf("VFBt_") > -1){
       file = id.replace("00000", "").replace("VFBt_","VFB/t/") + "/composite.wlz";
     }else if (id.indexOf("VFBi_") > -1){
       file = "VFB/i/" + id.substr(5,9) + "/" + id.substr(9,13) + "/volume.wlz";
     }else if (id.indexOf("VFB_") > -1){
       file = "VFB/i/" + id.substr(4,8) + "/" + id.substr(8,12) + "/volume.wlz";
     }
   }
   return file;
 }

function updateWlzDisplay(){
  $.cookie("displaying", JSON.stringify(parent.$("body").data()), { path: '/' });
  $("#left-panel").text(JSON.stringify(parent.$("body").data()));
}

function addToWlzDisplay(ids){
  if (ids !== undefined && ids !== null) {
    var id;
    var text;
    var selected;
    var layers;
    for (id in ids) {
      id = id.replace(":","_");
      if (id.indexOf("VFBt_") > -1){
       id = id.replace("00000", "");
       if (id != parent.$("body").data("current").template){
         text = '{ "template": "' + id + '", scl: 1.0,mod:"zeta",dst:0,pit:0,yaw:0,rol:0,qlt:80,cvt:"png",fxp:"0.0,0.0,0.0",blend:"screen",inverted:false}';
         parent.$("body").data("current",text);
         loadTemplateMeta(id);
         if (!parent.$("body").data(id)){
           text = '{"' + id + '":{"selected":{"0":{"id":"' + parent.$("body").data("meta").id.replace('VFBt_','VFBd_') + '","colour":"auto","visible":true}}}}';
           parent.$("body").data(id,text);
         }
       }
      }else if (id.indexOf("VFBi_") > -1){
        selected = parent.$("body").data(parent.$("body").data("current").template).selected;
        if (JSON.stringify(selected).indexOf(id) > -1){

        }else{
          layers = Object.keys(selected).length;
          text = '{' + layers + ':{"id":,"' + id + '","colour":"auto","visible":true}}';
          selected.push(text);
        }
      }else if (id.indexOf("VFB_") > -1){
       file = "VFB/i/" + id.substr(4,8) + "/" + id.substr(8,12) + "/volume.wlz";
      }
    }
  }
}

function animateWlzDisplay(){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 1024;
  canvas.height = 681;
  function step() {
    selected = parent.$("body").data(parent.$("body").data("current").template).selected;
    if (selected){
      var layers = Object.keys(selected).length;
      if (layers > 0){
        var count = 0;
        var image = [];
        for (i=0; i < layers; i++) {
          if (selected[i].visible){
            image[i] = document.createElement('img');
            image[i].src = generateWlzURL(i);
            if (count===0){
              ctx.clearRect (0,0,500,500);
              ctx.globalCompositeOperation = 'source-over';
            }
            ctx.drawImage(image[i], 0, 0);
            if (count===0){
              ctx.globalCompositeOperation = parent.$("body").data("current").blend;
            }
            count++;
          }
        }
      }
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function loadColours(){
  file = "/data/VFB/colours200.csv";
  $.get(file, function(data) {
    var lines = data.split("\n");
    parent.$("body").data("colours", lines);
    updateWlzDisplay();
  });
}

function initWlzDisplay(ids) {
  if (!jQuery.cookie('displaying')) {
   loadTemplateMeta("VFBt_001");
   var count = 0;
   var text = '{ "template": "VFBt_001","scl":1.0,"mod":"zeta","dst":0.0,"pit":0.0,"yaw":0.0,"rol":0.0,"qlt":80,"cvt":"png","fxp":"' + parent.$("body").data.centre + '","alpha": 100,"blend":"screen","inverted":false}';
   parent.$("body").data("current", JSON.parse(text));
   parent.$("body").data("VFBt_001", { selected: {
     0: { id: "VFBt_00100000", colour: "auto", visible: true }
   }});
   if (ids !== undefined && ids !== null && ids !== "") {
     var id;
     text = "";
     for (id in ids) {
       count ++;
       text = '{ selected: { " + count + ": { id: "' + id + '", colour: "auto", visible: true }}}';
       parent.$("body").data("VFBt_001", text);
     }
   }
   updateWlzDisplay();
  }
  parent.$("body").data(JSON.parse($.cookie("displaying")));
  loadTemplateMeta(parent.$("body").data("current").template);

  updateWlzDisplay();
 }

 function generateWlzURL(index){
   var current = parent.$("body").data("current");
   var selected = parent.$("body").data(current.template).selected;
   var layer = selected[index];
   var file = fileFromId(layer.id);
   var colour = "255,255,255";
   if (layer.colour !== "auto"){
     colour = layer.colour;
   }else{
     if (parent.$("body").data("colours") === undefined){
       loadColours();
     }else{
       colour = parent.$("body").data("colours")[index];
     }
   }
   var text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&sel=" + layer.id.substr(9) + "," + colour + "&mod=" + current.mod + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + current.dst + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
   return text;
 }
