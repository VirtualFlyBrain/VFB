<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>
<c:if test="${!empty ontBeanList}">
	<div id="exampleImages" class="carousel slide" data-ride="carousel" style="width: 400px; margin: 0 auto">
		<!-- Wrapper for slides -->
		<div class="carousel-inner">
			<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
				<c:set var="tpb" value="${ontBean.thirdPartyBean}" />
				<c:if test="${status.index < 6}">
					<div class="item">
						<a href="/owl/${tpb.vfbId}" target="_top">
						<img src="${tpb.thumbUrl}" alt="${tpb.vfbId} - ${tpb.sourceName} (${tpb.remoteId})">
						<div class="carousel-caption">
			        <h3>${ontBean.name}</h3>
			        <p>${tpb.descr}</p>
							<p>Source:
								<a href="${tpb.baseUrl}${tpb.remoteId}" target="_new" title="See source" >${tpb.sourceName}</a>
							</p>
						</div>
					</div>
				</c:if>
			</c:forEach>
		</div>
		<!-- Left and right controls -->
		<a class="left carousel-control" href="#exampleImages" data-slide="prev">‹</a>
  	<a class="right carousel-control" href="#exampleImages" data-slide="next">›</a>
	</div>
		<a href="/do/individual_list.html?action=exemplar_neuron&id=${region}">Show	all >></a>
	</div>
</c:if>
