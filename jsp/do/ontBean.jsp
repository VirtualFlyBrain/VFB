<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@page import="org.springframework.web.context.*,org.springframework.web.context.support.*,uk.ac.ed.vfb.tools.autocomplete.*"%>
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
		<!-- Google Analytics -->
			<script>
				dataLayer.push({'event':'sendVirtualPageview','vpv':'/do/ont_bean.html?fbId=${ontBean.fbbtId}'});
			</script>
		<!-- End Google Analytics -->

	</c:when>
	<c:otherwise>
		<jsp:include page="/jsp/includes/1ColHead.jsp">
			<jsp:param name="title" value="${ontBean.name}" />
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

<c:if test="${beanType=='ont'}">
	<jsp:include page="/jsp/includes/bits/${termMenu}">
		<jsp:param name="fbbtId" value="${ontBean.fbbtId}" />
	</jsp:include>
</c:if>


<h2 style="font-size: 1.5em; margin-top:-3px"><a href="/site/tools/anatomy_finder/index.htm?id=${ontBean.fbbtId}&name=${ontBean.name}" target="_top" title="View details and run queries in anatomy finder">${ontBean.name}</a></h2>
<c:if test="${!empty ontBean.fbbtId}">
<p>
	<b>ID: </b><a href="/site/tools/anatomy_finder/index.htm?id=${ontBean.fbbtId}&name=${ontBean.name}" target="_top" title="View details and run queries in anatomy finder" >${ontBean.fbbtId}</a>
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
			&nbsp;&nbsp;&nbsp; * <a href="${curr.webLink}" title="${curr.miniref}" target="_new">${curr.miniref}</script></a>
			<br />
		</c:forEach>
	</p>
</c:if>
<c:if test="${beanType=='ont'}">
	<c:if test="${fn:length(ontBean.isa)>0}">
		<p>
			<b>Parent classes: </b><br />
			<c:forEach items="${ontBean.isa}" var="curr" varStatus="status">
				&nbsp;&nbsp;&nbsp; *
				<a href="/site/tools/anatomy_finder/index.htm?id=${curr.key}&name=${curr.value}" title="Look up" target="_top">${curr.value}</a>
			</c:forEach>
		</p>
	</c:if>
</c:if>
<c:if test="${beanType=='ind'}">
	<c:if test="${fn:length(ontBean.types)>0}">
		<p>
			<b>Parent classes: </b><br />
			<c:forEach items="${ontBean.types}" var="curr" varStatus="status">
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
	</c:if>
</c:if>
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
	<a href="${tpb.baseUrl}${tpb.remoteId}" target="_new" title="Open in ${tpb.sourceName}" >${tpb.sourceName}</a>
	<br clear="all"/>
	<a href="/owl/${tpb.vfbId}" target="_top" >
		<img class="thumb"src="${tpb.thumbUrl}" />
	</a>
	<br/>
	<a href="/owl/${tpb.vfbId}" target="_top" >See in the viewer >> </a>
	<br/>

</c:if>

<c:if test="${beanType=='ont'}">
	<p>
		<br />
		<b>External Links: </b><br />
		<br />
		<a href="http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}" target="_new" title="See in FlyBase" ><img alt="See in FlyBase" src="/images/vfb/project/logos/flybase.gif" height="50px" /></a> &nbsp; &nbsp;
		<a href="http://neurolex.org/wiki/${fn:replace(ontBean.fbbtId, ':', '_')}" target="_new" title="View/edit in NeuroLex Wiki" ><img alt="View/edit in NeuroLex Wiki" src="/images/vfb/project/logos/neurolex_logo.png" height="50px" /></a>  &nbsp; &nbsp;
		<c:forEach items="${refs}" var="curr" varStatus="status">
			<c:if test="${fn:contains(curr, 'FlyBrain_NDB')}">
				<a href="${curr.webLink}" target="_new" title="${curr.miniref}" ><img alt="See in FlyBrain Neuron Database" src="/images/vfb/project/logos/NDB_logo.gif" height="50px" /></a>  &nbsp; &nbsp;
			</c:if>
		</c:forEach>
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
</c:if>

<c:if test="${needFoot == true}">
	<jsp:include page="/jsp/includes/homeFoot.jsp"/>
</c:if>
