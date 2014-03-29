<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<head>
	<title>VFB</title>
    <link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/layout.css" />
	
	<link rel="stylesheet" href="/thirdParty/smoothbox/smoothbox.css" type="text/css" media="screen" />
    <script type="text/javascript" src="/javascript/thirdParty/mootools-core-1.3.2.js"></script>
    <script type="text/javascript" src="/javascript/thirdParty/mootools-more-1.3.2.1.js"></script>

<script type="text/javascript">
	window.addEvent('domready', function() {
		var cookieValue = Cookie.read("recentQuery");
		//alert("executing " + cookieValue);
		window.location.href = cookieValue;	
	});
</script>
</head>
<body>
<jsp:include page="/jsp/includes/js/tag.jsp" />
</body>

