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
		//cdn.datatables.net/colreorder/1.1.3/css/dataTables.colReorder.css;
		/css/bootstrap-colorpicker.min.css;
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
		/javascript/vfb/wlziip.js;
		/javascript/thirdParty/bootstrap-slider.min.js;
		//cdn.datatables.net/1.10.7/js/jquery.dataTables.min.js;
		//cdn.datatables.net/responsive/1.0.6/js/dataTables.responsive.min.js;
		//cdn.datatables.net/tabletools/2.2.4/js/dataTables.tableTools.min.js;
		//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.js;
		//cdn.datatables.net/colreorder/1.1.3/js/dataTables.colReorder.min.js;
		/javascript/thirdParty/bootstrap-colorpicker.min.js;
		/javascript/thirdParty/stroketext/strokeText.js;
		" />
</jsp:include>

<c:if test="${!empty param.add}">
	<script>
		$('body').ready( function () {
			addToStackData("${param.add}");
		});
	</script>
</c:if>

<div class="row">

	<div class="col-md-7 col-lg-6" id="viewer-panel">
		<form class="form-inline">
			<div class="btn btn-default btn-xs" title="Reset view" id="resetPosition"><span class="glyphicon glyphicon-screenshot"></span></div>
			<div class="btn btn-default btn-xs" title="Move through the stack" id="slider-sliceCurrentSliderValLabel">Slice: <span id="slider-sliceSliderVal" class="badge">1</span> <span class="glyphicon glyphicon-edit"></span></div>
			<div id="slider-sliceCurrentSlider" style="display: initial;padding-left: 5px;padding-right: 5px;"><input id="slider-slice" type="text" /></div>
			<div class="btn btn-default btn-xs" title="Change the image scale" id="slider-scaleCurrentSliderValLabel">Zoom: <span id="slider-scaleSliderVal" class="badge">1x</span> <span class="glyphicon glyphicon-edit"></span></div>
			<div id="slider-scaleCurrentSlider" style="display:initial;padding-left: 5px;padding-right: 5px;"><input id="slider-scale" type="text" /></div>
			<div class="btn btn-default btn-xs" title="Change the viewing plane" id="toggle-view">Plane <span id="toggle-viewVal" class="badge">Z</span> <span class="glyphicon glyphicon-repeat"></span></div>
			<div class="btn btn-default btn-xs hidden-xs" title="Ajust then image blending transparency. Note: this will also be automatically adjusted" id="slider-alphaCurrentSliderValLabel"><span class="glyphicon glyphicon-adjust"></span> <span id="slider-alphaSliderVal" class="badge">61%</span> <span class="glyphicon glyphicon-edit"></span></div>
			<div id="slider-alphaCurrentSlider" class="hidden-xs" style="display: initial;padding-left: 5px;padding-right: 5px;"><input id="slider-alpha" type="text" /></div>
			<a href="#" tabindex="0" rel="imageAttributes" class="btn btn-default btn-xs" role="button" data-toggle="popover" data-trigger="focus"
				data-placement="bottom"
				title="Image Attribution"
				data-popover-content="#imageAttributes">
					<span class="glyphicon glyphicon-info-sign"></span>
			</a>
			<div id="imageAttributes" class="hide">
				<span id="imageAttributesText" >
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
				</span>
			</div>
			<script>
				$(function(){
					$('[rel="imageAttributes"]').popover({trigger: 'focus',container: 'body',html: true,content: function () {
							var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
							return clone;
						}
					}).click(function(e) {
						if ($(this).is(":focus")) {
							if ($(this).data("open")) {
								$(this).blur();
								$(this).data("open", false);
								return true;
							}else{
								$(this).data("open", true);
								e.preventDefault();
							}
						}
					});
				});
			</script>
			<div class="text-muted hidden-xs" style="display:initial;" id="positionDiv"><span title="Image center" class="glyphicon glyphicon-screenshot"></span> <span id="positionVal" title="Image currently centered on this point" class="badge">X,Y,Z</span></div>
		</form>
		<canvas class="well" id="canvas" style="display: block; cursor: crosshair;">Your browser does not support the HTML5 canvas tag.</canvas>
		<script>
			$(document).ready(function() {
				animateWlzDisplay();
			});
		</script>
	</div>

	<div class="col-md-5 col-lg-6" id="right-panel" style="min-width:640px;">
		<div class="well">
			<ul class="nav nav-tabs nav-justified">
			  <li id="SelecMenuTab"><a id="selecHead" href="#selec" data-toggle="tab"><span class="glyphicon glyphicon-screenshot"></span> Selected</a></li>
			  <li id="DispMenuTab" class="active"><a href="#disp" data-toggle="tab"><span class="glyphicon glyphicon-picture"></span> Displayed</a></li>
			  <li id="AnatoMenuTab"><a href="#anato" data-toggle="tab"><span class="glyphicon glyphicon-list-alt"></span> Anatomy</a></li>
			  <li id="SearchMenuTab"><a href="#search" data-toggle="tab"><span class="glyphicon glyphicon-search"></span> Search</a></li>
				<li id="QueryMenuTab"><a href="#queryBuild" data-toggle="tab"><span class="glyphicon glyphicon-tasks"></span> Query</a></li>
				<li id="MinMenuTab"><a href="#min" data-toggle="tab" onClick="minimizeMenuTabs();"><span class="glyphicon glyphicon-resize-small"></span> Minimize</a></li>
			</ul>
			<div class="tab-content">
			        <div class="tab-pane" id="selec">
			            <h4>Available at the selected point <span id="pointVal" class="badge">X,Y,Z</span></h4>
									<div class="content-fluid" id="selecContent">
										<table id="selected" class="display compact" cellspacing="0" width="100%">
											<thead>
												<tr>
													<th>#</th><th>Display</th><th>Name</th><th>Type</th>
												</tr>
											</thead>
											<tbody>
												<tr><th>-</th><th>Click somewhere on the image</th><th><img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." /></th><th><img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." /></th></tr>
											</tbody>
										</table>
										<script>
										  $(document).ready(function() {
												$('#selected').DataTable( { retrieve: true,
									        paging: true,
									        searching: true,
									        ordering: true,
									        responsive: true,
									        stateSave: true,
									        order: [[ 0, 'desc' ]],
									        columnDefs: [
									            {
									                targets: [ 0 ],
									                visible: false,
									                searchable: false
									            }
									          ]
									      });
												$('#selected').on( 'page.dt', function () {
									        updateLabels();
													$('#selected').dataTable().fnAdjustColumnSizing(false);
													$('#selected').DataTable().draw(false);
									      } );
											});
										</script>
									</div>
			        </div>
			        <div class="tab-pane active" id="disp" align="center">
			            <a href="#" onClick="clearAllDisplayed();" class="btn btn-xs btn-warning" style="float:left;">Clear all</a>
									<a href="#" onClick="copyUrlToClipboard();" class="btn btn-xs btn-success" style="float:right;">Copy URL</a>
									<h4 style="float:center">Currently Displayed</h4>
									<div class="content-fluid" id="dispContent">
										<table id="displayed" class="display compact" cellspacing="0" width="100%">
											<thead>
												<tr>
													<th>#</th><th>Display</th><th>Name</th><th>Type</th>
												</tr>
											</thead>
											<tbody>
												<tr><th>-</th><th><img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." /></th><th><img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." /></th><th><img src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." /></th></tr>
											</tbody>
										</table>
										<script>
										  $(document).ready(function() {
												loadRightMenuDisplayed();
												updateLabels();
										    window.setInterval(function(){
													if ($.fn.dataTable.isDataTable('#displayed')) {
														loadRightMenuDisplayed();
														// $('#displayed').DataTable().column( 0 ).visible( false );
											      // $('#displayed').dataTable().fnAdjustColumnSizing();
													}
										    }, 10000);
												loadRightMenuDisplayed();
										  });
										</script>
									</div>
			        </div>
			        <div class="tab-pane" id="anato">
								<div class="row" >
									<div class="col-xs-9">
			            	<h4>Neuroanatomy Tree</h4>
									</div>
									<div id="openCloseAll" class="col-xs-3">
										<div class="btn-group">
											<button class"btn btn-default btn-xs" onClick="addAllDomains();" title="Add all available anatomy to the stack"><span class="glyphicon glyphicon-plus"></span></button>
											<button class"btn btn-default btn-xs" onClick="removeAllDomains();" title="Remove all available anatomy from the stack"><span class="glyphicon glyphicon-minus"></span></button>
											<button class"btn btn-default btn-xs" onClick="expandTree();" title="expand tree"><span class="glyphicon glyphicon-resize-full"></span></button>
											<button class"btn btn-default btn-xs" onClick="collapseTree();" title="collapse tree"><span class="glyphicon glyphicon-resize-small"></span></button>
										</div>
									</div>
									<div class="clearfix visible-xs-block"></div>
									<div class="col-xs-12" id="anatoContent"></div>
								</div>
			        </div>
			        <div class="tab-pane" id="search">
								<div class="content-fluid" id="searchBar"></div>
								<div class="content-fluid" id="result-section">
									<div class="well">
										<div class="contence-fluid" id="result">
											<div class="row" id="navigation">
												<div class="col-xs-6" id="pager-header"></div>
												<div class="col-xs-6"><ul class="list-inline" id="pager"></ul></div>
											</div>
											<dl>
												<div class="contence-fluid" id="docs"></div>
											</dl>
										</div>
									</div>
								</div>
								<script>
								$('#searchBar').load('/site/tools/anatomy_finder/index.htm #search-bar');
								</script>
			        </div>
							<div class="tab-pane" id="queryBuild">
								<div class="row row-centered" >
									<div class="col-xs-12 col-centered">
			            	<h4>Your Query</h4>
									</div>
									<div id="queryText" class="col-xs-12 col-centered">
										<iframe id="query_builder" name="query_builder" src="/do/query_builder.html" id="query_builder" style="width:100%;height:400px" FRAMEBORDER="0"></iframe>
									</div>
								</div>
							</div>
							<div class="tab-pane" id="min">
							</div>
			</div><!-- tab content -->
		</div><!-- end of container -->
	</div>



</div>

	<div id="footer">
		<div id="annotation" class="well">
			<a name="details"></a>
			<div id="anatomyDetails">
				<!-- <h2 class="panel_header">Annotation for Selected Node</h2> -->
				Click anywhere on the stack viewer or use the menus to select any anatomy.<br/><br/>
				Annotations for the selected anatomical term will be displayed here, with further query options visible after selection.
			</div>
		</div>
	</div>

<jsp:include page="/jsp/includes/homeFoot.jsp" />
