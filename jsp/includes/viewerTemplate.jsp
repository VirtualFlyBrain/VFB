<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="meta_root">${(empty param.meta_root)?"/data/flybrain/":param.meta_root}</c:set>
<jsp:include page="/jsp/includes/homeHead.jsp">
    <jsp:param name="title" value="Virtual Fly Brain: ${param.title}"/>
    <jsp:param name="css" value="
		/css/bootstrap-slider.min.css;
		//cdn.datatables.net/t/bs/jszip-2.5.0,pdfmake-0.1.18,dt-1.10.11,b-1.1.2,b-flash-1.1.2,b-html5-1.1.2,b-print-1.1.2,r-2.0.2/datatables.min.css;
		/css/bootstrap-colorpicker.min.css;
		"/>
    <jsp:param name="js" value="
		/javascript/vfb/wlziip.js;
		/javascript/thirdParty/bootstrap-slider.min.js;
	    //cdn.datatables.net/t/bs/jszip-2.5.0,pdfmake-0.1.18,dt-1.10.11,b-1.1.2,b-flash-1.1.2,b-html5-1.1.2,b-print-1.1.2,r-2.0.2/datatables.min.js;
	    /javascript/thirdParty/bootstrap-colorpicker.min.js;
		/javascript/thirdParty/stroketext/strokeText.js;
		//cdn.datatables.net/plug-ins/1.10.10/api/fnStandingRedraw.js;
		"/>
</jsp:include>
<script>paramInc = {};</script>
<c:if test="${!empty param.id}">
    <script>$('body').ready(function () {
        openFullDetails("${param.id}");
        window.setTimeout(function () {
            detailLoad = false;
            openFullDetails("${param.id}");
        }, 5000);
    });
    paramInc.id = '${param.id}'; </script>
</c:if>
<c:if test="${!empty param.clear}">
    <script>window.setTimeout(function () {
        clearAllDisplayed();
        updateStackData();
    }, 3000);
    paramInc.clear = '${param.clear}'; </script>
    <c:if test="${!empty param.add}">
        <script>window.setTimeout(function () {
            addToStackData("${param.add}");
            updateStackData();
        }, 3500);</script>
    </c:if></c:if>
<c:if test="${!empty param.add}">
    <script>addToStackData("${param.add}", paramInc.id === undefined);
    updateStackData();
    paramInc.add = '${param.add}'; </script>
</c:if>
<c:if test="${!empty param.tab}">
    <script>$('body').ready(function () {
        window.setTimeout(function () {
            openTab("${param.tab}");
        }, 5000);
    });
    paramInc.tab = '${param.tab}'; </script>
</c:if>

