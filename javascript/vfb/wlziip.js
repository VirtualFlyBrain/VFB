/*! VirtualFlyBrain.org Interface tools for interfacing with the WlzIIPsrv */

function updateWlzDisplay(){
  updateStackData();
  loadRightMenuDisplayed();
}

function animateWlzDisplay(){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 637;
  canvas.height = 319;
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
   loadTemplateAnatomyTree();
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
  if (parent.$("body").data("current")){
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

  if (parent.$("body").data("meta")){
    $('[id^=nameFor]').each(function() {
      content = $(this).data('id');
      content = content.replace('VFBi_','VFB_');
      switch (content.substr(0,4)) {
        case "VFB_":
          $(this).load('/do/ont_bean.html?id=' + content + ' #partName');
          break;
        case "VFBt":
          $(this).text(parent.$("body").data("meta").name);
          break;
        case "FBbt":
          $(this).load('/do/ont_bean.html?id=' + content + ' #partName');
          break;
        default:
          parent.$("body").data("message", "unable to resolve " + content);
      }

    });
    $('[id^=typeFor]').each(function() {
      content = $(this).data('id');
      content = content.replace('VFBi_','VFB_');
      switch (content.substr(0,4)) {
        case "VFB_":
          $(this).load('/do/ont_bean.html?id=' + content + ' #partParent');
          $("#parentIdFor"+$(this).data('id')).load('/do/ont_bean.html?id=' + content + ' #partParentId');
          break;
        case "VFBt":
          $(this).html($('#backgroundStain').html());
          break;
        case "FBbt":
          $(this).load('/do/ont_bean.html?id=' + content + ' #partParent');
          $("#parentIdFor"+$(this).data('id')).load('/do/ont_bean.html?id=' + content + ' #partParentId');
          break;
        default:
          parent.$("body").data("message", "unable to resolve " + content);
      }

    });
  }
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

function createInfoButtonHTML(layer) {
  var content = "";
  if (layer) {
    content += '<button type="button" class="btn btn-default btn-xs" aria-label="Open Details" title="Full Details" onClick="';
    switch (layer.id.substr(0,4)) {
      case "VFBt":
        content += "$('#anatomyDetails').load('/site/stacks/index.htm #imageAttributesText')";
        break;
      case "VFBd":
        content += "$('#anatomyDetails').load('/do/ont_bean.html?id=" + layer.extid + "')";
        break;
      default:
        content += "$('#anatomyDetails').load('/do/ont_bean.html?id=" + layer.id.replace('VFBi_','VFB_') + "')";
    }
    content += '"><span class="glyphicon glyphicon-info-sign"></span></button>';
  }
  return content;
}

function createVisibleButtonHTML(layer) {
  var content = "";
  if (layer) {
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    if (layer.visible) {
      content += '<button type="button" class="btn btn-default btn-xs" aria-label="Hide" title="Hide" onClick="';
      content += "parent.$('body').data('" + current.template + "').selected[" + String(i) + "].visible=false; updateWlzDisplay(); parent.$('body').data('disp', 'clear');";
      content += '"><span class="glyphicon glyphicon-eye-open"></span></button>';
    }else{
      content += '<button type="button" class="btn btn-default btn-xs" aria-label="Show" title="Show" onClick="';
      content += "parent.$('body').data('" + current.template + "').selected[" + String(i) + "].visible=true; updateWlzDisplay();";
      content += '"><span class="glyphicon glyphicon-eye-close"></span></button>';
    }
  }
  return content;
}

function createColourButtonHTML(layer) {
  var content = "";
  if (layer) {
    var temp;
    if (layer.colour == "auto") {
      temp = parent.$("body").data("colours")[i];
    }else{
      temp = layer.colour;
    }
    content += '<button type="button" class="btn btn-default btn-xs" aria-label="Adjust Colour" title="Adjust Colour" onClick="';
    content += "updateWlzDisplay();";
    content += '" style="background:rgb(' + temp + ');"><span class="glyphicon glyphicon-tint"></span></button>';
  }
  return content;
}

function createCloseButtonHTML(layer) {
  var content = "";
  if (layer) {
    content += '<button type="button" class="btn btn-default btn-xs" aria-label="Remove" title="Remove" onClick="';
    content += "removeFromStackData('" + layer.id + "');updateWlzDisplay();";
    content += '"><span class="glyphicon glyphicon-remove-sign"></span></button>';
  }
  return content;
}

function createAddButtonHTML(id) {
  var content = "";
  content += '<button type="button" class="btn btn-default btn-xs" aria-label="Add" title="Add" onClick="';
  content += "addToStackData('" + id + "');updateWlzDisplay();";
  content += '"><span class="glyphicon glyphicon-paperclip"></span></button>';
  return content;
}

function loadRightMenuDisplayed() {
  var content = "";
  if (parent.$("body").data("current") && parent.$("body").data("colours")){
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    if (selected) {
      var layers = Object.keys(selected).length;
      content += '<table id="displayed" class="display" cellspacing="0" width="100%"><thead><tr>';
      var temp = '<th class="text-center">#</th><th class="text-center">Display</th><th class="text-center">Name</th><th class="text-center">Type</th>';
      content += temp;
      content += '</tr></thead>';
      // content += '<tfoot><tr>' + temp + '</tr></tfoot><tbody>';
      var i;
      for (i in selected) {
        content += "<tr>";
        layer = selected[i];

        if (layer) {
          // index:
          content += '<th class="text-center">' + String(i) + '</th>';
          // Details:
          content += '<th class="text-center">';
          content += createInfoButtonHTML(layer);
          // visible:
          content += createVisibleButtonHTML(layer);
          // Colour:
          content += createColourButtonHTML(layer);
          // Remove:
          if (i > 0) {
            content += createCloseButtonHTML(layer);
          }
          content += '</th>';
          // Name:
          if (layer.id.indexOf("VFBd_") > -1) {
            temp = layer.extid;
          }else{
            temp = layer.id;
          }
          content += '<th class="text-center">';
          content += '<span id="nameFor' + layer.id + '" data-id="' + temp + '">' + layer.id.replace('VFBi_','VFB_') + '</span>';
          content += '</th>';
          // Type:
          content += '<th class="text-center">';
          content += '<span class="hide" id="parentIdFor' + layer.id + '"></span><a href="#details"><span class="link" onclick="';
          content += "$('#anatomyDetails').load('/do/ont_bean.html?id=' + $('#parentIdFor"+layer.id+"').text())";
          content += '" id="typeFor' + layer.id + '" data-id="' + temp + '">' + temp.replace('VFBi_','VFB_') + '</span></a>';
          content += '</th>';
          // end row
          content += "</tr>";
        }else{
          content += "<tr></tr><tr></tr><tr></tr><tr></tr>";
        }
      }
      content += "</tbody></table>";
    }
  }
  $("#dispContent").html(content);
  $(document).ready(function() { $('#displayed').DataTable( { retrieve: true, paging: false, searching: false, ordering: true, responsive: true, order: [[ 0, 'asc' ]]} ); } );

}

function loadTemplateAnatomyTree() {
   if (parent.$("body").data("current")){
     var current = parent.$("body").data("current");
     var selected = parent.$("body").data(current.template).selected;
     file = "/data/" + fileFromId(current.template).replace("composite.wlz","tree.json");
     $.getJSON( file, function( data ) {
       var content = "";
       content += '<div class="tree well">';
       content += createTreeHTML(data);
       content += "</div>";
       $("#anatoContent").html(content);
       updateWlzDisplay();
       $(function () {
          $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
          $('.tree li.parent_li > span').on('click', function (e) {
              var children = $(this).parent('li.parent_li').find(' > ul > li');
              if (children.is(":visible")) {
                  children.hide('fast');
                  $(this).attr('title', 'Expand this branch').find(' > b').html('<span class="glyphicon glyphicon-plus-sign" style="border:none;"></span>');
              } else {
                  children.show('fast');
                  $(this).attr('title', 'Collapse this branch').find(' > b').html('<span class="glyphicon glyphicon-minus-sign" style="border:none;"></span>');
              }
              e.stopPropagation();
          });
          // collapse all at start:
          var children = $('.tree li.parent_li > span').parent('li.parent_li').find(' > ul > li');
          children.hide('fast');
          $('.parent_li').find(' > span').find(' > b').html('<span class="glyphicon glyphicon-plus-sign" style="border:none;"></span>');
      });
     });
   }
}

function createTreeHTML(treeStruct) {
  var n;
  var l;
  var layer = '0';
  var node;
  var temp;
  var current = parent.$("body").data("current");
  var selected = parent.$("body").data(current.template).selected;
  var html = "<ul>";
  for (n in treeStruct) {
    node = treeStruct[n];
    if (treeStruct[n].node) {
      node = treeStruct[n].node;
    }
    html += "<li>";
    html += '<span><b></b>'+ $("body").data("domains")[node.nodeId].name +'</span> ';
    if ($("body").data("domains")[node.nodeId].id && $("body").data("domains")[node.nodeId].id !== ""){
      temp = parent.$("body").data("current").template.replace("VFBt_","VFBd_") + String(pad(parseInt(parent.$("body").data("domains")[node.nodeId].id),5));
      if (JSON.stringify(selected).indexOf(temp) > -1) {
        for (l in selected) {
          if (selected[l].id == temp) {
            layer = selected[l];
          }
        }
        html += createInfoButtonHTML(layer) + createVisibleButtonHTML(layer) + createColourButtonHTML(layer) + createCloseButtonHTML(layer);
      }else{
        html += createAddButtonHTML(temp);
      }
    }
    if (node.children) {
      html += createTreeHTML(node.children);
    }
    html += "</li>";
  }
  html += "</ul>";
  return html;
}

loadColours();
$('body').ready( function () {
  initWlzControls();
  loadRightMenuDisplayed();
});
