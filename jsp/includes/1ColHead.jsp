<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" itemscope itemtype="http://schema.org/Organization" >
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<head>
	<title>Virtual Fly Brain: ${param.title}</title>
	<meta name="keywords" content="virtual fly brain atlas, interactive fly brain, Drosophila, fruitfly,  brain atlas, neuron search, neuropil search, phenotype search, gene expression" />

		<!-- START Google Snippit code -->
			<meta itemprop="name" content="Virtual Fly Brain: ${param.title}">
			<meta itemprop="description" content="Integrative queries of Drosophila neuroanatomical data.">
			<meta itemprop="image" content="http://www.virtualflybrain.org/images/vfb/project/cluster_eg.png">
		<!-- END Google Snippit code -->

		<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
		<script src="//code.jquery.com/jquery-1.11.3.js"></script>
		<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
		<script src="//code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>

		<!-- Latest compiled and minified JavaScript -->
		<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/bloodhound.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/typeahead.bundle.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/typeahead.jquery.min.js"></script>

		<!-- Code to manage stacks -->
		<script src="//cdnjs.cloudflare.com/ajax/libs/store.js/1.3.17/store+json2.min.js"></script>
		<script type="text/javascript" src="/javascript/vfb/stackManager.js" ></script>

		<!-- https://github.com/CWSpear/bootstrap-hover-dropdown -->
		<script src="/javascript/thirdParty/bootstrap-hover-dropdown.min.js"></script>

  	<c:forEach items="${fn:split(param.css, ';')}" var="item">
  		<link rel="stylesheet" media="all" type="text/css" href="${item}" />
  	</c:forEach>

</head>
<body>
	<jsp:include page="/jsp/includes/js/tag.jsp" />
	<jsp:include page="/jsp/includes/bits/head.jsp"/>

	<div id="content-fluid">
	<!--  Closing tags is in homeFoot.js -->
