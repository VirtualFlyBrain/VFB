/*! VirtualFlyBrain.org Interface tools for interfacing with the WlzIIPsrv */

window.PosX = 0;
window.PosY = 0;
window.lastSel = [""];
window.textOffset = 0;
var SelectedIndex = 0;

function updateWlzDisplay(){
  updateStackData();
}

function updateMenuData() {
  //console.log('Updating menu data...');
  loadRightMenuDisplayed();
  updateAnatomyTree();
  updateLabels();
}

function animateWlzDisplay(){
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 637;
  canvas.height = 319;
  canvas.onmousedown = GetCoordinates;
  function step() {
    var selected = parent.$("body").data(parent.$("body").data("current").template).selected;
    if (selected){
      var layers = Object.keys(selected).length;
      if (layers > 0){
        var count = 0;
        var image = [];
        var i;
        var current = parent.$("body").data("current");
        var orientation = {Z:{W:0,H:1,D:2},Y:{W:0,H:2,D:1},X:{W:1,H:2,D:0}};
        var orient = current.slice;
        for (i in selected) {
          if (selected[i].visible){
            image[i] = document.createElement('img');
            image[i].src = generateWlzURL(i);
            if (count===0){
              current.alpha = 100;
              if (parent.$("body").data("disp") == "scale"){
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
            if (count===0 && (selected[0].visible === false || parent.$("body").data("disp") == "clear")){
              if (parent.$("body").data("disp") == "scale"){
                if (parent.$("body").data("meta")){
                  canvas.width = parseInt((parseInt((parseFloat(parent.$("body").data("meta").extent.split(',')[orientation[orient].W])+1)*parseFloat(current.scl))+1)*parseFloat(parent.$("body").data("meta").voxel.split(',')[orientation[orient].W]));
                  canvas.height = parseInt((parseInt((parseFloat(parent.$("body").data("meta").extent.split(',')[orientation[orient].H])+1)*parseFloat(current.scl))+1)*parseFloat(parent.$("body").data("meta").voxel.split(',')[orientation[orient].H]));
                }
                $("#viewer-panel").css("min-width", canvas.width);
                parent.$("body").data("disp", "done");
              }
              ctx.globalCompositeOperation = 'source-over';
              ctx.clearRect (0,0,ctx.canvas.width,ctx.canvas.height);
              parent.$("body").data("disp", "done");
              if (!current.inverted) {
                ctx.fillStyle="black";
                ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
              }
              ctx.globalCompositeOperation = parent.$("body").data("current").blend;
              current.alpha = 200;
              count++;
            }
          }
        }
      }
    }
    window.setTimeout(function(){
      requestAnimationFrame(step);
      if (window.reloadInterval < 30000) {
        window.reloadInterval = window.reloadInterval + 100;
      }
    }, window.reloadInterval);
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

function drawCircle() {
  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.beginPath();
  ctx.arc(window.PosX, window.PosY, 3, 0, 2 * Math.PI, false);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  window.textOffset = 0;
}

function drawText(message) {
  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.font = "12px Arial";
  ctx.fillStyle = 'white';
  ctx.fillText(message,window.PosX + 5, window.PosY + window.textOffset);
  window.textOffset+= 12;
}

function callForObjects(text, id) {
  console.log('Calling:' + text);
  $.ajax({
      url: text,
      type: "GET",
      timeout: 99999999,
      dataType: "text", // "xml", "json"
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
          // format fcgi response for JSON
          data = data.trim();
          data = '{ ' + data.replace(/[\n\r]/g,'], ') + '] }';
          data = data.replace('], ], ','], ');
          data = data.replace('Wlz-foreground-objects:','"Wlz-foreground-objects": [');
          data = data.replace('Wlz-coordinate-3d:','"Wlz-coordinate-3d": [');
          data = data.replace('[ ','[');
          data = data.replace(/\s/g,', ');
          data = data.replace('{,','{');
          data = data.replace(':,',':');
          data = data.replace(':,',':');
          data = data.replace(',,',',');
          data = data.replace(', }',' }');

          var json = JSON.parse(data);

          var temp = json['Wlz-foreground-objects'];

          if (temp !== null && parseInt(temp) === 0) {
            console.log('Adding:' + cleanIdforExt(id));
            addAvailableItems(cleanIdforInt(id));
          }
          $('.tab-pane').removeClass('active');
          $('#selec').addClass('active');
          $('#SelecMenuTab').addClass('active');
          $('#DispMenuTab').removeClass('active');
          $('#AnatoMenuTab').removeClass('active');
          $('#SearchMenuTab').removeClass('active');

      },
      error: function(jqXHR, textStatus, ex) {
          alert(textStatus + "," + ex + "," + jqXHR.responseText);
      }
  });
  return true;
}

function updatePosition() {
  drawCircle();
  SelectedIndex = 0;
  window.reloadInterval = 1000;
  $('#selected').dataTable().fnClearTable();
  $('#selected').dataTable().fnAddData(['-','<img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." />','<img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." />','<img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." />']);
  SelectedIndex++;
  $('.tab-pane').removeClass('active');
  $('#selec').addClass('active');
  $('#SelecMenuTab').addClass('active');
  $('#DispMenuTab').removeClass('active');
  $('#AnatoMenuTab').removeClass('active');
  $('#SearchMenuTab').removeClass('active');
  $('#pointVal').text('*,*,*');

  var current = parent.$("body").data("current");
  var file = fileFromId(parent.$("body").data("current").template);
  var text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + current.dst + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&prl=-1," + String(window.PosX) + "," + String(window.PosY) + "&obj=Wlz-foreground-objects&obj=Wlz-coordinate-3D";
  var selected = parent.$("body").data(parent.$("body").data("current").template).selected;
  var temp = [];

  $.ajax({
      url: text,
      type: "GET",
      timeout: 99999999,
      dataType: "text", // "xml", "json"
      xhrFields: {
        withCredentials: true
      },
      success: function(data) {
          // format fcgi response for JSON
          data = data.trim();
          data = '{ ' + data.replace(/[\n\r]/g,'], ') + '] }';
          data = data.replace('], ], ','], ');
          data = data.replace('Wlz-foreground-objects:','"Wlz-foreground-objects": [');
          data = data.replace('Wlz-coordinate-3d:','"Wlz-coordinate-3d": [');
          data = data.replace('[ ','[');
          data = data.replace(/\s/g,', ');
          data = data.replace('{,','{');
          data = data.replace(':,',':');
          data = data.replace(':,',':');
          data = data.replace(',,',',');
          data = data.replace(', }',' }');

          var json = JSON.parse(data);

          var oldPos = window.selPointX + ',' + window.selPointY + ',' + window.selPointZ;

          // update 3d coordinates
          window.selPointX = parseInt(json['Wlz-coordinate-3d'][0]);
          window.selPointY = parseInt(json['Wlz-coordinate-3d'][1]);
          window.selPointZ = parseInt(json['Wlz-coordinate-3d'][2]);

          var newPos = window.selPointX + ',' + window.selPointY + ',' + window.selPointZ;
          var i;
          if ( oldPos == newPos ){
            var displayed = JSON.stringify(selected);
            for (i = 0, l=lastSel.length; i < l; i++) {
              if (lastSel[i] > 0){
                fullItem = parent.$("body").data("current").template.replace("VFBt_","VFBd_") + String(pad(parseInt(lastSel[i]),5));
                // if already added then remove
                if (displayed.indexOf(fullItem) > -1) {
                  console.log('Removing ' + fullItem + ' after double click');
                  removeFromStackData(fullItem);
                }else{ // else add it
                  console.log('Adding ' + fullItem + ' after double click');
                  addToStackData(fullItem);
                }
              }
            }
          }
          window.lastSel = json['Wlz-foreground-objects'];
          temp = [];
          for (i in window.lastSel) {
            if (window.lastSel[i] === 0) {
              temp[i]=$('body').data()[$('body').data().current.template].selected[0].id;
            }else{
              temp[i]=parent.$("body").data("current").template.replace("VFBt_","VFBd_") + String(pad(parseInt(window.lastSel[i]),5));
            }
          }
          $('#selected').dataTable().fnDeleteRow( 0, false );
          addAvailableItems(temp);

          $('.tab-pane').removeClass('active');
          $('#selec').addClass('active');
          $('#SelecMenuTab').addClass('active');
          $('#DispMenuTab').removeClass('active');
          $('#AnatoMenuTab').removeClass('active');
          $('#SearchMenuTab').removeClass('active');
          $('#pointVal').text(String(window.selPointX) + ',' + String(window.selPointY) + ',' + String(window.selPointZ));

      },
      error: function(jqXHR, textStatus, ex) {
          alert(textStatus + "," + ex + "," + jqXHR.responseText);
      }
  });

  var i;

  for (i in selected) {
    if (cleanIdforExt(selected[i].id).indexOf('VFB_')>-1 && selected[i].visible) {
      file = fileFromId(cleanIdforInt(selected[i].id));
      text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + current.dst + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&prl=-1," + String(window.PosX) + "," + String(window.PosY) + "&obj=Wlz-foreground-objects";
      callForObjects(text, cleanIdforInt(selected[i].id));
    }
  }
}

function GetCoordinates(e){
  window.PosX = 0;
  window.PosY = 0;
  var ImgPos;
  ImgPos = FindPosition(canvas);
  if (!e) e = window.event;
  if (e.pageX || e.pageY)
  {
    window.PosX = e.pageX;
    window.PosY = e.pageY;
  }
  else if (e.clientX || e.clientY)
    {
      window.PosX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      window.PosY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
  window.PosX = window.PosX - ImgPos[0] - parseInt($('#canvas').css('padding').replace('px',''));
  window.PosY = window.PosY - ImgPos[1] - parseInt($('#canvas').css('padding').replace('px',''));

  updatePosition();

}

function FindPosition(oElement){
  if(typeof( oElement.offsetParent ) != "undefined")
  {
    for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
    {
      posX += oElement.offsetLeft;
      posY += oElement.offsetTop;
    }
      return [ posX, posY ];
    }
    else
    {
      return [ oElement.x, oElement.y ];
    }
}

function generateWlzURL(index){
   var current = parent.$("body").data("current");
   var selected = parent.$("body").data(current.template).selected;
   var layer = selected[index];
   var file = "";
   var colour = "255,255,255";
   var text = "";
   if (layer.colour !== "auto"){
     colour = layer.colour;
   }else{
     if (!parent.$("body").data("colours")){
       loadColours();
     }else{
       colour = parent.$("body").data("colours")[index];
     }
   }
   switch (layer.id.substr(0,4)){
     case "VFB_":
       file = fileFromId(layer.id);
       text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&sel=0," + colour + "&mod=" + current.mod + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + current.dst + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
       break;
     case "VFBi":
       file = fileFromId(layer.id);
       text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&sel=0," + colour + "&mod=" + current.mod + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + current.dst + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
       break;
     case "VFBt":
       file = fileFromId(layer.id);
       text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&sel=0," + colour + "," + current.alpha + "&mod=" + current.mod + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + current.dst + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
       break;
     case "VFBd":
       file = fileFromId(current.template);
       text = "/fcgi/wlziipsrv.fcgi?wlz=/disk/data/VFB/IMAGE_DATA/" + file + "&sel=" + String(parseInt(layer.id.substr(8))) + "," + colour + "," + current.alpha + "&mod=" + current.mod + "&fxp=" + current.fxp + "&scl=" + current.scl + "&dst=" + current.dst + "&pit=" + current.pit + "&yaw=" + current.yaw + "&rol=" + current.rol + "&qlt=" + current.qlt + "&cvt=" + current.cvt;
       break;
     default:
       alertMessage("unable to generate URL for id:" + layer.id);
   }
   return text;
}

function initWlzControls() {
  $('#slider-slice').data('live',false);
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
   $('#slider-slice').data('live',true);
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
  //console.log('Updating the controls...');
  if (parent.$("body").data("current") && $('#slider-slice').data('live')){
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
      content = cleanIdforExt(content);
      switch (content.substr(0,4)) {
        case "VFB_":
          $(this).load('/do/ont_bean.html?id=' + content + ' #partName', function() {
            if ($(this).text().indexOf("VFB") < 0) {
              if ($(this).data('layer')) {
                parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].name = $(this).text();
              }
              $(this).id = "Resolved" + $(this).id;
            }
          });
          $(this).attr("onClick", $("#infoButtonFor" + content).attr("onClick"));
          break;
        case "VFBt":
          $(this).text(parent.$("body").data("meta").name);
          $(this).id = "Resolved" + $(this).id;
          parent.$("body").data(parent.$("body").data("current").template).selected[0].name = parent.$("body").data("meta").name;
          break;
        case "FBbt":
          $(this).load('/do/ont_bean.html?id=' + content + ' #partName', function() {
            if ($(this).text().indexOf("FBbt") < 0 && $(this).text().indexOf("VFB") < 0) {
              if ($(this).data('layer')) {
                parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].name = $(this).text();
              }
              $(this).id = "Resolved" + $(this).id;
            }
          });
          $(this).attr("onClick", $("#" + $(this).attr("id").replace("nameFor","infoButtonFor")).attr("onClick"));
          break;
        default:
          alertMessage("unable to resolve name for id:" + content);
      }
    });
    $('[id^=typeFor]').each(function() {
      content = $(this).data('id');
      content = cleanIdforExt(content);
      switch (content.substr(0,4)) {
        case "VFB_":
          $(this).load('/do/ont_bean.html?id=' + content + ' #partParent', function() {
            if ($(this).text().indexOf("_") < 0){
              if ($(this).data('layer')) {
                parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].type = $(this).text();
              }
              $(this).id = "Resolved" + $(this).id;
            }
          });
          $("#parentIdFor"+$(this).data('id')).load('/do/ont_bean.html?id=' + content + ' #partParentId', function() {
            if ($(this).text().length > 5){
              if ($(this).data('layer')) {
                parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].typeid = cleanIdforExt($(this).text());
              }
              $(this).id = "Resolved" + $(this).id;
            }
          });
          break;
        case "VFBt":
          $(this).html($('#backgroundStain').html());
          if ($(this).data('layer')) {
            parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].type = $(this).html();
          }
          $(this).id = "Resolved" + $(this).id;
          break;
        case "FBbt":
          $(this).load('/do/ont_bean.html?id=' + content + ' #partParent', function() {
            if ($(this).text().indexOf("_") < 0){
              if ($(this).data('layer')) {
                parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].type = $(this).text();
              }
              $(this).id = "Resolved" + $(this).id;
            }
          });
          $("#"+$(this).attr("id").replace("typeFor","parentIdFor")).load('/do/ont_bean.html?id=' + content + ' #partParentId', function() {
            if ($(this).text().length > 5){
              if ($(this).data('layer')) {
                parent.$("body").data(parent.$("body").data("current").template).selected[$(this).data('layer')].typeid = cleanIdforExt($(this).text());
              }
              $(this).id = "Resolved" + $(this).id;
            }
          });
          break;
        default:
          alertMessage("unable to resolve type for id:" + content);
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
    content += '<button type="button" id="infoButtonFor' + cleanIdforExt(layer.id) + '" class="btn btn-default btn-xs" aria-label="Open Details" title="Full Details" onClick="';
    switch (layer.id.substr(0,4)) {
      case "VFBt":
        content += "$('#anatomyDetails').load('/site/stacks/index.htm #imageAttributesText')";
        break;
      case "VFBd":
        content += "openFullDetails('" + layer.extid + "')";
        break;
      default:
        content += "openFullDetails('" + cleanIdforExt(layer.id) + "')";
    }
    content += '"><span style="border:none;" class="glyphicon glyphicon-info-sign"></span></button>';
  }
  return content;
}

