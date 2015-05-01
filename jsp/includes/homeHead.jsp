<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" itemtype="http://schema.org/Organization" >

<head>
	<meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
	<title>Virtual Fly Brain: ${param.title}</title>
	<link rel="icon" href="/favicon.ico">

	<meta name="keywords" content="virtual fly brain atlas, interactive fly brain, Drosophila, fruit fly,  brain atlas, neuron search, neuropil search, phenotype search, gene expression" />

		<!-- START Google Snippit code -->
			<meta itemprop="name" content="Virtual Fly Brain">
			<meta itemprop="description" content="Integrative queries of Drosophila neuroanatomical data.">
			<meta itemprop="image" content="http://www.virtualflybrain.org/images/vfb/project/cluster_eg.png">
		<!-- START Google Snippit code -->
      	<c:forEach items="${fn:split(param.css, ';')}" var="item">
      		<link rel="stylesheet" media="all" type="text/css" href="${item}" />
      	</c:forEach>

	<link rel="stylesheet" href="/thirdParty/smoothbox/smoothbox.css" type="text/css" media="screen" />
	<script src="/thirdParty/smoothbox/smoothbox.js" type="text/javascript"></script>
</head>
<body>
  <jsp:include page="/jsp/includes/js/tag.jsp" />

  <c:if test="${empty param.nonav}">
		<jsp:include page="/jsp/includes/bits/head.jsp"/>
	</c:if>


	<div class="container">

	<!--  Closing tag is in homeFoot.js -->
