<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>
<c:if test="${!empty ontBeanList}">
	<h3 style='margin: -2px 0 2px 0; font-size: 1.1.em;'>Example images</h3>
	<br />
	<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
		<c:set var="tpb" value="${ontBean.thirdPartyBean}" />
		<c:if test="${status.index < 6}">
			<div style="border: 1px solid gray; float: left; margin: 0 3px;">
				<h3 style='margin: -2px 0 2px 0; font-size: 1em;'>${ontBean.name}</h3>
				<vfbUtil:trimToWhite string="${ontBean.def}" size="210" />
				<c:if test="${!empty tpb}">
					<b>Source:</b>
					<a href="${tpb.baseUrl}${tpb.remoteId}" target="_new" title="See source" >${tpb.sourceName}</a>
					<br/>
					<a style="float: left; margin: 0 3px;" href="/owl/${tpb.vfbId}" target="_top">
						See in viewer >>
					</a>
					<br clear="all"/>
					<a href="/owl/${tpb.vfbId}" target="_top" title="See in viewer" >
						<img class="thumb" src="${tpb.thumbUrl}" alt="${tpb.vfbId} - ${tpb.sourceName} (${tpb.remoteId})" />
					</a>
					<br/>
				</c:if>
			</div>
		</c:if>
	</c:forEach>
	<div style="float: left; margin: 0 3px;">
		<a href="/do/individual_list.html?action=exemplar_neuron&id=${region}">Show	all >></a>
	</div>
</c:if>
