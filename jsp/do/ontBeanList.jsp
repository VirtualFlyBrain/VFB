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
		/css/vfb/utils/help.css;
		//cdn.datatables.net/1.10.7/css/jquery.dataTables.min.css;
		//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.css;
		//cdn.datatables.net/responsive/1.0.6/css/dataTables.responsive.css;
		//cdn.datatables.net/tabletools/2.2.4/css/dataTables.tableTools.css;
		//cdn.datatables.net/fixedheader/2.1.2/css/dataTables.fixedHeader.css;
	" />
	<jsp:param name="js" value="
		//cdn.datatables.net/1.10.7/js/jquery.dataTables.min.js;
		//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.js;
		//cdn.datatables.net/responsive/1.0.6/js/dataTables.responsive.min.js;
		//cdn.datatables.net/tabletools/2.2.4/js/dataTables.tableTools.min.js;
		//cdn.datatables.net/fixedheader/2.1.2/js/dataTables.fixedHeader.min.js;
		https://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js;
	" />
</jsp:include>

<div class="row">
	<div class="col-md-12">
		<div class="row">
			<div class="container" align="center">
				<h2>Query: ${query}</h2>
			</div>
		</div>
		<div class="container">
			<table id="resultsTable" class="display" width="100%">
	    	<thead>
	        <tr>
							<th>ID</th>
	            <th>Name</th>
	            <th>Definition</th>
							<th>Query VFB</th>
							<th>Exemplar Images</th>
							<th>Query FlyBase</th>
	        </tr>
	    	</thead>
		    <tbody>
					<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
		        <tr>
		            <td><a href="http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}">${ontBean.fbbtIdAsOWL}</a></td>
		            <td><a href="http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}">${ontBean.name}</a></td>
								<td>${ontBean.def}</td>
								<td id="more${status.index}">
									http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}
								</td>
								<td id="exemplar${status.index}">
									http://www.virtualflybrain.org/do/individual_list.html?action=exemplar_neuron&id=${ontBean.fbbtIdAsOWL}
								</td>
								<td id="flybase${status.index}">
									http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}
								</td>
		        </tr>
					</c:forEach>
		    </tbody>
			</table>
		</div>
		<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
			<script>
				$('#exemplar${status.index}').load('/do/individual_film_strip.html?action=exemplar_neuron&id=${ontBean.fbbtId}&showMin=6&showMax=6');
				$('#more${status.index}').html('<a class="btn btn-success btn-sm" href="http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}" alt="http://www.virtualflybrain.org/site/tools/anatomy_finder/?id=${ontBean.fbbtIdAsOWL}" >More info</a>');
				$('#flybase${status.index}').html('<a class="btn btn-info btn-sm" href="http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}" alt="http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}" >FlyBase Report</a>');
			</script>
		</c:forEach>
		<script>
			$(document).ready( function () {
				var table = $('#resultsTable').DataTable( {
					paging: true,
					searching: true,
					ordering:  true,
					responsive: true,
				} );
				var tt = new $.fn.dataTable.TableTools( table );
				$( tt.fnContainer() ).insertBefore('div.dataTables_wrapper');
	    	new $.fn.dataTable.FixedHeader( table );
			} );
			$(function() {
    		$("img.lazy").lazyload({
					skip_invisible : true
				});
			});
		</script>
	</div>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
