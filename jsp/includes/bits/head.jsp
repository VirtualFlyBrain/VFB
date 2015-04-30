<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<script type="text/javascript" src="/javascript/vfb/mailEncoder.js" ></script>
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="/jsp/includes/js/bootstrap.min.js"></script>


<c:set var="headAtt" scope="session" value="true" />

<c:set var="currURL" scope="session"><%=request.getRequestURL().toString().split(request.getServerName().toString())[1]%></c:set>
<c:set var="helpURL" value="${(empty param.helpURL)?'./help.htm':param.helpURL}" />


<c:if test="${!empty param.res}">
	<c:set var="resolution" value="?res=${param.res}" scope="session"/>
</c:if>
<c:set var="path"><%=request.getRequestURL()%></c:set>
<c:set var="title" value="${param.title}" />


	<nav class="navbar navbar-default navbar-static-top">
	  <div class="container">
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
	          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" href="/site/vfb_site/home.htm">About <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	  					<li><a href="/site/vfb_site/home.htm">Homepage</a></li>
	  					<li><a href="/site/vfb_site/overview.htm">Overview</a></li>
	  					<li><a href="/site/vfb_site/features.htm">Features</a></li>
	  					<li><a href="/site/vfb_site/tutorial.htm">Tutorials</a></li>
	  					<li><a href="/site/vfb_site/usefulLinks.htm">Useful Links</a></li>
	  					<li><a href="/site/vfb_site/releases.htm">Releases</a></li>
	  					<li><a href="/site/vfb_site/sitemap.htm">Sitemap</a></li>
	  					<li><a href="/site/vfb_site/privacy_cookies.htm">Privacy and Cookies</a></li>
	            <li><script>mail2("support","virtualflybrain",1,"","Email us")</script></li>
	  					<li><a href="/site/vfb_site/about_us.htm">About Us</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" href="#">Tools <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	            <li><a href="/site/tools/query_builder/">Query Builder</a></li>
	            <li><a href="/site/tools/anatomy_finder/">Anatomy/Neuron&nbsp;Finder</a></li>
	            <li><a href="/site/tools/protected/index.htm">Protected Area</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" href="#">Stacks <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	            <li><a href="/site/stacks/index.htm">adult brain - Janelia</a></li>
	            <li><a href="/site/stacks/halfmain.htm">half brain - BrainName</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" href="#">Downloads <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	            <li><a href="/site/vfb_site/template_files_downloads.htm">Template data</a></li>
	            <li><a href="/site/vfb_site/image_data_downloads.htm">Image data</a></li>
	            <li><a href="/site/vfb_site/supp_files_downloads.htm">Support files</a></li>
	          </ul>
	        </li>
	        <li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false" href="${helpURL}" target="_new">Help <span class="caret"></span></a>
	          <ul class="dropdown-menu" role="menu">
	            <li><a href="${helpURL}" target="_new">Quick help</a></li>
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
