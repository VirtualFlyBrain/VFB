<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib uri="/WEB-INF/classes/vfbUtils.tld" prefix="vfbUtil"%>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="cleanTitle">${fileName}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>

<jsp:include page="/jsp/includes/1ColHead.jsp">
	<jsp:param name="title" value="${cleanTitle}" />
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|Query Results@ " />
	<jsp:param name="css" value="/css/vfb/utils/help.css;/css/vfb/utils/resultList.css;" />
</jsp:include>


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
						<option value="100" ${(perPage==100)?"selected":""} >100</option>
					</select>
					<a id="csv" style="float: right; margin-right: 10px" href="/do/csv_report.html?type=${type}&filename=${fileName}">Save
						as CSV</a>
				</form>
			</span>

			<table>
				<thead>
					<th>Name</th>
					<th style="min-width:120px;" align="center">Preview</th>
					<th style="min-width:220px;" align="center">Type</th>
					<th style="min-width:120px;" align="center">Driver</th>
				</thead>
				<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
					<tr>
						<td>
							<h3 style='margin: -2px 0 2px 0; font-size: 1.1.em;'>${ontBean.name}</h3> <vfbUtil:trimToWhite
								string="${ontBean.def}" size="400" /> 
								<c:set var="tpb" value="${ontBean.thirdPartyBean}" />
								<c:set var="types" value="${ontBean.types}" />
								<br/>
								<c:if test="${!empty tpb}">
								<a href="/site/tools/view_stack/3rdPartyStack.htm?json=${tpb.stackUrl}&type=THIRD_PARTY_STACK&tpbid=${tpb.vfbId}"
									title="See in viewer">See in viewer >></a> 
								</c:if>
								<br/>
								<b>Source:</b> <a href="${tpb.baseUrl}${tpb.remoteId}" title="View original ${tpb.sourceName} entry" target="_new">${tpb.sourceName}</a>
								<br/>
						</td>
						<c:if test="${!empty tpb}">
							<td style="padding: 2px 0; text-align: center;"><a href="/site/tools/view_stack/3rdPartyStack.htm?json=${tpb.stackUrl}&type=THIRD_PARTY_STACK&tpbid=${tpb.vfbId}"
								title="See in viewer"><img class="thumb" src="${tpb.thumbUrl}"/></a> 
							</td>
						</c:if>
						<c:if test="${!empty types}">
							<td style="padding: 2px;">
								<c:forEach items="${types}" var="item" varStatus="stat">
									<a href="/site/tools/anatomy_finder/index.htm?id=${item.key}" title="View ${item.value} entry">${item.value}</a><c:if test="${!stat.last}">,</c:if>
									<br/>
								</c:forEach>
							</td>
							<td style="padding: 2px;">
								<c:set var="driverDetails" value='${drivers[fn:replace(ontBean.fbbtId, ":", "_")]}'/>
								<a href="http://flybase.org/reports/${driverDetails[0]}.html" target="_new">${driverDetails[1]}</a>
							</td>
						</c:if>
					</tr>
				</c:forEach>
			</table>

		</div>
	</div>
	<!-- help_wrapper -->
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
