<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
GEPPETTO.Init.flipCameraY();
GEPPETTO.Init.flipCameraZ();
GEPPETTO.SceneController.setWireframe(false);
G.setIdleTimeout(-1);
G.setOnSelectionOptions({unselected_transparent:false});

GEPPETTO.ControlPanel.setColumnMeta([{ "columnName": "path", "order": 1, "locked": false, "displayName": "Path", "source": "$entity$.getPath()" }, { "columnName": "name", "order": 2, "locked": false, "displayName": "Name", "source": "$entity$.getName()", "action": "var displayTexxxt = '$entity$'.split('.')['$entity$'.split('.').length - 1]; G.addWidget(1).setData($entity$[displayTexxxt + '_meta']).setName(displayTexxxt).addCustomNodeHandler(customHandler,'click');" }, { "columnName": "type", "order": 3, "locked": false, "customComponent": GEPPETTO.ArrayComponent, "displayName": "Type(s)", "source": "$entity$.getTypes().map(function (t) {return t.getPath()})", "action": "var displayTexxxt = '$entity$'.split('.')['$entity$'.split('.').length - 1]; G.addWidget(1).setData($entity$[displayTexxxt + '_meta']).setName(displayTexxxt).addCustomNodeHandler(customHandler,'click');" }, { "columnName": "controls", "order": 4, "locked": false, "customComponent": GEPPETTO.ControlsComponent, "displayName": "Controls", "source": "", "action": "GEPPETTO.FE.refresh();" }, { "columnName": "image", "order": 5, "locked": false, "customComponent": GEPPETTO.ImageComponent, "displayName": "Image", "cssClassName": "img-column", "source": "GEPPETTO.ModelFactory.getAllVariablesOfMetaType($entity$.$entity$_meta.getType(), 'ImageType')[0].getInitialValues()[0].value.data" }]);
GEPPETTO.ControlPanel.setColumns(['name', 'type', 'controls', 'image']);
GEPPETTO.ControlPanel.setDataFilter(function(entities){var visualInstances = GEPPETTO.ModelFactory.getAllInstancesWithCapability(GEPPETTO.Resources.VISUAL_CAPABILITY, entities);var compositeInstances = [];for(var i=0; i<visualInstances.length; i++){if(visualInstances[i].getType().getMetaType() == GEPPETTO.Resources.COMPOSITE_TYPE_NODE){compositeInstances.push(visualInstances[i]);}}return compositeInstances;});
GEPPETTO.ControlPanel.setControlsConfig({ "VisualCapability": { "select": { "condition": "GEPPETTO.SceneController.isSelected($instances$)","false": {"actions": ["GEPPETTO.SceneController.select($instances$)"],"icon": "fa-hand-stop-o","label": "Unselected","tooltip": "Select"},"true": {"actions": ["GEPPETTO.SceneController.deselect($instances$)"],"icon": "fa-hand-rock-o","label": "Selected","tooltip": "Deselect"},"visibility": { "condition": "GEPPETTO.SceneController.isVisible($instances$)", "false": { "id": "visibility", "actions": [ "GEPPETTO.SceneController.show($instances$);" ], "icon": "fa-eye-slash", "label": "Hidden", "tooltip": "Show" }, "true": { "id": "visibility", "actions": [ "GEPPETTO.SceneController.hide($instances$);" ], "icon": "fa-eye", "label": "Visible", "tooltip": "Hide" } } }, "color": { "id": "color", "actions": [ "$instance$.setColor('$param$');" ], "icon": "fa-tint", "label": "Color", "tooltip": "Color" }, "zoom": { "id": "zoom", "actions": [ "GEPPETTO.SceneController.zoomTo($instances$)" ], "icon": "fa-search-plus", "label": "Zoom", "tooltip": "Zoom" }, "visibility_obj": { "showCondition": "$instance$.getType().hasVariable($instance$.getId() + '_obj')", "condition": "(function() { var visible = false; if ($instance$.getType().$instance$_obj != undefined && $instance$.getType().$instance$_obj.getType().getMetaType() != GEPPETTO.Resources.IMPORT_TYPE && $instance$.$instance$_obj != undefined) { visible = GEPPETTO.SceneController.isVisible([$instance$.$instance$_obj]); } return visible; })()", "false": { "id": "visibility_obj", "actions": [ "(function(){var instance = Instances.getInstance('$instance$.$instance$_obj'); if (instance.getType().getMetaType() == GEPPETTO.Resources.IMPORT_TYPE) { instance.getType().resolve(function() { GEPPETTO.FE.refresh() }); } else { GEPPETTO.SceneController.show([instance]); }})()" ], "icon": "fa-eye-slash", "label": "Hidden", "tooltip": "Show obj" }, "true": { "id": "visibility_obj", "actions": [ "GEPPETTO.SceneController.hide([$instance$.$instance$_obj])" ], "icon": "fa-eye", "label": "Visible", "tooltip": "Hide obj" } }, "visibility_swc": { "showCondition": "$instance$.getType().hasVariable($instance$.getId() + '_swc')", "condition": "(function() { var visible = false; if ($instance$.getType().$instance$_swc != undefined && $instance$.getType().$instance$_swc.getType().getMetaType() != GEPPETTO.Resources.IMPORT_TYPE && $instance$.$instance$_swc != undefined) { visible = GEPPETTO.SceneController.isVisible([$instance$.$instance$_swc]); } return visible; })()", "false": { "id": "visibility_swc", "actions": [ "(function(){var instance = Instances.getInstance('$instance$.$instance$_swc'); if (instance.getType().getMetaType() == GEPPETTO.Resources.IMPORT_TYPE) { instance.getType().resolve(function() { GEPPETTO.FE.refresh() }); } else { GEPPETTO.SceneController.show([instance]); }})()" ], "icon": "fa-eye-slash", "label": "Hidden", "tooltip": "Show swc" }, "true": { "id": "visibility_swc", "actions": [ "GEPPETTO.SceneController.hide([$instance$.$instance$_swc])" ], "icon": "fa-eye", "label": "Visible", "tooltip": "Hide swc" } }, }, "Common": { "info": { "id": "info", "action": ["var displayTexxxt = '$entity$'.split('.')['$entity$'.split('.').length - 1]; G.addWidget(1).setData($entity$[displayTexxxt + '_meta']).setName(displayTexxxt).addCustomNodeHandler(customHandler,'click');"], "icon": "fa-info-circle", "label": "Info", "tooltip": "Info" }, "delete": { "id": "delete", "actions": [ "$instance$.delete()" ], "icon": "fa-trash-o", "label": "Delete", "tooltip": "Delete" } } });
GEPPETTO.ControlPanel.setControls({"Common": ['info', 'delete'], "VisualCapability": ['select', 'color', 'visibility', 'zoom', 'visibility_obj', 'visibility_swc']});

