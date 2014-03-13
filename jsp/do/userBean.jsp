<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<jsp:include page="/jsp/includes/1ColHead.jsp">
	<jsp:param name="navpath" value="Home@/index.htm|Tools@" />
</jsp:include>

<div id="center_wide">

	<!-- span class="anchor"><a class="help some-class" href="#" title="Right click here for tersm-specific actions">&nbsp;Actions on term </a></span-->
	<h2>Edit user details</h2>
	<p>
		<form:form method="post">
				<table>
					<tr>
						<td>User:</td>
						<td><c:if test="${param.action!='new'}">
								<form:input path="username" readonly="true" cssClass="user_input"/>
							</c:if> <c:if test="${param.action=='new'}">
								<form:input path="username" cssClass="user_input"/>
							</c:if> <form:errors path="username" cssClass="red" /></td>
					</tr>
					<tr>
						<td>Password:</td>
						<td><form:password path="password" cssClass="user_input"/> <form:errors path="password" cssClass="red" /></td>
					</tr>
					<tr>
						<td>Confirm Password :</td>
						<td><form:password path="confirmPassword" cssClass="user_input"/> <form:errors path="confirmPassword" cssClass="red" /></td>
					</tr>
					<tr>

						<td>First name:</td>
						<td><form:input path="firstname" cssClass="user_input"/> <form:errors path="firstname" cssClass="red" /></td>
					</tr>
					<tr>

						<td>Surname:</td>
						<td><form:input path="surname" cssClass="user_input"/> <form:errors path="surname" cssClass="red" /></td>
					</tr>
					<tr>

						<td>Institution:</td>
						<td><form:input path="institution" cssClass="user_input"/> <form:errors path="institution" cssClass="red" /></td>
					</tr>
					<tr>

						<td>Position:</td>
						<td><form:input path="position" cssClass="user_input"/> <form:errors path="position" cssClass="red" /></td>
					</tr>
					<tr>
						<td>Contact email:</td>
						<td><form:input path="email" cssClass="user_input"/> <form:errors path="email" cssClass="red" /></td>
					</tr>
					<tr>
						<td>Contact phone:</td>
						<td><form:input path="phone" cssClass="user_input"/></td>
					</tr>
					<tr>
						<td>Notes:</td>
						<td><form:textarea path="notes" cssClass="user_input user_notes"/></td>
					</tr>
					<tr>
						<td>Use registration email  <br/>for newsletters:</td>
						<td align="left"><form:checkbox path="email4Newsletter" cssClass="user_input left"/></td>
					</tr>					
					<tr>
						<%--Is enabled: </td><td><form:checkbox path="isEnabled"/></td--%>
					</tr>
					<tr>
						<td><input type="submit" value="Submit"></td>
						<td><input type="reset" value="Cancel" onclick="window.location = '/site/tools/login/index.htm'"></td>
					</tr>
				</table>

			</form:form>
	</p>
	</div>	
	<jsp:include page="/jsp/includes/homeFoot.jsp" />