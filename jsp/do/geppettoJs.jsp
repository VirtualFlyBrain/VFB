<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
GEPPETTO.Init.flipCameraY();
GEPPETTO.Init.flipCameraZ();
GEPPETTO.SceneController.setWireframe(false);
G.setIdleTimeout(-1);
G.setOnSelectionOptions({unselected_transparent:false});



colours = ["0x73294c","0x49e54a","0x6c2ad0","0x91f451","0xc346f0","0xb0eb34","0x3819a9","0xe1ec2c","0x4945dd","0x79d633","0x973cda","0x52c440","0xe83cda","0x6eee7f","0xbb2fc8","0x40a725","0x6627ad","0xdef262","0x4349c3","0xe9d737","0x8b66ee","0x99bf27","0xcd63ef","0xabdd55","0x3b157e","0x9ae871","0xbf2eb5","0x43c76b","0xee32b1","0x5defa6","0x852da8","0xc7ce3c","0x5d71de","0xeac028","0x343386","0xe0d85e","0xb662d5","0x74b237","0xec6add","0x3b8d28","0xc92f9e","0x4aa855","0xe33089","0x60f1d3","0xea291f","0x5de1e5","0xf15021","0x458ee8","0xe89112","0x20104d","0xd4ed83","0x70308c","0xbcb62e","0x9060c6","0x98a125","0xa83fa4","0xb5eb8d","0x871a73","0xa3c055","0xc885eb","0x226d13","0xd35fb5","0x85c876","0xea2c68","0x52cea0","0xdd333e","0x40af7b","0xee598b","0x2d8346","0xbd2751","0xa3e8a7","0x531c59","0xf0e581","0x28285d","0xe9ab2e","0x9c91ec","0xe4ba4b","0x65529d","0x708a20","0xe791dd","0x44701b","0xed74a9","0x1f5113","0xc44881","0x78a151","0x991e5d","0x7ddbc7","0xc2361e","0x47bbd8","0xe75f29","0x427cb8","0xe97627","0x4899c3","0xd48122","0x3b4680","0xeee998","0x201537","0xe1c471","0x606eb2","0xee9f4c","0x243250","0xbdb658","0x98458a","0xb9c97d","0x360d25","0xdde8af","0x1b1a29","0xe7b46a","0x9b79c2","0xaa8322","0x859fde","0xca6529","0x3eaba1","0xdd5259","0x34896f","0x8d1f16","0xb7e4e1","0x65171e","0xbce7c0","0xa62f47","0x82bf9a","0x4a1620","0xe1e5cf","0x2e1b21","0xe9d2a4","0x532c4f","0xbda251","0xac6aa9","0x457636","0xcca4e2","0x3f4e13","0xeb9fc9","0x132b11","0xd9beea","0x1f4723","0xe46d50","0x23627f","0xa44c17","0x93bbe5","0xc97d3a","0x3a5a80","0xe99863","0x122f32","0xe8886e","0x38707b","0xe8757f","0x3d683c","0xea89a4","0x5f7632","0xbd739c","0x85842e","0x6d5075","0xa8a867","0x9b5070","0x619467","0x8d3b47","0x8fc9da","0x763712","0xe3cfd6","0x372018","0xebb795","0x2d2d1c","0xefb1bb","0x3c4521","0xb1afc7","0x6e5f16","0xa383a9","0x5d4415","0x659495","0x923b32","0x88ab9b","0x4f2715","0xb8bda3","0x424053","0xbda16e","0x294d48","0xe28f82","0x3a6b54","0xb75c57","0x91a876","0xc67482","0x6a7750","0xcc919a","0x4f3e22","0xaa95a2","0xad663e","0x757892","0xa17e43","0x69434e","0xc1a78c","0x60403c","0xc98c70","0x576f6a","0x9b6161","0x756f3b","0x8a6b6f","0x545542","0xa28b76","0x855a3f","0x787760"];

coli = 0;
var setSepCol = function(entityPath) { var c = coli; coli++; if (coli > 199) { coli = 0; }; Instances.getInstance(entityPath).setColor(colours[c], true).setOpacity(0.3, true); if (c = 0) { Instances.getInstance(entityPath).setOpacity(0.2, true); }; };

var resolve3D = function(path, callback) { var instance = undefined; try { instance = Instances.getInstance(path + "." + path + "_swc"); } catch (ignore) { } if(instance == undefined){ try { instance = Instances.getInstance(path + "." + path + "_obj"); } catch (ignore) { } } if(instance!=undefined){ instance.getType().resolve(function() { setSepCol(path); if (callback != undefined) { callback(); } }); } };

var customHandler=function(node, path, widget){ var n;try {n = eval(path);} catch (ex) {node = undefined;}var meta=path+"."+path+"_meta";var target=widget; if(GEPPETTO.isKeyPressed("meta")){target=G.addWidget(1).addCustomNodeHandler(customHandler,'click');}if(n!=undefined){var metanode= Instances.getInstance(meta);target.setData(metanode).setName(n.getName());}else{Model.getDatasources()[0].fetchVariable(path,function(){Instances.getInstance(meta);target.setData(eval(meta)).setName(eval(path).getName()); resolve3D(path);});}};

G.addWidget(1).setPosition((window.innerWidth-(Math.ceil(window.innerWidth/5)+10)),10).setSize((window.innerHeight-20),Math.ceil(window.innerWidth/5)).setData(FBbt_00100219.FBbt_00100219_meta).setName(FBbt_00100219.getName()).addCustomNodeHandler(customHandler,'click');

G.setIdleTimeOut(-1);

Popup1.setName('Click on image to show info');
oldSelection = "";
GEPPETTO.on(Events.Select, function () {selection = G.getSelection(); message = ""; if (selection.length > 0){ if (selection[0].getParent() != oldSelection){ oldSelection = selection[0].getParent(); try{Popup1.setData(selection[0].getParent()[selection[0].getParent().getId()+"_meta"]).setName(selection[0].getParent()[selection[0].getParent().getId()+"_meta"].getName());}catch (ignore){};}; };} );

<c:if test="${fn:length(individuals)>0}">
    <c:forEach items="${individuals}" var="curr" varStatus="status">
        <c:if test="${not empty curr}">
            Model.getDatasources()[0].fetchVariable("${curr}");
            Instances.getInstance("${curr}.${curr}_meta");
            resolve3D("${curr}");
        </c:if>
    </c:forEach>
</c:if>

