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
								<th>Query VFB</th>
								<th>Available Images</th>
								<th>Query FlyBase</th>
		        </tr>
		    	</thead>
			    <tbody><c:set var="count" value="-1" scope="page"/>
						<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status"><c:set var="count" value="${count + 1}" scope="page"/><tr><td><a href="http://www.virtualflybrain.org/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}" class="text-muted">${ontBean.fbbtIdAsOWL}</a></td><td><a href="http://www.virtualflybrain.org/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}" class="text-success">${ontBean.name}</a></td><td class="text-muted">${ontBean.def}</td><td><a class="btn btn-success btn-sm" href="http://www.virtualflybrain.org/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}">More info</a><span class="sr-only"> - http://www.virtualflybrain.org/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}</span></td>
						<td id="exemplar${status.index}" data-id="${ontBean.fbbtId}" data-index="${status.index}" style="padding:0px;width:350px;">
							<div class="content-fluid" id="imagesCaro" style="width:350px; max-width:350px;">
							<span class="sr-only">00000 Images Found So Far...<br /></span>
							<span id="resoveImages" data-id="${ontBean.fbbtId}" data-index="${status.index}"><a class="btn btn-sm btn-info" href="http://www.virtualflybrain.org/do/individual_list.html?action=exemplar_neuron&id=${ontBean.fbbtIdAsOWL}">Find images</a></span></div></td><td><a class="btn btn-info btn-sm" href="http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}">FlyBase Report</a><span class="sr-only"> - http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}</span></td></tr></c:forEach>
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
					"order": [[ 4, "desc" ]],
					dom: "<'row'<'col-sm-6'i><'col-sm-6'f>>R<'row'<'col-sm-12'tr>><'row'<'col-sm-4'l><'col-sm-4'B><'col-sm-4'p>>",
					buttons: [
							'copy',
							'csv',
							'print'
					]
				} );
				window.setTimeout(function(){
					updateStackCounter();
					$('[id=resoveImages]').each(function(){
						var i = parseInt($(this).data('index'));
						$.get( "/do/individual_film_strip.html?action=exemplar_neuron&id=" + $(this).data('id'), function( data ) {
							$('#resultsTable').dataTable().fnUpdate(data,i,4,false);
							$('#resultsTable').DataTable().draw(false);
						});
						$(this).attr('id','loadingImages');
					});
					$('#resultsTable').dataTable().fnAdjustColumnSizing(false);
					$('#resultsTable').DataTable().draw();
					$('#resultsTable_length label').after($('#resultsTable_info').text().substring($('#resultsTable_info').text().indexOf(' of')).replace(' entries', ''));
					window.setInterval(function(){
						$('[id=resoveImages]').each(function(){
							var i = parseInt($(this).data('index'));
							$.get( "/do/individual_film_strip.html?action=exemplar_neuron&id=" + $(this).data('id'), function( data ) {
								$('#resultsTable').dataTable().fnUpdate(data,i,4,false);
								$('#resultsTable').DataTable().draw(false);
							});
							$(this).attr('id','loadingImages');
						});
						if ($('.lazy').parent().parent().width() > 360){
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
