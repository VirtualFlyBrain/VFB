<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<div class="content-fluid" id="imagesCaro" style="width:350px; max-width:350px;">
<c:if test="${!empty ontBeanList}">
<span class="sr-only"><fmt:formatNumber minIntegerDigits="5" value="${fn:length(ontBeanList)}" /> Images Found.<br /></span>
<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>
<div id="exampleImages${fn:replace(region, ":", "_")}" class="carousel" data-ride="carousel" data-interval="20000" style="width:350px;">
<c:if test="${fn:length(ontBeanList) > 1}">
<ol class="carousel-indicators" style="height: 25px;">
<li data-target="#exampleImages${fn:replace(region, ":", "_")}" data-slide-to="0" class="active"></li>
<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status" begin="0" end="10">
<c:if test="${status.index < showMax && status.index > 0}">
<li data-target="#exampleImages${fn:replace(region, ":", "_")}" data-slide-to="${status.index}"></li>
</c:if>
</c:forEach>
</ol>
</c:if>
<div class="carousel-inner">
<c:forEach items="${ontBeanList}" var="ontBean" varStatus="status" begin="0" end="10">
<c:set var="tpb" value="${ontBean.thirdPartyBean}" />
<c:if test="${status.index < showMax}">
<div class="${status.index eq 0 ? 'item active':'item'}">
<img class="lazy" title="open ${ontBean.name} in viewer" data-original="${tpb.thumbUrl}" alt="${ontBean.name} (${tpb.vfbId})" style="width:350px;cursor: pointer;" onclick="openFullDetails('${tpb.vfbId}');addToStackData('${tpb.vfbId}');">
<div class="carousel-caption" style="bottom:-33px;opacity:0.3;" title="open ${ontBean.name} in viewer" onclick="openFullDetails('${tpb.vfbId}');addToStackData('${tpb.vfbId}');">
  <b>${ontBean.name}</b><br>
  <span class="small">${tpb.vfbId}</span>
</div>
</div>
</c:if>
</c:forEach>
</div>
<c:if test="${fn:length(ontBeanList) > 0}"><c:set var="allIds" value="VFBt_00100000" /><c:forEach items="${ontBeanList}" var="ontBean" varStatus="status"><c:set var="allIds" value="${allIds},${ontBean.fbbtIdAsOWL}" /></c:forEach></c:if>
<c:if test="${fn:length(ontBeanList) > 1}"><a class="left carousel-control" href="#exampleImages${fn:replace(region, ":", "_")}" role="button" data-slide="prev">
<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
</a>
<a class="right carousel-control" href="#exampleImages${fn:replace(region, ":", "_")}" role="button" data-slide="next">
<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
</a>
</c:if>
</div>
<c:if test="${fn:length(ontBeanList) < showMax}">
<div class="btn-group btn-group-justified" role="group" aria-label="open example images" style="width:350px"><div class="btn-group" role="group"><button type="button" onClick="addToStackData('${allIds}');updateStackData();" class="btn btn-xs btn-success" title="Add all in stack viewer"><span style="border:none;" class="glyphicon glyphicon-paperclip"></span> <span class="badge">${fn:length(ontBeanList)}</span></button></div><div class="btn-group" role="group"><button type="button" id="queryLink" class="btn btn-xs btn-success" onClick="window.location.href='/do/individual_list.html?action=exemplar_neuron&id=${region}'" title="Open a list of all results">List all <span class="badge">${fn:length(ontBeanList)}</span></button></div></div>
</c:if>
<c:if test="${fn:length(ontBeanList) > (showMax - 1)}">
<div class="btn-group btn-group-justified" role="group" aria-label="open example images" style="width:350px"><div class="btn-group" role="group"><button type="button" onClick="openFullDetails('${allIds}');addToStackData('${allIds}');" class="btn btn-xs btn-success" title="Open all in stack viewer">Open <span class="badge">${fn:length(ontBeanList)}</span></button></div><div class="btn-group" role="group"><button type="button" id="queryLink" class="btn btn-xs btn-success" onClick="window.location.href='/do/individual_list.html?action=exemplar_neuron&id=${region}'" title="Open a list of all results">List all <span class="badge">${fn:length(ontBeanList)}</span></button></div></div>
</c:if>
</c:if>
<c:if test="${empty ontBeanList}">
<script>$("div[style]").removeAttr("style");</script>
<a id="queryLink" class="btn btn-info btn-sm" href="/do/individual_list.html?action=exemplar_neuron&id=${region}">Found <span class="badge">0</span></a>
</c:if>
</div>
