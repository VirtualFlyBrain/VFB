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
	<jsp:param name="css" value="/css/vfb/utils/help.css;//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.css;" />
	<jsp:param name="js" value="//cdn.datatables.net/plug-ins/1.10.7/integration/bootstrap/3/dataTables.bootstrap.js;" />
</jsp:include>

<script type="text/javascript">
	function formSubmit() {
		alert(document.getElementById("perPage").options[document.getElementById("perPage").selectedIndex].value);
		var value = document.getElementById("perPage").options[document.getElementById("perPage").selectedIndex].value;
		window.open("?<%=request.getQueryString()%>&perPage=" + value, "_self");
	}
</script>


<%-- <div id="example_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"> --%>
<div class="row">
	<div class="col-md-12">
		<div class="row">
			<div class="col-xs-6">
				<h1 id="help_header">Query: ${query}</h1>
			</div>
			<div class="col-xs-6">
				<a id="csv" style="float: right; margin-right: 10px"
					href="/do/csv_report.html?type=${type}&filename=${fileName}">
					<span class="glyphicon glyphicon-save-file"></span>Save as CSV
				</a>
			</div>
		</div>
		<div class="content">
			<table id="results" class="display" style="width:100%;">
	    	<thead>
	        <tr>
							<th>ID</th>
	            <th>Name</th>
	            <th>Definition</th>
							<th>Query VFB</th>
							<th>Query FlyBase</th>
	        </tr>
	    	</thead>
		    <tbody>
					<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
		        <tr>
		            <td>${ontBean.fbbtId}</td>
		            <td>${ontBean.name}</td>
								<td>${ontBean.def}</td>
								<td><a class="label label-success" href="/site/tools/anatomy_finder/?id=${ontBean.fbbtId}">More info</a></td>
								<td><a class="label label-info" href="http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}" target="_new">FlyBase Report</a></td>
		        </tr>
					</c:forEach>
		    </tbody>
			</table>
		</div>
		<script>
		$(document).ready( function () {
			$('#results').DataTable({
				paging: true,
				searching: true,
				ordering:  true,
				responsive: true
			});
		} );
		</script>
	</div>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
