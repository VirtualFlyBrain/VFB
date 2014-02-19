<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" debug="true">

<!-- If meta_root param is set, use it, oterhwise use the default value -->
<c:set var="meta_root">${(empty param.meta_root)?"/data/flybrain/":param.meta_root}</c:set>
<!-- Need to use that parameter to make query builder work within the iframe on history.back() -->
<c:set var="currURL" scope="session">${param.currURL}</c:set>
   <head>
      <meta name="author" content="Ruven Pillay &lt;ruven@users.sourceforge.netm&gt;, Tom Perry &lt;T.Perry@hgu.mrc.ac.uk&gt; and others" />
      <meta name="keywords" content="Internet Imaging Protocol IIP IIPImage" />
      <meta name="description" content="High Resolution Remote Image Viewing" />
      <meta name="copyright" content="&copy; 2003-2007 Ruven Pillay" />
 
      <link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/header.css" />
      <link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/layout-basic.css" />
      <link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/help.css" />
      <link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/utils.css" />
      
      <link rel="stylesheet" media="all" type="text/css" href="/css/utils/contextMenu.css" />  
	  <link rel="stylesheet" media="all" type="text/css" href="/css/tree/autocomplete.css" />

      <link rel="stylesheet" type="text/css" media="all" href="/css/tools/tiledImage.css" />   
      <link rel="stylesheet" type="text/css" media="all" href="/css/tools/draggableWindow.css" />
      <link rel="stylesheet" type="text/css" media="all" href="/css/tools/slider.css" />
 
      <link rel="stylesheet" type="text/css" media="all" href="/css/utils/busyIndicator.css" />
      <link rel="stylesheet" media="all" type="text/css" href="/css/utils/emapMenu.css" />

      <link rel="stylesheet" media="all" type="text/css" href="/css/tree/tree.css" />
      <link rel="stylesheet" media="all" type="text/css" href="/css/tree/colourPick.css" />
      <link rel="stylesheet" href="/thirdParty/smoothbox/smoothbox.css" type="text/css" media="screen" />	   

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
      <script type="text/javascript" src="/javascript/tools/sliderComponent.js"></script>
      <script type="text/javascript" src="/javascript/tools/tiledImageDistanceTool.js"></script>
 	  <script type="text/javascript" src="/javascript/tree/treeImplementVFB.js"></script>
      <script type="text/javascript" src="/javascript/tree/tiledImageTreeTool.js"></script>
      <script type="text/javascript" src="/javascript/tree/colorPicker.js"></script>
	  <script type="text/javascript" src="/javascript/thirdParty/Meio.Autocomplete.js"></script>
	  <script type="text/javascript" src="/javascript/tree/contextMenu.js"></script>
	  <script type="text/javascript" src="/javascript/tree/contextMenuVFB.js"></script>
	  <script type="text/javascript" src="/javascript/vfb/utils.js"></script>
	  <script src="/thirdParty/smoothbox/smoothbox.js" type="text/javascript"></script>
	  <c:forEach items="${fn:split(param.css, ';')}" var="item">
      	<link rel="stylesheet" media="all" type="text/css" href="${item}" />
      </c:forEach>

	<script type="text/javascript">
	   var selectedNodeId = "${param.id}";
	   function doOnload() {
		      jso = {"modelDataUrl":"${meta_root}${param.woolz}"};
		      emouseatlas.emap.tiledImageModel.initialise(jso);
			}    
	</script>

   </head>

   <body onload="doOnload();">
	<div id="wrapper_basic">
	    <div id="center_panel">
			<div id="emapIIPViewerDiv"></div>	 
		</div>
		
		
		<div id="right_panel"> 
		</div>	
		
		<div id="annotation">
			<!-- span class="mif-tree-name" style="z-index:100; float:right; width:200px ">
				<a class="help triangle-down" href="#" title="Right click here for term-specific actions">&nbsp;Actions on term</a>
			</span-->
			<!-- Need this to get the context menu on the term info box working, see span above -->
			<div id="annotation_content">
				<h2 class="panel_header">Annotation for Selected Node</h2>
				Annotation for currently selected anatomical term is displayed here.<br/><br/>
				Please click anywhere on the stack viewer above or on any node of the
				tree on the right to select a domain.<br/><br/>				
				<b>Tip: </b> To keep your current tree selection open the link in a new tab. To do that, right/ctrl click the link and select "Open link in new tab" from the pop-up menu.
			</div>
		</div>
				 	
 	</div> <!--body_wrapper -->
			
	<!-- Context menu for tree nodes --> 	
	<ul id="contextmenu">
		<li><a name="include" class="cut" id="include">Add to the query</a></li>
		<!-- li><a href="#exclude" id="exclude">Add as "exclude"</a></li -->
		<li class="separator"><a href="#quit" class="quit">Cancel</a></li>
	</ul>
	
   </body>

</html>

