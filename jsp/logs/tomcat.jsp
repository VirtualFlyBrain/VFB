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
<c:forEach items="${log}" var="curr" varStatus="status">
${curr}<br />
</c:forEach>
</body>
</html>
