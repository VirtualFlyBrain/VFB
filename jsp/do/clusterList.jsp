<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/classes/vfbUtils.tld" prefix="vfbUtil"%>


<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="cleanTitle">${fileName}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>

<jsp:include page="/jsp/includes/homeHead.jsp">
	<jsp:param name="title" value="${cleanTitle}" />
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|Query Results@ " />
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


<div class="row">
	<div class="col-xs-12">
		<div class="row">
			<div class="container-fluid" align="center">
				<h2>Query: ${query}</h2>
			</div>
		</div>
		<div class="container-fluid">
			<table id="resultsTable" class="display" width="100%">
	    	<thead>
	        <tr>
						<th>Cluster</th>
						<th>Exemplar name</th>
						<th>Summary</th>
						<th>Exemplar Preview</th>
						<th>Source</th>
						<th>Members of cluster</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status"><tr>
						<td>
							<a href="http://flybrain.mrc-lmb.cam.ac.uk/vfb/fc/clusterv/3/${ontBean.name}/" title="Interactive 3D rendering of cluster" target="_new">
								<img class="lazy" height="100" data-original="http://flybrain.mrc-lmb.cam.ac.uk/vfb/fc/clusterv/3/${ontBean.name}/thumb_0.333.png" alt="${query}: ${ontBean.name}, ${ontBean.def}" />
							</a>
						</td>
						<td>
							<h3>${ontBean.name}</h3>
						</td>
						<td>
							${ontBean.def}<c:set var="tpb" value="${ontBean.thirdPartyBean}" />
						</td>
						<td>
							<a href="${tpb.baseUrl}${tpb.remoteId}" target="_new">${tpb.sourceName}</a>
						</td>
						<td>
							<c:if test="${!empty tpb}"><a href="${tpb.baseUrl}${tpb.remoteId}" title="View ${tpb.sourceName} entry" target="_new">
								<img class="lazy" data-original="${tpb.thumbUrl}" alt="${query}: ${tpb.sourceName} (${tpb.remoteId}), ${ontBean.name}, ${ontBean.def}" />
							</a></c:if>
						</td>
						<td>
							<c:if test="${!empty tpb}"><a href="/do/individual_list.html?action=neuron_found&id=${tpb.vfbId}&region=${ontBean.name}">
								Show individual members&nbsp;>>
							</a></c:if>
						</td>
					</tr></c:forEach>
				</tbody>
			</table>
		</div>
		<script>
			$(document).ready( function () {
				var table = $('#resultsTable').DataTable( {
					paging: true,
					searching: true,
					ordering: true,
					responsive: true,
					stateSave: true,
					"order": [[ 0, "desc" ]]
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
				}, 1000);
			} );
		</script>
	</div>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