function createInfoButtonHTMLbyId(id) {
  var content = "";
  if (id) {
    id = cleanIdforExt(id);
    content += '<button type="button" id="infoButtonFor' + id + '" class="btn btn-default btn-xs" aria-label="Open Details" title="Full Details" onClick="';
    switch (id.substr(0,4)) {
      case "VFBt":
        content += "$('#anatomyDetails').load('/site/stacks/index.htm #imageAttributesText')";
        break;
      default:
        content += "openFullDetails('" + id + "')";
    }
    content += '"><span style="border:none;" class="glyphicon glyphicon-info-sign"></span></button>';
  }
  return content;
}

function createVisibleButtonHTML(layer,i) {
  var content = "";
  if (layer) {
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    if (layer.visible) {
      content += '<button type="button" class="btn btn-default btn-xs" aria-label="Hide" title="Hide" onClick="';
      content += "parent.$('body').data('" + current.template + "').selected[" + String(i) + "].visible=false; updateWlzDisplay(); parent.$('body').data('disp', 'clear');updateMenuData();";
      content += '"><span style="border:none;" class="glyphicon glyphicon-eye-open"></span></button>';
    }else{
      content += '<button type="button" class="btn btn-default btn-xs" aria-label="Show" title="Show" onClick="';
      content += "parent.$('body').data('" + current.template + "').selected[" + String(i) + "].visible=true; updateWlzDisplay();updateMenuData();";
      content += '"><span style="border:none;" class="glyphicon glyphicon-eye-close"></span></button>';
    }
  }
  return content;
}

