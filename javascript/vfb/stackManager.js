/*! VirtualFlyBrain.org functions to manage image stack */

function updateStackCounter() {
  if ($.cookie("displaying")) {
    var stack = JSON.parse($.cookie("displaying"));
    if (stack.current){
      $("#viewer2DVal").text(Object.keys(stack[stack.current.template].selected).length-1);
    }
  }
}

function cleanIdforExt(id) {
  id = id.replace(":","_");
  id = id.toLowerCase().replace("vfb","VFB").replace("fbbt","FBbt");
  id = id.replace('VFBi_','VFB_');
  return id;
}

function cleanIdforInt(id) {
  id = id.replace(":","_");
  id = id.toLowerCase().replace("vfb","VFB").replace("fbbt","FBbt");
  id = id.replace('VFB_','VFBi_');
  return id;
}

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
       var l;
       var list = "";
       for (l in $('body').data("domains")) {
         if ($('body').data("domains")[l].id > "") {
           list += cleanIdforInt($('body').data("domains")[l].extId[0]);
         }
       }
       parent.$("body").data("available", list);
       updateStackData();
     });
   }
}

function generateAddButtons() {
  if (parent.$("body").data("available")) {
    $("[id^=attach]").each(function(){
      if ($(this).html() === ""){
        var content = "";
        if (cleanIdforInt($(this).data("id")).indexOf("FBbt_") > -1) {
          if (parent.$("body").data("available").indexOf(cleanIdforInt($(this).data("id"))) > -1) {
            content += '<button type="button" class="btn btn-default btn-xs" aria-label="Add to stack viewer" title="Add to stack viewer" onClick="';
            content += "addToStackData('" + cleanIdforInt($(this).data("id")) + "');updateMenuData();if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
            content += '"><span style="border:none;" class="glyphicon glyphicon-paperclip"></span></button>';
          }
        }else if (cleanIdforInt($(this).data("id")).indexOf("VFB") > -1) {
          content += '<button type="button" class="btn btn-default btn-xs" aria-label="Add to stack viewer" title="Add to stack viewer" onClick="';
          content += "addToStackData('" + cleanIdforInt($(this).data("id")) + "');updateMenuData();if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
          content += '"><span style="border:none;" class="glyphicon glyphicon-paperclip"></span></button>';
        }
        $(this).html(content);
      }
    });
  }
}

function fileFromId(id) {
   var file = "";
   if (id){
     id = cleanIdforInt(id);
     if (id.indexOf("VFBt_") > -1){
       file = id.replace("00000", "").replace("VFBt_","VFB/t/") + "/composite.wlz";
     }else if (id.indexOf("VFBi_") > -1){
       file = "VFB/i/" + id.substr(5,4) + "/" + id.substr(9,4) + "/volume.wlz";
     }else if (id.indexOf("VFB_") > -1){
       file = "VFB/i/" + id.substr(4,4) + "/" + id.substr(8,4) + "/volume.wlz";
     }else if (id.indexOf("VFBd_") > -1){
       file = id.substr(0,8).replace("VFBd_","VFB/t/") + "domain" + id.substr(8) + ".wlz";
     }
   }
   return file;
}

function updateStackData(){
  var data = returnCleanData();
  if (data.length > 10){
    $.cookie("displaying", data, { expires: 5*365, path: '/' });
    updateStackCounter();
    generateAddButtons();
  }
}

function returnCleanData() {
  var save = JSON.parse(JSON.stringify(parent.$("body").data()));
  delete save.domains;
  delete save.disp;
  delete save.meta;
  delete save.colours;
  delete save.tree;
  delete save.available;
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
  updateStackData();
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
    alert($.cookie("displaying"));
    alert(returnCleanData());
    alertMessage("Invalid cookie! Sorry your settings have got currupted so we will have to clear them.");
    $.cookie("displaying", null, { expires: -5, path: '/' });
    loadDefaultData(ids);
  }
  loadTemplateMeta(parent.$("body").data("current").template);
  updateStackData();
}

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function alertMessage(message) {
  console.log(message);
  // Needs Fixing:
  $('#alert-message-text').text(message);
  $('#alert_message').show();
  window.setTimeout(function() {
      $("#alert_message").fadeTo(500, 0).slideUp(500, function(){
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
      id = cleanIdforInt(ids[i]);
      if (id.indexOf("VFBt_") > -1){
       id = id.replace("00000", "");
       if (id != parent.$("body").data("current").template){
         text = '{ "template": "' + id + '","scl":1.0,"mod":"zeta","slice":"Z","dst":0.0,"pit":0.0,"yaw":0.0,"rol":0.0,"qlt":80,"cvt":"png","fxp":"0,0,0","alpha": 100,"blend":"screen","inverted":false}';
         parent.$("body").data("current",text);
         loadTemplateMeta(id);
         if (!parent.$("body").data(id)){
           text = '{"' + id + '":{"selected":{"0":{"id":"' + parent.$("body").data("meta").id + '","colour":"auto","visible":true}}}}';
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
          text = '{"id":"' + id + '","colour":"auto","visible":true}';
          layers = Object.keys(selected).length;
          selected[layers] = JSON.parse(text);
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
          text = '{"id":"' + id + '","colour":"auto","visible":true, "extid":"';
          for (layers in parent.$("body").data("domains")){
            if (parseInt(parent.$("body").data("domains")[layers].id) == parseInt(id.substr(8))) {
              text += parent.$("body").data("domains")[layers].extId[0] + '" }';
            }
          }
          layers = Object.keys(selected).length;
          selected[layers] = JSON.parse(text);
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
          text = '{"id":"';
          for (layers in parent.$("body").data("domains")){
            if (parent.$("body").data("domains")[layers].extId[0] == id) {
              if (parent.$("body").data("domains")[layers].id === ""){
                alertMessage(id + ' not found in current stack');
              }else{
                text += parent.$("body").data("current").template.replace("VFBt_","VFBd_") + String(pad(parseInt(parent.$("body").data("domains")[layers].id),5)) + '","colour":"auto","visible":true, "extid":"' + id + '" }';
              }
            }
          }
          layers = Object.keys(selected).length;
          selected[layers] = JSON.parse(text);
        }
      }
    }
    updateStackData();
  }
}

function removeFromStackData(ids) {
  if (ids !== undefined && ids !== null) {
    var i;
    var l;
    var id;
    var current = parent.$("body").data("current");
    var selected = parent.$("body").data(current.template).selected;
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    for (i in ids) {
      id = cleanIdforInt(ids[i]);
      if (JSON.stringify(selected).indexOf(id) > -1) {
        if (id.indexOf("VFB") > -1){
          for (l in selected) {
            if (selected[l].id == id) {
              delete selected[l];
            }
          }
        }else{
          for (l in selected) {
            if (selected[l].extid == id) {
              delete selected[l];
            }
          }
        }
      }
    }
    selected = parent.$("body").data(current.template).selected;
    i=0;
    for (l in selected) {
      selected[i]=selected[l];
      i++;
    }
    selected = parent.$("body").data(current.template).selected;
    for (l in selected) {
      if (parseInt(l)>i) {
        delete selected[l];
      }
    }
    updateStackData();
  }
}

$('body').ready( function () {
	initStackData(null);
});
