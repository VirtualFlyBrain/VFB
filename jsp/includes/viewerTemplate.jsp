<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="meta_root">${(empty param.meta_root)?"/data/flybrain/":param.meta_root}</c:set>
<jsp:include page="/jsp/includes/homeHead.jsp">
	<jsp:param name="title" value="Virtual Fly Brain: ${param.title}" />
	<jsp:param name="css" value="
		/css/bootstrap-slider.min.css;
		//cdn.datatables.net/1.10.7/css/jquery.dataTables.min.css;
		//cdn.datatables.net/responsive/1.0.6/css/dataTables.responsive.css;
		//cdn.datatables.net/tabletools/2.2.4/css/dataTables.tableTools.css;
		//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.css;
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
		/javascript/vfb/wlziip.js;
		/javascript/thirdParty/bootstrap-slider.min.js;
		//cdn.datatables.net/1.10.7/js/jquery.dataTables.min.js;
		//cdn.datatables.net/responsive/1.0.6/js/dataTables.responsive.min.js;
		//cdn.datatables.net/tabletools/2.2.4/js/dataTables.tableTools.min.js;
		//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.js;
		" />
</jsp:include>

<div class="row">

	<div class="col-md-7" id="viewer-panel">
		<form class="form-inline">
			<div class="btn btn-default btn-xs" title="Reset view" id="resetPosition"><span class="glyphicon glyphicon-screenshot"></span></div>
			<div class="btn btn-default btn-xs" title="Move through the stack" id="slider-sliceCurrentSliderValLabel">Slice: <span id="slider-sliceSliderVal" class="badge">1</span> <span class="glyphicon glyphicon-edit"></span></div>
			<div id="slider-sliceCurrentSlider" style="display: initial;padding-left: 5px;padding-right: 5px;"><input id="slider-slice" type="text" /></div>
			<div class="btn btn-default btn-xs" title="Change the image scale" id="slider-scaleCurrentSliderValLabel">Zoom: <span id="slider-scaleSliderVal" class="badge">1x</span> <span class="glyphicon glyphicon-edit"></span></div>
			<div id="slider-scaleCurrentSlider" style="display:initial;padding-left: 5px;padding-right: 5px;"><input id="slider-scale" type="text" /></div>
			<div class="btn btn-default btn-xs" title="Change the viewing plane" id="toggle-view">Toggle View <span id="toggle-viewVal" class="badge">Z</span> <span class="glyphicon glyphicon-repeat"></span></div>
			<a href="#" tabindex="0" rel="imageAttributes" class="btn btn-default btn-xs" role="button" data-toggle="popover" data-trigger="focus"
				data-placement="bottom"
				title="Image Attribution"
				data-popover-content="#imageAttributes">
					<span class="glyphicon glyphicon-info-sign"></span>
			</a>
			<div id="imageAttributes" class="hide">
				<c:if test="${!empty param.stackInfo}">
					<c:set var="credits" value="${fn:split(param.stackInfo,'|')}" />
					<h3><span class="glyphicon glyphicon-picture"></span> Background and Anatomy Stack:</h3>
					<p>${credits[0]}</p>
				  <p><b>Created by: </b>${credits[1]}</p>
				  <p><b>Background Staining: </b>${credits[2]} <span id="backgroundStain"><a href="${credits[3]}" target="_new">${credits[4]}</a></span</p>
					<p><a href="/site/vfb_site/template_files_downloads.htm">Full details and a download link can be found here.</a>
					<h3><span class="glyphicon glyphicon-info-sign"></span> See individual details sheet for any images overlayed for attributation information.</h3>
				</c:if>
				<c:if test="${empty param.stackInfo}">
					<h3><span class="glyphicon glyphicon-picture"></span> Background and Anatomy Stack:</h3>
					<p><a href="/site/vfb_site/template_files_downloads.htm">Full details and a download link can be found here.</a>
					<h3><span class="glyphicon glyphicon-info-sign"></span> See individual details sheet for any images overlayed for attributation information.</h3>
				</c:if>
			</div>
			<script>
				$(function(){
					$('[rel="imageAttributes"]').popover({trigger: 'focus',container: 'body',html: true,content: function () {
							var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
							return clone;
						}
					}).click(function(e) {
						e.preventDefault();
						if ($(this).is(":focus")) {
							if ($(this).data("open")) {
								$(this).blur();
								$(this).data("open", false);
							}else{
								$(this).data("open", true);
							}
						}
					});
				});
			</script>
			<div class="text-muted hidden-xs" style="display:initial;" id="positionDiv">Centered on: <span id="positionVal" class="badge">X,Y,Z</span></div>
		</form>
		<canvas class="well" id="canvas" style="display: block;"></canvas>
		<script>
			$(document).ready(function() {
				animateWlzDisplay();
			});
		</script>
	</div>

	<div class="col-md-5" id="right-panel">
		<div class="well">
			<ul class="nav nav-tabs nav-justified">
			  <li><a href="#selec" data-toggle="tab"><span class="glyphicon glyphicon-screenshot"></span> Selected</a></li>
			  <li class="active"><a href="#disp" data-toggle="tab"><span class="glyphicon glyphicon-picture"></span> Displayed</a></li>
			  <li><a href="#anato" data-toggle="tab"><span class="glyphicon glyphicon-list-alt"></span> Anatomy</a></li>
			  <li><a href="#search" data-toggle="tab"><span class="glyphicon glyphicon-search"></span> Search</a></li>
			</ul>
			<div class="tab-content">
			        <div class="tab-pane" id="selec">
			            <h4>Available at the selected point <span id="pointVal" class="badge">X,Y,Z</span></h4>
			            <p id="selecContent"></p>
			        </div>
			        <div class="tab-pane active" id="disp">
			            <h4>Currently Displayed</h4>
									<p id="dispContent"></p>
			        </div>
			        <div class="tab-pane" id="anato">
			            <h4>Neuro Anatomy Tree</h4>
									<p id="anatoContent"></p>
			        </div>
			        <div class="tab-pane" id="search">
			            <h4>Search</h4>
									<p id="searchContent">
										<script>
										$('#searchContent').load('/site/tools/anatomy_finder/index.htm #search-page');
										</script>
									</p>
			        </div>
			</div><!-- tab content -->
		</div><!-- end of container -->
	</div>



</div>

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
