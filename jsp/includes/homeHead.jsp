<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" >

<head>
	<title>Virtual Fly Brain: ${param.title}</title>
	<meta name="keywords" content="virtual fly brain atlas, interactive fly brain, Drosophila, fruit fly,  brain atlas, neuron search, neuropil search, phenotype search, gene expression" />
	<script type="text/javascript" async src="/jsp/includes/js/analytics.js" ></script>	
	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/header.css" />              
      	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/utils.css" />
      	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/p7menu.css" />
      	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/layout/layout-home.css" />
      	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/table.css" />
      	<c:forEach items="${fn:split(param.css, ';')}" var="item">
      		<link rel="stylesheet" media="all" type="text/css" href="${item}" />
      	</c:forEach>      
      	<script type="text/javascript" src="/javascript/thirdParty/mootools-core-1.3.2.js"></script>
      	<script type="text/javascript" src="/javascript/thirdParty/mootools-more-1.3.2.1.js"></script>  
	<link rel="stylesheet" href="/thirdParty/smoothbox/smoothbox.css" type="text/css" media="screen" />
	<script src="/thirdParty/smoothbox/smoothbox.js" type="text/javascript"></script>
	<script type="text/javascript" src="/javascript/vfb/mailEncoder.js" ></script>	  
</head>
<body>
  <div id="wrapper">
  	<c:if test="${empty param.nonav}">
		<jsp:include page="/jsp/includes/bits/head.jsp"/>
	</c:if> 	 
	
	<div id="contentwrapper">
	<!--  Closing tag is in homeFoot.js -->	
