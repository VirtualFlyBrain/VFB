/*! VirtualFlyBrain.org Interface tools for interfacing with the WlzIIPsrv */

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
  $.cookie("displaying", returnCleanData(), { expires: 5*365, path: '/' });
  switch (parent.$("body").data("menu")) {
    case "disp":
      loadRightMenuDisplayed();
      break;
    case "selec":
      loadRightMenuSelected();
      break;
    case "anato":
      loadRightMenuAnatomy();
      break;
    case "search":
      loadRightMenuSearch();
      break;
    default:
      loadRightMenuDisplayed();
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
                $("#viewer-panel").css("min-width", canvas.width);
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
          }else{
            if (selected[0].visible === false || parent.$("body").data("disp") == "clear"){
              ctx.clearRect (0,0,ctx.canvas.width,ctx.canvas.height);
              parent.$("body").data("disp", "done");
            }
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

function generateWlzURL(index){
   var current = parent.$("body").data("current");
   var selected = parent.$("body").data(current.template).selected;
   var layer = selected[index];
   var file = fileFromId(layer.id);
   var colour = "255,255,255";
   if (layer.colour !== "auto"){
     colour = layer.colour;
   }else{
     if (!parent.$("body").data("colours")){
       loadColours();
     }else{
       colour = parent.$("body").data("colours")[index];
     }
   }
   var text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&sel=" + layer.id.substr(9) + "," + colour + "&mod=" + current.mod + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + current.dst + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
   return text;
 }

function initWlzControls() {
  if (parent.$("body").data("meta")){
   var orientation = {Z:{W:0,H:1,D:2},Y:{W:0,H:2,D:1},X:{W:1,H:2,D:0}};
   var orient = parent.$("body").data("current").slice;
   var slSlice = $("#slider-slice").bootstrapSlider({precision: 0, tooltip: 'always', handle: 'triangle', min: 1, max: parseInt(parent.$("body").data("meta").extent.split(',')[orientation[orient].D])+1, step: 1, value: parseInt(parent.$("body").data("meta").center.split(',')[orientation[orient].D])+1, focus: true});
   slSlice.on('slide', function(ev){
     orient = parent.$("body").data("current").slice;
     parent.$("body").data("current").dst = parseInt(ev.value)-1-parseInt(parent.$("body").data("meta").center.split(',')[orientation[orient].D]);
     $("#slider-sliceSliderVal").text(ev.value);
   });
   slSlice.on('slideStop', function(ev){
     orient = parent.$("body").data("current").slice;
     parent.$("body").data("current").dst = parseInt(ev.value)-1-parseInt(parent.$("body").data("meta").center.split(',')[orientation[orient].D]);
     $("#slider-sliceSliderVal").text(ev.value);
     updateWlzDisplay();
   });
   var slScale = $("#slider-scale").bootstrapSlider({precision: 1, tooltip: 'always', handle: 'triangle', scale: 'logarithmic', min: 0.1, max: 5, value: parseFloat(parent.$("body").data("current").scl), step: 0.1, focus: true});
   slScale.on('slide', function(ev){
     parent.$("body").data("current").scl = ev.value.toFixed(1);
     $("#slider-scaleSliderVal").text(String(ev.value.toFixed(1))+'x');
     parent.$("body").data("disp", "scale");
   });
   slScale.on('slideStop', function(ev){
     parent.$("body").data("current").scl = ev.value.toFixed(1);
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
     parent.$("body").data("disp", "scale");
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
 }else{
   window.setTimeout(function(){
     initWlzControls();
     if (parent.$("body").data("current")) {
       loadTemplateMeta(parent.$("body").data("current").template);
     }
   },5000);
 }
}

function updateLabels() {
  var orientation = {Z:{W:0,H:1,D:2},Y:{W:0,H:2,D:1},X:{W:1,H:2,D:0}};
  var orient = parent.$("body").data("current").slice;
  $("#slider-sliceSliderVal").text(parseInt(parent.$("body").data("current").fxp.split(',')[orientation[orient].D])+parseInt(parent.$("body").data("current").dst)+1);
  $("#toggle-viewVal").text(parent.$("body").data("current").slice);
  $("#slider-scaleSliderVal").text(String(parseFloat(parent.$("body").data("current").scl).toFixed(1))+'x');
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

function loadRightMenuDisplayed() {
  var content = "";
  if (parent.$("body").data("current") && parent.$("body").data("colours")){
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    var layers = Object.keys(selected).length;
    content += '<table id="displayed" class="display" cellspacing="0" width="100%"><thead><tr>';
    var temp = '<th>#</th><th><span class="glyphicon glyphicon-info-sign"></span></th><th><span class="glyphicon glyphicon-eye-open"></span></th><th><span class="glyphicon glyphicon-tint"></span></th><th>Name</th><th>Type</th>';
    content += temp;
    content += '</tr></thead>';
    // content += '<tfoot><tr>' + temp + '</tr></tfoot><tbody>';
    for (i=0; i < layers; i++) {
      content += "<tr>";
      layer = selected[i];
      // index:
      content += '<th>' + String(i) + '</th>';
      // Details:
      content += '<th>';
      content += '<button type="button" class="btn btn-default btn-xs" aria-label="Open Details" title="Full Details" onClick="';
      switch (layer.id.substr(0,4)) {
        case "VFBt":
          content += "$('#anatomyDetails').load('/site/stacks/index.htm #imageAttributes')";
          break;
        case "VFBd":
          content += "$('#anatomyDetails').load('do/ont_bean.html?id=" + layer.extid + "')";
          break;
        default:
          content += "$('#anatomyDetails').load('do/ont_bean.html?id=" + layer.id + "')";
      }
      content += '"><span class="glyphicon glyphicon-info-sign"></span></buton>';
      content += '</th>';
      // visible:
      content += '<th>';
      if (layer.visible) {
        content += '<button type="button" class="btn btn-default btn-xs" aria-label="Hide" title="Hide" onClick="';
        content += "parent.$('body').data('" + current.template + "').selected[" + String(i) + "].visible=false; updateWlzDisplay(); parent.$('body').data('disp', 'clear');";
        content += '"><span class="glyphicon glyphicon-eye-open"></span></buton>';
      }else{
        content += '<button type="button" class="btn btn-default btn-xs" aria-label="Show" title="Show" onClick="';
        content += "parent.$('body').data('" + current.template + "').selected[" + String(i) + "].visible=true; updateWlzDisplay();";
        content += '"><span class="glyphicon glyphicon-eye-close"></span></buton>';
      }
      content += '</th>';
      // Colour:
      content += '<th>';
      if (layer.colour == "auto") {
        temp = parent.$("body").data("colours")[i];
      }else{
        temp = layer.colour;
      }
      content += '<button type="button" class="btn btn-default btn-xs" aria-label="Adjust Colour" title="Adjust Colour" onClick="';
      content += "updateWlzDisplay();";
      content += '" style="background:rgb(' + temp + ');"><span class="glyphicon glyphicon-tint"></span></buton>';
      content += '</th>';
      if (layer.id.indexOf("VFBd_") > -1) {
        temp = layer.extid;
      }else{
        temp = layer.id;
      }
      // Name:
      content += '<th>';
      content += '<span id="nameFor' + layer.id + '" data-id="' + temp + '">' + layer.id + '</span>';
      content += '</th>';
      // Type:
      content += '<th>';
      content += '<span id="typeFor' + layer.id + '" data-id="' + temp + '">' + temp + '</span>';
      content += '</th>';
      // end row
      content += "</tr>";
    }
    content += "</tbody></table><script>$(document).ready(function() { $('#displayed').DataTable( { className: 'align-center', scrollY: true, scrollX: true, paging: false, searching: true, ordering: true, responsive: true, stateSave: true, order: [[ 0, 'asc' ]]} ); } );</script>";
  }
  $("#dispContent").html(content);
  if (parent.$("body").data("meta")){
    $('[id^=nameFor]').each(function() {
      content = $(this).data('id');
      content = content.replace('VFBi_','VFB_');
      switch (content.substr(0,4)) {
        case "VFB_":
          $(this).load('do/ont_bean.html?id=' + $(this).data('id') + ' #partName');
          break;
        case "VFBt":
          $(this).text(parent.$("body").data("meta").name);
          break;
        case "FBbt":
          $(this).load('do/ont_bean.html?id=' + $(this).data('id') + ' #partName');
          break;
        default:
          parent.$("body").data("message", "unable to resolve " + content);
      }

    });
    if (parent.$("body").data("meta")){
      $('[id^=typeFor]').each(function() {
        content = $(this).data('id');
        content = content.replace('VFBi_','VFB_');
        switch (content.substr(0,4)) {
          case "VFB_":
            $(this).load('do/ont_bean.html?id=' + $(this).data('id') + ' #partParents');
            break;
          case "VFBt":
            $(this).load('/site/stacks/index.htm #backgroundStain');
            break;
          case "FBbt":
            $(this).load('do/ont_bean.html?id=' + $(this).data('id') + ' #partParents');
            break;
          default:
            parent.$("body").data("message", "unable to resolve " + content);
        }

      });
    }
  }
}

loadColours();
