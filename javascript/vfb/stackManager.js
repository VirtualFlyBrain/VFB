/*! VirtualFlyBrain.org functions to manage image stack */

window.selPointX = 0;
window.selPointY = 0;
window.selPointZ = 0;
window.reloadInterval = 10;
var CompKey = ['"}}}}','"},"','":{"','{"','","','":{"','":"','":','},"',',"'];

function updateStackCounter() {
  var html;
  if ($.cookie("displaying")) {
    var stack = expandCookieDisplayed();
    if (stack.current){
      $("#viewer2DVal").text(Object.keys(stack[stack.current.template].selected).length-1);
      generateAddButtons();
      if ($.isFunction($.cookie)){
        if ($.cookie('cookie-box') === undefined){
  				$('#cookie-warning').show();
          html = '<div class="col-md-8 col-md-offset-2">';
    			html += '<div class="alert alert-info alert-dismissible" role="alert" id="info-char">';
    			html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
    			html += '<center>';
    			html += '<strong><span class="glyphicon glyphicon-info-sign"></span></strong> Just so you know this site uses cookies to track usage and preferences.';
    			html += 'By continuing to use our website, you agree to the use of cookies. <br>';
    			html += 'If you would like to know more about cookies and how to manage them please view our <a href="/site/vfb_site/privacy_cookies.htm">privacy and cookies</a> policy.';
    			html += '</center>';
    			html += '</div>';
    			html += '</div>';
          $('#cookie-warning').html(html);
  			}else{
  				$('#cookie-warning').hide();
  			}
        if( $.cookie('dev-box') === undefined ){
          $('#dev-warning').show();
          html = '<div class="col-md-8 col-md-offset-2">';
					html += '<div class="alert alert-warning alert-dismissible" role="alert" id="warning-char">';
					html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
					html += '<center>';
					html += '<strong><span class="glyphicon glyphicon-warning-sign"></span></strong> This is a test server and not the official VFB site.';
					html += '</center>';
					html += '</div>';
					html += '</div>';
          $('#dev-warning').html(html);
        }else{
          $('#dev-warning').hide();
        }
      }
    }
  }
}

function cleanIdforExt(id) {
  if (id) {
    id = id.replace(":","_");
    id = id.toLowerCase().replace("vfb","VFB").replace("fbbt","FBbt");
    id = id.replace('VFBi_','VFB_');
    return id;
  }
  return "";
}

function cleanIdforInt(id) {
  if (id) {
    id = id.replace(":","_");
    id = id.toLowerCase().replace("vfb","VFB").replace("fbbt","FBbt");
    id = id.replace('VFB_','VFBi_');
    return id;
  }
  return "";
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
         var temp = parent.$("body").data("meta").center.split(',');
         window.selPointX = temp[0];
         window.selPointY = temp[1];
         window.selPointZ = temp[2];
       }
       var l;
       var list = "";
       for (l in $('body').data("domains")) {
         if ($('body').data("domains")[l].id > "") {
           list += cleanIdforInt($('body').data("domains")[l].extId[0]) + ",";
         }
       }
       parent.$("body").data("available", list);
       updateStackData();
     });
   }
}

function createAddButtonHTMLfinal(id) {
  id = cleanIdforInt(id);
  var content="";
  if (JSON.stringify(parent.$("body").data(parent.$("body").data("current").template).selected).indexOf(id) > -1) {
    content += '<button type="button" class="btn btn-success btn-xs" aria-label="Remove from stack viewer" title="Currently added to stack viewer; click to remove" onclick="';
    content += "removeFromStackData('" + id + "');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
    content += '"><span style="border:none;" class="glyphicon glyphicon-ok-circle"></span></button>';
  }else{
    content += '<button type="button" class="btn btn-success btn-xs" aria-label="Add to stack viewer" title="Add to stack viewer" onclick="';
    content += "addToStackData('" + id + "');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
    content += '"><span style="border:none;" class="glyphicon glyphicon-paperclip"></span></button>';
  }
  return content;
}

