<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>
<c:if test="${!empty ontBeanList}">
<div class="content-fluid">
	<div id="exampleImages" class="carousel slide" data-ride="carousel" style="width: 300px;">
		<ol class="carousel-indicators">
			<li data-target="#exampleImages" data-slide-to="0" class="active"></li>
			<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
				<c:if test="${status.index < 6 && status.index > 0}">
    			<li data-target="#exampleImages" data-slide-to="${status.index}"></li>
				</c:if>
			</c:forEach>
  	</ol>
		<!-- Wrapper for slides -->
		<div class="carousel-inner">
			<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
				<c:set var="tpb" value="${ontBean.thirdPartyBean}" />
				<c:if test="${status.index < 6}">
					<div class="${status.index eq 0 ? 'item active':'item'}">
						<a href="/owl/${tpb.vfbId}" target="_top">
						<img src="${tpb.thumbUrl}" alt="">
						<div class="carousel-caption">
			        <b>${ontBean.name}</b>
							<span class="small">${tpb.vfbId}</span>
						</div>
					</div>
				</c:if>
			</c:forEach>
		</div>
		<!-- Left and right controls -->
		<a class="left carousel-control" href="#exampleImages" role="button" data-slide="prev">
	    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
  	</a>
	  <a class="right carousel-control" href="#exampleImages" role="button" data-slide="next">
	    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
	  </a>
	</div>
	<a align="right" href="/do/individual_list.html?action=exemplar_neuron&id=${region}">Query all >></a>
</div>
</c:if>
