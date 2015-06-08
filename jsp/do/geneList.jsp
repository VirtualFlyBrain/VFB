<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="cleanTitle">${fileName}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>

<jsp:include page="/jsp/includes/1ColHead.jsp">
	<jsp:param name="title" value="${cleanTitle}" />
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|Query Results@ " />
	<jsp:param name="css" value="/css/vfb/utils/help.css;/css/vfb/utils/resultList.css;" />
</jsp:include>


<div class="row">
	<div class="col-xs-12">
		<div class="row">
			<div class="center-block" align="center">
				<h2>Query: ${query}</h2>
			</div>
			<div class="container-fluid">
				<table id="geneResultsTable" class="display" width="100%">
					<thead>
						<tr>
						<c:forEach items="${transgeneColumns}" var="curr">
							<th>${curr}</th>
						</c:forEach>
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
									<b>Source: </b><a href="${tpb.baseUrl}${tpb.remoteId}" title="View original source page" target="_new">${tpb.sourceName}</a> <br/>
									<c:if test="${!empty geneBean.thirdPartyBean.thumbName}">
										<a style="float: left; margin: 0 3px;" href="/site/stacks/index.htm?add=${tpb.vfbId}" title="View registered stack in 3D Viewer"  target="_blank">
										<img class="lazy" data-original="${geneBean.thirdPartyBean.thumbUrl}" height="50" alt="${geneBean.driver} ${query}, ${tpb.sourceName}, ${geneBean.referenceRef}"/></a>
										<br/>
									</c:if>
									<c:if test="${!empty geneBean.thirdPartyBean.stackName}">
										<span load="$(this).html(createAddButtonHTML(${tpb.vfbId}))"></span>
									</c:if>
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
				"order": [[ 3, "asc" ]]
			} );
			var tt = new $.fn.dataTable.TableTools( table );
			$( tt.fnContainer() ).insertBefore('div.dataTables_wrapper');
			window.setTimeout(function(){
				$('div.DTTT.btn-group').addClass('table_tools_group').children('a.btn').each(function () {
						$(this).addClass('btn-sm btn-default btn-primary');
						$(this).children('div').each(function () {
							$(this).attr('style', 'position: absolute; left: 0px; top: 0px; width: 48px; height: 32px; z-index: 99;');
						});
				});
			}, 100);
		} );
	</script>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
