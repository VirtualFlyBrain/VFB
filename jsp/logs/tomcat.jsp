<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@page
	import="org.springframework.web.context.*,org.springframework.web.context.support.*,uk.ac.ed.vfb.tools.autocomplete.*"%>

<!DOCTYPE html>
<html><head>
<title>Tomcat Log</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="description" content="" />
<meta name="copyright" content="" />
<link rel="stylesheet" type="text/css" href="/css/kickstart.css" media="all" />									<!-- KICKSTART -->
<link rel="stylesheet" type="text/css" href="/css/style.css" media="all" />											<!-- CUSTOM STYLES -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript" src="/js/kickstart.js"></script>																	<!-- KICKSTART -->
<script src="/js/jquery-1.11.1.js"></script>																	<!-- JQUERY -->
<script type="text/javascript">
  function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }
</script>
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
