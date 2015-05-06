<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">

<!-- Optional theme -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">

<!-- text search and help etc -->
<link href="/css/vfb/utils/utils.css" rel="stylesheet">
<script type="text/javascript" src="/javascript/vfb/mailEncoder.js" ></script>
<script type="text/javascript" src="/javascript/vfb/utils.js" ></script>
<link rel="stylesheet" media="all" type="text/css" href="/css/tree/autocomplete.css">
<script type="text/javascript" src="/javascript/thirdParty/Meio.Autocomplete.js" ></script>
<script type="text/javascript" src="/javascript/thirdParty/mootools-core-1.3.2.js"></script>
<script type="text/javascript" src="/javascript/thirdParty/mootools-more-1.3.2.1.js"></script>
<script type="text/javascript">
window.addEvent('domready', createAutocomplete);
</script>
<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
<![endif]-->

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>

<script>
$scope.isActive = function (viewLocation) {
     var active = (viewLocation === $location.url());
     return active;
};
</script>

<c:set var="headAtt" scope="session" value="true" />

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
	      <a class="navbar-brand" href="/site/vfb_site/home.htm">VirtualFlyBrain.org</a>
	    </div>
	    <div id="navbar-collapse-1" class="collapse navbar-collapse">
	      <ul class="nav navbar-nav">
	        <li class="dropdown">
	          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"> About <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	  					<li ng-class="{ active: isActive('/site/vfb_site/home.htm') }"><a href="/site/vfb_site/home.htm">Homepage</a></li>
	  					<li ng-class="{ active: isActive('/site/vfb_site/features.htm') }"><a href="/site/vfb_site/features.htm"></a></li>
	  					<li><a href="/site/vfb_site/tutorial.htm">Tutorials</a></li>
	  					<li><a href="/site/vfb_site/usefulLinks.htm">Useful Links</a></li>
	  					<li><a href="/site/vfb_site/releases.htm">Releases</a></li>
	  					<li><a href="/site/vfb_site/sitemap.htm">Sitemap</a></li>
	  					<li><a href="/site/vfb_site/privacy_cookies.htm">Privacy and Cookies</a></li>
	            <li><script>mail2("support","virtualflybrain",1,"","Email us")</script></li>
	  					<li><a href="/site/vfb_site/about_us.htm">About Us</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Tools <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	            <li><a href="/site/tools/query_builder/">Query Builder</a></li>
	            <li><a href="/site/tools/anatomy_finder/">Anatomy/Neuron&nbsp;Finder</a></li>
	            <li><a href="http://jefferislab.org/si/nblast/">NBLAST</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Stacks <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	            <li><a href="/site/stacks/index.htm">adult brain - Janelia</a></li>
	            <li><a href="/site/stacks/halfmain.htm">half brain - BrainName</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Downloads <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	            <li><a href="/site/vfb_site/template_files_downloads.htm">Template data</a></li>
	            <li><a href="/site/vfb_site/image_data_downloads.htm">Image data</a></li>
	            <li><a href="/site/vfb_site/supp_files_downloads.htm">Support files</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Help <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	            <li><a href="${helpURL}" target="_new">Help for the current page</a></li>
	            <li><a href="http://www.youtube.com/playlist?list=PL8E3BDD1BA565B4FD" target="_new">Tutorial Videos</a></li>
	          </ul>
	        </li>
	      </ul>
	      <ul class="nav navbar-nav navbar-right">
	        <li>
	  				<script>
	  					var theURL = encodeURIComponent(window.location);
	  				</script>
	          <a href="/site/vfb_site/Feedback.htm" onclick="location.href=this.href+'?url='+theURL;return false;">Report an issue</a>
	        </li>
	        <li>
	          <a href="/do/composite_view.html?action=edit" class="recent_query_link" title="View/Edit composite">Edit current composite view</a>
	        </li>
	      </ul>
	    </div><!--/.nav-collapse -->
	  </div>
	</nav><!-- header -->

