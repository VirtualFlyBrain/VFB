<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">

<head>
	<title>${query}</title>
	<link rel="stylesheet" type="text/css" media="all"	href="/css/vfb/utils/help.css" />
	<link rel="stylesheet" type="text/css" media="all"	href="/css/vfb/utils/resultList.css" />
	<jsp:include page="/jsp/includes/js/ga.jsp" />	
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

	<span style="width:100%; ">
		<form name="perPage" action="?${paramString}">
			${nav} &nbsp; Records per page: 
			<c:forEach items="${paramItems}" var="curr">
				<input type="hidden" name="${fn:split(curr, '=')[0]}" value="${fn:split(curr, '=')[1]}"/> 
			</c:forEach>
			<select id="perPage" name="perPage" onchange='this.form.submit()'>
  				<option value="10" ${(perPage==10)?"selected":""} >10</option>
  				<option value="20" ${(perPage==20)?"selected":""} >20</option>
				<option value="50" ${(perPage==50)?"selected":""} >50</option>
				<option value="0" ${(perPage==0)?"selected":""} >All</option>
			</select>
			<a id="csv" style="float:right; margin-right:10px" href="/do/csv_report.html?type=gbm&filename=${fileName}">Save as CSV</a>
		</form>
	</span>

		<table>
		<thead> 
		<tr>
		<c:forEach items="${transgeneColumns}" var="curr">
			<th>${curr}</th>
		</c:forEach>
		</tr>
		</thead>
		<tbody>
		<c:forEach items="${geneList}" var="geneBean" varStatus="status">		
			<tr>
				<td><a href="${transgeneLinks[0]}${geneBean.driverRef}.html" >${geneBean.driver}</a></td>
				<td><a href="/site/tools/anatomy_finder/index.htm?id=FBbt:${geneBean.locationRef}&popup=true">${geneBean.location}</a>
					<c:if test="${geneBean.flag}">
						<a href="" class="warn" title="${queryDesc} expression in this cell may be localised to regions of the cell that do not overlap the queried structure">(*)</a>
					</c:if>
				</td>
				<td><a href="${transgeneLinks[0]}${geneBean.reference}.html" >${geneBean.referenceRef}</a></td>
				<td>
				<c:set var="tpb" value="${geneBean.thirdPartyBean}" />
				<c:if test="${!empty tpb && tpb.completeExpressionPattern}">
					<b>Source: </b><a href="${tpb.baseUrl}${tpb.remoteId}" title="View original source page">${tpb.sourceName} <br/>
					<c:if test="${!empty geneBean.thirdPartyBean.thumbName}">
						<img src="${geneBean.thirdPartyBean.thumbUrl}"height="50"/></a>
						<br clear="all"/>					</c:if>
					<c:if test="${!empty geneBean.thirdPartyBean.stackName}">
						<a style="float: left; margin: 0 3px;" href="/site/tools/view_stack/3rdPartyStack.htm?json=${tpb.stackUrl}&type=THIRD_PARTY_STACK&tpbid=${tpb.vfbId}" title="View registered stack in 3D Viewer"  target="_blank">
							See in viewer >>
						</a><br/>
					</c:if>
				</c:if>
				</td>
			</tr>
		</c:forEach>	 
	</tbody>
	</table>

</div>
</div>
 </body>
</html>