<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/classes/vfbUtils.tld" prefix="vfbUtil"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">

<head>
<title>${query}</title>
<link rel="stylesheet" type="text/css" media="all" href="/css/vfb/utils/help.css" />
<link rel="stylesheet" type="text/css" media="all" href="/css/vfb/utils/resultList.css" />
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

			<ul>
				<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
					<li>
						<h3 style='margin: -2px 0 2px 0; font-size: 1.1.em;'>${ontBean.name}</h3> <vfbUtil:trimToWhite
							string="${ontBean.def}" size="210" /><br /> 
							<a href="/site/tools/anatomy_finder/index.htm?id=${ontBean.fbbtId}">More info >> </a>
							&nbsp; or &nbsp; 
							<a href="http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}">Check in FlyBase >> </a>
					</li>
				</c:forEach>
			</ul>

		</div>
	</div>
	<!-- help_wrapper -->
</body>
</html>