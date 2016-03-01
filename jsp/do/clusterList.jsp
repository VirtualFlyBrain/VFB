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
        <div class="row">
            <div class="container-fluid" align="center">
                <h2>Query: ${query}</h2>
            </div>
        </div>
    </div>
    <div class="col-xs-12" style="padding:0;">
        <div class="container-fluid" style="padding:0;">
            <div class="table-responsive">
                <table id="resultsTable" class="display" width="100%">
                    <thead>
                    <tr>
                        <th style="display:none;">Query</th>
                        <th style="display:none;">Cluster details</th>
                        <th>Cluster</th>
                        <th>Exemplar name</th>
                        <th>Exemplar definition</th>
                        <th>Exemplar source</th>
                        <th>Exemplar preview</th>
                        <th>Members of cluster</th>
                    </tr>
                    </thead>
                    <tbody>
                    <c:forEach items="${ontBeanList}" var="ontBean" varStatus="status">
                        <tr>
                            <td style="display:none;">${query}</td>
                            <td style="display:none;">
                                http://flybrain.mrc-lmb.cam.ac.uk/vfb/fc/clusterv/3/${ontBean.name}/
                            </td>
                            <td>
                                <a href="http://flybrain.mrc-lmb.cam.ac.uk/vfb/fc/clusterv/3/${ontBean.name}/"
                                   title="Interactive 3D rendering of cluster" target="_blank">
                                    <img class="lazy"
                                         data-original="http://flybrain.mrc-lmb.cam.ac.uk/vfb/fc/clusterv/3/${ontBean.name}/thumb_0.333.png"
                                         alt="NBLAST neuron cluster based on exemplar ${ontBean.name}"/>
                                </a>
                            </td>
                            <td>
                                <h5><span style="cursor: pointer;"
                                          onclick="post('/site/stacks/index.htm',{'add':'${ontBean.fbbtIdAsOWL}'});">${ontBean.name}</span>
                                </h5>
                            </td>
                            <td>
                                    ${ontBean.def}
                                <c:set var="tpb" value="${ontBean.thirdPartyBean}"/>
                            </td>
                            <td>
                                <a href="${tpb.baseUrl}${tpb.remoteId}" target="_blank"
                                   class="btn btn-sm btn-warning">${tpb.sourceName}</a>
                            </td>
                            <td>
                                <c:if test="${!empty tpb}"><img class="lazy" data-original="${tpb.thumbUrl}"
                                                                alt="${query}: ${tpb.sourceName} (${tpb.remoteId}), ${ontBean.name}, ${ontBean.def}"
                                                                onclick="post('/site/stacks/index.htm',{'add':'${tpb.vfbId}'});"
                                                                style="cursor: pointer;"/></c:if>
                            </td>
                            <td>
                                <c:if test="${!empty tpb}">
                                    <span id="OpenAllButtonFor${tpb.vfbId}" data-id="${tpb.vfbId}"></span><br/>
                                    <a class="btn btn-sm btn-success"
                                       href="/do/individual_list.html?action=neuron_found&id=${tpb.vfbId}&region=${ontBean.name}"
                                       alt="http://www.virtualflybrain.org/do/individual_list.html?action=neuron_found&id=${tpb.vfbId}&region=${ontBean.name}">
                                        List individual members
                                    </a></c:if>
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
                        'copyHtml5',
                        {
                            extend: 'csvHtml5',
                            exportOptions: {
                                columns: [0, 1, 3, 4, 5]
                            }
                        },
                        'print'
                    ],
                    "columnDefs": [
                        {
                            "targets": [0],
                            "visible": false,
                            "searchable": false
                        },
                        {
                            "targets": [1],
                            "visible": false,
                            "searchable": false
                        },
                        {
                            "targets": [2],
                            "visible": true,
                            "searchable": false
                        },
                        {
                            "targets": [6],
                            "visible": true,
                            "searchable": false
                        },
                        {
                            "targets": [7],
                            "visible": true,
                            "searchable": false
                        }
                    ]
                });
                window.setTimeout(function () {
                    updateStackCounter();
                    $('#resultsTable').dataTable().fnAdjustColumnSizing(false);
                    $('#resultsTable').DataTable().draw();
                    $('#resultsTable_length label').after($('#resultsTable_info').text().substring($('#resultsTable_info').text().indexOf(' of')).replace(' entries', ''));
                    window.setInterval(function () {
                        if ($('.lazy').parent().width() > 360) {
                            $('#resultsTable').dataTable().fnAdjustColumnSizing(false);
                            $('#resultsTable').DataTable().draw(false);
                        }
                    }, 10000);
                    $('body').css('cursor', 'default');
                }, 1000);
                window.setInterval(function () {
                    $('[id^=OpenAllButtonFor]').each(function () {
                        if ($(this).html() == "") {
                            $(this).load('/do/individual_list.html?action=neuron_found&id=' + cleanIdforExt($(this).data("id")) + ' #openAllButton');
                        } else {
                            $(this).id = "Resolved" + $(this).id;
                        }
                    });
                }, 5000);
            });
        </script>
    </div>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp"/>
