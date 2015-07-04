/*! VirtualFlyBrain.org functions to manage image stack */

window.selPointX = 0;
window.selPointY = 0;
window.selPointZ = 0;
window.reloadInterval = 10;
var CompKey = ['"}}}}','"},"','":{"','{"','","','":{"','":"','":','},"',',"'];
var CompMax = {A:'!4scl!71!9mod!6zeta!4slice!6Z!4dst!70!9pit!70!9yaw!70!9rol!70!9qlt!780!9cvt!6png!4fxp!6',
  B:'VFBt_001!2S!20!2i!6VFBt_00100000!4N!6Janelia Adult Brain',
  C:'VFBt_002!2S!20!2i!6VFBt_00200000!4N!6Ito Half Brain',
  c1c:'i!6VFBd_00100024!4e!6FBbt_00007401!1', c2c:'!2i!6VFBd_00100023!4e!6FBbt_00003678!1', c3c:'!2i!6VFBd_00100026!4e!6FBbt_00003679!1', c4c:'!2i!6VFBd_00100004!4e!6FBbt_00003680!1', c5c:'!2i!6VFBd_00100006!4e!6FBbt_00003668!1', c6c:'!2i!6VFBd_00100017!4e!6FBbt_00007453!1', c7c:'!2i!6VFBd_00100036!4e!6FBbt_00007385!1', c8c:'!2i!6VFBd_00100019!4e!6FBbt_00007677!1', c9c:'!2i!6VFBd_00100018!4e!6FBbt_00015407!1', c10c:'!2i!6VFBd_00100015!4e!6FBbt_00045039!1', c11c:'!2i!6VFBd_00100012!4e!6FBbt_00040049!1', c12c:'!2i!6VFBd_00100039!4e!6FBbt_00040048!1', c13c:'!2i!6VFBd_00100016!4e!6FBbt_00045037!1', c14c:'!2i!6VFBd_00100014!4e!6FBbt_00040050!1', c15c:'!2i!6VFBd_00100005!4e!6FBbt_00003682!1', c16c:'!2i!6VFBd_00100008!4e!6FBbt_00003681!1',
  c17c:'!2i!6VFBd_00100051!4e!6FBbt_00040060!1', c18c:'!2i!6VFBd_00100007!4e!6FBbt_00007053!1', c19c:'!2i!6VFBd_00100003!4e!6FBbt_00003852!1', c20c:'!2i!6VFBd_00100022!4e!6FBbt_00003885!1', c21c:'!2i!6VFBd_00100025!4e!6FBbt_00003748!1', c22c:'!2i!6VFBd_00100002!4e!6FBbt_00045003!1', c23c:'!2i!6VFBd_00100028!4e!6FBbt_00045032!1', c24c:'!2i!6VFBd_00100027!4e!6FBbt_00007054!1', c25c:'!2i!6VFBd_00100029!4e!6FBbt_00007055!1', c26c:'!2i!6VFBd_00100034!4e!6FBbt_00007059!1', c27c:'!2i!6VFBd_00100033!4e!6FBbt_00040044!1', c28c:'!2i!6VFBd_00100030!4e!6FBbt_00040043!1', c29c:'!2i!6VFBd_00100032!4e!6FBbt_00045027!1', c30c:'!2i!6VFBd_00100031!4e!6FBbt_00040042!1', c31c:'!2i!6VFBd_00100038!4e!6FBbt_00045046!1',
  c32c:'!2i!6VFBd_00100037!4e!6FBbt_00045040!1', c33c:'!2i!6VFBd_00100040!4e!6FBbt_00040040!1', c34c:'!2i!6VFBd_00100035!4e!6FBbt_00040039!1', c35c:'!2i!6VFBd_00100013!4e!6FBbt_00040041!1', c36c:'!2i!6VFBd_00100010!4e!6FBbt_00045051!1', c37c:'!2i!6VFBd_00100020!4e!6FBbt_00045050!1', c38c:'!2i!6VFBd_00100009!4e!6FBbt_00045048!1', c39c:'!2i!6VFBd_00100011!4e!6FBbt_00003982!1', c40c:'!2i!6VFBd_00100049!4e!6FBbt_00014013!1', c41c:'!2i!6VFBd_00100050!4e!6FBbt_00040051',
  d1d:'!2i!6VFBd_00200023!4e!6FBbt_00007401!1', d2d:'!2i!6VFBd_00200022!4e!6FBbt_00003678!1', d3d:'!2i!6VFBd_00200025!4e!6FBbt_00003679!1', d4d:'!2i!6VFBd_00200003!4e!6FBbt_00003680!1', d5d:'!2i!6VFBd_00200005!4e!6FBbt_00003668!1', d6d:'!2i!6VFBd_00200016!4e!6FBbt_00007453!1', d7d:'!2i!6VFBd_00200035!4e!6FBbt_00007385!1', d8d:'!2i!6VFBd_00200018!4e!6FBbt_00007677!1', d9d:'!2i!6VFBd_00200017!4e!6FBbt_00015407!1', d10d:'!2i!6VFBd_00200020!4e!6FBbt_00045007!1', d11d:'!2i!6VFBd_00200014!4e!6FBbt_00045039!1', d12d:'!2i!6VFBd_00200011!4e!6FBbt_00040049!1', d13d:'!2i!6VFBd_00200038!4e!6FBbt_00040048!1', d14d:'!2i!6VFBd_00200015!4e!6FBbt_00045037!1', d15d:'!2i!6VFBd_00200013!4e!6FBbt_00040050!1', d16d:'!2i!6VFBd_00200004!4e!6FBbt_00003682!1',
  d17d:'!2i!6VFBd_00200007!4e!6FBbt_00003681!1', d18d:'!2i!6VFBd_00200006!4e!6FBbt_00007053!1', d19d:'!2i!6VFBd_00200002!4e!6FBbt_00003852!1', d20d:'!2i!6VFBd_00200021!4e!6FBbt_00003885!1', d21d:'!2i!6VFBd_00200024!4e!6FBbt_00003748!1', d22d:'!2i!6VFBd_00200001!4e!6FBbt_00045003!1', d23d:'!2i!6VFBd_00200027!4e!6FBbt_00045032!1', d24d:'!2i!6VFBd_00200026!4e!6FBbt_00007054!1', d25d:'!2i!6VFBd_00200028!4e!6FBbt_00007055!1', d26d:'!2i!6VFBd_00200033!4e!6FBbt_00007059!1', d27d:'!2i!6VFBd_00200032!4e!6FBbt_00040044!1', d28d:'!2i!6VFBd_00200029!4e!6FBbt_00040043!1', d29d:'!2i!6VFBd_00200031!4e!6FBbt_00045027!1', d30d:'!2i!6VFBd_00200030!4e!6FBbt_00040042!1', d31d:'!2i!6VFBd_00200037!4e!6FBbt_00045046!1', d32d:'!2i!6VFBd_00200036!4e!6FBbt_00045040!1',
  d33d:'!2i!6VFBd_00200039!4e!6FBbt_00040040!1', d34d:'!2i!6VFBd_00200034!4e!6FBbt_00040039!1', d35d:'!2i!6VFBd_00200012!4e!6FBbt_00040041!1', d36d:'!2i!6VFBd_00200009!4e!6FBbt_00045051!1', d37d:'!2i!6VFBd_00200019!4e!6FBbt_00045050!1', d38d:'!2i!6VFBd_00200008!4e!6FBbt_00045048!1', d39d:'!2i!6VFBd_00200010!4e!6FBbt_00003982!1', d40d:'!2i!6VFBd_00200048!4e!6FBbt_00014013!1', d41d:'!2i!6VFBd_00200049!4e!6FBbt_00040051!1', d42d:'!2i!6VFBd_00200043!4e!6FBbt_00007080!1', d43d:'!2i!6VFBd_00200040!4e!6FBbt_00003985!1', d44d:'!2i!6VFBd_00200046!4e!6FBbt_00004043!1', d45d:'!2i!6VFBd_00200041!4e!6FBbt_00100337!1', d46d:'!2i!6VFBd_00200044!4e!6FBbt_00110653!1', d47d:'!2i!6VFBd_00200047!4e!6FBbt_00004020!1', d48d:'!2i!6VFBd_00200328!4e!6FBbt_00007354!1',
  d49d:'!2i!6VFBd_00200321!4e!6FBbt_00100346!1', d50d:'!2i!6VFBd_00200343!4e!6FBbt_00007072!1', d51d:'!2i!6VFBd_00200307!4e!6FBbt_00100339!1', d52d:'!2i!6VFBd_00200325!4e!6FBbt_00100340!1', d53d:'!2i!6VFBd_00200322!4e!6FBbt_00100352!1', d54d:'!2i!6VFBd_00200312!4e!6FBbt_00100350!1', d55d:'!2i!6VFBd_00200318!4e!6FBbt_00007074!1', d56d:'!2i!6VFBd_00200306!4e!6FBbt_00003983!1', d57d:'!2i!6VFBd_00200327!4e!6FBbt_00100347!1', d58d:'!2i!6VFBd_00200315!4e!6FBbt_00100343!1', d59d:'!2i!6VFBd_00200320!4e!6FBbt_00100345!1', d60d:'!2i!6VFBd_00200314!4e!6FBbt_00100342!1', d61d:'!2i!6VFBd_00200308!4e!6FBbt_00003683!1', d62d:'!2i!6VFBd_00200305!4e!6FBbt_00003984!1', d63d:'!2i!6VFBd_00200319!4e!6FBbt_00100344!1', d64d:'!2i!6VFBd_00200323!4e!6FBbt_00007083!1',
  d65d:'!2i!6VFBd_00200303!4e!6FBbt_00007427!1', d66d:'!2i!6VFBd_00200338!4e!6FBbt_00100355!1', d67d:'!2i!6VFBd_00200324!4e!6FBbt_00100338!1', d68d:'!2i!6VFBd_00200337!4e!6FBbt_00100357!1', d69d:'!2i!6VFBd_00200345!4e!6FBbt_00100351!1', d70d:'!2i!6VFBd_00200317!4e!6FBbt_00100354!1', d71d:'!2i!6VFBd_00200311!4e!6FBbt_00100349!1', d72d:'!2i!6VFBd_00200330!4e!6FBbt_00007077!1', d73d:'!2i!6VFBd_00200316!4e!6FBbt_00100341!1', d74d:'!2i!6VFBd_00200313!4e!6FBbt_00100356',
  D7:'VFBi_0000000', D6:'VFBi_000000', D5:'VFBi_00000', D4:'VFBi_0000', D3:'VFBi_000', D2:'VFBi_00', D1:'VFBi_0', D0:'VFBi_',
  E:'!4alpha!7220!9blend!6screen!4inverted!7false!8',
  F8:'00000000', F7:'0000000', F6:'000000', F5:'00000', F4:'0000', F3:'000',
  G:'"}}!8',
  H:'VFBt_00',
  I8:'!2i!6!D8',I7:'!2i!6!D7',I6:'!2i!6!D6',I5:'!2i!6!D5',I4:'!2i!6!D4',I3:'!2i!6!D3',I2:'!2i!6!D2',I1:'!2i!6!D1'
};