function createColourButtonHTML(layer,i) {
  var content = "";
  if (layer && parent.$("body").data("colours")) {
    var temp;
    if (layer.colour == "auto") {
      temp = parent.$("body").data("colours")[i];
    }else{
      temp = layer.colour;
    }
    content += '<button type="button" class="btn btn-default btn-xs" aria-label="Adjust Colour" title="Adjust Colour" onClick="';
    content += "updateWlzDisplay();updateMenuData();";
    content += '" style="background:rgb(' + temp + ');"><span style="border:none;" class="glyphicon glyphicon-tint"></span></button>';
  }
  return content;
}

function createCloseButtonHTML(layer) {
  var content = "";
  if (layer) {
    content += '<button type="button" class="btn btn-default btn-xs" aria-label="Remove" title="Remove" onClick="';
    content += "removeFromStackData('" + layer.id + "');updateWlzDisplay();updateMenuData();";
    content += '"><span style="border:none;" class="glyphicon glyphicon-trash"></span></button>';
  }
  return content;
}

function createAddButtonHTML(id) {
  var content = '<span style="border:none;" id="attach" data-id="' + cleanIdforInt(id) + '"></span>';
  return content;
}

function loadRightMenuDisplayed() {
  //console.log('Updating the displayed layers...');
  if (parent.$("body").data("current") && parent.$("body").data("colours")){
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    if (selected && $.fn.dataTable.isDataTable('#displayed')) {
      var layers = Object.keys(selected).length;
      var temp;
      var i;
      var j;
      var rowD;
      var index = "-";
      var controls = "-";
      var name = "?";
      var type = "?";
      for (i in selected) {
        index = "-";
        controls = "-";
        name = "?";
        type = "?";
        layer = selected[i];
        if (layer) {
          rowD = $('#displayed').dataTable().fnGetData(i);
          // index:
          index = String(i);
          if (rowD === null || rowD[0] !== index || (rowD[2].indexOf('"nameFor') > -1 && layer.name) || (rowD[3].indexOf('"typeFor') > -1 && layer.type)){
            // Details:
            controls = createInfoButtonHTML(layer);
            // visible:
            controls += createVisibleButtonHTML(layer,i);
            // Colour:
            controls += createColourButtonHTML(layer,i);
            // Remove:
            if (i > 0) {
              controls += createCloseButtonHTML(layer);
            }
            // Name:
            if (layer.id.indexOf("VFBd_") > -1) {
              temp = layer.extid;
            }else{
              temp = layer.id;
            }
            if (layer.name) {
              name = '<a href="#details"><span id="ResolvedNameFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '" onclick="';
              name += "$('#infoButtonFor" + cleanIdforExt(layer.id) + "').click();";
              name += '">';
              name += layer.name;
            }else{
              if (layer.id.indexOf('VFBd_') > -1) {
                for (j in parent.$("body").data("domains")) {
                  if (cleanIdforInt(parent.$("body").data("domains")[j].extId[0]) == cleanIdforInt(layer.extid)) {
                    name = '<a href="#details"><span id="LoadedNameFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '" onclick="';
                    name += "$('#infoButtonFor" + cleanIdforExt(layer.id) + "').click();";
                    name += '">';
                    name += parent.$("body").data("domains")[j].name;
                    break;
                  }
                }
              }else{
                name = '<a href="#details"><span id="nameFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '" onclick="';
                name += "$('#infoButtonFor" + cleanIdforExt(layer.id) + "').click();";
                name += '">';
                name += cleanIdforExt(layer.id);
              }
            }
            name += '</span></a>';
            // Type:
            if (layer.typeid) {
              type = '<a href="#details"><span class="link" onclick="';
              type += "openFullDetails('" +layer.typeid + "')";
            }else{
              type = '<span class="hide" id="parentIdFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '" ></span><a href="#details"><span class="link" onclick="';
              type += "openFullDetails($('#parentIdFor"+layer.id+"').text())";
            }
            if (layer.type) {
              type += '" id="resolvedTypeFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '">';
              type += layer.type;
            }else{
              type += '" id="typeFor' + layer.id + '" data-id="' + temp + '" data-layer="' + i + '">';
              type += cleanIdforExt(temp);
            }
            type += '</span></a>';
            if (rowD !== null){
              $('#displayed').dataTable().fnUpdate(index,i,0, false );
              $('#displayed').dataTable().fnUpdate(controls,i,1, false );
              $('#displayed').dataTable().fnUpdate(name,i,2, false );
              $('#displayed').dataTable().fnUpdate(type,i,3, false );
              console.log('Updating ' + index + ' in the displayed layers');
            }else{
              $('#displayed').dataTable().fnAddData([ index, controls, name, type], false);
              console.log('Adding ' + index + ' to the displayed layers');
            }
          }else{
            // Details:
            controls = createInfoButtonHTML(layer);
            // visible:
            controls += createVisibleButtonHTML(layer,i);
            // Colour:
            controls += createColourButtonHTML(layer,i);
            // Remove:
            if (i > 0) {
              controls += createCloseButtonHTML(layer);
            }
            if (rowD[1] !== controls) {
              $('#displayed').dataTable().fnUpdate(controls,i,1, false );
              console.log('Updating controls for ' + index + ' in the displayed layers');
            }
          }
        }
      }
      i++;
      while ($('#displayed').dataTable().fnGetData(i)){
        $('#displayed').dataTable().fnDeleteRow(i, false );
      }
      $('#displayed').dataTable().fnAdjustColumnSizing(false);
      $('#displayed').DataTable().draw(false);
    }else{
      $('#displayed').DataTable( { retrieve: true,
        paging: true,
        searching: true,
        ordering: true,
        responsive: true,
        stateSave: true,
        order: [[ 0, 'desc' ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }
          ]
      });
      $('#displayed').on( 'page.dt', function () {
        updateLabels();
      } );
    }
  }
}