colours = ["0xaee47c","0x3f0076","0xbbda4e","0x3f2d9c","0xd3d848","0x002b92","0x99d34f","0x5a1e8f","0x36e993","0x5c0075","0x4cd875","0x84198e","0x59ee96","0x82007d","0x81cd51","0x5541b3","0xa2e76f","0x001d79","0xf8d04d","0x385dd2","0xafad13","0x5072eb","0x95a401","0x005ccb","0x80a613","0x7e53c8","0x6bb639","0x8430a2","0x1eb858","0xa82292","0x4faf3c","0x924bbe","0x258a14","0xd987ff","0x009834","0xf77ce9","0x007210","0xfc90ff","0x006000","0xee93ff","0x00903f","0xb84bba","0x00e1a2","0xa7007b","0x01efbb","0x930077","0x6cec9d","0x67006e","0x90e88a","0x7e0073","0xbae26f","0x0142a6","0xd9a31c","0x4e88ff","0xeba72b","0x0054b8","0xd9da64","0x012477","0xffc65a","0x028df6","0xbc9400","0x958bff","0x749000","0xc38bff","0x5a8400","0xd854bc","0x00a85e","0xc1258c","0x01c589","0xcb1975","0x44eccb","0xae006f","0x02ecdf","0xa0070c","0x00c59e","0xe93a7c","0x008747","0xe95dc2","0x00681a","0xff72d1","0x005503","0xe64aa4","0x8ce8a5","0x540059","0xace388","0x46024f","0xc8de78","0x69005c","0xa1e598","0x8d0061","0xa4e4a2","0xf650a0","0x006727","0xff5084","0x019d6e","0xe03161","0x018455","0xbd004d","0x006732","0xff73bc","0x00530f","0xe79eff","0x416a00","0xfda7ff","0x928f00","0x8798ff","0xcf7509","0x006cc7","0xffa440","0x002363","0xebd469","0x002a6d","0xffae49","0x004289","0xffaf5e","0x0160af","0xbe5d00","0x57a4ff","0xc4550d","0x028bdd","0xd14929","0x009cdb","0xb31c1e","0x93b1ff","0x7c7f00","0xd8a5ff","0x627100","0xff8de0","0x354a02","0xff9de8","0x394f09","0xbfa7ff","0x8a7b00","0x003370","0xff834f","0x0066a8","0xf05c47","0x1d4786","0xff9d5b","0x39205b","0xcddb8e","0x44094a","0xffaf6c","0x5f71b6","0xa75400","0x5c3c79","0x7e6f00","0xff91ce","0x4f5600","0xeea9e6","0x544d00","0xff72a5","0x666f27","0xff628f","0x665900","0xff9ed0","0x8e6800","0x5c0047","0xffbc7f","0x67336c","0xff8256","0x894a81","0x825500","0xff8bb2","0x663c00","0xff99b8","0x6b3300","0xb76797","0x9d3a00","0x6e1f4c","0xffaf7c","0x6a002c","0xff9b77","0x630021","0xffa18a","0x5e0300","0xff989e","0x731000","0xff8f9f","0x884400","0x8b3a65","0xf55754","0x670018","0xff8878","0x800023","0xff7e94","0x843000","0xff6d8d","0x8f000a","0xd77688","0x7d0018","0xff7f7f","0x900034","0xff5972","0x985035","0xa8004e","0xd1343a","0x9d4648","0xe23659","0xa9002f"];

