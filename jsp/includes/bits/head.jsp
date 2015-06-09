<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="/css/bootstrap-theme.min.css">

<!-- Custom styles for this template -->
<link href="/css/offcanvas.css" rel="stylesheet">
<!-- text search and help etc -->
<link href="/css/vfb/utils/utils.css" rel="stylesheet">
<script type="text/javascript" src="/javascript/vfb/mailEncoder.js" ></script>
<script type="text/javascript" src="/javascript/vfb/utils.js" ></script>


<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->


<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>

<c:set var="headAtt" scope="session" value="true" />

<c:set var="currDomain" scope="session"><%=request.getServerName().toString()%></c:set>
<c:set var="currURL" scope="session"><%=request.getRequestURL().toString().split(request.getServerName().toString())[1]%></c:set>
<c:set var="helpURL" value="${(empty param.helpURL)?'./help.htm':param.helpURL}" />


<c:if test="${!empty param.res}">
	<c:set var="resolution" value="?res=${param.res}" scope="session"/>
</c:if>
<c:set var="path"><%=request.getRequestURL()%></c:set>
<c:set var="title" value="${param.title}" />


	<nav class="navbar navbar-default navbar-static-top" style="position:absolute;width:100%;top:0px;">
	  <div class="container-fluid">
	    <div class="navbar-header">
	      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1">
	        <span class="sr-only">Toggle navigation</span>
	        <span class="icon-bar"></span>
	        <span class="icon-bar"></span>
	        <span class="icon-bar"></span>
	      </button>
	      <a class="navbar-brand hidden-xs" href="/site/vfb_site/home.htm">VirtualFlyBrain.org</a>
	      <a class="navbar-brand" href="/site/vfb_site/home.htm"><img id="logo" src="/images/vfb/flyBrain.gif" style="max-height:100%;" alt="VirtualFlyBrain.org" ></a>
	    </div>
	    <div id="navbar-collapse-1" class="collapse navbar-collapse">
	      <ul class="nav navbar-nav">
	      <li><a href="/site/vfb_site/home.htm">Home</a></li>
	        <li class="dropdown">
	          <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" role="button" aria-expanded="false"> About <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
				  		<li><a href="/site/vfb_site/features.htm">Features</a></li>
				  		<li><a href="/site/vfb_site/releases.htm">Releases</a></li>
				  		<li><a href="/site/vfb_site/usefulLinks.htm">Useful Links</a></li>
	    				<li><script>mail2("support","virtualflybrain",1,"","Email us")</script></li>
	  					<li><a href="/site/vfb_site/about_us.htm">About us</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" role="button" aria-expanded="false">Tools <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	          	<li><a href="/site/tools/anatomy_finder/">Anatomy/Neuron Finder</a></li>
	            <li><a href="/site/tools/query_builder/">Query Builder</a></li>
	            <li><a href="http://jefferislab.org/si/nblast/" target="_new">NBLAST</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" role="button" aria-expanded="false">Stacks <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	            <li><a href="/site/stacks/index.htm">adult brain - Janelia</a></li>
	            <li><a href="/site/stacks/halfmain.htm">half brain - BrainName</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" role="button" aria-expanded="false">Downloads <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	            <li><a href="/site/vfb_site/template_files_downloads.htm">Template data</a></li>
	            <li><a href="/site/vfb_site/image_data_downloads.htm">Image data</a></li>
	            <li><a href="/site/vfb_site/supp_files_downloads.htm">Support files</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" role="button" aria-expanded="false">Help <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	            <li><a href="${helpURL}" target="_new">Help for the current page</a></li>
	            <li><a href="/site/vfb_site/faq.htm">FAQ</a></li>
	            <li><a href="/site/vfb_site/tutorial.htm">Tutorials</a></li>
	            <li><a href="http://www.youtube.com/playlist?list=PL8E3BDD1BA565B4FD" target="_new">Tutorial Videos</a></li>
	          </ul>
	        </li>
	      </ul>
	      <ul class="nav navbar-nav navbar-right">
					<li id="pageLoading" >
						<a class="navbar-brand" href="#"><img class="" src="/javascript/ajax-solr/images/ajax-loader.gif" alt="loading..." style="max-height: 100%;"/></a>
					</li>
					<li>
						<a class="alert alert-success" href="/site/stacks/index.htm">Stack Viewer <span id="viewer2DVal" class="badge">*</span></a>
						<script>
							updateStackCounter();
						</script>
	        </li>
					<li>
			  		<script>
			  			var theURL = encodeURIComponent(window.location);
			  		</script>
	        	<a href="/site/vfb_site/Feedback.htm" onclick="location.href=this.href+'?url='+theURL;return false;">Report an issue</a>
	        </li>
	      </ul>
	    </div><!--/.nav-collapse -->
	  </div>
	</nav><!-- header -->

<!-- START Notices -->
	<c:if test="${fn:contains(currDomain, 'inf.ed.ac.uk')}">
		<c:if test="${!fn:contains(currDomain, 'vfb-bocian')}">
			<div class="row" id="dev-warning" style="display: none;">
					<div class="col-md-8 col-md-offset-2">
						<div class="alert alert-warning alert-dismissible" role="alert" id="warning-char">
							<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<center>
								<strong><span class="glyphicon glyphicon-warning-sign"></span></strong> This is a test server and not the official VFB site.
							</center>
						</div>
					</div>
			</div>
			<script>
				$(document).ready( function () {
					$('.alert.alert-warning.alert-dismissible').bind('closed.bs.alert', function () {
						$.cookie('dev-box', 'closed', { expires: 7, path: '/' });
					});
				});
			</script>
		</c:if>
	</c:if>

	<div class="row" id="cookie-warning" style="display: none;">
			<div class="col-md-8 col-md-offset-2">
				<div class="alert alert-info alert-dismissible" role="alert" id="info-char">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<center>
						<strong><span class="glyphicon glyphicon-info-sign"></span></strong> Just so you know this site uses cookies to track usage and preferences.
						By continuing to use our website, you agree to the use of cookies. <br>
						If you would like to know more about cookies and how to manage them please view our <a href="/site/vfb_site/privacy_cookies.htm">privacy and cookies</a> policy.
					</center>
				</div>
			</div>
	</div>

	<%-- <div id="alert_message" class="alert alert-warning" style="display: none;">
      <span class="close" data-dismiss="alert" aria-label="Close">&times;</span>
      <span><strong>!</strong> <span id="alert-message-text">All is well, nothing to see here.</span></span>
  </div> --%>

	<script>
		$(document).ready( function () {
			// $('#alert_message').hide();
			$('.alert.alert-info.alert-dismissible').bind('closed.bs.alert', function () {
				$.cookie('cookie-box', 'closed', { expires: 5*365, path: '/' });
			});
		});
	</script>
	<!-- END Notices -->
