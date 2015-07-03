<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="cleanTitle">${fileName}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>

<jsp:include page="/jsp/includes/homeHead.jsp">
	<jsp:param name="title" value="${cleanTitle}" />
	<jsp:param name="css" value="
		//cdn.datatables.net/1.10.7/css/jquery.dataTables.min.css;
		//cdn.datatables.net/responsive/1.0.6/css/dataTables.responsive.css;
		//cdn.datatables.net/tabletools/2.2.4/css/dataTables.tableTools.css;
		//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.css;
	" />
	<jsp:param name="js" value="
		//cdn.datatables.net/1.10.7/js/jquery.dataTables.min.js;
		//cdn.datatables.net/responsive/1.0.6/js/dataTables.responsive.min.js;
		//cdn.datatables.net/tabletools/2.2.4/js/dataTables.tableTools.min.js;
		//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.js;
	" />
</jsp:include>

<div class="row-fluid" style="padding:0;">
	<div class="col-xs-12">
		<div class="row">
			<div class="center-block" align="center">
				<h2>Query: ${query}</h2>
			</div>
		</div>
		<div class="col-xs-12" style="padding:0;">
			<div class="container-fluid" style="padding:0;">
				<table id="geneResultsTable" class="display">
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
							<td><a href="${transgeneLinks[0]}${geneBean.driverRef}.html" target="_new">${geneBean.driver}</a></td>
							<td><a href="/site/tools/anatomy_finder/index.htm?id=FBbt:${geneBean.locationRef}&name=${geneBean.location}">${geneBean.location}</a>
							<c:if test="${geneBean.flag}">
								<a href="" class="warn" title="${queryDesc} expression in this cell may be localised to regions of the cell that do not overlap the queried structure">(*)</a>
							</c:if>
							</td>
							<td><a href="${transgeneLinks[0]}${geneBean.reference}.html" target="_new">${geneBean.referenceRef}</a></td>
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
									<a href="${tpb.baseUrl}${tpb.remoteId}" title="View original source page" target="_new">${tpb.sourceName}</a>
								</c:if>
							</td>
						</tr>
					</c:forEach>
					</tbody>
				</table>

			</div>
		</div>
	</div>
	<script>
		$(document).ready( function () {
			var table = $('#geneResultsTable').DataTable( {
				paging: true,
				searching: true,
				ordering: true,
				responsive: true,
				stateSave: true,
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
				$('.btn-group-justified').css("width","350px");
				$('.carousel').css("width","350px");
				$('#geneResultsTable').dataTable().fnAdjustColumnSizing(false);
				$('#geneResultsTable').DataTable().draw();
				if ($('#geneResultsTable_length').html().indexOf('> entries')>-1){
					$('#geneResultsTable_length').html($('#geneResultsTable_length').html().replace('> entries', '>' + $('#geneResultsTable_info').text().substring($('#geneResultsTable_info').text().indexOf(' of'))));
				}
				$(".dataTables_paginate li").css("margin", 0);
				$(".dataTables_paginate li").css("padding", 0);
				window.setInterval(function(){
					$('.btn-group-justified').css("width","350px");
					$('.carousel').css("width","350px");
					$('#geneResultsTable').dataTable().fnAdjustColumnSizing(false);
					$('#geneResultsTable').DataTable().draw(false);
					if ($('#geneResultsTable_length').html().indexOf('> entries')>-1){
						$('#geneResultsTable_length').html($('#geneResultsTable_length').html().replace('> entries', '>' + $('#geneResultsTable_info').text().substring($('#geneResultsTable_info').text().indexOf(' of'))));
					}
					$(".dataTables_paginate li").css("margin", 0);
					$(".dataTables_paginate li").css("padding", 0);
					$('.btn-primary').css('height','32px');
					$('.btn-primary').css('width','48px');
				}, 10000);
			}, 1000);
		} );
	</script>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
