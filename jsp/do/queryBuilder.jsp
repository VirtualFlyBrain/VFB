<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
    <title>VFB Query Builder</title>
    <meta http-equiv="cache-control" content="max-age=0"/>
    <meta http-equiv="cache-control" content="no-cache"/>
    <meta http-equiv="expires" content="0"/>
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT"/>
    <meta http-equiv="pragma" content="no-cache"/>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">

    <!-- Optional theme -->
    <link rel="stylesheet" href="/css/bootstrap-theme.min.css">

    <!-- Custom styles for this template -->
    <link href="/css/offcanvas.css" rel="stylesheet">

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>


    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>

    <script type="text/javascript">
        $('body').ready(function () {
            var isInIframe = (window.location != window.parent.location)
            if (!isInIframe) {
                location.replace('/site/stacks/index.htm?tab=query');
            }
            var target = $('query_text');
            var url = "/do/ont_query_result.html";
            var params = 'action=count';
            var tip = "This tool allows you to search for neurons that innervate two different brain regions, specifying pre- or post-synaptic terminals. <br/>" +
                    "To begin, please search and select a neuropil using search box at the top of the page, or the Selected, Displayed or Anatomy tabs. Add the neuropil to the query using the 'Add to Query' <a href='#' class='btn btn-xs btn-info' ><span style='border:none;padding-left:0px;padding-right:0px;' class='glyphicon glyphicon-tasks'></span></a> icon next to your required anatomy term. <br />" +
                    "Then choose the type of terminals using the drop-down menu to the right of the term. <br/>" +
                    "Continue adding more terms as required.<br/>" +
                    "A query can be executed at any time by clicking the 'Show Results' button.<br/><br/>" +
                    "<div class='lead bg-warning'>Your query is currently empty.</div> Click <a href='#' class='btn btn-xs btn-info' ><span style='border:none;padding-left:0px;padding-right:0px;' class='glyphicon glyphicon-tasks'></span></a> icon next to anatomy terms to query against them. ";
            var queryText = "${queryText}";
            if (queryText != "") {
                $('#query_text').html(queryText);
                $('#query_count').load(url + '?' + params + '&time=' + Date.now(), function () {
                    if ($("#query_count").text().indexOf(" 0 ") > -1) {
                        $("#query_count").removeClass("bg-success").addClass("bg-danger");
                    } else {
                        $("#query_count").addClass("bg-success").removeClass("bg-danger");
                    }
                    if ($("#query_count").text().indexOf('Records found: ') > -1) {
                        $("#query_count").html('Records found: <span class="badge">' + $("#query_count").text().replace('Records found: ', '') + '</span>')
                    }
                });
            } else {
                $('#query_text').html(tip);
            }
        });

    </script>

    <script type="text/javascript">
        function execOntQuery() {
            window.open('/do/ont_query_result.html?action=multiquery&time=' + Date.now(), '_top');
            return false;
        }
        function execDBQuery() {
            window.open('/do/gene_list.html?action=multiquery&time=' + Date.now(), '_top');
            return false;
        }
    </script>

</head>

<body style="margin:2px">
<jsp:include page="/jsp/includes/js/tag.jsp"/>
<div id="content" style="position:absolute;top:0">
    <div style="width:100%;">
        <form name="ontQuery" action="/do/query_builder.html">
            <input id="hidden_field" type="hidden" class="form-control" name="sequence" value=""/>
            <script type="text/javascript">
                $('#hidden_field').value = Date.now();
            </script>
            <c:forEach items="${arguments}" var="curr" varStatus="stat">
            <c:if test="${curr.relation=='include'}">
            <div class="form-group has-success">
                <div class="input-group"><span class="input-group-addon"
                                               title="The query includes anything matching this item"><span
                        class="glyphicon glyphicon-plus-sign"></span></span>
                    </c:if>
                    <c:if test="${curr.relation=='exclude'}">
                    <div class="form-group has-error">
                        <div class="input-group"><span class="input-group-addon"
                                                       title="The query excludes anything matching this item"><span
                                class="glyphicon glyphicon-minus-sign"></span></span>
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
                            <span class="input-group-addon" title="Remove this item from the query"
                                  onclick="window.location='/do/query_builder.html?action=delete&index=${stat.index}'+'&time='+Date.now();return false"><span
                                    class="glyphicon glyphicon-remove-sign"></span></span>
                        </div>
                    </div>
                    <br/>
                    </c:forEach>
                    <div id="query_text" class="lead"></div>
                    <div id="query_count" class="lead"></div>

        </form>
        <c:if test="${fn:length(arguments) > 0 }">
            <!-- Show:
            <select id="query_type" name="query_type">
            <option value="neuron">Neurons</option>
            <option value="transgene">Transgenes</option>
            <option value="geneex">Gene Expression</option>
            <option value="phenotype">Phenotypes</option>
            </select -->
            <button class="btn btn-primary" onclick="execOntQuery()" title="Query Ontology">Show Results</button>
            <br/>
            <!-- button onclick="parent.execDBQuery()" title="Query Expression DB" style="vertical-align: middle">Query Expression DB</button -->
        </c:if>
    </div>

</div><!-- content -->
<c:if test="${!empty errorMsg}">
    <script type="text/javascript">
        console.log("${errorMsg}");
    </script>
</c:if>


</body>
</html>
