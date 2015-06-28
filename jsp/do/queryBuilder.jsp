<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<title>VFB Query Builder</title>
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">

	<!-- Optional theme -->
	<link rel="stylesheet" href="/css/bootstrap-theme.min.css">

	<!-- Custom styles for this template -->
	<link href="/css/offcanvas.css" rel="stylesheet">

	<link rel="stylesheet" media="all" type="text/css" href="/css/vfb/utils/utils.css" />
    <script type="text/javascript" src="/javascript/thirdParty/mootools-core-1.3.2.js"></script>
    <script type="text/javascript" src="/javascript/thirdParty/mootools-more-1.3.2.1.js"></script>
    <script type="text/javascript" src="/javascript/vfb/utils.js"></script>

   <script type="text/javascript">
    window.addEvent('domready', function() {
      	var target = $('query_text');
    	var url = "/do/ont_query_result.html";
    	var params = 'action=count';
    	var tip = "This tool allows you to search for neurons that innervate two different brain regions, specify pre or post-synaptic terminals. <br/>"+
		"To begin, please select a term from the anatomy tree and add it to the query using the 'Add to Query' icon on the top of the term info panel." +
		"Then choose the type of terminals using the drop-down menu to the right of the term. <br/>" +
		"Continue adding more terms as required.<br/>"+
		"A query can be executed at any time by clicking the 'Execute' button.<br/><br/>" +
		"Your query is currently empty.";
		var queryText = "${queryText}";
		if (queryText != "") {
			tip = queryText;
			loadURL(url, target, tip, params, true);
		}
		else {
			loadURL(url, target, tip, params, false);
		}
    });

</script>

</head>

<body style="margin:2px">
<jsp:include page="/jsp/includes/js/tag.jsp" />
<div id="content" style="position:absolute;top:0">
	<div style="width:100%;">
		<form name="ontQuery" action="/do/query_builder.html">
			<br/>
			<c:forEach items="${arguments}" var="curr" varStatus="stat">
				<c:if test="${curr.relation=='include'}">
					<div class="form-group has-success"><span class="input-group-addon"><span class="glyphicon glyphicon-plus-sign"></span></span>
				</c:if>
				<c:if test="${curr.relation=='exclude'}">
					<div class="form-group has-error"><span class="input-group-addon"><span class="glyphicon glyphicon-minus-sign"></span></span>
				</c:if>
				<input type="text" class="form-control" name="name" value="${curr.ontBean.name}" readonly/>
				<select name="type" class="form-control" onChange="ontQuery.submit();">
					<c:forEach items="${typeDefs}" var="item">
						<%=pageContext.getAttribute("curr") %>
						|${curr.type}|${item.key}
						<option value="${item.key}" ${(curr.type==item.key)?"selected":""}>${item.key}</option>
					</c:forEach>
				</select>
				<!-- input type="image" value="Set query type" src="/images/utils/delete.png;" style="vertical-align: middle;height:20px; border:1px solid gray"/-->
				<span class="input-group-addon" onclick="window.location='/do/query_builder.html?action=delete&index=${stat.index}';return false"><span class="glyphicon glyphicon-remove-sign"></span></span>
				</div>
				<br/>
			</c:forEach>
			<div id="query_text" style="margin: 10px 0 0 5px;"><br/></div>
			<br/>
		</form>
		<c:if test="${fn:length(arguments) >0 }" >
			<!-- Show:
			<select id="query_type" name="query_type">
				<option value="neuron">Neurons</option>
				<option value="transgene">Transgenes</option>
				<option value="geneex">Gene Expression</option>
				<option value="phenotype">Phenotypes</option>
			</select -->
			<button class="btn btn-primary" onclick="parent.execOntQuery()" title="Query Ontology">Execute</button><br/>
			<!-- button onclick="parent.execDBQuery()" title="Query Expression DB"  style="vertical-align: middle">Query Expression DB</button -->
		</c:if>
	</div>

</div><!-- content -->
	<c:if test="${!empty errorMsg}" >
		<script type="text/javascript">
			alert("${errorMsg}");
		</script>
	</c:if>


 </body>
</html>
