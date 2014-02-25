<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" >
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<head>
	  <title>Virtual Fly Brain: ${param.title}</title>
	  <meta name="keywords" content="virtual fly brain atlas, interactive fly brain, Drosophila, fruit fly,  brain atlas, neuron search, neuropil search, phenotype search, gene expression" />
      
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
	  <jsp:include page="/jsp/includes/js/ga.jsp" />
</head>
<body>
  	<div id="wrapper">
	<jsp:include page="/jsp/includes/bits/head.jsp"/> 	 
	
	<div id="contentwrapper" style="border:1px solid gray" >
	<!--  Closing tags is in homeFoot.js -->	