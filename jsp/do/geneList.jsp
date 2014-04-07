<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

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
				<option value="100" ${(perPage ge 100)?"selected":""} >100</option>
			</select>
			
			<a id="csv" style="float:right; margin-right:10px" href="/do/csv_report.html?type=gbm&filename=${fileName}">Save as CSV</a>
		</form>
		
		<c:if test="${perPage lt 10 || perPage gt 100}">
			<script> document.getElementById('perPage').onchange(); </script>
		</c:if>
		
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
				<td><a href="${transgeneLinks[0]}${geneBean.driverRef}.html" target="_new">${geneBean.driver}</a></td>
				<td><a href="/site/tools/anatomy_finder/index.htm?id=FBbt:${geneBean.locationRef}&popup=true">${geneBean.location}</a>
					<c:if test="${geneBean.flag}">
						<a href="" class="warn" title="${queryDesc} expression in this cell may be localised to regions of the cell that do not overlap the queried structure">(*)</a>
					</c:if>
				</td>
				<td><a href="${transgeneLinks[0]}${geneBean.reference}.html" target="_new">${geneBean.referenceRef}</a></td>
				<td>
				<c:set var="tpb" value="${geneBean.thirdPartyBean}" />
				<c:if test="${!empty tpb && tpb.stackType=='adult brain' && tpb.completeExpressionPattern}">
					<b>Source: </b><a href="${tpb.baseUrl}${tpb.remoteId}" title="View original source page" target="_new">${tpb.sourceName} <br/>
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
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
