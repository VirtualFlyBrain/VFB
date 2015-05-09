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
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
		<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
		<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>

		<!-- START solr autocomplete components -->
		<script src="/javascript/ajax-solr/vfb.js"></script>
		<script src="/javascript/ajax-solr/core/Core.js"></script>
		<script src="/javascript/ajax-solr/core/AbstractManager.js"></script>
		<script src="/javascript/ajax-solr/managers/Manager.jquery.js"></script>
		<script src="/javascript/ajax-solr/core/Parameter.js"></script>
		<script src="/javascript/ajax-solr/core/ParameterStore.js"></script>
		<script src="/javascript/ajax-solr/core/AbstractWidget.js"></script>
		<script src="/javascript/ajax-solr/widgets/ResultWidget.js"></script>
		<script src="/javascript/ajax-solr/widgets/jquery/PagerWidget.js"></script>
		<script src="/javascript/ajax-solr/core/AbstractFacetWidget.js"></script>
		<script src="/javascript/ajax-solr/widgets/TagcloudWidget.js"></script>
		<script src="/javascript/ajax-solr/widgets/CurrentSearchWidget.js"></script>
		<script src="/javascript/ajax-solr/core/AbstractTextWidget.js"></script>
		<script src="/javascript/ajax-solr/widgets/AutocompleteWidget.js"></script>
		<!-- END solr autocomplete components -->

  	<c:forEach items="${fn:split(param.css, ';')}" var="item">
  		<link rel="stylesheet" media="all" type="text/css" href="${item}" />
  	</c:forEach>

</head>
<body>
	<jsp:include page="/jsp/includes/js/tag.jsp" />
	<jsp:include page="/jsp/includes/bits/head.jsp"/>

	<div id="content-fluid">
	<!--  Closing tags is in homeFoot.js -->