function generateAddButtons() {
  if (parent.$("body").data("available")) {
    $("[id^=attach]").each(function(){
      var id = cleanIdforInt($(this).data("id"));
      var content = "";
      if ($(this).html() === ""){
        if (id.indexOf("FBbt_") > -1) {
          if (parent.$("body").data("available").indexOf(id) > -1) {
            if(JSON.stringify(parent.$("body").data(parent.$("body").data("current").template).selected).indexOf(id) > -1) {
              content += '<button type="button" class="btn btn-success btn-xs" aria-label="Remove from stack viewer" title="Currently added to stack viewer; click to remove" onclick="';
              content += "removeFromStackData('" + id + "');$('*[id=attach][data-id=" + $(this).data("id") + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
              content += '"><span style="border:none;" class="glyphicon glyphicon-ok-circle"></span></button>';
              $(this).html(content);
            }else{
              content += '<button type="button" class="btn btn-success btn-xs" aria-label="Add to stack viewer" title="Add to stack viewer" onclick="';
              content += "addToStackData('" + id + "');$('*[id=attach][data-id=" + $(this).data("id") + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
              content += '"><span style="border:none;" class="glyphicon glyphicon-paperclip"></span></button>';
            }
          }
        }else if (id.indexOf("VFB") > -1) {
          if(JSON.stringify(parent.$("body").data(parent.$("body").data("current").template).selected).indexOf(id) > -1) {
            content += '<button type="button" class="btn btn-success btn-xs" aria-label="Remove from stack viewer" title="Currently added to stack viewer; click to remove" onclick="';
            content += "removeFromStackData('" + id + "');$('*[id=attach][data-id=" + $(this).data("id") + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
            content += '"><span style="border:none;" class="glyphicon glyphicon-ok-circle"></span></button>';
            $(this).html(content);
          }else{
            content += '<button type="button" class="btn btn-success btn-xs" aria-label="Add to stack viewer" title="Add to stack viewer" onclick="';
            // TBD Need to resolve correct template:
            content += "addToStackData(['VFBt_00100000','" + id + "']);$('*[id=attach][data-id=" + $(this).data("id") + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
            content += '"><span style="border:none;" class="glyphicon glyphicon-paperclip"></span></button>';
          }
        }
        $(this).html(content);
      }
    });
    $('#pageLoading').hide();
    if (window.location.pathname == "/site/stacks/index.htm") {
      $("[id^=addToQuery]").each(function(){
        if ($(this).data("id") && $(this).data("id") !=="undefined"){
    		  var text = '<a href="#" class="btn btn-xs btn-info" onclick="';
    		  text += "parent.$('#query_builder').attr('src', '/do/query_builder.html?action=add&amp;rel=include&amp;fbId=" + $(this).data("id") + "');if (typeof openQueryTab !== 'undefined' && $.isFunction(openQueryTab)) {openQueryTab();};ga('send', 'event', 'query', 'add', '" + cleanIdforExt($(this).data("id")) + "');";
    		  text += '"><span style="border:none;" class="glyphicon glyphicon-tasks"></span></a>';
    		  $(this).html(text);
          $(this).attr("id", "Resolved"+$(this).attr("id"));
        }else{
          $(this).attr("id", "NA"+$(this).attr("id"));
        }
      });
  	}
  }else{
    if ($('body').data("domains") && $('body').data("current") && $('body').data($('body').data("current").template).selected){
      var selected = $('body').data($('body').data("current").template).selected;
      var domains = $('body').data("domains");
      var available = selected[0].id;
      var i;
      for (i in domains){
          if (domains[i].domainData.domainId && domains[i].domainData.domainId !== ""){
            if (domains[i].extId && domains[i].extId[0] && domains[i].extId[0] !== "undefined" && domains[i].extId[0] !== ""){
              available += ',' + cleanIdforInt(domains[i].extId[0]);
            }
          }
      }
      parent.$("body").data("available", available);
    }
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
    if (window.reloadInterval < 5000 || window.reloadInterval > 5050 ){
      window.reloadInterval = 10;
    }
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
  delete save.ref_txt;
  var t;
  var l;
  for (t in save) {
    if (t.indexOf('VFBt_')>-1) {
      if (save[t].selected["5"]){
        for (l in save[t].selected) {
          delete save[t].selected[l].name;
          delete save[t].selected[l].type;
        }
      }
    }
  }
  save = JSON.stringify(save);
  var count = 1000;
  while (save.indexOf('auto')>-1 && count>0){
    save = save.replace(',"visible":true','').replace(',"colour":"auto"','');
    count--;
  }
  count = 1000;
  while (save.indexOf('"id"')>-1 && count>0){
    save = save.replace('"name"','"N"').replace('"type"','"t"').replace('"typeid"','"I"').replace('"extid"','"e"').replace('"current"','"C"').replace('"selected"','"S"');
    save = save.replace('"template"','"T"').replace('"visible"','"v"').replace('"selected"','"S"').replace('"colour"','"c"').replace('"id"','"i"');
  }
  save = compressJSONdata(save);
  return save;
}

function compressJSONdata(data) {
  var i;
  var count = 0;
  for (i in CompKey) {
    count = 1000;
    while (data.indexOf(CompKey[i]) > -1 && count>0) {
      data = data.replace(CompKey[i],'!' + String(i));
    }
  }
  return data;
}

function decompressJSONdata(data) {
  var i;
  var count = 0;
  for (i in CompKey) {
    count = 1000;
    while (data.indexOf('!' + String(i)) > -1 && count>0) {
      data = data.replace('!' + String(i), CompKey[i]);
    }
  }
  return data;
}

function expandCookieDisplayed() {
  var data = $.cookie("displaying");
  var patt = new RegExp('"[A-z]":');
  var count = 1000;
  data = decompressJSONdata(data);
  while (patt.test(data) && count>0){
    data = data.replace('"C"','"current"').replace('"N"','"name"').replace('"t"','"type"').replace('"I"','"typeid"').replace('"T"','"template"').replace('"c"','"colour"').replace('"v"','"visible"').replace('"S"','"selected"').replace('"e"','"extid"');
    data = data.replace('"i"','"id"');
    count--;
  }
  data = JSON.parse(data);
  var layer;
  var template;
  for (template in data) {
    if (data[template].selected){
      for (layer in data[template].selected) {
        if (data[template].selected[layer].colour === undefined) {
          data[template].selected[layer].colour = "auto";
        }
        if (data[template].selected[layer].visible === undefined) {
          data[template].selected[layer].visible = true;
        }
      }
    }
  }
  return data;
}

function defaultScaleByScreen() {
  var scale = 1.0;
  if (window.screenX < 1950) {
    scale = 0.9;
  }
  if (window.screenX < 1000) {
    scale = 0.5;
  }
  return scale;
}

function loadDefaultData(ids) {
  loadTemplateMeta("VFBt_001");
  var count = 0;
  var text = '{ "template": "VFBt_001","scl":' + defaultScaleByScreen() + ',"mod":"zeta","slice":"Z","dst":0.0,"pit":0.0,"yaw":0.0,"rol":0.0,"qlt":80,"cvt":"png","fxp":"0,0,0","alpha": 100,"blend":"screen","inverted":false}';
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
      parent.$("body").data(expandCookieDisplayed());
      addToStackData(ids);
    }
  }
  parent.$("body").data(expandCookieDisplayed());
  if (parent.$("body").data("current") === undefined){
    alert($.cookie("displaying"));
    alert(returnCleanData());
    alertMessage("Invalid cookie! Sorry your settings have got currupted so we will have to clear them.");
    $.cookie("displaying", null, { expires: -5, path: '/' });
    loadDefaultData(ids);
    location.reload();
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
  ga('send', 'event', 'code', 'alert', message);
}

