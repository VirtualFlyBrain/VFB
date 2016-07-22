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
		<!-- Google Analytics -->
			<script>
				dataLayer.push({'event':'sendVirtualPageview','vpv':'/do/ont_bean.html?fbId=${ontBean.fbbtId}'});
			</script>
		<!-- End Google Analytics -->

<c:forEach items="${aclNeuron}" var="neuron" varStatus="i"><c:if test="${ontBean.fbbtId == neuron.fbbtId}"><c:set var="isNeuron" value="true" scope="request"/></c:if></c:forEach>
<c:forEach items="${aclNeuropil}" var="neuropil" varStatus="i"><c:if test="${ontBean.fbbtId == neuropil.fbbtId}"><c:set var="isNeuropil" value="true" scope="request"/></c:if></c:forEach>
<c:forEach items="${aclTract}" var="tract" varStatus="i"><c:if test="${ontBean.fbbtId == tract.fbbtId}"><c:set var="isTract" value="true" scope="request"/></c:if></c:forEach>
<c:forEach items="${aclClone}" var="clone" varStatus="i"><c:if test="${ontBean.fbbtId == clone.fbbtId}"><c:set var="isClone" value="true" scope="request"/></c:if></c:forEach>

<c:if test="${sessionScope.currURL!='/site/tools/query_builder/'}"><c:set var="termMenu" value="termMenuNeuron.jsp"/></c:if>
<c:if test="${isNeuropil && sessionScope.currURL!='/site/tools/query_builder/'}"><c:set var="termMenu" value="termMenuNeuropil.jsp"/></c:if>
<c:if test="${isTract && sessionScope.currURL!='/site/tools/query_builder/'}"><c:set var="termMenu" value="termMenuTract.jsp"/></c:if>
<c:if test="${isClone && sessionScope.currURL!='/site/tools/query_builder/'}"><c:set var="termMenu" value="termMenuClone.jsp"/></c:if>
<c:if test="${fn:contains(sessionScope.currURL,'/site/tools/query_builder/')}"><c:set var="termMenu" value="termMenuQB.jsp"/></c:if>

<c:if test="${beanType=='ont'}">
	<jsp:include page="/jsp/includes/bits/${termMenu}">
		<jsp:param name="fbbtId" value="${ontBean.fbbtId}" />
	</jsp:include>
</c:if>


