<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="headAtt" scope="session" value="true" />

<c:set var="currURL" scope="session"><%=request.getRequestURL().toString().split(request.getServerName().toString())[1]%></c:set>
<c:set var="helpURL" value="${(empty param.helpURL)?'./help.htm':param.helpURL}" />
 	<div id="head_wrapper">

 		<table style="width:100%">
 		<tr>
 		<td style="border-right:1px solid gray;width:178px">
 			<c:if test="${!empty param.res}">
 				<c:set var="resolution" value="?res=${param.res}" scope="session"/>
 			</c:if>
  			<a href="/site/vfb_site/home.htm" title="VFB Home">
  				<img id="logo" src= "/images/vfb/flyBrain.gif" alt="Virtual Fly Brain"/>
  			</a>
  		</td>
  		<td style="padding-left:2px;">
  			<c:set var="path"><%=request.getRequestURL()%></c:set>
  			<%--c:if test="${fncurrURL!='/' }" --%>
  				<a class="help" href="${helpURL}" style="top:-10px" title="Quick help" target="_blank">&nbsp;Help</a>
  				<a class="help youtube" href="http://www.youtube.com/playlist?list=PL8E3BDD1BA565B4FD" target="_new" style="top:-10px" title="Watch VFB tutorial videos">Tutorial Videos</a>
			<%--/c:if--%>
			<c:set var="title" value="&nbsp;${param.title}" />
  			<h1 id="page_header">
  				<c:choose>
  					<c:when test="${fn:length(param.title)>35}">
  						<a href="/site/vfb_site/overview.htm">VFB:</a>${(empty param.title)?"":title}
  					</c:when>
  					<c:otherwise>
  						<a href="/site/vfb_site/overview.htm">Virtual Fly Brain:</a>${(empty param.title)?"":title}
  					</c:otherwise>
  				</c:choose>
  			</h1>
  			<div id="breadcrumb" >
			<c:if test="${!empty param.navpath}">
				<c:forEach items="${fn:split(param.navpath, '|')}" var="curr" varStatus="status">
					<c:set var="currLinks" value="${fn:split(curr, '@')}" />
					<c:if test="${! status.first}">></c:if>
					<c:if test="${! status.last}">
						<c:if test="${currLinks[1]!='#'}">
							<a href="${currLinks[1]}">${currLinks[0]}</a>
						</c:if>
						<c:if test="${currLinks[1]=='#'}">
							${currLinks[0]}
						</c:if>
					</c:if>
					<c:if test="${status.last}">
						<b>${currLinks[0]}</b>
					</c:if>
				</c:forEach>
			</c:if>
  			</div>
  		</div><!-- header -->

		<div id="menuwrapper"
			style="z-index: 100; position: relative; top: 18px; height: 26px;">
		<ul id="p7menubar">

			<li><a class="trigger" href="/site/vfb_site/home.htm">The VFB Site</a>
				<ul>
					<li><a href="/site/vfb_site/home.htm">Home</a></li>
					<li><a href="/site/vfb_site/overview.htm">Overview</a></li>
					<li><a href="/site/vfb_site/features.htm">Features</a></li>
					<li><a href="/site/vfb_site/tutorial.htm">Tutorials</a></li>
					<li><a href="/site/vfb_site/usefulLinks.htm">Useful Links</a></li>
					<li><a href="/site/vfb_site/releases.htm">Releases</a></li>
					<li><a href="/site/vfb_site/sitemap.htm">Sitemap</a></li>
					<li><a href="/site/vfb_site/privacy_cookies.htm">Privacy and Cookies</a></li>
				</ul>
			</li>
			<li><a class="trigger" href="#">Tools</a>
				<ul>
					<li><a href="/site/tools/query_builder/">Query Builder</a></li>
					<!-- li><a href="/site/tools/neuron_finder/">Neuron Finder</a></li-->
					<li><a href="/site/tools/anatomy_finder/">Anatomy/Neuron&nbsp;Finder</a></li>
					<!-- li><a href="/site/vfb_site/inProgress.htm" onclick="alert('We are sorry. This feature development is in progress'); return false">Upload Your Stack</a></li>
					<li><a href="/site/vfb_site/inProgress.htm" onclick="alert('We are sorry. This feature development is in progress'); return false">Annotation Tool</a></li>
					<li><a href="/site/vfb_site/inProgress.htm" onclick="alert('We are sorry. This feature development is in progress'); return false">Software Downloads</a></li-->
					<li><a href="/site/tools/protected/index.htm">Protected Area</a></li>
				</ul>
			</li>
			<li><a class="trigger" href="#">Stacks</a>
				<ul>
					<li><a href="/site/stacks/index.htm">adult brain - Janelia</a></li>
					<li><a href="/site/stacks/halfmain.htm">half brain - BrainName</a></li>
				</ul>
			</li>
			<li><a class="trigger" href="#">Downloads</a>
				<ul>
					<li><a href="/site/vfb_site/template_files_downloads.htm">Template data</a></li>
					<li><a href="/site/vfb_site/image_data_downloads.htm">Image data</a></li>
					<li><a href="/site/vfb_site/supp_files_downloads.htm">Support files</a></li>
				</ul>
			</li>
			<li><a class="trigger" href="/site/vfb_site/about_us.htm">About Us</a>
				<ul>
					<li><script>mail2("support","virtualflybrain",1,"","Email us")</script></li>
					<li><a href="/site/vfb_site/about_us.htm">About Us</a></li>
				</ul>
			</li>
			<li>
				<script>
					var theURL = encodeURIComponent(window.location);
				</script>
				<a href="/site/vfb_site/Feedback.htm" onclick="location.href=this.href+'?url='+theURL;return false;">Feedback</a>
			</li>
		</ul>
		<a href="/do/composite_view.html?action=edit" class="recent_query_link" title="View/Edit composite">Edit current composite view</a>
		<br class="clearit">
		</div>
		</td>
			</div><!-- header -->

		</td>
		</tr>
		</table>
	  	</div> <!-- head_wrapper -->
    <div style="clear:both;"></div>
