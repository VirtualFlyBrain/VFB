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
		<!-- START Google Snippit code -->
      
      	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/layout.css" />
      	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/utils.css" />
      	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/help.css" />      
      	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/header.css" />
      	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/layout-1col.css" />
      	<link rel="stylesheet" type="text/css" href="/css/vfb/utils/p7menu.css" />
      	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/p7menu_secondary.css" />	
      	<link rel="stylesheet" href="/thirdParty/smoothbox/smoothbox.css" type="text/css" media="screen" />
      
      	<c:forEach items="${fn:split(param.css, ';')}" var="item">
      		<link rel="stylesheet" media="all" type="text/css" href="${item}" />
      	</c:forEach>
      
      	<script type="text/javascript" src="/javascript/thirdParty/json2.js"></script>
      	<script type="text/javascript" src="/javascript/thirdParty/mootools-core-1.3.2.js"></script>
      	<script type="text/javascript" src="/javascript/thirdParty/mootools-more-1.3.2.1.js"></script>
      
	<script type="text/javascript" src="/javascript/vfb/mailEncoder.js" ></script>
      	<script type="text/javascript" src="/thirdParty/smoothbox/smoothbox.js"></script>
      	<script type="text/javascript" src="/javascript/vfb/utils.js"></script>

</head>
<body>
	<jsp:include page="/jsp/includes/js/tag.jsp" />
  	<div id="wrapper">
	<jsp:include page="/jsp/includes/bits/head.jsp"/> 	 
	
	<div id="content-fluid">
	<!--  Closing tags is in homeFoot.js -->	
