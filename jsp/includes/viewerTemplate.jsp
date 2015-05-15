<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="meta_root">${(empty param.meta_root)?"/data/flybrain/":param.meta_root}</c:set>
<jsp:include page="/jsp/includes/homeHead.jsp">
	<jsp:param name="title" value="Virtual Fly Brain: ${param.title}" />
	<jsp:param name="css" value="
		/css/tree/autocomplete.css;
		/css/tools/tiledImage.css;
		/css/tools/draggableWindow.css;
		/css/tools/rotation.css;
		/css/tools/fixedPoint.css;
		/css/tools/scale.css;
		/css/tools/refresh.css;
		/css/tools/measuring.css;
		/css/tools/selector.css;
		/css/tools/locator.css;
		/css/tools/slider.css;
		/css/utils/busyIndicator.css;
		/css/utils/marker.css;
		/css/utils/emapMenu.css;
		/css/tree/tree.css;
		/css/tree/colourPick.css;
		" />
	<jsp:param name="js" value="
		/javascript/ajax-solr/vfb.js;
		/javascript/ajax-solr/core/Core.js;
		/javascript/ajax-solr/core/AbstractManager.js;
		/javascript/ajax-solr/managers/Manager.jquery.js;
		/javascript/ajax-solr/core/Parameter.js;
		/javascript/ajax-solr/core/ParameterStore.js;
		/javascript/ajax-solr/core/AbstractWidget.js;
		/javascript/ajax-solr/widgets/ResultWidget.js;
		/javascript/ajax-solr/widgets/jquery/PagerWidget.js;
		/javascript/ajax-solr/core/AbstractFacetWidget.js;
		/javascript/ajax-solr/widgets/TagcloudWidget.js;
		/javascript/ajax-solr/widgets/CurrentSearchWidget.js;
		/javascript/ajax-solr/core/AbstractTextWidget.js;
		/javascript/ajax-solr/widgets/AutocompleteWidget.js;
		/javascript/thirdParty/json2.js;
		/javascript/thirdParty/mifTree.js;
		/javascript/utils/busyIndicator.js;
		/javascript/utils/utilities.js;
		/javascript/utils/ajaxContentLoader.js;
		/javascript/utils/emapMenu.js;
		/javascript/tiledImageModel.js;
		/javascript/tiledImageView.js;
		/javascript/tools/draggableWindow.js;
		/javascript/tools/tiledImageTool.js;
		/javascript/tools/expressionLevelKey.js;
		/javascript/tools/sliderComponent.js;
		/javascript/tools/tiledImageLocatorTool.js;
		/javascript/tools/tiledImageDistanceTool.js;
		/javascript/tools/tiledImageLayerTool.js;
		/javascript/tools/tiledImagePropertiesTool.js;
		/javascript/tools/tiledImageRotationTool.js;
		/javascript/tools/tiledImageRefreshTool.js;
		/javascript/tools/tiledImageMeasuringTool.js;
		/javascript/tree/treeImplementVFB.js;
		/javascript/tree/tiledImageTreeTool.js;
		/javascript/tools/tiledImageScaleTool.js;
		/javascript/tools/tiledImageFixedPointTool.js;
		/javascript/tree/colorPicker.js;
		" />
</jsp:include>




<%-- <link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/header.css" />
<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/layout.css" />
<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/help.css" />
<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/utils.css" />
<link rel="stylesheet" type="text/css" href="/css/vfb/utils/p7menu.css" />

<link rel="stylesheet" media="all" type="text/css" href="/css/utils/contextMenu.css" />
<link rel="stylesheet" media="all" type="text/css" href="/css/tree/autocomplete.css" /> --%>


<%-- <link rel="stylesheet" href="/thirdParty/smoothbox/smoothbox.css" type="text/css" media="screen" /> --%>

<%-- <script type="text/javascript" src="/javascript/thirdParty/json2.js"></script>
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
<script type="text/javascript" src="/javascript/vfb/mailEncoder.js"></script> --%>

<script type="text/javascript" src="/javascript/thirdParty/mootools-core-1.3.2.js"></script>
<script type="text/javascript" src="/javascript/thirdParty/mootools-more-1.3.2.1.js"></script>

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
				<!-- <h2 class="panel_header">Annotation for Selected Node</h2> -->
				Click anywhere on the stack viewer or on any node of the
				tree to select a domain.<br/><br/>
				Annotations for the selected anatomical term will be displayed here, with further query options visible after selection.<br/><br/>
				<b>Tip: </b> To keep your current domain/tree selection, open links in a new tab. Right/control click and select "Open link in new tab".
			</div>
		</div>
	</div>

<jsp:include page="/jsp/includes/homeFoot.jsp" />
