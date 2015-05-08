<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<jsp:include page="/jsp/includes/1ColHead.jsp">
	<jsp:param name="title" value="User Stack Details" />
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/features.htm|Tools@#|User Stack Details@ " />
	<jsp:param name="css" value="/css/vfb/layout/layout-query.css;/css/vfb/annotation/upload.css;" />
</jsp:include>

<div id="center_wide">

	<h2>Edit Stack Details</h2>
	<p>
		<form:form method="post">	
				<table>
					<tr>
						<td>Stack Id<br/>(auto-generated):</td>
						<td><form:input path="stackId" readonly="true" cssClass="user_input disabled"/><br/><form:errors path="stackId" cssClass="red" /></td>
					</tr>
					<tr>
						<td>Stack Name<br/>(auto-generated):</td>
						<td><form:input path="stackName" readonly="true" cssClass="user_input disabled"/><br/> <form:errors path="stackName" cssClass="red" /></td>
					</tr>
					<tr>
						<td>User Name<br/>(auto-generated):</td>
						<td><form:input path="userName" readonly="true" cssClass="user_input disabled"/></td>
					</tr>				
					<tr>
						<td>Gene Id:</td>
						<td><form:input path="geneId" cssClass="user_input"/> <form:errors path="geneId" cssClass="red" /></td>
					</tr>
					<tr>
						<td>Gene Name:</td>
						<td><form:input path="geneName" cssClass="user_input"/> <form:errors path="geneName" cssClass="red" /></td>
					</tr>
					<tr>
						<td>Third party stack URL:</td>
						<td><form:input path="thirdPartyURL" cssClass="user_input"/> <form:errors path="thirdPartyURL" cssClass="red" /></td>
					</tr>
					<tr>
						<td>Experiment description <br/>and additional notes:</td>
						<td><form:textarea path="description" cssClass="user_input user_notes"/></td>
					</tr>
					<tr>
						<td><input type="submit" value="Submit"></td>
						<td><input type="reset" value="Cancel" onclick="window.location = '/do/annotation/stack_list.html'"></td>
					</tr>
				</table>

			</form:form>
	</p>

	</div>

	<jsp:include page="/jsp/includes/homeFoot.jsp" />
