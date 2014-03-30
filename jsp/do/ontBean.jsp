<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@page
	import="org.springframework.web.context.*,org.springframework.web.context.support.*,uk.ac.ed.vfb.tools.autocomplete.*"%>
<%
//test the spring framework
ServletContext servletContext = this.getServletContext();

WebApplicationContext wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);

AutocompleteDAO acdao = (AutocompleteDAO)wac.getBean("autocompleteDAONeuropil");
pageContext.setAttribute("aclNeuropil", acdao.getSynSet());


acdao = (AutocompleteDAO)wac.getBean("autocompleteDAONeuron");
pageContext.setAttribute("aclNeuron", acdao.getSynSet());	

acdao = (AutocompleteDAO)wac.getBean("autocompleteDAOTract");
pageContext.setAttribute("aclTract", acdao.getSynSet());	

acdao = (AutocompleteDAO)wac.getBean("autocompleteDAOClone");
pageContext.setAttribute("aclClone", acdao.getSynSet());	
%>

<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/p7menu_secondary.css" />
<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/resultList.css" />		
	
<c:forEach items="${aclNeuron}" var="neuron" varStatus="i">
	<c:if test="${ontBean.fbbtId == neuron.fbbtId}">
		<c:set var="isNeuron" value="true" scope="request"/>
	</c:if>
</c:forEach>
<c:forEach items="${aclNeuropil}" var="neuropil" varStatus="i">
	<c:if test="${ontBean.fbbtId == neuropil.fbbtId}">
		<c:set var="isNeuropil" value="true" scope="request"/>
	</c:if>
</c:forEach>
<c:forEach items="${aclTract}" var="tract" varStatus="i">
	<c:if test="${ontBean.fbbtId == tract.fbbtId}">
		<c:set var="isTract" value="true" scope="request"/>
	</c:if>
</c:forEach>
<c:forEach items="${aclClone}" var="clone" varStatus="i">
	<c:if test="${ontBean.fbbtId == clone.fbbtId}">
		<c:set var="isClone" value="true" scope="request"/>
	</c:if>
</c:forEach>

	
<c:if test="${sessionScope.currURL!='/site/tools/query_builder/'}">
	<c:set var="termMenu" value="termMenuNeuron.jsp"/>
</c:if>
<c:if test="${isNeuropil && sessionScope.currURL!='/site/tools/query_builder/'}">
	<c:set var="termMenu" value="termMenuNeuropil.jsp"/>
</c:if>
<c:if test="${isTract && sessionScope.currURL!='/site/tools/query_builder/'}">
	<c:set var="termMenu" value="termMenuTract.jsp"/>
</c:if>
<c:if test="${isClone && sessionScope.currURL!='/site/tools/query_builder/'}">
	<c:set var="termMenu" value="termMenuClone.jsp"/>
</c:if>
<c:if test="${fn:contains(sessionScope.currURL,'/site/tools/query_builder/')}">
	<c:set var="termMenu" value="termMenuQB.jsp"/>
</c:if>

<jsp:include page="/jsp/includes/bits/${termMenu}">
	<jsp:param name="fbbtId" value="${ontBean.fbbtId}" />
</jsp:include>

<c:if test="${headAtt == true}"> 
	<!-- Google Analytics -->
		<jsp:include page="/jsp/includes/js/ga.jsp">
			<jsp:param name="ORurl" value="do/ont_bean.html?fbId=${ontBean.fbbtId}" />
		</jsp:include>
	<!-- End Google Analytics -->
</c:if>
		
<h2 style="font-size: 1.5em; margin-top:-3px"><a href="/site/tools/anatomy_finder/index.htm?id=${ontBean.fbbtId}" target="_top" title="View details and run queries in anatomy finder">${ontBean.name}</a></h2>
<c:if test="${!empty ontBean.fbbtId}">
<p>
	<b>ID: </b>${ontBean.fbbtId} ${requestScope["javax.servlet.forward.request_uri"]}
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
<p>
	<b>Synonyms: </b><br />
	<c:forEach items="${ontBean.synonyms}" var="curr" varStatus="status">
		&nbsp;&nbsp;&nbsp; * ${curr}<br />
	</c:forEach>
	<c:if test="${fn:length(refs)>0}">
		<p>
			<b>References: </b><br />
			<c:forEach items="${refs}" var="curr" varStatus="status">
			&nbsp;&nbsp;&nbsp; * <a href="http://flybase.org/reports/${curr.id}.html" target="_top">${curr.miniref}</a>
				<br />
			</c:forEach>
		</p>
	</c:if>
<p>
	<b>Parent classes: </b><br />
	<c:forEach items="${ontBean.isa}" var="curr" varStatus="status">
		&nbsp;&nbsp;&nbsp; * 
		<a href="/site/tools/anatomy_finder/index.htm?id=${curr.key}" title="Look up" target="_top">${curr.value}</a>
	</c:forEach>
</p>
<c:if test="${fn:length(ontBean.relationships)>0}">
	<p>
		<b>Relationships: </b><br />
		<c:forEach items="${ontBean.relationships}" var="curr" varStatus="status">
			&nbsp;&nbsp;&nbsp; * ${curr.value[0]}	
			<a href="/site/tools/anatomy_finder/index.htm?id=${curr.key}" title="Look up" target="_top">${curr.value[1]}</a>
			<c:forEach items="${aclNeuropil}" var="neuropil" varStatus="i">
				<c:if test="${curr.key == neuropil.fbbtId}">
					&nbsp;&nbsp;<a href="/site/stacks/index.htm?add=${curr.key} " target="_top"
						title="Add to the selected domains in the viewer">See in the viewer >> </a>
				</c:if>
			</c:forEach>
			<br />
		</c:forEach>
	</p>
</c:if>
<p>
	<a href="http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}" target="_top">Check in FlyBase >> </a> &nbsp; &nbsp;
	<a href="http://neurolex.org/wiki/${fn:replace(ontBean.fbbtId, ':', '_')}" target="_top">View/edit in NeuroLex Wiki >> </a>
	<c:if test="${!isNeuron && !isClone}">
		<c:set var="isNeuropil" value="true"/>
		&nbsp;&nbsp;<a href="/site/stacks/index.htm?add=${ontBean.fbbtId}" target="_top"
		title="Add to the selected domains in the viewer">See in the viewer >> </a>
	</c:if>
	<c:if test="${isNeuron || isClone}">
		<br/>
		<jsp:include page="/do/individual_film_strip.html">
			<jsp:param name="action" value="exemplar_neuron" />
			<jsp:param name="id" value="${ontBean.fbbtId}" />
		</jsp:include>
	</c:if>
	
	
</p>