function updateStackCounter() {
  var html;
  if ($.cookie("displaying")) {
    var stack = expandCookieDisplayed();
    if (stack.current){
      $("[id=viewer2DVal]").each(function(){
        $(this).text(Object.keys(stack[stack.current.template].selected).length-1);
      });
      if (parent.$("body").data("meta")){
        $("[id=stackName]").each(function(){
          $(this).text(parent.$("body").data("meta").name);
        });
      }
      generateAddButtons();
      if ($.isFunction($.cookie)){
        if ($.cookie('cookie-box') === undefined){
  				$('#cookie-warning').show();
          html = '<div class="col-md-8 col-md-offset-2">';
    			html += '<div class="alert alert-info alert-dismissible" role="alert" id="info-char">';
    			html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true" onclick="';
          html += "$.cookie('cookie-box', 'closed', { expires: 5*365, path: '/' });";
          html += '" >&times;</span></button>';
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
					html += '<button type="button" class="close" data-dismiss="alert" aria-label="Close" ><span aria-hidden="true" onclick="';
          html += "$.cookie('dev-box', 'closed', { expires: 7, path: '/' });";
          html += '" >&times;</span></button>';
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
    $("[id^=imageViewerOpen]").each(function(){
      var html = '<button class="btn btn-sm btn-success" onclick="';
      html += "post('/site/stacks/index.htm',{'add':'" + cleanIdforInt($(this).data('id')) + "'});";
      if (($('body').data("available") && $('body').data("available").indexOf(cleanIdforInt($(this).data('id'))) > -1) || $(this).data('id').indexOf('VFB') > -1) {
        html += '" title="Open ' + $(this).data('name') + ' in stack viewer">Open ' + $(this).data('name') + ' in stack viewer</button>';
        $(this).html(html);
        $(this).attr('id','ResolvedImageViewerOpen');
      }else{
        html += '" title="Open ' + $(this).data('name') + ' in stack viewer" disabled="disabled">' + $(this).data('name') + ' is not specifically labeled in the current stack</button>';
        html = html.replace('btn-success','btn-default');
        $(this).html(html);
        $(this).attr('id','ResolvedImageViewerOpen');
      }
    });
    $("[id^=attach]").each(function(){
      var id = cleanIdforInt($(this).data("id"));
      var content = "";
      if ($(this).html() === ""){
        if (id.indexOf("FBbt_") > -1) {
          if (parent.$("body").data("available").indexOf(id) > -1) {
            if(JSON.stringify(parent.$("body").data(parent.$("body").data("current").template).selected).indexOf(id) > -1) {
              content += '<button type="button" class="btn btn-success btn-xs" aria-label="Remove from stack viewer" title="Currently added to stack viewer; click to remove" onclick="';
              content += "removeFromStackData('" + id + "');$('*[id=attach][data-id=" + cleanIdforExt($(this).data("id")) + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
              content += '"><span style="border:none;" class="glyphicon glyphicon-ok-circle"></span></button>';
              $(this).html(content);
            }else{
              content += '<button type="button" class="btn btn-success btn-xs" aria-label="Add to stack viewer" title="Add to stack viewer" onclick="';
              content += "addToStackData('" + id + "',false);$('*[id=attach][data-id=" + cleanIdforExt($(this).data("id")) + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
              content += '"><span style="border:none;" class="glyphicon glyphicon-paperclip"></span></button>';
            }
          }
        }else if (id.indexOf("VFB") > -1) {
          if(JSON.stringify(parent.$("body").data(parent.$("body").data("current").template).selected).indexOf(id) > -1) {
            content += '<button type="button" class="btn btn-success btn-xs" aria-label="Remove from stack viewer" title="Currently added to stack viewer; click to remove" onclick="';
            content += "removeFromStackData('" + id + "');$('*[id=attach][data-id=" + cleanIdforExt($(this).data("id")) + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
            content += '"><span style="border:none;" class="glyphicon glyphicon-ok-circle"></span></button>';
            $(this).html(content);
          }else{
            content += '<button type="button" class="btn btn-success btn-xs" aria-label="Add to stack viewer" title="Add to stack viewer" onclick="';
            // TBD Need to resolve correct template:
            content += "addToStackData(['VFBt_00100000','" + id + "'],false);$('*[id=attach][data-id=" + cleanIdforExt($(this).data("id")) + "]').html('');updateStackData();if (typeof updateMenuData !== 'undefined' && $.isFunction(updateMenuData)) {updateMenuData();};if (typeof updateWlzDisplay !== 'undefined' && $.isFunction(updateWlzDisplay)) {updateWlzDisplay();};";
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
    		  text += "parent.$('#query_builder').attr('src', '/do/query_builder.html?action=add&amp;rel=include&amp;fbId=" + cleanIdforExt($(this).data("id")) + "');if (typeof openQueryTab !== 'undefined' && $.isFunction(openQueryTab)) {openQueryTab();};ga('send', 'event', 'query', 'add', '" + cleanIdforExt($(this).data("id")) + "');";
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
  for (i in CompMax) {
    count = 1000;
    while (data.indexOf(CompMax[i]) > -1 && count>0) {
      data = data.replace(CompMax[i],'!' + String(i));
    }
  }
  return data;
}

function decompressJSONdata(data) {
  var i;
  var j;
  var count = 0;
  var keys = Object.keys(CompMax).reverse();
  for (j=0; j<keys.length; j++) {
    count = 1000;
    i=keys[j];
    while (data.indexOf('!' + String(i)) > -1 && count>0) {
      data = data.replace('!' + String(i), CompMax[i]);
    }
  }
  keys = Object.keys(CompKey).reverse();
  for (j=0; j<keys.length; j++) {
    count = 1000;
    i=keys[j];
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

function clearAllData() {
  var current = parent.$("body").data("current");
  var selected = parent.$("body").data(current.template).selected;
  var i;
  for (i in selected) {
    if (i > 0){
      delete selected[i];
    }
  }
  updateStackData();
}

function defaultScaleByScreen() {
  var scale = 1.0;
  if ($(window).width() < 1370) {
    scale = 0.9;
  }
  if ($(window).width() < 630) {
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
  parent.$("body").data("VFBt_002", { selected: { 0: { id: "VFBt_00200000", colour: "auto", visible: true }}});
  parent.$("body").data("VFBt_003", { selected: { 0: { id: "VFBt_00300000", colour: "auto", visible: true }}});
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

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField);
         }
    }
    document.body.appendChild(form);
    form.submit();
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

function addToStackData(ids, showDetails){
  if (ids !== undefined && ids !== null) {
    showDetails = typeof showDetails !== 'undefined' ? showDetails : true;
    window.reloadInterval = 10;
    if (parent.$("body").data("current") && parent.$("body").data("meta") && parent.$("body").data("domains")) {
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
               location.href=location.href.replace(location.hash,"").replace('#','');
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
      if (id.indexOf('VFBt_')<0 && id.indexOf('VFBd_' && window.location.pathname == "/site/stacks/index.htm")>-1 && showDetails){
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
              if (typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.isDataTable('#displayed')){
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
                  if (typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.isDataTable('#displayed')){
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
                if (typeof $.fn.dataTable !== 'undefined' && $.fn.dataTable.isDataTable('#displayed')){
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