function openFullDetails(id) {
  if ($('#anatomyDetails')) {
    id = cleanIdforExt(id);
    if (id.indexOf("VFBt_") < 0 && id.indexOf("VFBd_") < 0){
      $('#anatomyDetails').html('<img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading...">');
      $('#anatomyDetails').load("/do/ont_bean.html?id=" + id);
    }else{
      alertMessage("Can't directly open details for:" + id);
    }
  }
  ga('send', 'event', 'load', 'details', id);
}

function addToStackData(ids){
  if (ids !== undefined && ids !== null) {
    window.reloadInterval = 10;
    if (parent.$("body").data("current") && parent.$("body").data("meta") && parent.$("body").data("domains")&& parent.$("body").data("colours")) {
      var id;
      var i;
      var text;
      var selected;
      var layers;
      var temp;
      var j;
      if (ids.indexOf(',')>-1){
        ids = ids.split(',');
      }
      if (!Array.isArray(ids)) {
        ids = [ids];
      }
      for (i in ids) {
        id = cleanIdforInt(ids[i]);
        try{
          ga('send', 'event', 'viewer', 'add', cleanIdforExt(id));
          if (id.indexOf("VFBt_") > -1){
           id = id.replace("00000", "");
           if (id != parent.$("body").data("current").template){
             loadTemplateMeta(id);
             text = '{ "template": "' + id + '","scl":' + defaultScaleByScreen() + ',"mod":"zeta","slice":"Z","dst":0.0,"pit":0.0,"yaw":0.0,"rol":0.0,"qlt":80,"cvt":"png","fxp":"0.0,0.0,0.0","alpha": 100,"blend":"screen","inverted":false}';
             parent.$("body").data("current",JSON.parse(text));
             updateStackData();
             if (!parent.$("body").data(id)){
               text = '{"selected":{"0":{"id":"' + id + "00000" + '","colour":"auto","visible":true}}}';
               parent.$("body").data(id,JSON.parse(text));
             }
             updateStackData();
             parent.$("body").data("disp","scale");
             if (window.location.pathname == "/site/stacks/index.htm"){
               location.reload();
             }
           }
          }else if (id.indexOf("VFBi_") > -1){
            selected = parent.$("body").data(parent.$("body").data("current").template).selected;
            if (JSON.stringify(selected).indexOf(id) > -1){
              for (layers in selected){
                if (cleanIdforInt(selected[layers].id) == id){
                  selected[layers].visible = true;
                }
              }
            }else{
              text = '{"id":"' + id + '","colour":"auto","visible":true}';
              layers = Object.keys(selected).length;
              selected[layers] = JSON.parse(text);
              parent.$("body").data("current").alpha = 100;
            }
          }else if (id.indexOf("VFBd_") > -1){
            selected = parent.$("body").data(parent.$("body").data("current").template).selected;
            if (JSON.stringify(selected).indexOf(id) > -1){
              for (layers in selected){
                if (cleanIdforInt(selected[layers].id) == id){
                  selected[layers].visible = true;
                }
              }
            }else{
              layers = Object.keys(selected).length;
              text = '{"id":"' + id + '","colour":"auto","visible":true, "extid":"';
              for (layers in parent.$("body").data("domains")){
                if (parseInt(parent.$("body").data("domains")[layers].domainData.domainId) == parseInt(id.substr(8))) {
                  text += cleanIdforInt(parent.$("body").data("domains")[layers].extId[0]) + '" }';
                }
              }
              layers = Object.keys(selected).length;
              selected[layers] = JSON.parse(text);
            }
          }else if (id.indexOf("FBbt_") > -1){
            selected = parent.$("body").data(parent.$("body").data("current").template).selected;
            if (JSON.stringify(selected).indexOf(id) > -1){
              for (layers in selected){
                if (cleanIdforInt(selected[layers].extid) == id){
                  selected[layers].visible = true;
                }
              }
            }else{
              layers = Object.keys(selected).length;
              if (parent.$("body").data("available").indexOf(id) > -1) {
                text = '{"id":"';
                for (layers in parent.$("body").data("domains")){
                  if (cleanIdforInt(parent.$("body").data("domains")[layers].extId[0]) == id) {
                    if (parent.$("body").data("domains")[layers].domainData.domainId === ""){
                      alertMessage(id + ' not found in current stack');
                    }else{
                      temp = parent.$("body").data("current").template.replace("VFBt_","VFBd_") + String(pad(parseInt(parent.$("body").data("domains")[layers].domainData.domainId),5));
                      if (JSON.stringify(selected).indexOf(temp) > -1){
                        for (j in selected){
                          if (cleanIdforInt(selected[j].id) == temp){
                            selected[j].visible = true;
                            break;
                          }
                        }
                      }else{
                        text += temp + '","colour":"auto","visible":true, "extid":"' + id + '" }';
                      }
                    }
                    break;
                  }
                }
              }
              layers = Object.keys(selected).length;
              selected[layers] = JSON.parse(text);
            }
          }
        }catch(e){
          alertMessage('Issue adding id:' + id + String(e));
        }
      }
      if (id.indexOf('VFBt_')<0 && id.indexOf('VFBd_')<0){
        openFullDetails(id);
      }
      updateStackData();
    }else{
      window.setTimeout(function(){
				addToStackData(ids);
			}, 5000);
    }
  }
}

