<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="/css/bootstrap-theme.min.css">

<!-- Custom styles for this template -->
<link href="/css/offcanvas.css" rel="stylesheet">
<!-- text search and help etc -->
<link href="/css/vfb/utils/utils.css" rel="stylesheet">
<script type="text/javascript" src="/javascript/vfb/mailEncoder.js"></script>
<script type="text/javascript" src="/javascript/vfb/utils.js"></script>

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
<script src="//oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
<script src="//oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->


<c:set var="headAtt" scope="session" value="true"/>

<c:set var="currDomain" scope="session"><%=request.getServerName().toString()%>
</c:set>
<c:set var="currURL"
       scope="session"><%=request.getRequestURL().toString().split(request.getServerName().toString())[1]%>
</c:set>
<c:set var="helpURL" value="${(empty param.helpURL)?'./help.htm':param.helpURL}"/>


<c:if test="${!empty param.res}">
    <c:set var="resolution" value="?res=${param.res}" scope="session"/>
</c:if>
<c:set var="path"><%=request.getRequestURL()%>
</c:set>
<c:set var="title" value="${param.title}"/>


<nav class="navbar navbar-default navbar-static-top" style="position:absolute;width:100%;top:0px;">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand hidden-xs hidden-sm" href="/site/vfb_site/home.htm">VirtualFlyBrain.org</a>
            <a class="navbar-brand" href="/site/vfb_site/home.htm"><img id="logo" src="/images/vfb/flyBrain.gif"
                                                                        style="max-height:100%;"
                                                                        alt="VirtualFlyBrain.org"></a>
        </div>
        <div id="navbar-collapse-1" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" role="button"
                       aria-expanded="false"> Site <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="/site/vfb_site/home.htm">Home</a></li>
                        <li><a href="/site/vfb_site/overview.htm">Overview</a></li>
                        <li><a href="/site/vfb_site/features.htm">Features</a></li>
                        <li><a href="/site/vfb_site/releases.htm">Releases</a></li>
                        <li><a href="/site/vfb_site/usefulLinks.htm">Useful Links</a></li>
                        <li><a href="/site/vfb_site/yourPaper.htm">Tell us about your data</a></li>
                        <li id="EmailHeader1">
                            <script>mail3("support", "virtualflybrain", 1, "", "Email us", "EmailHeader1")</script>
                        </li>
                        <li><a href="/site/vfb_site/about_us.htm">About us</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="http://tinyurl.com/jqdxh28" target="_blank">The Old Site</a></li>
                    </ul>
                </li>
                <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown"
                                        role="button" aria-expanded="false">Tools <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#searchtext" onclick="$('#searchtext').focus()">Search</a></li>
                        <li><a href="/site/stacks/index.htm?tab=query">Query Builder</a></li>
                        <li><a href="http://jefferislab.org/si/nblast/" target="_blank">NBLAST</a></li>
                        <li><a href="/site/vfb_site/registration.htm" target="_top">Image Registration</a></li>
                    </ul>
                </li>
                <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" id="stacksMenu"
                                        data-hover="dropdown" role="button" aria-expanded="false">Stacks <span
                        class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li id="openStackViewerOption"><a href="/site/stacks/index.htm">Open the Stack Viewer (<span
                                id="stackName"></span>)</a></li>
                        <li id="openVFBt_001"><a
                                onClick="forceStoreControl();addToStackData('VFBt_001');post('/site/stacks/index.htm',{'add':'VFBt_00100000'});">Open
                            the Janelia Adult Brain <span id="CountVFBt_001"
                                                          class="label label-warning label-as-badge"></span></a></li>
                        <li id="openVFBt_002"><a
                                onClick="forceStoreControl();addToStackData('VFBt_002');post('/site/stacks/index.htm',{'add':'VFBt_00200000'});">Open
                            the Ito Half Brain <span id="CountVFBt_002"
                                                     class="label label-warning label-as-badge"></span></a></li>
                        <li id="openVFBt_004"><a
                                onClick="forceStoreControl();addToStackData('VFBt_004');post('/site/stacks/index.htm',{'add':'VFBt_00400000'});">Open
                            the Ventral Nervous System <span id="CountVFBt_004"
                                                             class="label label-warning label-as-badge"></span></a></li>
                        <li id="openVFBt_003"><a
                                onClick="forceStoreControl();addToStackData('VFBt_003');post('/site/stacks/index.htm',{'add':'VFBt_00300000'});">Open
                            the Larval Brain <span id="CountVFBt_003" class="label label-warning label-as-badge"></span></a>
                        </li>
                        <li id="clearAllOption"><a onClick="forceStoreControl();clearAllData();">Clear <span
                                id="viewer2DVal" class="label label-success label-as-badge">*</span> items</a></li>
                        <li id="clearEverythingOption"><a onClick="forceStoreControl();clearAbsolutlyAllData();">Clear
                            All <span id="viewerTotalItems" class="label label-warning label-as-badge">*</span>
                            items</a></li>
                        <li id="menuOpen3D"><a id="menuOpen3Dlink"
                                               href="http://129.215.164.244:8084/org.geppetto.frontend/geppetto?load_project_from_url=http://www.virtualflybrain.org/do/geppettoJson.json"
                                               target="_blank">Open <span id="viewer2DVal"
                                                                          class="label label-success label-as-badge">*</span>
                            items in 3D viewer</a></li>
                        <li id="sepAnatomy" role="separator" class="divider"></li>
                        <li id="menuAddAnatomy">
                            <a onClick="forceStoreControl();addAllDomains();">
                                Add (colour) all neuroanatomy
                            </a>
                        </li>
                        <li id="menuRemoveAnatomy">
                            <a onClick="forceStoreControl();removeAllDomains();">
                                Remove all neuroanatomy
                            </a>
                        </li>
                    </ul>
                </li>
                <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown"
                                        role="button" aria-expanded="false">Downloads <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="/site/vfb_site/template_files_downloads.htm">Template data</a></li>
                        <li><a href="/site/vfb_site/image_data_downloads.htm">Image data</a></li>
                        <li><a href="/site/vfb_site/supp_files_downloads.htm">Support files</a></li>
                    </ul>
                </li>
                <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown"
                                        role="button" aria-expanded="false">Help <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="/site/vfb_site/faq.htm">FAQ</a></li>
                        <li><a href="/site/vfb_site/tutorial.htm">Tutorial Videos</a></li>
                        <li><a href="https://groups.google.com/forum/#!forum/vfb-suport" target="_blank">Support
                            Forum</a></li>
                        <li><a id="issueLinkM" href="/site/vfb_site/Feedback.htm"
                               onclick="ga('send', 'event', 'click', 'issue', theURL);" target="_blank">Report an
                            issue</a>
                        </li>
                    </ul>
                </li>
            </ul>
            <form class="navbar-form navbar-left" role="search">
                <div id="searchgroup" class="form-group">
                    <input id="searchtext" type="text" class="typeahead form-control" autocomplete="off"
                           placeholder="Search" aria-describedby="searchid"
                           title="Search for neuropil, neuron, lineage clone or tract">
                    <span class="input-group-addon" id="searchid" style="display: none;"></span>
                </div>
            </form>
            <ul class="nav navbar-nav navbar-right">
                <li>
                    <a class="bg-success" href="/site/stacks/index.htm"><span class="glyphicon glyphicon-film"></span>
                        <span id="stackName">Stack Viewer</span> <span id="viewer2DVal"
                                                                       class="label label-success label-as-badge">*</span></a>
                    <script>
                        updateStackCounter();
                    </script>
                </li>
                <li id="reportAnIssue">
                    <script>
                        var theURL = "";
                        $('body').ready(function () {
                            theURL = encodeURIComponent(window.location);
                            if (theURL.indexOf('site%2Fstacks%2Findex.htm') > -1 && theURL.indexOf('Feedback.htm') < 0) {
                                theURL = returnFullUrl();
                                window.setInterval(function () {
                                    theURL = returnFullUrl();
                                    $('#issueLink').attr('href', '/site/vfb_site/Feedback.htm?url=' + theURL);
                                    $('#issueLinkM').attr('href', '/site/vfb_site/Feedback.htm?url=' + theURL);
                                }, 30000);
                            }
                            $('#issueLink').attr('href', '/site/vfb_site/Feedback.htm?url=' + theURL);
                            $('#issueLinkM').attr('href', '/site/vfb_site/Feedback.htm?url=' + theURL);
                        });
                    </script>
                    <a id="issueLink" href="/site/vfb_site/Feedback.htm"
                       onclick="ga('send', 'event', 'click', 'issue', theURL);" target="_blank">Report an issue</a>
                </li>
            </ul>
        </div><!--/.nav-collapse -->
    </div>
</nav>
<!-- header -->

<!-- START Notices -->
<c:if test="${fn:contains(currDomain, 'inf.ed.ac.uk')}">
    <c:if test="${!fn:contains(currDomain, 'vfb-bocian')}">
        <div class="row" id="dev-warning" style="display: none;">
        </div>
    </c:if>
</c:if>

<div class="row" id="cookie-warning" style="display: none;">
</div>

<%-- <div id="alert_message" class="alert alert-warning" style="display: none;">
  <span class="close" data-dismiss="alert" aria-label="Close">&times;</span>
  <span><strong>!</strong> <span id="alert-message-text">All is well, nothing to see here.</span></span>
</div> --%>

<script>
    $(document).ready(function () {
        $('.nav .dropdown-menu li a').css('cursor', 'pointer');
    });
</script>
<!-- END Notices -->
