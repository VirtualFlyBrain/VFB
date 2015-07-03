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


<div class="row-fluid" style="padding:0;">
	<div class="col-xs-12">
		<div class="row">
			<div class="container-fluid" align="center">
				<h2>Query: ${query}</h2>
			</div>
		</div>
	</div>
	<div class="col-xs-12" style="padding:0;">
		<div class="container-fluid" style="padding:0;">
			<table id="resultsTable" class="display">
	    	<thead>
	        <tr>
						<th>Cluster</th>
						<th>Exemplar name</th>
						<th>Summary</th>
						<th>Source</th>
						<th>Exemplar Preview</th>
						<th>Members of cluster</th>
				</tr>
			</thead>
			<tbody>
				<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status"><tr>
						<td>
							<a href="http://flybrain.mrc-lmb.cam.ac.uk/vfb/fc/clusterv/3/${ontBean.name}/" title="Interactive 3D rendering of cluster" target="_new">
								<img class="lazy" data-original="http://flybrain.mrc-lmb.cam.ac.uk/vfb/fc/clusterv/3/${ontBean.name}/thumb_0.333.png" alt="${query}: ${ontBean.name}, ${ontBean.def}" />
							</a>
						</td>
						<td>
							<h5>${ontBean.name}</h5>
						</td>
						<td>
							${ontBean.def}<c:set var="tpb" value="${ontBean.thirdPartyBean}" />
						</td>
						<td>
							<a href="${tpb.baseUrl}${tpb.remoteId}" target="_new" class="btn btn-sm btn-warning">${tpb.sourceName}</a>
						</td>
						<td>
							<c:if test="${!empty tpb}"><img class="lazy" data-original="${tpb.thumbUrl}" alt="${query}: ${tpb.sourceName} (${tpb.remoteId}), ${ontBean.name}, ${ontBean.def}" onclick="post('/site/stacks/index.htm',{'add':'${tpb.vfbId}'});" style="cursor: pointer;" /></c:if>
						</td>
						<td>
							<c:if test="${!empty tpb}">
								<span id="OpenAllButtonFor${tpb.vfbId}" data-id="${tpb.vfbId}"></span><br/>
								<a class="btn btn-sm btn-success" href="/do/individual_list.html?action=neuron_found&id=${tpb.vfbId}&region=${ontBean.name}">
								List individual members
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
					updateStackCounter();
					$('div.DTTT.btn-group').addClass('table_tools_group').children('a.btn').each(function () {
							$(this).addClass('btn-sm btn-default btn-primary');
							$(this).children('div').each(function () {
								$(this).attr('style', 'position: absolute; left: 0px; top: 0px; width: 48px; height: 32px; z-index: 99;');
							});
					});
					$('#resultsTable').dataTable().fnAdjustColumnSizing();
					$(".dataTables_paginate li").css("margin", 0);
					$(".dataTables_paginate li").css("padding", 0);
				}, 1000);
				window.setInterval(function(){
					$('[id^=OpenAllButtonFor]').each(function() {
						if ($(this).html() == "") {
							$(this).load('/do/individual_list.html?action=neuron_found&id=' + cleanIdforExt($(this).data("id")) + ' #openAllButton');
						}else{
							$(this).id = "Resolved" + $(this).id;
						}
					});
				}, 5000);
			} );
		</script>
	</div>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
