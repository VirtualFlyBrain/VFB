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
	<!-- Bootstrap -->
  <link href="/css/bootstrap.min.css" rel="stylesheet">
	<!-- Custom styles for this template -->
  <link href="offcanvas.css" rel="stylesheet">
  <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->
	<meta name="keywords" content="virtual fly brain atlas, interactive fly brain, Drosophila, fruit fly,  brain atlas, neuron search, neuropil search, phenotype search, gene expression" />

		<!-- START Google Snippit code -->
			<meta itemprop="name" content="Virtual Fly Brain">
			<meta itemprop="description" content="Integrative queries of Drosophila neuroanatomical data.">
			<meta itemprop="image" content="http://www.virtualflybrain.org/images/vfb/project/cluster_eg.png">
		<!-- START Google Snippit code -->
      	<c:forEach items="${fn:split(param.css, ';')}" var="item">
      		<link rel="stylesheet" media="all" type="text/css" href="${item}" />
      	</c:forEach>
      	<script type="text/javascript" src="/javascript/thirdParty/mootools-core-1.3.2.js"></script>
      	<script type="text/javascript" src="/javascript/thirdParty/mootools-more-1.3.2.1.js"></script>
	<link rel="stylesheet" href="/thirdParty/smoothbox/smoothbox.css" type="text/css" media="screen" />
	<script src="/thirdParty/smoothbox/smoothbox.js" type="text/javascript"></script>
</head>
<body>
  <jsp:include page="/jsp/includes/js/tag.jsp" />
	<script type="text/javascript" src="/javascript/vfb/mailEncoder.js" ></script>
	<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
  <!-- Include all compiled plugins (below), or include individual files as needed -->
  <script src="js/bootstrap.min.js"></script>
  <div id="wrapper">
  	<c:if test="${empty param.nonav}">
		<jsp:include page="/jsp/includes/bits/head.jsp"/>
	</c:if>

	<div id="contentwrapper">
	<!--  Closing tag is in homeFoot.js -->
