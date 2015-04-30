	<div id="cellar">
	  | <a href="/site/vfb_site/sitemap.htm">Sitemap</a> |
	  <a href="/">Virtual Fly Brain</a> |
	  <script>mail2("support","virtualflybrain",1,"","Email us")</script> |
	  <a href="/site/vfb_site/privacy_cookies.htm">Privacy and Cookies</a> |
	  <!--<a href="https://github.com/VirtualFlyBrain/VFB/issues/new" target="_blank">Site Feedback</a> |-->
	</div>


	<br />


		<!-- BEGIN version display -->
		<div id="VFBversion" style="position:relative; left: 0; bottom: 0; font-size: xx-small;">
			<a href="https://github.com/VirtualFlyBrain/VFB/tree/<jsp:include page="/branch" />" target="_new" title="Current GitHub code repository branch and revision" >
				<jsp:include page="/branch" />- <jsp:include page="/revision" /></a>
			[<a href="ftp://ftp.flybase.net/releases/<jsp:include page="/flybase" />" target="_new" title="Current FlyBase DataBase in use" > <jsp:include page="/flybase" /></a>]
			[<a href="<jsp:include page="/owldate" />" target="_new" title="Current VFB OWL ontology in use" > <jsp:include page="/owldate" /></a>]
			[<a href="<jsp:include page="/owlIndRev" />" target="_new" title="Current VFB OWL individuals in use" > <jsp:include page="/owlIndRev" /></a>]
		</div>

		<!-- END version display -->

		<!-- Bootstrap core JavaScript
			================================================== -->
			<!-- Placed at the end of the document so the pages load faster -->
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
			<script src="/jsp/includes/js/bootstrap.min.js"></script>
			<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
			<script src="/jsp/includes/js/ie10-viewport-bug-workaround.js"></script>
			<script src="offcanvas.js"></script>
