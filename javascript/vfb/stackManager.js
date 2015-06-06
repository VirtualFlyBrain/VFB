/*! VirtualFlyBrain.org functions to manage image stack */

$(document).ready( function () {
  window.setInterval(function(){
    if ($.cookie("displaying")) {
      var stack = JSON.parse($.cookie("displaying"));
      if (stack.current){
        $("#viewer2DVal").text(Object.keys(stack[stack.current.template].selected).length);
      }
    }
  }, 5000);
	var ids = "";
	initStackData(ids);
});

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

function updateStackData(){
  $.cookie("displaying", returnCleanData(), { expires: 5*365, path: '/' });
}

function returnCleanData() {
  var save = JSON.parse(JSON.stringify(parent.$("body").data()));
  delete save.domains;
  delete save.disp;
  delete save.meta;
  delete save.colours;
  delete save.menu;
  return JSON.stringify(save);
}

function loadDefaultData(ids) {
  loadTemplateMeta("VFBt_001");
  var count = 0;
  var text = '{ "template": "VFBt_001","scl":1.0,"mod":"zeta","slice":"Z","dst":0.0,"pit":0.0,"yaw":0.0,"rol":0.0,"qlt":80,"cvt":"png","fxp":"0,0,0","alpha": 100,"blend":"screen","inverted":false}';
  parent.$("body").data("current", JSON.parse(text));
  parent.$("body").data("VFBt_001", { selected: { 0: { id: "VFBt_00100000", colour: "auto", visible: true }}});
  if (ids !== undefined && ids !== null && ids !== "") {
    addToStackData(ids);
  }
  updateWlzDisplay();
}

function initStackData(ids) {
  if (!$.cookie('displaying')) {
    loadDefaultData(ids);
  }else{
    if (ids) {
      parent.$("body").data(JSON.parse($.cookie("displaying")));
      addToStackData(ids);
    }
  }
  parent.$("body").data(JSON.parse($.cookie("displaying")));
  if (parent.$("body").data("current") === undefined){
    alertMessage("Invalid cookie! Sorry your settings have got currupted so we will have to clear them.");
    $.cookie("displaying", null, { expires: -5, path: '/' });
    loadDefaultData(ids);
  }
  loadTemplateMeta(parent.$("body").data("current").template);
  loadColours();
  parent.$("body").data("menu","disp");
  updateWlzDisplay();
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function alertMessage(message) {
  $('#alert-message-text').text(message);
  $('#alert_message').show();
  window.setTimeout(function() {
      $(".alert-message").fadeTo(500, 0).slideUp(500, function(){
          $(this).remove();
      });
  }, 3000);
}

function addToStackData(ids){
  if (ids !== undefined && ids !== null) {
    var id;
    var i;
    var text;
    var selected;
    var layers;
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    for (i in ids) {
      id = ids[i].replace(":","_").replace('VFB_','VFBi_');
      if (id.indexOf("VFBt_") > -1){
       id = id.replace("00000", "");
       if (id != parent.$("body").data("current").template){
         text = '{ "template": "' + id + '","scl":1.0,"mod":"zeta","slice":"Z","dst":0.0,"pit":0.0,"yaw":0.0,"rol":0.0,"qlt":80,"cvt":"png","fxp":"0,0,0","alpha": 100,"blend":"screen","inverted":false}';
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
          for (layers in selected){
            if (selected[layers].id == id){
              selected[layers].visible = true;
            }
          }
        }else{
          layers = Object.keys(selected).length;
          text = '{' + layers + ':{"id":,"' + id + '","colour":"auto","visible":true}}';
          selected.push(text);
        }
      }else if (id.indexOf("VFBd_") > -1){
        selected = parent.$("body").data(parent.$("body").data("current").template).selected;
        if (JSON.stringify(selected).indexOf(id) > -1){
          for (layers in selected){
            if (selected[layers].id == id){
              selected[layers].visible = true;
            }
          }
        }else{
          layers = Object.keys(selected).length;
          text = '{' + layers + ':{"id":,"' + id + '","colour":"auto","visible":true, "extid":"';
          for (layers in parent.$("body").data("domains")){
            if (parseInt(parent.$("body").data("domains")[layers].id) == parseInt(id.substr(8))) {
              text += parent.$("body").data("domains")[layers].extId[0] + '" }}';
            }
          }
          selected.push(text);
        }
      }else if (id.indexOf("FBbt_") > -1){
        selected = parent.$("body").data(parent.$("body").data("current").template).selected;
        if (JSON.stringify(selected).indexOf(id) > -1){
          for (layers in selected){
            if (selected[layers].extid == id){
              selected[layers].visible = true;
            }
          }
        }else{
          layers = Object.keys(selected).length;
          text = '{' + layers + ':{"id":,"';
          for (layers in parent.$("body").data("domains")){
            if (parent.$("body").data("domains")[layers].extId[0] == id) {
              if (parent.$("body").data("domains")[layers].id === ""){
                alertMessage(id + ' not found in current stack');
              }else{
                text += parent.$("body").data("current").template + String(pad(parseInt(parent.$("body").data("domains")[layers].id),5)) + '","colour":"auto","visible":true, "extid":"' + id + '" }}';
              }
            }
          }
          selected.push(text);
        }
      }
    }
    updateStackData();
  }
}

function addStack(id){
  if ($.cookie("displaying")) {
  }
}
