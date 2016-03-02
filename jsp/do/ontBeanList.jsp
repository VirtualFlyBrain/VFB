<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib uri="/WEB-INF/classes/vfbUtils.tld" prefix="vfbUtil" %>

<c:set var="fileName">${fn:replace(query, "<i>", "")}</c:set>
<c:set var="fileName">${fn:replace(fileName, "</i>", "")}</c:set>
<c:set var="cleanTitle">${fileName}</c:set>
<c:set var="fileName">${fn:replace(fileName, " ", "_")}</c:set>

<jsp:include page="/jsp/includes/homeHead.jsp">
    <jsp:param name="title" value="${cleanTitle}"/>
    <jsp:param name="cache" value="no"/>
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
    </div>
    <div class="col-xs-12" style="padding:0;">
        <div class="container-fluid" style="padding:0;">
            <div class="table-responsive">
                <table id="resultsTable" class="display" width="100%" border="1" frame="below" rules="rows">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Definition</th>
                        <th>Query VFB</th>
                        <th>Available Images</th>
                        <th>Query FlyBase</th>
                    </tr>
                    </thead>
                    <tbody><c:set var="count" value="-1" scope="page"/>
                    <c:forEach items="${ontBeanList}" var="ontBean" varStatus="status"><c:set var="count"
                                                                                              value="${count + 1}"
                                                                                              scope="page"/>
                        <tr>
                            <td><a href="http://www.virtualflybrain.org/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}"
                                   class="text-muted">${ontBean.fbbtIdAsOWL}</a></td>
                            <td><a href="http://www.virtualflybrain.org/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}"
                                   class="text-success">${ontBean.name}</a></td>
                            <td class="text-muted">${ontBean.def}</td>
                            <td><a class="btn btn-success btn-sm"
                                   href="http://www.virtualflybrain.org/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}">More
                                info</a><span class="sr-only"> - http://www.virtualflybrain.org/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}</span>
                            </td>
                            <td id="exemplar${status.index}" data-id="${ontBean.fbbtId}" data-index="${status.index}"
                                style="padding:0px;width:350px;">
                                <div class="content-fluid" id="imagesCaro" style="width:350px; max-width:350px;">
                                    <span class="sr-only">00000 Images Found So Far...<br/></span>
                                    <span id="resoveImages" data-id="${ontBean.fbbtId}" data-index="${status.index}"><a
                                            class="btn btn-sm btn-info"
                                            href="http://www.virtualflybrain.org/do/individual_list.html?action=exemplar_neuron&id=${ontBean.fbbtIdAsOWL}">Find
                                        images</a></span></div>
                            </td>
                            <td><a class="btn btn-info btn-sm"
                                   href="http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}">FlyBase
                                Report</a><span
                                    class="sr-only"> - http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}</span>
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
                    "order": [[4, "desc"]],
                    dom: "<'row'<'col-sm-6'i><'col-sm-6'f>>R<'row'<'col-sm-12'tr>><'row'<'col-sm-4'l><'col-sm-4'B><'col-sm-4'p>>",
                    buttons: [
                        {
                            extend: 'copyHtml5',
                            exportOptions: {
                                columns: [0, 1, 2]
                            }
                        },
                        {
                            extend: 'csvHtml5',
                            exportOptions: {
                                columns: [0, 1, 2]
                            }
                        },
                        {
                            extend: 'print',
                            exportOptions: {
                                columns: [0, 1, 2]
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
                            "searchable": false,
                            "className": "dt-center"
                        },
                        {
                            "targets": [5],
                            "visible": true,
                            "searchable": false,
                            "className": "dt-center"
                        }
                    ]
                });
                window.setTimeout(function () {
                    updateStackCounter();
                    $('[id=resoveImages]').each(function () {
                        var i = parseInt($(this).data('index'));
                        $.get("/do/individual_film_strip.html?action=exemplar_neuron&id=" + $(this).data('id'), function (data) {
                            $('#resultsTable').dataTable().fnUpdate(data, i, 4, false);
                            $('#resultsTable').DataTable().draw(false);
                        });
                        $(this).attr('id', 'loadingImages');
                    });
                    $('#resultsTable').dataTable().fnAdjustColumnSizing(false);
                    $('#resultsTable').DataTable().draw();
                    $('#resultsTable_length label').after($('#resultsTable_info').text().substring($('#resultsTable_info').text().indexOf(' of')).replace(' entries', ''));
                    window.setInterval(function () {
                        $('[id=resoveImages]').each(function () {
                            var i = parseInt($(this).data('index'));
                            $.get("/do/individual_film_strip.html?action=exemplar_neuron&id=" + $(this).data('id'), function (data) {
                                $('#resultsTable').dataTable().fnUpdate(data, i, 4, false);
                                $('#resultsTable').DataTable().draw(false);
                            });
                            $(this).attr('id', 'loadingImages');
                        });
                        if ($('.lazy').parent().parent().width() > 360) {
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
