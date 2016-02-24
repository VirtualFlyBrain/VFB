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
			<div class="container-fluid" align="center">
				<h2>Query: ${query}</h2>
			</div>
		</div>
	</div>
	<div class="col-xs-12" style="padding:0;">
		<div class="container-fluid" style="padding:0;">
			<div class="table-responsive">
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
								<a href="http://flybrain.mrc-lmb.cam.ac.uk/vfb/fc/clusterv/3/${ontBean.name}/" title="Interactive 3D rendering of cluster" target="_blank">
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
								<a href="${tpb.baseUrl}${tpb.remoteId}" target="_blank" class="btn btn-sm btn-warning">${tpb.sourceName}</a>
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
		</div>
		<script>
			$(document).ready( function () {
				var table = $('#resultsTable').DataTable( {
					paging: true,
					searching: true,
					ordering: true,
					responsive: true,
					autoWidth: false,
					"order": [[ 0, "desc" ]],
					dom: "<'row'<'col-sm-6'i><'col-sm-6'f>>R<'row'<'col-sm-12'tr>><'row'<'col-sm-4'l><'col-sm-4'B><'col-sm-4'p>>",
					buttons: [
							'copy',
							'csv',
							'print'
					]
				} );
				window.setTimeout(function(){
					updateStackCounter();
					$('#resultsTable').dataTable().fnAdjustColumnSizing(false);
					$('#resultsTable').DataTable().draw();
					$('#resultsTable_length label').after($('#resultsTable_info').text().substring($('#resultsTable_info').text().indexOf(' of')).replace(' entries', ''));
					window.setInterval(function(){
						if ($('.lazy').parent().width() > 360) {
							$('#resultsTable').dataTable().fnAdjustColumnSizing(false);
							$('#resultsTable').DataTable().draw(false);
						}
					}, 10000);
					$('body').css('cursor', 'default');
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