<div class="row">
    <div class="col-md-6" style="min-width:555px;padding: 2px;">


        <div class="row" style="overflow:scroll;">

            <div class="col-md-12" id="viewer-menu">
                <form class="form-inline">
                    <div class="btn btn-default btn-xs form-group" title="Reset view" id="resetPosition"><span
                            class="glyphicon glyphicon-screenshot"></span></div>
                    <div class="btn btn-default btn-xs form-group" title="Move through the stack"
                         id="slider-sliceCurrentSliderValLabel">Slice: <span id="slider-sliceSliderVal"
                                                                             class="badge">1</span> <span
                            class="glyphicon glyphicon-edit"></span></div>
                    <div id="slider-sliceCurrentSlider" class="form-group"
                         style="display: none;padding-left: 5px;padding-right: 5px;"><input id="slider-slice"
                                                                                            type="text"/></div>
                    <div class="btn btn-default btn-xs form-group" title="Change the image scale"
                         id="slider-scaleCurrentSliderValLabel">Zoom: <span id="slider-scaleSliderVal"
                                                                            class="badge">1x</span> <span
                            class="glyphicon glyphicon-edit"></span></div>
                    <div id="slider-scaleCurrentSlider" class="form-group"
                         style="display: none;padding-left: 5px;padding-right: 5px;"><input id="slider-scale"
                                                                                            type="text"/></div>
                    <div class="btn btn-default btn-xs form-group" title="Change the viewing plane" id="toggle-view">
                        Plane <span id="toggle-viewVal" class="badge">Z</span> <span
                            class="glyphicon glyphicon-repeat"></span></div>
                    <div class="btn btn-default btn-xs hidden-xs form-group"
                         title="Adjust the image blending transparency. Note: this will also be automatically adjusted"
                         id="slider-alphaCurrentSliderValLabel"><span class="glyphicon glyphicon-adjust"></span> <span
                            id="slider-alphaSliderVal" class="badge">61%</span> <span
                            class="glyphicon glyphicon-edit"></span></div>
                    <div id="slider-alphaCurrentSlider" class="hidden-xs form-group"
                         style="display: none;padding-left: 5px;padding-right: 5px;"><input id="slider-alpha"
                                                                                            type="text"/></div>
                    <a href="#" tabindex="0" rel="imageAttributes" class="btn btn-default btn-xs" role="button"
                       data-toggle="popover" data-trigger="focus"
                       data-placement="bottom"
                       title="Image Attribution"
                       data-popover-content="#imageAttributes">
                        <span class="glyphicon glyphicon-info-sign"></span>
                    </a>
                    <div id="imageAttributes" class="hide">
						<span id="imageAttributesText">
						<c:if test="${!empty param.stackInfo}">
                            <c:set var="credits" value="${fn:split(param.stackInfo,'|')}"/>
                            <h3><span class="glyphicon glyphicon-picture"></span> Background and Anatomy Stack:</h3>
                            <p>${credits[0]}</p>
                            <p><b>Created by: </b>${credits[1]}</p>
                            <p><b>Background Staining: </b>${credits[2]} <span id="backgroundStain"><a
                                    href="${credits[3]}" target="_blank">${credits[4]}</a></span</p>
                            <p><a href="/site/vfb_site/template_files_downloads.htm">Full details and a download link
                                can be found here.</a>
                            <h3><span class="glyphicon glyphicon-info-sign"></span> See information for each image for
                                attribution information.</h3>
                        </c:if>
						<c:if test="${empty param.stackInfo}">
                            <h3><span class="glyphicon glyphicon-picture"></span> Background and Anatomy Stack:</h3>
                            <p><a href="/site/vfb_site/template_files_downloads.htm">Full details and a download link
                                can be found here.</a>
                            <h3><span class="glyphicon glyphicon-info-sign"></span> See information for each image for
                                attribution information.</h3>
                        </c:if>
						</span>
                    </div>
                    <div class="btn btn-success btn-xs form-group" title="Open current items in 3D" id="open3D"
                         onclick="window.open($('#menuOpen3Dlink').attr('href'), '_blank', async = true);">3D <span
                            class="glyphicon glyphicon-share"></span></div>
                </form>
            </div>
        </div>
        <div class="row" style="overflow:scroll;">
            <div class="col-md-12" id="viewer-panel">
                <canvas class="well" id="canvas" style="display: block; cursor: crosshair;">Your browser does not
                    support the HTML5 canvas tag.
                </canvas>
                <div id="labelBlock"
                     style="position: absolute; color: black; padding-left: 5px; padding-right: 5px; top: 0px; left: 35px;">
                    Loading...
                </div>
                <script>
                    $(document).ready(function () {
                        $('[rel="imageAttributes"]').popover({
                            trigger: 'focus', container: 'body', html: true, content: function () {
                                var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
                                return clone;
                            }
                        }).click(function (e) {
                            if ($(this).is(":focus")) {
                                if ($(this).data("open")) {
                                    $(this).blur();
                                    $(this).data("open", false);
                                    return true;
                                } else {
                                    $(this).data("open", true);
                                    e.preventDefault();
                                }
                            }
                        });
                        animateWlzDisplay();
                    });
                </script>
            </div>
        </div>

        <div class="row" style="overflow:scroll;">
            <div class="col-md-12" id="right-panel">
                <div class="content-fluid">
                    <ul class="nav nav-tabs">
                        <li id="SelecMenuTab"><a id="selecHead" href="#selec" data-toggle="tab"><span
                                class="glyphicon glyphicon-map-marker"></span> Selected</a></li>
                        <li id="DispMenuTab" class="active"><a href="#disp" data-toggle="tab"><span
                                class="glyphicon glyphicon-picture"></span> Displayed</a></li>
                        <li id="AnatoMenuTab"><a href="#anato" data-toggle="tab"><span
                                class="glyphicon glyphicon-list-alt"></span> Anatomy</a></li>
                        <li id="QueryMenuTab"><a href="#queryBuild" data-toggle="tab"><span
                                class="glyphicon glyphicon-tasks"></span> Query Builder</a></li>
                        <li id="MinMenuTab"><a href="#min" data-toggle="tab" onClick="minimizeMenuTabs();"><span
                                class="glyphicon glyphicon-resize-small"></span> Minimize</a></li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane" id="selec">
                            <div class="row-fluid" style="padding:0;">
                                <div class="col-md-12" style="padding:0;">
                                    <h4>Available at the selected point <span id="pointVal"
                                                                              class="label label-default label-as-badge">X,Y,Z</span>
                                    </h4>
                                </div>
                                <div class="col-md-12" style="padding:0;">
                                    <div class="table-responsive" id="selecContent">
                                        <table id="selected" class="display compact" cellspacing="0">
                                            <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>#</th>
                                                <th>Controls</th>
                                                <th>Type</th>
                                                <th>Image</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <th>Click somewhere on the image</th>
                                                <th>-</th>
                                                <th><img src="/images/tools/ajax-loader.gif" alt="loading..."/></th>
                                                <th><img src="/images/tools/ajax-loader.gif" alt="loading..."/></th>
                                                <th><img src="/images/tools/ajax-loader.gif" alt="loading..."/></th>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <script>
                                            $(document).ready(function () {
                                                $('#selected').DataTable({
                                                    retrieve: true,
                                                    paging: true,
                                                    searching: true,
                                                    ordering: true,
                                                    responsive: false,
                                                    stateSave: true,
                                                    order: [[1, 'desc']],
                                                    dom: "<'row-fluid'<'col-sm-6'i><'col-sm-6'f>>R<'row-fluid'<'col-sm-12'tr>><'row-fluid'<'col-sm-4'l><'col-sm-4'B><'col-sm-4'p>>",
                                                    buttons: [
                                                        {
                                                            extend: 'copyHtml5',
                                                            exportOptions: {
                                                                columns: [1, 0, 3]
                                                            }
                                                        },
                                                        {
                                                            extend: 'csvHtml5',
                                                            exportOptions: {
                                                                columns: [1, 0, 3]
                                                            }
                                                        },
                                                        {
                                                            extend: 'print',
                                                            exportOptions: {
                                                                columns: [1, 0, 3]
                                                            }
                                                        }
                                                    ],
                                                    "columnDefs": [
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
                                                            "targets": [3],
                                                            "visible": false,
                                                            "searchable": false
                                                        },
                                                        {
                                                            "targets": [4],
                                                            "visible": true,
                                                            "searchable": false
                                                        }
                                                    ]
                                                });
                                                $('#selected').DataTable().column(3).visible(false);
                                                $('#selected').DataTable().column(1).visible(false);
                                                $('#selected').on('page.dt', function () {
                                                    updateLabels();
                                                    $('#selected').dataTable().fnAdjustColumnSizing(false);
                                                    $('#selected').DataTable().draw(false);
                                                });
                                            });
                                        </script>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane active" id="disp">
                            <div class="row-fluid" style="padding:0;">
                                <div class="col-md-12" style="padding:0;">
                                    <a href="#" onClick="clearAllDisplayed();" class="btn btn-xs btn-warning"
                                       style="float:left;"><span style="border:none;padding-left:0px;padding-right:0px;"
                                                                 class="glyphicon glyphicon-trash"></span> Clear all</a>
                                    <a href="#" onClick="copyUrlToClipboard();" class="btn btn-xs btn-success"
                                       style="float:right;"><span
                                            style="border:none;padding-left:0px;padding-right:0px;"
                                            class="glyphicon glyphicon-copy"></span> Copy URL</a>
                                    <h4>
                                        <center>Currently Displayed</center>
                                    </h4>
                                </div>
                                <div class="col-md-12" style="padding:0;" id="dispTable">
                                    <div class="table-responsive" id="dispContent">
                                        <table id="displayed" class="display compact" cellspacing="0">
                                            <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>#</th>
                                                <th>Controls</th>
                                                <th>Type</th>
                                                <th>Image</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <th><img src="/images/tools/ajax-loader.gif" alt="loading..."/></th>
                                                <th>-</th>
                                                <th><img src="/images/tools/ajax-loader.gif" alt="loading..."/></th>
                                                <th><img src="/images/tools/ajax-loader.gif" alt="loading..."/></th>
                                                <th><img src="/images/tools/ajax-loader.gif" alt="loading..."/></th>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <script>
                                            $(document).ready(function () {
                                                loadRightMenuDisplayed();
                                                updateLabels();
                                                window.setInterval(function () {
                                                    if ($.fn.dataTable == undefined) {
                                                        console.log('Reloading on watchdog failure...');
                                                        location.reload();
                                                    } else {
                                                        if ($.fn.dataTable.isDataTable('#displayed')) {
                                                            loadRightMenuDisplayed();
                                                            // $('#displayed').DataTable().column( 0 ).visible( false );
                                                            // $('#displayed').dataTable().fnAdjustColumnSizing();
                                                            if ($('#displayed_filter > label') && $('#displayed_filter > label').html() && $('#displayed_filter > label').html().indexOf('Search:') > -1) {
                                                                $('#displayed_filter > label').html($('#displayed_filter > label').html().replace('Search:', 'Filter:'));
                                                            }
                                                            if ($('#selected_filter > label') && $('#selected_filter > label').html() && $('#selected_filter > label').html().indexOf('Search:') > -1) {
                                                                $('#selected_filter > label').html($('#selected_filter > label').html().replace('Search:', 'Filter:'));
                                                            }
                                                        }
                                                    }
                                                    if (backgroundLoaded < 99) {
                                                        $("#labelBlock").text('Loading slices in background for faster access...');
                                                        countBackground();
                                                    } else {
                                                        $("#labelBlock").text('Click to select or double click to toggle anatomy:');
                                                    }
                                                }, 10000);
                                                loadRightMenuDisplayed();
                                                if ($('#displayed_filter > label') && $('#displayed_filter > label').html() && $('#displayed_filter > label').html().indexOf('Search:') > -1) {
                                                    $('#displayed_filter > label').html($('#displayed_filter > label').html().replace('Search:', 'Filter:'));
                                                }
                                            });
                                        </script>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane" id="anato">
                            <div class="row-fluid" style="padding:0;">
                                <div class="col-sm-12">
                                    <h4 style="display: inline-block;">Neuroanatomy </h4>
                                    <div class="btn-group">
                                        <button class
                                        "btn btn-default btn-xs" onClick="addAllDomains();" title="Add all available
                                        anatomy to the stack" data-toggle="tooltip" data-placement="top"><span
                                            class="glyphicon glyphicon-plus"></span> Add All</button>
                                        <button class
                                        "btn btn-default btn-xs" onClick="removeAllDomains();" title="Remove all
                                        available anatomy from the stack" data-toggle="tooltip"
                                        data-placement="top"><span class="glyphicon glyphicon-minus"></span> Remove
                                        All</button>
                                        <button class
                                        "btn btn-default btn-xs" onClick="expandTree();" title="expand tree"
                                        data-toggle="tooltip" data-placement="top"><span
                                            class="glyphicon glyphicon-resize-full"></span> Expand Tree</button>
                                        <button class
                                        "btn btn-default btn-xs" onClick="collapseTree();" title="collapse tree"
                                        data-toggle="tooltip" data-placement="top"><span
                                            class="glyphicon glyphicon-resize-small"></span> Collapse Tree</button>
                                    </div>
                                </div>
                                <div class="clearfix visible-sm-block"></div>
                                <div class="col-md-12" id="anatoContent" style="padding:0;"></div>
                            </div>
                        </div>
                        <div class="tab-pane" id="queryBuild">
                            <div class="row-fluid row-centered" style="padding:0;">
                                <div class="col-md-12 col-centered">
                                    <h4>Your Query</h4>
                                </div>
                                <div id="queryText" class="col-md-12 col-centered" style="padding:0;">
                                    <iframe id="query_builder" name="query_builder" src="/do/query_builder.html"
                                            id="query_builder" style="width:100%;height:400px" FRAMEBORDER="0"></iframe>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane" id="min">
                        </div>
                    </div><!-- tab content -->
                </div><!-- end of container -->
            </div>
        </div>
    </div>

    <div class="col-md-6">

        <div id="details">
            <div id="annotation" class="well" style="padding-top: 2px;">
                <a name="details"></a>
                <div id="anatomyDetails">
                    <!-- <h2 class="panel_header">Annotation for Selected Node</h2> -->
                    Click anywhere on the stack viewer or use the search in the header or the Anatomy menu tab to select
                    an anatomy term.<br/><br/>
                    Information for the selected anatomical term will be displayed here, with further query options
                    visible after selection.
                    <script>
                        $(document).ready(function () {
                            if (parent.$('body').data('current')) {
                                var selected = parent.$("body").data(parent.$("body").data("current").template).selected;
                                var topLayer = Object.keys(selected).length - 1;
                                var id = parent.$("body").data(parent.$("body").data("current").template).selected[topLayer].id;
                                openFullDetails(id);
                            } else {
                                window.setTimeout(function () {
                                    if (parent.$('body').data('current')) {
                                        var selected = parent.$("body").data(parent.$("body").data("current").template).selected;
                                        var topLayer = Object.keys(selected).length - 1;
                                        var id = parent.$("body").data(parent.$("body").data("current").template).selected[topLayer].id;
                                        if (id.indexOf('00000') < 0 && id.indexOf('VFBd_') < 0) {
                                            openFullDetails(id);
                                        }
                                    }
                                }, 5000);
                            }
                        });
                    </script>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="content-fluid" id="footer">
    <jsp:include page="/jsp/includes/homeFoot.jsp"/>
