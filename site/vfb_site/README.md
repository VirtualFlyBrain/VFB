##Adding a new page

To create a new main site page simply create a new file in this folder and add the following template code:

```html
<jsp:include page="/jsp/includes/homeHead.jsp">
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|My Page@" />
	<jsp:param name="css" value="/css/vfb/utils/table.css" /> <!-- include all required css files -->
	<jsp:param name="title" value="My Page" />
</jsp:include>

<div class="row">

	<div class="col-md-9">

	<!-- START - editable content -->

		<h2>Title</h2>

			<h3>Sub title</h3>

			<p>
				Text
			</p>
			<p>
				Next pargraph of text
			</p>


	<!-- END - editable content -->

	</div> <!-- col -->

	<div class="col-md-3">
		<jsp:include page="/jsp/includes/bits/homeRight.jsp" />
	</div>
</div>
<jsp:include page="/jsp/includes/homeFoot.jsp" />
```

As well as adding your content between the editable content markers remember to add your pages name in the navpath for the header:

e.g. 'My Page' as in previous example:
```html
<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|My Page@" />
```
and the page title set here:
```html
<jsp:param name="title" value="My Page" />
```

Once your happy with your page you can either ask someone to add it to the menu structure or if your confident enough to do so you can add it yourself.

To add your page to the header edit /jsp/includes/bits/head.jsp

Note: This contains the header menu for all pages so be considerate.


The menus is this bit:
```html
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
					<li><a href="/site/stacks/">Anatomy/Neuron&nbsp;Finder</a></li>
					<!-- li><a href="/site/vfb_site/inProgress.htm" onclick="alert('We are sorry. This feature development is in progress'); return false">Upload Your Stack</a></li>
					<li><a href="/site/vfb_site/inProgress.htm" onclick="alert('We are sorry. This feature development is in progress'); return false">Annotation Tool</a></li>
					<li><a href="/site/vfb_site/inProgress.htm" onclick="alert('We are sorry. This feature development is in progress'); return false">Software Downloads</a></li-->
					<li><a href="/site/tools/protected/index.htm">Protected Area</a></li>
				</ul>
			</li>
			<li><a class="trigger" href="#">Stacks</a>
				<ul>
					<li><a href="/site/stacks/index.htm">Adult Brain Stack</a></li>
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
```

The tabs should help you tie up the opening and closing tags. Spend time studying the menu stucture against what appears on the site and it should make sense.

###examples:

To add 'My Page' under the 'Stacks' menu header simply add `<li><a href="/site/vfb_site/my_page.htm">My Page</a></li>` here:
```html
			<li><a class="trigger" href="#">Stacks</a>
				<ul>
				  	--------- HERE ---------
					<li><a href="/site/stacks/index.htm">Adult Brain Stack</a></li>
					--------- OR HERE ---------
				</ul>
			</li>
```

If you want to add it as a new menu item on it's own then you can simple add the same code for example here:
```html
      			<li><a class="trigger" href="#">Stacks</a>
				<ul>
					<li><a href="/site/stacks/index.htm">Adult Brain Stack</a></li>
				</ul>
			</li>
			--------- HERE ---------
			<li><a class="trigger" href="#">Downloads</a>
				<ul>
					<li><a href="/site/vfb_site/template_files_downloads.htm">Template data</a></li>
					<li><a href="/site/vfb_site/image_data_downloads.htm">Image data</a></li>
					<li><a href="/site/vfb_site/supp_files_downloads.htm">Support files</a></li>
				</ul>
			</li>
```

Any problems feel free to raise an <a href="https://github.com/VirtualFlyBrain/VFB/issues" target="_blank">issue</a> with a question.
