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
       if (parent.$("body").data("meta").center !== undefined && (parent.$("body").data("current") === undefined || parent.$("body").data("current").fxp == "0.0,0.0,0.0" || parent.$("body").data("current").fxp == "0,0,0" || parent.$("body").data("current").fxp == "undefined")){
         parent.$("body").data("current").fxp = parent.$("body").data("meta").center;
       }
       updateWlzDisplay();
       initWlzControls();
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
  var save = parent.$("body").data();
  delete save.domains;
  delete save.disp;
  delete save.meta;
  delete save.colours;
  $.cookie("displaying", JSON.stringify(save), { expires: 5*365, path: '/' });
  alert('saved cookie:' + $.cookie("displaying"));
  //$("#left-panel").text(JSON.stringify(parent.$("body").data()));
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
    var selected = parent.$("body").data(parent.$("body").data("current").template).selected;
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
              if (parent.$("body").data("disp") == "scale"){
                var current = parent.$("body").data("current");
                var orientation = {Z:{W:0,H:1,D:2},Y:{W:0,H:2,D:1},X:{W:1,H:2,D:0}};
                var orient = current.slice;
                if (parent.$("body").data("meta")){
                  canvas.width = parseInt((parseInt((parseFloat(parent.$("body").data("meta").extent.split(',')[orientation[orient].W])+1)*parseFloat(current.scl))+1)*parseFloat(parent.$("body").data("meta").voxel.split(',')[orientation[orient].W]));
                  canvas.height = parseInt((parseInt((parseFloat(parent.$("body").data("meta").extent.split(',')[orientation[orient].H])+1)*parseFloat(current.scl))+1)*parseFloat(parent.$("body").data("meta").voxel.split(',')[orientation[orient].H]));
                }
                parent.$("body").data("disp", "done");
              }
              if (selected[0].visible === false || parent.$("body").data("disp") == "clear"){
                ctx.clearRect (0,0,ctx.canvas.width,ctx.canvas.height);
                parent.$("body").data("disp", "done");
              }
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
   var text = '{ "template": "VFBt_001","scl":1.0,"mod":"zeta","slice":"Z","dst":0.0,"pit":0.0,"yaw":0.0,"rol":0.0,"qlt":80,"cvt":"png","fxp":"0,0,0","alpha": 100,"blend":"screen","inverted":false}';
   parent.$("body").data("current", JSON.parse(text));
   parent.$("body").data("VFBt_001", { selected: { 0: { id: "VFBt_00100000", colour: "auto", visible: true }}});
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
 }else{
   alert("found cookie" + $.cookie("displaying"));
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

function initWlzControls() {
   var orientation = {Z:{W:0,H:1,D:2},Y:{W:0,H:2,D:1},X:{W:1,H:2,D:0}};
   var orient = parent.$("body").data("current").slice;
   var slSlice = $("#slider-slice").bootstrapSlider({precision: 0, tooltip: 'always', handle: 'triangle', min: 1, max: parseInt(parent.$("body").data("meta").extent.split(',')[orientation[orient].D])+1, step: 1, value: parseInt(parent.$("body").data("meta").center.split(',')[orientation[orient].D])+1, focus: true});
   slSlice.on('slide', function(ev){
     orient = parent.$("body").data("current").slice;
     parent.$("body").data("current").dst = String(parseInt(ev.value)-1-parseInt(parent.$("body").data("meta").center.split(',')[orientation[orient].D]));
     $("#slider-sliceSliderVal").text(ev.value);
   });
   slSlice.on('slideStop', function(ev){
     orient = parent.$("body").data("current").slice;
     parent.$("body").data("current").dst = String(parseInt(ev.value)-1-parseInt(parent.$("body").data("meta").center.split(',')[orientation[orient].D]));
     $("#slider-sliceSliderVal").text(ev.value);
     updateWlzDisplay();
   });
   var slScale = $("#slider-scale").bootstrapSlider({precision: 1, tooltip: 'always', handle: 'triangle', scale: 'logarithmic', min: 0.1, max: 5, value: parent.$("body").data("current").scl, step: 0.1, focus: true});
   slScale.on('slide', function(ev){
     parent.$("body").data("current").scl = String(ev.value.toFixed(1));
     $("#slider-scaleSliderVal").text(String(ev.value.toFixed(1))+'x');
   });
   slScale.on('slideStop', function(ev){
     parent.$("body").data("current").scl = String(ev.value.toFixed(1));
     $("#slider-scaleSliderVal").text(String(ev.value.toFixed(1))+'x');
     updateWlzDisplay();
     parent.$("body").data("disp", "scale");
   });
   $("body").on('click', "#slider-scaleCurrentSliderValLabel", function(){
     if ($("#slider-scaleCurrentSlider").is(":visible")){
       $("#slider-scaleCurrentSlider").hide();
       $("#slider-scaleCurrentSliderValLabel .glyphicon").show();
       $("#slider-scaleCurrentSliderValLabel").removeClass("active");
     }else{
       hideAllSliders();
       $("#slider-scaleCurrentSlider").show();
       $("#slider-scaleCurrentSliderValLabel .glyphicon").hide();
       $("#slider-scaleCurrentSliderValLabel").addClass("active");
       $("#slider-scaleCurrentSlider .slider-handle.min-slider-handle").focus();
     }
   });
   $("body").on('click', "#slider-sliceCurrentSliderValLabel", function(){
     if ($("#slider-sliceCurrentSlider").is(":visible")){
       $("#slider-sliceCurrentSlider").hide();
       $("#slider-sliceCurrentSliderValLabel .glyphicon").show();
       $("#slider-sliceCurrentSliderValLabel").removeClass("active");
     }else{
       hideAllSliders();
       $("#slider-sliceCurrentSlider").show();
       $("#slider-sliceCurrentSliderValLabel .glyphicon").hide();
       $("#slider-sliceCurrentSliderValLabel").addClass("active");
       $("#slider-sliceCurrentSlider .slider-handle.min-slider-handle").focus();
     }
   });
   $("body").on('click', "#resetPosition", function(){
     hideAllSliders();
     var text = '{ "scl":1.0,"mod":"zeta","slice":"Z","dst":0.0,"pit":0.0,"yaw":0.0,"rol":0.0,"qlt":80,"cvt":"png","fxp":"0,0,0","alpha": 100,"blend":"screen","inverted":false}';
     parent.$("body").data("current").scl = 1.0;
     setOrientaion("Z");
     parent.$("body").data("current").fxp = parent.$("body").data("meta").center;
     parent.$("body").data("current").alpha = 100;
     parent.$("body").data("current").inverted = false;
     parent.$("body").data("current").blend = "screen";
     updateWlzDisplay();
     updateLabels();
   });
   $("body").on('click', "#toggle-view", function(){
     hideAllSliders();
     setOrientaion();
     orient = parent.$("body").data("current").slice;
     parent.$("body").data("current").dst = 0;
     parent.$("body").data("disp", "scale");
     updateLabels();
   });
   updateLabels();
   hideAllSliders();
   parent.$("body").data("disp", "scale");
}

function updateLabels() {
  var orientation = {Z:{W:0,H:1,D:2},Y:{W:0,H:2,D:1},X:{W:1,H:2,D:0}};
  var orient = parent.$("body").data("current").slice;
  $("#slider-sliceSliderVal").text(parseInt(parent.$("body").data("current").fxp.split(',')[orientation[orient].D])+parseInt(parent.$("body").data("current").dst)+1);
  $("#toggle-viewVal").text(parent.$("body").data("current").slice);
  $("#slider-scaleSliderVal").text(String(parent.$("body").data("current").scl.toFixed(1))+'x');
  $('#slider-slice').bootstrapSlider('setValue', parseInt(parent.$("body").data("current").fxp.split(',')[orientation[orient].D])+parseInt(parent.$("body").data("current").dst)+1);
  var pos = parent.$("body").data("current").fxp.split(',');
  for (var i=0; i<3; i++){
    pos[i] = String(parseInt(pos[i])+1);
  }
  $('#positionVal').text(pos.join(','));
}

function hideAllSliders() {
  $('[id$=CurrentSlider]').each(function() {
    $(this).hide();
  });
}

function setOrientaion(ori) {
   var orientation = {Z:{W:0,H:1,D:2},Y:{W:0,H:2,D:1},X:{W:1,H:2,D:0}};
   if (ori == "Z" || ori == "X" || ori == "Y"){
     parent.$("body").data("current").slice=ori;
   }else {
     switch (parent.$("body").data("current").slice){
       case "Z":
        parent.$("body").data("current").slice="Y";
        break;
       case "Y":
        parent.$("body").data("current").slice="X";
        break;
       default:
        parent.$("body").data("current").slice="Z";
     }
   }
   var orient = parent.$("body").data("current").slice;
   switch (orient){
    case "Y":
      parent.$("body").data("current").pit=90.0;
      parent.$("body").data("current").yaw=90.0;
      parent.$("body").data("current").rol=90.0;
      $('#slider-slice').data('bootstrapSlider').options.max = parseInt(parent.$("body").data("meta").extent.split(',')[orientation[orient].D])+1;
      break;
    case "X":
      parent.$("body").data("current").pit=90.0;
      parent.$("body").data("current").yaw=0.0;
      parent.$("body").data("current").rol=90.0;
      $('#slider-slice').data('bootstrapSlider').options.max = parseInt(parent.$("body").data("meta").extent.split(',')[orientation[orient].D])+1;
      break;
    default:
      parent.$("body").data("current").pit=0.0;
      parent.$("body").data("current").yaw=0.0;
      parent.$("body").data("current").rol=0.0;
      $('#slider-slice').data('bootstrapSlider').options.max = parseInt(parent.$("body").data("meta").extent.split(',')[orientation[orient].D])+1;
   }
   updateWlzDisplay();
 }
