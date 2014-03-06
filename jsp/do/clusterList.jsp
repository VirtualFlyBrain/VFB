<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/classes/vfbUtils.tld" prefix="vfbUtil"%>

<jsp:include page="/jsp/includes/1ColHead.jsp">
	<jsp:param name="title" value="${query}" />
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|Query Results@ " />
	<jsp:param name="css" value="/css/vfb/utils/help.css;/css/vfb/utils/resultList.css;" />
</jsp:include>

<jsp:include page="/jsp/includes/js/ga.jsp" />	

<script type="text/javascript">
	function formSubmit() {
		alert(document.getElementById("perPage").options[document.getElementById("perPage").selectedIndex].value);
		var value = document.getElementById("perPage").options[document.getElementById("perPage").selectedIndex].value;
		window.open("?<%=request.getQueryString()%>&perPage=" + value, "_self");
	}
</script>
</head>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>

<body>
	<div id="help_wrapper">
		<div id="help_head_wrapper">
			<h1 id="help_header">Query: ${query}</h1>
		</div>

		<div id="help_content">

			<span style="width: 100%;">
				<form name="perPage" action="?${paramString}">
					${nav} &nbsp; Records per page:
					<c:forEach items="${paramItems}" var="curr">
						<input type="hidden" name="${fn:split(curr, '=')[0]}" value="${fn:split(curr, '=')[1]}" />
					</c:forEach>
					<select id="perPage" name="perPage" onchange='this.form.submit()'>
						<option value="10" ${(perPage==10)?"selected":""} >10</option>
						<option value="20" ${(perPage==20)?"selected":""} >20</option>
						<option value="50" ${(perPage==50)?"selected":""} >50</option>
						<option value="0" ${(perPage==0)?"selected":""} >All</option>
					</select>
					<a id="csv" style="float: right; margin-right: 10px" href="/do/csv_report.html?type=${type}&filename=${fileName}">Save
						as CSV</a>
				</form>
			</span>

			<table>
				<thead>
					<th>Cluster</th>
					<th>Exemplar name / Summary</th>
					<th>Exemplar preview</th>
					<th>Members of cluster</th>
				</thead>
				<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
					<tr>
						<td style="padding: 2px 0; text-align: center;">
							<a href="http://flybrain.mrc-lmb.cam.ac.uk/vfb/fc/clusterv/3/${ontBean.name}/" title="Interactive 3D rendering of cluster"> 
								<img height="100" src="http://flybrain.mrc-lmb.cam.ac.uk/vfb/fc/clusterv/3/${ontBean.name}/thumb_0.333.png" />
							</a>
						</td>
						<td>
							<h3 style='margin: -2px 0 2px 0; font-size: 1.1.em;'>${ontBean.name}</h3> <vfbUtil:trimToWhite
								string="${ontBean.def}" size="210" /> 
							<c:set var="tpb" value="${ontBean.thirdPartyBean}" /><br /> 
							<b>Source:</b>
							<a href="${tpb.baseUrl}${tpb.remoteId}">${tpb.sourceName}</a>
						</td>
						<c:if test="${!empty tpb}">
							<td style="padding: 2px 0; text-align: center;"><a href="${tpb.baseUrl}${tpb.remoteId}"
								title="View ${tpb.sourceName} entry"><img class="thumb" src="${tpb.thumbUrl}" /></a> &nbsp;&nbsp; 
							</td>
							<td style="padding: 2px">
								<c:if test="${empty param.popup}">							
								<a href="/do/individual_list.html?action=neuron_found&id=${tpb.vfbId}&region=${ontBean.name}">Show
										individual members&nbsp;>> </a>
								</c:if>
							</td>
						</c:if>
					</tr>
				</c:forEach>
			</table>

		</div>
	</div>
	<!-- help_wrapper -->
</body>
</html>
