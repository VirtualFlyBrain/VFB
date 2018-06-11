<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>

<%@page import="org.springframework.web.context.*,org.springframework.web.context.support.*,uk.ac.ed.vfb.service.*, uk.ac.ed.vfb.model.*, uk.ac.ed.vfb.tools.autocomplete.*"%>
<%
//test the spring framework
ServletContext servletContext = this.getServletContext();
System.out.println("SC: " + servletContext);
WebApplicationContext wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);

OntBeanManager obm = (OntBeanManager)wac.getBean("ontBeanManager");
System.out.println("OBM: " + obm);
System.out.println("ID: " +request.getParameter("id") );
OntBeanIndividual ib = (OntBeanIndividual)obm.getBeanForId(request.getParameter("id"));
pageContext.setAttribute("ontBean", ib );

AutocompleteDAO acdao = (AutocompleteDAO)wac.getBean("autocompleteDAONeuropil");
pageContext.setAttribute("aclNeuropil", acdao.getSynSet());
%>



<c:choose>
	<c:when test="${headAtt == true}">

			<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">

		<head>
		<title>${query}</title>



		<link rel="stylesheet" type="text/css" media="all" href="/css/vfb/layout/layout.css" />
		<link rel="stylesheet" type="text/css" media="all" href="/css/vfb/utils/help.css" />
		<link rel="stylesheet" type="text/css" media="all" href="/css/vfb/utils/resultList.css" />
		<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/p7menu_secondary.css" />
		</head>

		<body>
	</c:when>
	<c:otherwise>
		<jsp:include page="/jsp/includes/1ColHead.jsp">
			<jsp:param name="title" value="${ontBean.name}" />
			<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|${ontBean.fbbtId}@ " />
			<jsp:param name="css" value="/css/vfb/utils/p7menu_secondary.css;/css/vfb/utils/resultList.css;/css/vfb/utils/help.css;/css/vfb/layout/layout.css;" />
		</jsp:include>
		<c:set var="needFoot" value="true" />
	</c:otherwise>
</c:choose>



<script type="text/javascript">
	function formSubmit() {
		alert(document.getElementById("perPage").options[document.getElementById("perPage").selectedIndex].value);
		var value = document.getElementById("perPage").options[document.getElementById("perPage").selectedIndex].value;
		window.open("?<%=request.getQueryString()%>&perPage=" + value, "_self");
	}
</script>

<jsp:include page="/jsp/includes/js/tag.jsp" />
		<!-- Google Analytics -->
			<script>
				dataLayer.push({'event':'sendVirtualPageview','vpv':'/jsp/do/individualBean.jsp?id=${ontBean.fbbtId}'});
			</script>
		<!-- End Google Analytics -->

<h2 style="font-size: 1.5em; margin-top:-3px"><a href="#" target="_top" title="View details">${ontBean.name}</a></h2>
<c:if test="${!empty ontBean.fbbtId}">
<p>
	<b>ID: </b><a href="http://www.virtualflybrain.org/owl/${ontBean.fbbtId}" target="_new" title="Indiviual web link" >${ontBean.fbbtId}</a>
</p>
</c:if>
<p>
	<b>Definition: </b>${ontBean.def}
</p>
<c:if test="${!empty ontBean.comment}">
	<p>
		<b>Comment: </b>${ontBean.comment}
	</p>
</c:if>
<c:if test="${fn:length(ontBean.synonyms)>0}">
	<p>
		<b>Synonyms: </b><br />
		<c:forEach items="${ontBean.synonyms}" var="curr" varStatus="status">
			&nbsp;&nbsp;&nbsp; * ${fn:replace(curr, '()', '')}<br />
		</c:forEach>
	</p>
</c:if>
<c:if test="${fn:length(refs)>0}">
	<p>
		<b>References: </b><br />
		<c:forEach items="${refs}" var="curr" varStatus="status">
			&nbsp;&nbsp;&nbsp; * <a href="${curr.webLink}" title="${curr.miniref}" target="_new"><script>document.write(decodeURIComponent('${curr.miniref}'));</script></a>
			<br />
		</c:forEach>
	</p>
</c:if>
<p>
	<b>Parent classes: </b><br />
	<c:set var="types" value="${ontBean.types}" />
	<c:forEach items="${types}" var="curr" varStatus="status">
		<c:set var="currParts" value="${fn:split(curr, '=')}" />
		<c:set var="url" value="${fn:split(currParts[0], ' ')[1]}" />
		<c:choose>
			<c:when test="${fn:containsIgnoreCase(currParts[0], 'http')}">
				&nbsp;&nbsp;&nbsp; *
				<a href="${fn:trim(currParts[0])}" title="External look up" target="_new">${currParts[1]}</a>
			</c:when>
			<c:otherwise>
				&nbsp;&nbsp;&nbsp; *
				<a href="/site/tools/anatomy_finder/index.htm?id=${fn:trim(currParts[0])}&name=${currParts[1]}" title="Look up" target="_top">${currParts[1]}</a>
			</c:otherwise>
		</c:choose>
	</c:forEach>
</p>
<c:if test="${fn:length(ontBean.relationships)>0}">
	<p>
		<b>Relationships: </b><br />
		<c:forEach items="${ontBean.relationships}" var="curr" varStatus="status">
			<c:choose>
				<c:when test="${fn:containsIgnoreCase(curr.value[2], 'http')}">
					&nbsp;&nbsp;&nbsp; * ${curr.value[0]}
					<a href="${curr.value[2]}" title="External look up" target="_new">${curr.value[1]}</a>
				</c:when>
				<c:otherwise>
					&nbsp;&nbsp;&nbsp; * ${curr.value[0]}
					<a href="/site/tools/anatomy_finder/index.htm?id=${curr.value[2]}&name=${curr.value[1]}" title="Look up" target="_top">${curr.value[1]}</a>

				</c:otherwise>
			</c:choose>
			<c:forEach items="${aclNeuropil}" var="neuropil" varStatus="i">
				<c:if test="${curr.value[2] == neuropil.fbbtId}">
					&nbsp;&nbsp;<a href="/site/stacks/index.htm?add=${curr.value[2]} " target="_top"
						title="Add to the selected domains in the viewer">See in the viewer >> </a>
				</c:if>
			</c:forEach>
			<br />
		</c:forEach>
	</p>
</c:if>
<c:set var="tpb" value="${ontBean.thirdPartyBean}"/>
<c:if test="${!empty tpb}">
	<b>Source:</b>
	<a href="${tpb.baseUrl}${tpb.remoteId}" target="_new" title="See source" ${tpb.sourceName}</a>
	<br clear="all"/>
	<a href="/owl/${tpb.vfbId}" target="_top" title="See in viewer" >
		<img class="thumb" src="${tpb.thumbUrl}" alt="${tpb.vfbId} - ${tpb.sourceName} (${tpb.remoteId})" />
	</a>
	<br/>
	<a href="/owl/${tpb.vfbId}">See in the viewer >> </a>
	<br/>

</c:if>
<c:choose>
	<c:when test="${needFoot == true}">
		<jsp:include page="/jsp/includes/homeFoot.jsp"/>
	</c:when>
	<c:otherwise>
		</body>
		</html>

	</c:otherwise>
</c:choose>