function loadTemplateAnatomyTree() {
   if (parent.$("body").data("current")){
     var current = parent.$("body").data("current");
     var selected = parent.$("body").data(current.template).selected;
     file = "/data/" + fileFromId(current.template).replace("composite.wlz","tree.json");
     $.getJSON( file, function( data ) {
       parent.$("body").data("tree",data);
       if (parent.$("body").data("tree")) {
         var content = "";
         content += '<div class="tree well">';
         content += createTreeHTML(parent.$("body").data("tree"));
         content += "</div>";
         $("#anatoContent").html(content);
         updateWlzDisplay();
         $(function () {
            $('.tree li:has(ul)').addClass('parent_li').find(' > span').has('b').attr('title', 'Expand this branch');
            $('.tree li.parent_li > span').has('b').on('click', function (e) {
                var children = $(this).parent('li.parent_li').find(' > ul > li');
                if (children.is(":visible")) {
                    children.hide('fast');
                    $(this).attr('title', 'Expand this branch').find(' > b').html('<span class="glyphicon glyphicon-expand" style="border:none;"></span>');
                } else {
                    children.show('fast');
                    $(this).attr('title', 'Collapse this branch').find(' > b').html('<span class="glyphicon glyphicon-collapse-down" style="border:none;"></span>');
                }
                e.stopPropagation();
            });
            $('.tree ul').first().css("padding", 0);
         });
       }
       // collapse all at start:
       collapseTree();
       updateMenuData();
     });
   }
}

