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

<c:choose>
	<c:when test="${headAtt == true}"> 
		<jsp:include page="/jsp/includes/js/tag.jsp" />
		<!-- Google Analytics -->
			<script>
				dataLayer.push({'event':'sendVirtualPageview','vpv':'/do/ont_bean.html?fbId=${ontBean.fbbtId}'});
			</script>
		<!-- End Google Analytics -->
		<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/p7menu_secondary.css" />
		<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/resultList.css" />
	</c:when>
	<c:otherwise>
		<jsp:include page="/jsp/includes/1ColHead.jsp">
			<jsp:param name="title" value="${ontBean.name}" />
			<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|${ontBean.fbbtId}@ " />
			<jsp:param name="css" value="/css/vfb/utils/p7menu_secondary.css;/css/vfb/utils/resultList.css;" />
		</jsp:include>
		<c:set var="needFoot" value="true" />
	</c:otherwise>
</c:choose>
		
	
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


		
<h2 style="font-size: 1.5em; margin-top:-3px"><a href="/site/tools/anatomy_finder/index.htm?id=${ontBean.fbbtId}&name=${ontBean.name}" target="_top" title="View details and run queries in anatomy finder">${ontBean.name}</a></h2>
<c:if test="${!empty ontBean.fbbtId}">
<p>
	<b>ID: </b>${ontBean.fbbtId}
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
		<c:set var="temp" value="${fn:replace(curr, '(', '<sup>(')}" />
		&nbsp;&nbsp;&nbsp; * ${fn:replace(temp, ')', ')</sup>')}<br />
	</c:forEach>
	<c:if test="${fn:length(refs)>0}">
		<p>
			<b>References: </b><br />
			<c:forEach items="${refs}" var="curr" varStatus="status">
				<c:set var="temp" value="" />
				<c:forEach items="${ontBean.refs}" var="currRef" varStatus="status">
					<c:set var="currParts" value="${fn:split(currRef, ',')}" />
					<c:if test="${fn:contains(currParts[1], curr.id)}">
						<c:set var="temp" value="${temp}${currParts[0]}" />
					</c:if>
				</c:forEach>
				&nbsp;&nbsp;&nbsp; * <sup>${temp}</sup><a href="http://flybase.org/reports/${curr.id}.html" target="_new">${curr.miniref}</a>
				<br />
			</c:forEach>
			<c:forEach items="${ontBean.refs}" var="curr" varStatus="status">
			<c:set var="currParts" value="${fn:split(curr, ',')}" />
			<c:if test="${fn:contains(curr, 'FlyBrain_NDB')}">
			&nbsp;&nbsp;&nbsp; * <a href="http://flybrain-ndb.iam.u-tokyo.ac.jp/fmi/xsl/browserecord.xsl?-lay=NDB&Accession+number=${fn:replace(currParts[1], 'FlyBrain_NDB:', '')}&-find=-find" target="_new"><sup>${currParts[0]}</sup> ${fn:replace(currParts[1], 'FlyBrain_NDB:', 'FlyBrain Neuron DB Accession number: ')}</a>
				<br />
			</c:if>
			</c:forEach>
		</p>
	</c:if>
<p>
	<b>Parent classes: </b><br />
	<c:forEach items="${ontBean.isa}" var="curr" varStatus="status">
		&nbsp;&nbsp;&nbsp; * 
		<a href="/site/tools/anatomy_finder/index.htm?id=${curr.key}&name=${curr.value}" title="Look up" target="_top">${curr.value}</a>
	</c:forEach>
</p>
<c:if test="${fn:length(ontBean.relationships)>0}">
	<p>
		<b>Relationships: </b><br />
		<c:forEach items="${ontBean.relationships}" var="curr" varStatus="status">
			&nbsp;&nbsp;&nbsp; * ${curr.value[0]}	
			<a href="/site/tools/anatomy_finder/index.htm?id=${curr.key}&name=${curr.value[1]}" title="Look up" target="_top">${curr.value[1]}</a>
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
	<a href="http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}" target="_new">Check in FlyBase >> </a> &nbsp; &nbsp;
	<a href="http://neurolex.org/wiki/${fn:replace(ontBean.fbbtId, ':', '_')}" target="_new">View/edit in NeuroLex Wiki >> </a>
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

<c:if test="${needFoot == true}">
	<jsp:include page="/jsp/includes/homeFoot.jsp"/>
</c:if>
