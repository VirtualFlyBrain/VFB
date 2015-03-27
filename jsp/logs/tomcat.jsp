<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@page
	import="org.springframework.web.context.*,org.springframework.web.context.support.*,uk.ac.ed.vfb.tools.autocomplete.*"%>

<!DOCTYPE html>
<html><head>
<title>Tomcat Log</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="description" content="Log file" />
<meta name="copyright" content="virtualflybrain.org" />
<center>
<h1>Tomcat Log</h1>
</center>
<hr />
</head>
<body>
<c:set var="col" value="blue" scope="page" />
<c:forEach items="${log}" var="curr" varStatus="status">
<c:if test="${fn:contains(curr, today)}">
<c:set var="col" value="blue" scope="page" />
	<br />
</c:if>
<c:if test="${fn:contains(curr, ' PM ')}">
<c:set var="col" value="blue" scope="page" />
<br />
</c:if>
<c:if test="${fn:contains(curr, ' AM ')}">
<c:set var="col" value="blue" scope="page" />
<br />
</c:if>
<c:if test="${fn:contains(curr, 'INFO')}">
<c:set var="col" value="green" scope="page" />
</c:if>
<c:if test="${fn:contains(curr, 'DEBUG')}">
<c:set var="col" value="darkgoldenrod" scope="page" />
</c:if>
<c:if test="${fn:contains(curr, 'WARNING')}">
<c:set var="col" value="orange" scope="page" />
</c:if>
<c:if test="${fn:contains(curr, 'ERROR')}">
<c:set var="col" value="red" scope="page" />
</c:if>
<c:if test="${fn:contains(curr, 'SEVERE')}">
<c:set var="col" value="red" scope="page" />
</c:if>
<font color="${col}">${curr}<br /></font>
</c:forEach>
</body>
</html>
