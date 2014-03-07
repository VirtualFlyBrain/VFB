<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<c:set var="meta_root">${(empty param.meta_root)?"/data/flybrain/":param.meta_root}</c:set>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<title>Virtual Fly Brain: ${param.title}</title>
<meta name="keywords"
	content="virtual fly brain atlas, interactive fly brain, Drosophila, fruit fly,  brain atlas, neuron search, neuropil search, phenotype search, gene expression" />
<meta name="author" content="Virtual Fly Brain Project" />
<meta name="description" content="High Resolution 3D Drosophila brain atlas" />

<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/header.css" />
<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/layout.css" />
<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/help.css" />
<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/utils.css" />
<link rel="stylesheet" type="text/css" href="/css/vfb/utils/p7menu.css" />

<link rel="stylesheet" media="all" type="text/css" href="/css/utils/contextMenu.css" />
<link rel="stylesheet" media="all" type="text/css" href="/css/tree/autocomplete.css" />

<link rel="stylesheet" type="text/css" media="all" href="/css/tools/tiledImage.css" />
<link rel="stylesheet" type="text/css" media="all" href="/css/tools/draggableWindow.css" />
<link rel="stylesheet" type="text/css" media="all" href="/css/tools/rotation.css" />
<link rel="stylesheet" type="text/css" media="all" href="/css/tools/fixedPoint.css" />
<link rel="stylesheet" type="text/css" media="all" href="/css/tools/scale.css" />
<link rel="stylesheet" type="text/css" media="all" href="/css/tools/refresh.css" />
<link rel="stylesheet" type="text/css" media="all" href="/css/tools/measuring.css" />
<link rel="stylesheet" type="text/css" media="all" href="/css/tools/selector.css" />
<link rel="stylesheet" type="text/css" media="all" href="/css/tools/locator.css" />
<link rel="stylesheet" type="text/css" media="all" href="/css/tools/slider.css" />

<link rel="stylesheet" type="text/css" media="all" href="/css/utils/busyIndicator.css" />
<link rel="stylesheet" type="text/css" media="all" href="/css/utils/marker.css" />
<link rel="stylesheet" media="all" type="text/css" href="/css/utils/emapMenu.css" />

<link rel="stylesheet" media="all" type="text/css" href="/css/tree/tree.css" />
<link rel="stylesheet" media="all" type="text/css" href="/css/tree/colourPick.css" />
<link rel="stylesheet" href="/thirdParty/smoothbox/smoothbox.css" type="text/css" media="screen" />

<c:forEach items="${fn:split(param.css, ';')}" var="item">
	<link rel="stylesheet" media="all" type="text/css" href="${item}" />
</c:forEach>

<script type="text/javascript" src="/javascript/thirdParty/json2.js"></script>
<script type="text/javascript" src="/javascript/thirdParty/mootools-core-1.3.2.js"></script>
<script type="text/javascript" src="/javascript/thirdParty/mootools-more-1.3.2.1.js"></script>
<script type="text/javascript" src="/javascript/thirdParty/mifTree.js"></script>

<script type="text/javascript" src="/javascript/utils/busyIndicator.js"></script>
<script type="text/javascript" src="/javascript/utils/utilities.js"></script>
<script type="text/javascript" src="/javascript/utils/ajaxContentLoader.js"></script>
<script type="text/javascript" src="/javascript/utils/emapMenu.js"></script>

<script type="text/javascript" src="/javascript/tiledImageModel.js"></script>
<script type="text/javascript" src="/javascript/tiledImageView.js"></script>