function removeFromStackData(ids) {
  if (ids !== undefined && ids !== null) {
    window.reloadInterval = 10;
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
      ga('send', 'event', 'viewer', 'remove', cleanIdforExt(id));
      if (JSON.stringify(selected).indexOf(id) > -1) {
        if (id.indexOf("VFBi_") > -1){
          for (l in selected) {
            if (selected[l].id == id) {
              delete selected[l];
              if ($.fn.dataTable.isDataTable('#displayed')){
                $('#displayed').dataTable().fnDeleteRow(parseInt(l),false);
                $('#displayed').DataTable().draw(false);
              }
            }
          }
        }else{
          if (id.indexOf("FBbt_") > -1) {
            for (l in selected) {
              if (cleanIdforInt(selected[l].extid) == id) {
                if (selected[l].id.indexOf('VFBt_') < 0){
                  delete selected[l];
                  if ($.fn.dataTable.isDataTable('#displayed')){
                    $('#displayed').dataTable().fnDeleteRow(parseInt(l),false);
                    $('#displayed').DataTable().draw(false);
                  }
                }
              }
            }
          }else if (id.indexOf("VFBd_") > -1){
            for (l in selected) {
              if (cleanIdforInt(selected[l].id) == id) {
                delete selected[l];
                if ($.fn.dataTable.isDataTable('#displayed')){
                  $('#displayed').dataTable().fnDeleteRow(parseInt(l),false);
                  $('#displayed').DataTable().draw(false);
                }
              }
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
      if (parseInt(l)>i-1) {
        delete selected[l];
      }
    }
    updateStackData();
  }
}

$('body').ready( function () {
	initStackData(null);
  window.setInterval(function(){
    generateAddButtons();
  }, 2000);
});