var setSepCol = function(path){console.log(path+" setting colour....");try{ if (typeof window[path] == "undefined") { setSepCol(path); }else{Instances.getInstance(path).setColor(colours[order[path]],true).setOpacity(0.7,true);if (order[path]<1){Instances.getInstance(path).setOpacity(0.6,true);}; capacity++; loaded++; }}catch (ignore){setSepCol(path);}};

var resolve3D = function(path){ try{ var i = Instances.getInstance(path+"."+path+"_obj"); i = Instances.getInstance(path+"."+path+"_swc"); }catch(ignore){} i.getType().resolve(function(){setSepCol(path);}); };
var customHandler=function(node, path, widget){ var n;try {n = eval(path);} catch (ex) {node = undefined;}var meta=path+"."+path+"_meta";var target=widget; if(GEPPETTO.isKeyPressed("meta")){target=G.addWidget(1).addCustomNodeHandler(customHandler,'click');}if(n!=undefined){var metanode= Instances.getInstance(meta);target.setData(metanode).setName(n.getName());}else{Model.getDatasources()[0].fetchVariable(path,function(){Instances.getInstance(meta);target.setData(eval(meta)).setName(eval(path).getName()); resolve3D(path);});}};

loaded = 0; timeout = []; timeout["max"] = 10; order = []; order["curr"] = 0; capacity = 1; total=0;

var getMeta = function(path){console.log(path+" loading Meta....");var meta=path+"."+path+"_meta"; Instances.getInstance(meta); console.log("Loaded metadata for " + path + " into " + meta);};

var loadInd=function(path){console.log(path+" loading....");Model.getDatasources()[0].fetchVariable(path,function(){getMeta(path);resolve3D(path);});};

var sleep=function(miliseconds) {var currentTime = new Date().getTime();while (currentTime + miliseconds >= new Date().getTime()){}}

var delay=function(ms, func, param) { console.log( order[param] + "/" + total + "->" + loaded ); setTimeout(function(){ if (capacity > 0) {capacity--; func(param);}else{delay(1000, func, param);}}, ms);}

info = G.addWidget(1).setPosition((window.innerWidth-(Math.ceil(window.innerWidth/5)+10)),10).setSize((window.innerHeight-20),Math.ceil(window.innerWidth/5)).addCustomNodeHandler(customHandler,'click');;
info.setName('Click on image to show info');
oldSelection = "";
GEPPETTO.on(Events.Select, function () {selection = G.getSelection(); message = ""; if (selection.length > 0){ if (selection[0].getParent() != oldSelection){ oldSelection = selection[0].getParent(); try{info.setData(selection[0].getParent()[selection[0].getParent().getId()+"_meta"]).setName(selection[0].getParent()[selection[0].getParent().getId()+"_meta"].getName());}catch (ignore){};}; };} );


<c:if test="${fn:length(individuals)>0}">
    <c:forEach items="${individuals}" var="curr" varStatus="status">
        <c:if test="${not empty curr}">
            timeout["${curr}"] = 0;
            order["${curr}"] = ${status.index};
            delay(${status.index}*1000,loadInd, "${curr}");
            total = ${status.index};
        </c:if>
    </c:forEach>

</c:if>

<c:forEach items="${domains}" var="curr" varStatus="status">
    <c:if test="${not empty curr}">
        //${domHead}<fmt:formatNumber minIntegerDigits="5" groupingUsed="false" value="${curr}"/>.setColor('0xaaaaaa',true);
    </c:if>
</c:forEach>

<c:forEach items="${domains}" var="curr" varStatus="status">
    <c:if test="${not empty curr}">
        //${domHead}<fmt:formatNumber minIntegerDigits="5" groupingUsed="false" value="${curr}"/>.setOpacity(0.6,true);
    </c:if>
</c:forEach>

<c:forEach items="${diffName}" var="curr" varStatus="status">
    <c:if test="${not empty curr}">
        setTimeout(function() { ${curr}.setColor('${diffColour[status.index]}',true);}, 7000);
    </c:if>
</c:forEach>

//<c:out escapeXml="false" value="${campos}"/>
//<c:out escapeXml="false" value="${camrot}"/>


G.setIdleTimeOut(-1);