<script type="text/javascript" src="/javascript/tools/draggableWindow.js"></script>
<script type="text/javascript" src="/javascript/tools/tiledImageTool.js"></script>
<script type="text/javascript" src="/javascript/tools/expressionLevelKey.js"></script>
<script type="text/javascript" src="/javascript/tools/sliderComponent.js"></script>
<script type="text/javascript" src="/javascript/tools/tiledImageLocatorTool.js"></script>
<script type="text/javascript" src="/javascript/tools/tiledImageDistanceTool.js"></script>
<script type="text/javascript" src="/javascript/tools/tiledImageLayerTool.js"></script>
<script type="text/javascript" src="/javascript/tools/tiledImagePropertiesTool.js"></script>
<script type="text/javascript" src="/javascript/tools/tiledImageRotationTool.js"></script>
<script type="text/javascript" src="/javascript/tools/tiledImageRefreshTool.js"></script>
<script type="text/javascript" src="/javascript/tools/tiledImageMeasuringTool.js"></script>
<script type="text/javascript" src="/javascript/tree/treeImplementVFB.js"></script>
<script type="text/javascript" src="/javascript/tree/tiledImageTreeTool.js"></script>
<script type="text/javascript" src="/javascript/tools/tiledImageScaleTool.js"></script>
<script type="text/javascript" src="/javascript/tools/tiledImageFixedPointTool.js"></script>
<script type="text/javascript" src="/javascript/tree/colorPicker.js"></script>
<script type="text/javascript" src="/javascript/thirdParty/Meio.Autocomplete.js"></script>
<script type="text/javascript" src="/javascript/tree/contextMenu.js"></script>
<script type="text/javascript" src="/javascript/tree/contextMenuVFB.js"></script>
<script type="text/javascript" src="/javascript/vfb/utils.js"></script>
<script type="text/javascript" src="/thirdParty/smoothbox/smoothbox.js"></script>
<script type="text/javascript" src="/javascript/vfb/mailEncoder.js" />

<script type="text/javascript">
	   var emapModel = emouseatlas.emap.tiledImageModel;
	   var selectedNodeId = "${param.id}";
	   var addNodeId = '${param.add}';
	   var domainList = readCookieAsArray('domainList');
	   //alert("Domain List: " + domainList);
	   if (addNodeId !== undefined && addNodeId != null && addNodeId != ''){
		    //alert("including " + addNodeId);
	   	 	domainList.include(addNodeId);
	   }
	   //alert("Updated cookie: " + domainList);
	   saveArrayAsCookie(domainList, 'domainList');
//	   Cookie.dispose('domainList');
	   window.addEvent('domready', function() {
	   <c:if test="${!empty param.json}">
		  jso = {"modelDataUrl":"/do/get_json.html?json=${param.json}&type=${param.type}"};
		</c:if>
		<c:if test="${!empty param.woolz}">
		  jso = {"modelDataUrl":"${meta_root}${param.woolz}"};
		</c:if>
	      emapModel.initialise(jso);
		});
	
	</script>

</head>
<body>


	<div id="contentwrapper">
		<div id="center_panel">
			<div id="emapIIPViewerDiv"></div>
		</div>
	</div>

	<div id="left_panel">
		<div id="toolContainerDiv">
			<!-- We presume that for third party stacks with proper credits the param.json will be used-->
			<c:if test="${empty param.json}">
				<jsp:include page="/jsp/includes/bits/credits.jsp" />
			</c:if>
			<c:if test="${!empty param.json}">
				<jsp:include page="/jsp/includes/bits/credits3party.jsp">
					<jsp:param name="tpb" value="${param.tpb}" /> 
				</jsp:include>
			</c:if>
		</div>
	</div>

	<div id="right_panel"></div>

	<div id="footer">
		<div id="annotation">
			<!-- Need this to get the context menu on the term info box working, see span above -->
			<div id="annotation_content">
				<h2 class="panel_header">Annotation for Selected Node</h2>
				Annotation for currently selected anatomical term is displayed here.<br/><br/>
				Please click anywhere on the stack viewer above or on any node of the
				tree on the right to select a domain.<br/><br/>
				<b>Did you know?</b> You can run simple queries on a chosen term from the current panel. <br/> 
				Simply choose one of the query options to the right of 'Query for', on the term-specific menu bar that will appear at the top of this panel once you have selected an anatomy term.<br/><br/> 
				<b>Tip</b>To keep your current domain/tree selection open links in a new tab. Right/control click the link and select "Open link in new tab".  
			</div>
		</div>
		<jsp:include page="/jsp/includes/bits/cellar.jsp" />
	</div>


</body>
</html>
