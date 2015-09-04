<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="cleanTitle">${fileName}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>

<jsp:include page="/jsp/includes/homeHead.jsp">
	<jsp:param name="title" value="${cleanTitle}" />
	<jsp:param name="css" value="
		//cdn.datatables.net/1.10.9/css/jquery.dataTables.min.css;
		//cdn.datatables.net/1.10.9/css/dataTables.bootstrap.min.css;
		//cdn.datatables.net/responsive/1.0.7/css/responsive.bootstrap.min.css;
		//cdn.datatables.net/colreorder/1.2.0/css/colReorder.bootstrap.min.css;
		//cdn.datatables.net/buttons/1.0.1/css/buttons.dataTables.min.css;
		//cdn.datatables.net/buttons/1.0.1/css/buttons.bootstrap.min.css;
	" />
	<jsp:param name="js" value="
		//cdn.datatables.net/1.10.8/js/jquery.dataTables.min.js;
		//cdn.datatables.net/1.10.8/js/dataTables.bootstrap.min.js;
		//cdn.datatables.net/responsive/1.0.7/js/dataTables.responsive.min.js;
		//cdn.datatables.net/colreorder/1.2.0/js/dataTables.colReorder.min.js;
		//cdn.datatables.net/buttons/1.0.1/js/dataTables.buttons.min.js;
		//cdn.datatables.net/buttons/1.0.1/js/buttons.bootstrap.min.js;
		//cdn.datatables.net/buttons/1.0.1/js/buttons.jqueryui.min.js;
		//cdn.datatables.net/buttons/1.0.1/js/buttons.html5.min.js;
		//cdn.datatables.net/buttons/1.0.1/js/buttons.print.min.js;
	" />
</jsp:include>

<script>$('body').css('cursor', 'wait');</script>

<div class="row-fluid" style="padding:0;">
	<div class="col-xs-12">
		<div class="row">
			<div class="center-block" align="center">
				<h2>Query: ${query}</h2>
			</div>
		</div>
		<div class="col-xs-12" style="padding:0;">
			<div class="container-fluid" style="padding:0;">
				<div class="table-responsive">
					<table id="resultsTable" class="display">
						<thead>
							<tr>
							<c:forEach items="${transgeneColumns}" var="curr">
								<th>${curr}</th>
							</c:forEach>
								<th>Source</th>
							</tr>
						</thead>
						<tbody>
						<c:forEach items="${geneList}" var="geneBean" varStatus="status">
							<tr>
								<td><a href="${transgeneLinks[0]}${geneBean.driverRef}.html" target="_blank">${geneBean.driver}</a></td>
								<td><a href="/site/tools/anatomy_finder/index.htm?id=FBbt:${geneBean.locationRef}&name=${geneBean.location}">${geneBean.location}</a>
								<c:if test="${geneBean.flag}">
									<a href="" class="warn" title="${queryDesc} expression in this cell may be localised to regions of the cell that do not overlap the queried structure">(*)</a>
								</c:if>
								</td>
								<td><a href="${transgeneLinks[0]}${geneBean.reference}.html" target="_blank">${geneBean.referenceRef}</a></td>
								<td>
									<c:set var="tpb" value="${geneBean.thirdPartyBean}" />
									<c:if test="${!empty tpb && tpb.stackType=='adult brain' && tpb.completeExpressionPattern}">
										<c:if test="${!empty geneBean.thirdPartyBean.thumbName}">
											<a style="float: left; margin: 0 3px;" href="/site/stacks/index.htm?add=${tpb.vfbId}" title="View registered stack in 3D Viewer"  target="_blank">
											<img class="lazy" data-original="${geneBean.thirdPartyBean.thumbUrl}" alt="${geneBean.driver} ${query}, ${tpb.sourceName}, ${geneBean.referenceRef}"/></a>
										</c:if>
										<c:if test="${!empty geneBean.thirdPartyBean.stackName}">
											<span id="attach" data-id="${tpb.vfbId}"></span>
										</c:if>
									</c:if>
								</td>
								<td>
									<c:if test="${!empty tpb && tpb.stackType=='adult brain' && tpb.completeExpressionPattern}">
										<a href="${tpb.baseUrl}${tpb.remoteId}" title="View original source page" target="_blank">${tpb.sourceName}</a>
									</c:if>
								</td>
							</tr>
						</c:forEach>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	<script>
		$(document).ready( function () {
			var table = $('#resultsTable').DataTable( {
				paging: true,
				searching: true,
				ordering: true,
				responsive: true,
				stateSave: true,
				autoWidth: false,
				"order": [[ 3, "desc" ]]
			} );
			var tt = new $.fn.dataTable.TableTools( table );
			$( tt.fnContainer() ).insertBefore('div.dataTables_wrapper');
			window.setTimeout(function(){
				updateStackCounter();
				$('div.DTTT.btn-group').addClass('table_tools_group').children('a.btn').each(function () {
						$(this).addClass('btn-sm btn-default btn-primary');
						$(this).children('div').each(function () {
							$(this).attr('style', 'position: absolute; left: 0px; top: 0px; width: 48px; height: 32px; z-index: 99;');
						});
				});
				$('#resultsTable').dataTable().fnAdjustColumnSizing(false);
				$('#resultsTable').DataTable().draw();
				$('#resultsTable_length label').after($('#resultsTable_info').text().substring($('#resultsTable_info').text().indexOf(' of')).replace(' entries', ''));
				window.setInterval(function(){
					if ($('.lazy').parent().parent().width() > 500){
						$('#resultsTable').dataTable().fnAdjustColumnSizing(false);
						$('#resultsTable').DataTable().draw(false);
					}
				}, 10000);
				$('body').css('cursor', 'default');
			}, 1000);
		} );
	</script>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
