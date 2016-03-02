<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="cleanTitle">${fileName}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>

<jsp:include page="/jsp/includes/homeHead.jsp">
    <jsp:param name="title" value="${cleanTitle}"/>
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
        <div class="row">
            <div class="center-block" align="center">
                <h2>Query: ${query}</h2>
            </div>
        </div>
        <div class="col-xs-12" style="padding:0;">
            <div class="container-fluid" style="padding:0;">
                <div class="table-responsive">
                    <table id="resultsTable" class="display" width="100%" border="1" frame="below" rules="rows">
                        <thead>
                        <tr>
                            <c:forEach items="${transgeneColumns}" var="curr">
                                <th>${curr}</th>
                            </c:forEach>
                            <th>Source</th>
                        </tr>
                        </thead>
                        <tbody>
                        <c:forEach items="${geneList}" var="geneBean" varStatus="status">
                            <tr>
                                <td><a href="${transgeneLinks[0]}${geneBean.driverRef}.html"
                                       target="_blank">${geneBean.driver}</a><br/>
                                    <c:if test="${!empty geneBean.thirdPartyBean.stackName}">
                                        <span id="attach" data-id="${tpb.vfbId}"></span>
                                    </c:if></td>
                                <td>
                                    <a href="/site/stacks/index.htm?id=FBbt:${geneBean.locationRef}&name=${geneBean.location}">${geneBean.location}</a>
                                    <c:if test="${geneBean.flag}">
                                        <a href="" class="warn"
                                           title="${queryDesc} expression in this cell may be localised to regions of the cell that do not overlap the queried structure">(*)</a>
                                    </c:if>
                                </td>
                                <td><a href="${transgeneLinks[0]}${geneBean.reference}.html"
                                       target="_blank">${geneBean.referenceRef}</a></td>
                                <td>
                                    <c:set var="tpb" value="${geneBean.thirdPartyBean}"/>
                                    <c:if test="${!empty tpb && tpb.stackType=='adult brain' && tpb.completeExpressionPattern}">
                                        <c:if test="${!empty geneBean.thirdPartyBean.thumbName}">
                                            <a style="float: left; margin: 0 3px;"
                                               href="/site/stacks/index.htm?add=${tpb.vfbId}"
                                               title="View registered stack in 3D Viewer" target="_blank">
                                                <img class="lazy" data-original="${geneBean.thirdPartyBean.thumbUrl}"
                                                     alt="${geneBean.driver} ${query}, ${tpb.sourceName}, ${geneBean.referenceRef}"/></a>
                                        </c:if>
                                    </c:if>
                                </td>
                                <td>
                                    <c:if test="${!empty tpb && tpb.stackType=='adult brain' && tpb.completeExpressionPattern}">
                                        <a href="${tpb.baseUrl}${tpb.remoteId}" title="View original source page"
                                           target="_blank">${tpb.sourceName}</a>
                                    </c:if>
                                </td>
                            </tr>
                        </c:forEach>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <script>
        $(document).ready(function () {
            var table = $('#resultsTable').DataTable({
                paging: true,
                searching: true,
                ordering: true,
                responsive: true,
                stateSave: true,
                autoWidth: false,
                "order": [[3, "desc"]],
                dom: "<'row'<'col-sm-6'i><'col-sm-6'f>>R<'row'<'col-sm-12'tr>><'row'<'col-sm-4'l><'col-sm-4'B><'col-sm-4'p>>",
                buttons: [
                    {
                        extend: 'copyHtml5',
                        exportOptions: {
                            columns: [0, 1, 2, 4]
                        }
                    },
                    {
                        extend: 'csvHtml5',
                        exportOptions: {
                            columns: [0, 1, 2, 4]
                        }
                    },
                    {
                        extend: 'print',
                        exportOptions: {
                            columns: [0, 1, 2, 4]
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
                    }
                ]
            });
            window.setTimeout(function () {
                updateStackCounter();
                $('#resultsTable').dataTable().fnAdjustColumnSizing(false);
                $('#resultsTable').DataTable().draw();
                $('#resultsTable_length label').after($('#resultsTable_info').text().substring($('#resultsTable_info').text().indexOf(' of')).replace(' entries', ''));
                window.setInterval(function () {
                    if ($('.lazy').parent().parent().width() > 500) {
                        $('#resultsTable').dataTable().fnAdjustColumnSizing(false);
                        $('#resultsTable').DataTable().draw(false);
                    }
                }, 10000);
                $('body').css('cursor', 'default');
            }, 1000);
        });
    </script>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
