<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
GEPPETTO.Init.flipCameraY();
GEPPETTO.Init.flipCameraZ();
GEPPETTO.SceneController.setWireframe(false);
G.setIdleTimeout(-1);
G.setOnSelectionOptions({unselected_transparent:false});



colours = ["0xaee47c","0x3f0076","0xbbda4e","0x3f2d9c","0xd3d848","0x002b92","0x99d34f","0x5a1e8f","0x36e993","0x5c0075","0x4cd875","0x84198e","0x59ee96","0x82007d","0x81cd51","0x5541b3","0xa2e76f","0x001d79","0xf8d04d","0x385dd2","0xafad13","0x5072eb","0x95a401","0x005ccb","0x80a613","0x7e53c8","0x6bb639","0x8430a2","0x1eb858","0xa82292","0x4faf3c","0x924bbe","0x258a14","0xd987ff","0x009834","0xf77ce9","0x007210","0xfc90ff","0x006000","0xee93ff","0x00903f","0xb84bba","0x00e1a2","0xa7007b","0x01efbb","0x930077","0x6cec9d","0x67006e","0x90e88a","0x7e0073","0xbae26f","0x0142a6","0xd9a31c","0x4e88ff","0xeba72b","0x0054b8","0xd9da64","0x012477","0xffc65a","0x028df6","0xbc9400","0x958bff","0x749000","0xc38bff","0x5a8400","0xd854bc","0x00a85e","0xc1258c","0x01c589","0xcb1975","0x44eccb","0xae006f","0x02ecdf","0xa0070c","0x00c59e","0xe93a7c","0x008747","0xe95dc2","0x00681a","0xff72d1","0x005503","0xe64aa4","0x8ce8a5","0x540059","0xace388","0x46024f","0xc8de78","0x69005c","0xa1e598","0x8d0061","0xa4e4a2","0xf650a0","0x006727","0xff5084","0x019d6e","0xe03161","0x018455","0xbd004d","0x006732","0xff73bc","0x00530f","0xe79eff","0x416a00","0xfda7ff","0x928f00","0x8798ff","0xcf7509","0x006cc7","0xffa440","0x002363","0xebd469","0x002a6d","0xffae49","0x004289","0xffaf5e","0x0160af","0xbe5d00","0x57a4ff","0xc4550d","0x028bdd","0xd14929","0x009cdb","0xb31c1e","0x93b1ff","0x7c7f00","0xd8a5ff","0x627100","0xff8de0","0x354a02","0xff9de8","0x394f09","0xbfa7ff","0x8a7b00","0x003370","0xff834f","0x0066a8","0xf05c47","0x1d4786","0xff9d5b","0x39205b","0xcddb8e","0x44094a","0xffaf6c","0x5f71b6","0xa75400","0x5c3c79","0x7e6f00","0xff91ce","0x4f5600","0xeea9e6","0x544d00","0xff72a5","0x666f27","0xff628f","0x665900","0xff9ed0","0x8e6800","0x5c0047","0xffbc7f","0x67336c","0xff8256","0x894a81","0x825500","0xff8bb2","0x663c00","0xff99b8","0x6b3300","0xb76797","0x9d3a00","0x6e1f4c","0xffaf7c","0x6a002c","0xff9b77","0x630021","0xffa18a","0x5e0300","0xff989e","0x731000","0xff8f9f","0x884400","0x8b3a65","0xf55754","0x670018","0xff8878","0x800023","0xff7e94","0x843000","0xff6d8d","0x8f000a","0xd77688","0x7d0018","0xff7f7f","0x900034","0xff5972","0x985035","0xa8004e","0xd1343a","0x9d4648","0xe23659","0xa9002f"];

coli = 0;
var setSepCol = function(entityPath) { var c = coli; coli++; if (coli > 199) { coli = 0; }; Instances.getInstance(entityPath).setColor(colours[c], true).setOpacity(0.8, true); if (c = 0) { Instances.getInstance(entityPath).setOpacity(0.2, true); }; };

var resolve3D = function(path, callback) { var instance = undefined; try { instance = Instances.getInstance(path + "." + path + "_swc"); } catch (ignore) { } if(instance == undefined){ try { instance = Instances.getInstance(path + "." + path + "_obj"); } catch (ignore) { } } if(instance!=undefined){ instance.getType().resolve(function() { setSepCol(path); if (callback != undefined) { callback(); } }); } };

var customHandler=function(node, path, widget){ var n;try {n = eval(path);} catch (ex) {node = undefined;}var meta=path+"."+path+"_meta";var target=widget; if(GEPPETTO.isKeyPressed("meta")){target=G.addWidget(1).addCustomNodeHandler(customHandler,'click');}if(n!=undefined){var metanode= Instances.getInstance(meta);target.setData(metanode).setName(n.getName());}else{Model.getDatasources()[0].fetchVariable(path,function(){Instances.getInstance(meta);target.setData(eval(meta)).setName(eval(path).getName()); resolve3D(path);});}};

G.addWidget(1).setPosition((window.innerWidth-(Math.ceil(window.innerWidth/5)+10)),10).setSize((window.innerHeight-20),Math.ceil(window.innerWidth/5)).setData(FBbt_00100219.FBbt_00100219_meta).setName(FBbt_00100219.getName()).addCustomNodeHandler(customHandler,'click');

G.setIdleTimeOut(-1);

<c:if test="${fn:length(individuals)>0}">
    <c:forEach items="${individuals}" var="curr" varStatus="status">
        <c:if test="${not empty curr}">
            Model.getDatasources()[0].fetchVariable("${curr}");
        </c:if>
    </c:forEach>
</c:if>

<c:if test="${fn:length(individuals)>0}">
    <c:forEach items="${individuals}" var="curr" varStatus="status">
        <c:if test="${not empty curr}">
            Instances.getInstance("${curr}.${curr}_meta");
        </c:if>
    </c:forEach>
</c:if>

<c:if test="${fn:length(individuals)>0}">
    <c:forEach items="${individuals}" var="curr" varStatus="status">
        <c:if test="${not empty curr}">
            resolve3D("${curr}");
        </c:if>
    </c:forEach>
</c:if>

Popup1.setName('Click on image to show info');
oldSelection = "";
GEPPETTO.on(Events.Select, function () {selection = G.getSelection(); message = ""; if (selection.length > 0){ if (selection[0].getParent() != oldSelection){ oldSelection = selection[0].getParent(); try{Popup1.setData(selection[0].getParent()[selection[0].getParent().getId()+"_meta"]).setName(selection[0].getParent()[selection[0].getParent().getId()+"_meta"].getName());}catch (ignore){};}; };} );
