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
		<div class="row-fluid">
			<div class="col-md-2" align="center"><c:set var="allIds" value="VFBt_00100000" />
				<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status"><c:set var="allIds" value="${allIds},${ontBean.fbbtIdAsOWL}" /></c:forEach>
				<span id="openAllButton"><button onclick="post('/site/stacks/index.htm',{'add':'${allIds}'});" class="btn btn-sm btn-success">Open <span class="badge">${fn:length(ontBeanList)}</span> in viewer</button></span>
			</div>
			<div class="col-md-8" align="center">
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
								<th>ID</th>
		            <th>Name</th>
		            <th>Definition</th>
								<th>Preview</th>
								<th>Source</th>
								<th>Type</th>
								<th>Driver</th>
		        </tr>
		    	</thead>
			    <tbody>
						<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
							<c:set var="tpb" value="${ontBean.thirdPartyBean}" />
							<c:set var="types" value="${ontBean.types}" />
							<tr>
								<td>
									<a href="http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}" class="text-muted">${ontBean.fbbtIdAsOWL}</a></td>
								<td align="center">
										<c:choose>
											<c:when test="${!empty tpb}">
												<a href="/site/tools/anatomy_finder/?id=${tpb.vfbId}" class="text-success">${ontBean.name}</a><br />
												<span style="border:none;padding-left:0px;padding-right:0px;" id="attach" data-id="${tpb.vfbId}"></span>
											</c:when>
											<c:otherwise>
												<a href="/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}" class="text-info">${ontBean.name}</a>
											</c:otherwise>
										</c:choose>
								</td>
								<td class="text-muted">${ontBean.def}</td>
								<td>
									<c:if test="${!empty tpb}">
											<img class="lazy" data-original="${tpb.thumbUrl}" alt="See in viewer" onclick="post('/site/stacks/index.htm',{'add':'${tpb.vfbId}'});" style="cursor: pointer;" />
									</c:if>
								</td>
								<td>
									<c:if test="${!empty tpb}">
										<a href="${tpb.baseUrl}${tpb.remoteId}" title="View original ${tpb.sourceName} entry" target="_blank" class="btn btn-sm btn-warning">${tpb.sourceName}</a>
									</c:if>
								</td>
								<td>
									<c:if test="${!empty types}">
										<c:forEach items="${types}" var="item" varStatus="stat">
											<a href="/site/tools/anatomy_finder/index.htm?id=${item.key}" title="View ${item.value} entry" target="_top" class="btn btn-sm btn-success">${item.value}</a><c:if test="${!stat.last}">,</c:if>
											<br/>
										</c:forEach>
									</c:if>
								</td>
								<td>
										<c:set var="driverDetails" value='${drivers[ontBean.fbbtIdAsOWL]}'/>
										<a href="http://flybase.org/reports/${driverDetails[0]}.html" target="_blank" class="btn btn-sm btn-info">${driverDetails[1]}</a>
								</td>
							</tr>
						</c:forEach>
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
					$('#resultsTable').dataTable().fnAdjustColumnSizing(false);
					$('#resultsTable').DataTable().draw();
  				$('#resultsTable_length label').after($('#resultsTable_info').text().substring($('#resultsTable_info').text().indexOf(' of')).replace(' entries', ''));
					window.setInterval(function(){
						if ($('.lazy').parent().width() > 300) {
							$('#resultsTable').dataTable().fnAdjustColumnSizing(false);
							$('#resultsTable').DataTable().draw(false);
						}
					}, 10000);
					$('body').css('cursor', 'default');
				}, 1000);
			} );
		</script>
	</div>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