function addAllDomains() {
  addToStackData(parent.$("body").data("available").split(","));
  updateMenuData();
  updateWlzDisplay();
}

function removeAllDomains() {
  removeFromStackData(parent.$("body").data("available").split(","));
  updateMenuData();
  updateWlzDisplay();
}

function expandTree() {
  var children = $('.tree li.parent_li > span').parent('li.parent_li').find(' > ul > li');
  children.show('fast');
  $('.parent_li').find(' > span').find(' > b').html('<span class="glyphicon glyphicon-collapse-down" style="border:none;"></span>');
  $('.tree li:has(ul)').find(' > span').has('b').attr('title', 'Collapse this branch');
}

function collapseTree() {
  var children = $('.tree li.parent_li > span').parent('li.parent_li').find(' > ul > li');
  children.hide('fast');
  $('.parent_li').find(' > span').find(' > b').html('<span class="glyphicon glyphicon-expand" style="border:none;"></span>');
  $('.tree li:has(ul)').find(' > span').has('b').attr('title', 'Expand this branch');
}

function updateAnatomyTree() {
  if (parent.$("body").data("current")) {
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    var l;
    $('[id^=buttonsForVFB]').each(function() {
      $(this).html(createInfoButtonHTMLbyId($(this).data("extid")) + createAddButtonHTML($(this).data("id")));
    });
    var layer;
    for (l in selected) {
      layer = selected[l];
      $('#buttonsFor' + layer.id).html(createInfoButtonHTML(layer) + createVisibleButtonHTML(layer,l) + createColourButtonHTML(layer,l) + createCloseButtonHTML(layer));
    }
    generateAddButtons();
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
  var html = '<ul>';
  for (n in treeStruct) {
    node = treeStruct[n];
    if (treeStruct[n].node) {
      node = treeStruct[n].node;
    }
    html += "<li>";
    html += '<span id="treeLabel"><b><span class="glyphicon glyphicon-unchecked" style="border:none;"></span></b>'+ $("body").data("domains")[node.nodeId].name +'</span> ';

    if ($("body").data("domains")[node.nodeId].id && $("body").data("domains")[node.nodeId].id !== ""){
      temp = parent.$("body").data("current").template.replace("VFBt_","VFBd_") + String(pad(parseInt(parent.$("body").data("domains")[node.nodeId].id),5));
      html += "<span id='buttonsFor" + temp + "' data-id='" + temp + "' data-extid='" + $("body").data("domains")[node.nodeId].extId[0] + "'>";
      if (JSON.stringify(selected).indexOf(temp) > -1) {
        for (l in selected) {
          if (selected[l].id == temp) {
            layer = selected[l];
            html += createInfoButtonHTML(layer) + createVisibleButtonHTML(layer,l) + createColourButtonHTML(layer,l) + createCloseButtonHTML(layer);
          }
        }
      }else{
        html += createInfoButtonHTMLbyId($("body").data("domains")[node.nodeId].extId[0]) + createAddButtonHTML(temp);
      }
      html += "</span>";
    }else{
      temp = $("body").data("domains")[node.nodeId].extId[0];
      html += "<span id='buttonsFor" + temp + "' data-id='" + temp + "' data-extid='" + temp + "'>";
      html += createInfoButtonHTMLbyId(temp);
      html += "</span>";
    }
    if (node.children) {
      html += createTreeHTML(node.children);
    }
    html += "</li>";
  }
  html += "</ul>";
  return html;
}

function clearSelectedTable() {
  if ($.fn.dataTable.isDataTable('#selected')) {
    $('#selected').dataTable().distroy();
  }
  var text = '<table id="selected" class="display compact" cellspacing="0" width="100%"><thead><tr><th>ID</th><th>Display</th><th>Name</th><th>Type</th></tr></thead><tbody><tr><th>-</th><th><img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." /></th><th><img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." /></th><th><img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." /></th></tr></tbody></table>';
  $('#selecContent').html(text);
  if (!$.fn.dataTable.isDataTable('#selected')) {
    $('#selected').DataTable( { retrieve: true,
      paging: true,
      searching: true,
      ordering: true,
      responsive: true,
      stateSave: true,
      order: [[ 0, 'desc' ]]
    });
  }
}

function addAvailableItems(ids) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }
  var i;
  var id;
  var layers;
  var temp;
  var current = parent.$("body").data("current");
  var selected = parent.$("body").data(current.template).selected;
  for (i in ids) {
    id = cleanIdforInt(ids[i]);
    if (id.indexOf('VFBd_')>-1 || id.indexOf('VFBt_')>-1){
      temp = parseInt(id.replace(current.template,'').replace(current.template.replace('VFBt_','VFBd_'),''));
      for (layers in parent.$("body").data("domains")){
        if (cleanIdforInt(parent.$("body").data("domains")[layers].id) == temp) {
          temp = parent.$("body").data("domains")[layers];
          if (i > 0) {
            drawText(temp.name);
          }
          break;
        }
      }
      // Controls:
      controls = createInfoButtonHTMLbyId(cleanIdforExt(temp.extId[0]));
      controls += createAddButtonHTML(cleanIdforExt(temp.extId[0]));
      // Name:
      name = '<a href="#details"><span id="ResolvedNameFor' + id + '" data-id="' + cleanIdforInt(temp.extId[0]) + '" onclick="';
      name += "$('#infoButtonFor" + cleanIdforExt(temp.extId[0]) + "').click();";
      name += '">';
      name += temp.name;
      name += '</span></a>';
      // Type:
      type = '<span class="hide" id="parentIdFor' + temp.extId[0] + '" data-id="' + temp.extId[0] + '" ></span><a href="#details"><span class="link" onclick="';
      type += "openFullDetails($('#parentIdFor"+temp.extId[0]+"').text())";
      type += '" id="typeFor' + id + '" data-id="' + temp.extId[0] + '">';
      type += cleanIdforExt(temp.extId[0]);
      type += '</span></a>';
    }else{
      for (layers in selected){
        if (cleanIdforInt(selected[layers].id) == id) {
          temp = selected[layers];
          if (temp.name){
            drawText(temp.name);
          }else{
            drawText(cleanIdforExt(temp.id));
          }

          break;
        }
      }
      // Controls:
      controls = createInfoButtonHTMLbyId(cleanIdforExt(id));
      controls += createAddButtonHTML(cleanIdforExt(id));
      // Name:
      if (temp.name){
        name = '<a href="#details"><span id="ResolvedNameFor' + id + '" data-id="' + cleanIdforInt(id) + '" onclick="';
        name += "$('#infoButtonFor" + cleanIdforExt(id) + "').click();";
        name += '">';
        name += temp.name;
      }else{
        name = '<a href="#details"><span id="nameFor' + id + '" data-id="' + cleanIdforInt(id) + '" onclick="';
        name += "$('#infoButtonFor" + cleanIdforExt(id) + "').click();";
        name += '">';
        name += temp.id;
      }
      name += '</span></a>';
      // Type:
      type = '<span class="hide" id="parentIdFor' + id + '" data-id="' + id + '" ></span><a href="#details"><span class="link" onclick="';
      type += "openFullDetails($('#parentIdFor"+id+"').text())";
      type += '" id="typeFor' + id + '" data-id="' + id + '">';
      type += cleanIdforExt(id);
      type += '</span></a>';
    }
    $('#selected').dataTable().fnAddData([ SelectedIndex, controls, name, type], false);
    SelectedIndex++;
  }
  $('#selected').DataTable().draw(true);
  updateLabels();
}

loadColours();
$('body').ready( function () {
  initWlzControls();
  window.setInterval(function(){
    updateMenuData();
  }, 10000);
});
