<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/classes/vfbUtils.tld" prefix="vfbUtil"%>

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
	</div>
	<div class="col-xs-12" style="padding:0;">
		<div class="container-fluid" style="padding:0;">
			<table id="resultsTable" class="display">
	    	<thead>
	        <tr>
							<th>ID</th>
	            <th>Name</th>
	            <th>Definition</th>
							<th>Query VFB</th>
							<th>Available Images</th>
							<th>Query FlyBase</th>
	        </tr>
	    	</thead>
		    <tbody>
					<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status"><tr><td><a href="http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}" class="text-muted">${ontBean.fbbtIdAsOWL}</a></td><td><a href="http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}" class="text-success">${ontBean.name}</a></td><td class="text-muted">${ontBean.def}</td><td><a class="btn btn-success btn-sm" href="http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}">More info</a><span class="sr-only"> - http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}</span></td><td id="exemplar${status.index}" style="padding:0px;"><span class="sr-only">http://www.virtualflybrain.org/do/individual_list.html?action=exemplar_neuron&id=${ontBean.fbbtIdAsOWL}</span></td><script>$('#exemplar${status.index}').load('/do/individual_film_strip.html?action=exemplar_neuron&id=${ontBean.fbbtId}&showMin=6&showMax=6',function(response,status,xhr){if(status=='error'){$('#exemplar${status.index}').load('/do/individual_film_strip.html?action=exemplar_neuron&id=${ontBean.fbbtId}&showMin=6&showMax=6');};});</script><td><a class="btn btn-info btn-sm" href="http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}">FlyBase Report</a><span class="sr-only"> - http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}</span></td></tr></c:forEach>
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
					"order": [[ 4, "asc" ]]
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
					$('#resultsTable').dataTable().fnAdjustColumnSizing(false);
					$('#resultsTable').DataTable().draw(false);
					$(".dataTables_paginate li").css("margin", 0);
					$(".dataTables_paginate li").css("padding", 0);
					window.setInterval(function(){
						$('.btn-group-justified').css("width","350px");
						$('.carousel').css("width","350px");
						$('#resultsTable').dataTable().fnAdjustColumnSizing(false);
						$('#resultsTable').DataTable().draw(false);
						$(".dataTables_paginate li").css("margin", 0);
						$(".dataTables_paginate li").css("padding", 0);
					}, 10000);
				}, 1000);
			} );
		</script>
	</div>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
