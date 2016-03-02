<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib uri="/WEB-INF/classes/vfbUtils.tld" prefix="vfbUtil" %>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="cleanTitle">${fileName}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>

<jsp:include page="/jsp/includes/homeHead.jsp">
    <jsp:param name="title" value="${cleanTitle}"/>
    <jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|Query Results@ "/>
    <jsp:param name="css" value="
		//cdn.datatables.net/t/bs/jszip-2.5.0,pdfmake-0.1.18,dt-1.10.11,b-1.1.2,b-flash-1.1.2,b-html5-1.1.2,b-print-1.1.2,r-2.0.2/datatables.min.css;
	"/>
    <jsp:param name="js" value="
		//cdn.datatables.net/t/bs/jszip-2.5.0,pdfmake-0.1.18,dt-1.10.11,b-1.1.2,b-flash-1.1.2,b-html5-1.1.2,b-print-1.1.2,r-2.0.2/datatables.min.js;
	"/>
</jsp:include>

<script>$('body').css('cursor', 'wait');</script>

<div class="row-fluid" style="padding:0;">
    <div class="col-xs-12">
        <div class="row-fluid">
            <div class="col-md-2" align="center"><c:set var="allIds" value="VFBt_00100000"/>
                <c:forEach items="${ontBeanList}" var="ontBean" varStatus="status"><c:set var="allIds"
                                                                                          value="${allIds},${ontBean.fbbtIdAsOWL}"/></c:forEach>
                <span id="openAllButton"><button onclick="post('/site/stacks/index.htm',{'add':'${allIds}'});"
                                                 class="btn btn-sm btn-success">Open <span
                        class="badge">${fn:length(ontBeanList)}</span> in viewer
                </button></span>
            </div>
            <div class="col-md-8" align="center">
                <h2>Query: ${query}</h2>
            </div>
        </div>
    </div>
    <div class="col-xs-12" style="padding:0;">
        <div class="container-fluid" style="padding:0;" width="100%" border="1" frame="below" rules="rows">
            <div class="table-responsive">
                <table id="resultsTable" class="display">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Definition</th>
                        <th>Preview</th>
                        <th>Source</th>
                        <th>Type</th>
                        <th>Driver</th>
                    </tr>
                    </thead>
                    <tbody>
                    <c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
                        <c:set var="tpb" value="${ontBean.thirdPartyBean}"/>
                        <c:set var="types" value="${ontBean.types}"/>
                        <tr>
                            <td>
                                <a href="http://www.virtualflybrain.org/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}"
                                   class="text-muted">${ontBean.fbbtIdAsOWL}</a></td>
                            <td align="center">
                                <c:choose>
                                    <c:when test="${!empty tpb}">
                                        <a href="/site/stacks/index.htm?id=${tpb.vfbId}"
                                           class="text-success">${ontBean.name}</a><br/>
                                        <span style="border:none;padding-left:0px;padding-right:0px;" id="attach"
                                              data-id="${tpb.vfbId}"></span>
                                    </c:when>
                                    <c:otherwise>
                                        <a href="/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}"
                                           class="text-info">${ontBean.name}</a>
                                    </c:otherwise>
                                </c:choose>
                            </td>
                            <td class="text-muted">${ontBean.def}</td>
                            <td>
                                <c:if test="${!empty tpb}">
                                    <img class="lazy" data-original="${tpb.thumbUrl}" alt="See in viewer"
                                         onclick="post('/site/stacks/index.htm',{'add':'${tpb.vfbId}'});"
                                         style="cursor: pointer;"/>
                                </c:if>
                            </td>
                            <td>
                                <c:if test="${!empty tpb}">
                                    <a href="${tpb.baseUrl}${tpb.remoteId}"
                                       title="View original ${tpb.sourceName} entry" target="_blank"
                                       class="btn btn-sm btn-warning">${tpb.sourceName}</a>
                                </c:if>
                            </td>
                            <td>
                                <c:if test="${!empty types}">
                                    <c:forEach items="${types}" var="item" varStatus="stat">
                                        <a href="/site/stacks/index.htm?id=${item.key}" title="View ${item.value} entry"
                                           target="_top" class="btn btn-sm btn-success">${item.value}</a><c:if
                                            test="${!stat.last}">,</c:if>
                                        <br/>
                                    </c:forEach>
                                </c:if>
                            </td>
                            <td>
                                <c:set var="driverDetails" value='${drivers[ontBean.fbbtIdAsOWL]}'/>
                                <a href="http://flybase.org/reports/${driverDetails[0]}.html" target="_blank"
                                   class="btn btn-sm btn-info">${driverDetails[1]}</a>
                            </td>
                        </tr>
                    </c:forEach>
                    </tbody>
                </table>
            </div>
        </div>
        <script>
            $(document).ready(function () {
                var table = $('#resultsTable').DataTable({
                    paging: true,
                    searching: true,
                    ordering: true,
                    responsive: true,
                    autoWidth: false,
                    "order": [[0, "desc"]],
                    dom: "<'row-fluid'<'col-sm-6'i><'col-sm-6'f>>R<'row-fluid'<'col-sm-12'tr>><'row-fluid'<'col-sm-4'l><'col-sm-4'B><'col-sm-4'p>>",
                    buttons: [
                        {
                            extend: 'copyHtml5',
                            exportOptions: {
                                columns: [0, 1, 2, 4, 5, 6]
                            }
                        },
                        {
                            extend: 'csvHtml5',
                            exportOptions: {
                                columns: [0, 1, 2, 4, 5, 6]
                            }
                        },
                        {
                            extend: 'print',
                            exportOptions: {
                                columns: [0, 1, 2, 4, 5, 6]
                            }
                        }
                    ],
                    "columnDefs": [
                        {
                            "targets": [0],
                            "visible": true,
                            "searchable": true,
                            "className": "dt-center"
                        },
                        {
                            "targets": [1],
                            "visible": true,
                            "searchable": true,
                            "className": "dt-center"
                        },
                        {
                            "targets": [2],
                            "visible": true,
                            "searchable": true,
                            "className": "dt-center"
                        },
                        {
                            "targets": [3],
                            "visible": true,
                            "searchable": false,
                            "className": "dt-center"
                        },
                        {
                            "targets": [4],
                            "visible": true,
                            "searchable": true,
                            "className": "dt-center"
                        },
                        {
                            "targets": [5],
                            "visible": true,
                            "searchable": true,
                            "className": "dt-center"
                        },
                        {
                            "targets": [6],
                            "visible": true,
                            "searchable": true,
                            "className": "dt-center"
                        }
                    ]
                });
                window.setTimeout(function () {
                    updateStackCounter();
                    $('#resultsTable').dataTable().fnAdjustColumnSizing(false);
                    $('#resultsTable').DataTable().draw();
                    $('#resultsTable_length label').after($('#resultsTable_info').text().substring($('#resultsTable_info').text().indexOf(' of')).replace(' entries', ''));
                    window.setInterval(function () {
                        if ($('.lazy').parent().width() > 300) {
                            $('#resultsTable').dataTable().fnAdjustColumnSizing(false);
                            $('#resultsTable').DataTable().draw(false);
                        }
                    }, 10000);
                    $('body').css('cursor', 'default');
                }, 1000);
            });
        </script>
    </div>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
