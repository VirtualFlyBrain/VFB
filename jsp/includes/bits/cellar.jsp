<%@ page trimDirectiveWhitespaces="true" %>
	<br/><br/><br/><br/><br/>
	<div class="row" align="center">
	  | <a href="/site/vfb_site/sitemap.htm">Sitemap</a> |
	  <a href="/">Virtual Fly Brain</a> |
	  <span id="EmailFooter1"></span><script>mail3("support","virtualflybrain",1,"","Email us","EmailFooter1")</script> |
	  <a href="/site/vfb_site/privacy_cookies.htm">Privacy and Cookies</a> |
	  <!--<a href="https://github.com/VirtualFlyBrain/VFB/issues/new" target="_blank">Site Feedback</a> |-->
	</div>
	<br />
		<!-- BEGIN version display -->
		<div id="VFBversion" style="position:relative; left: 0; bottom: 0; font-size: xx-small;">
			<a href="https://github.com/VirtualFlyBrain/VFB/tree/<jsp:include page="/branch" />" target="_blank" title="Current GitHub code repository branch and revision" >
				<jsp:include page="/branch" />- <jsp:include page="/revision" /></a>
				<span id="flybase" style="display:none;visibility:hidden;"><jsp:include page="/flybase" /></span>
				<script>
				$(document).ready( function () {
					if (store.enabled) {
						var flybase = String($('#flybase').text()).split(' ')[0];
						store.set('currentFlybaseVersion', flybase);
						$('#flybaseLink').attr('html', 'ftp://ftp.flybase.net/releases/' + flybase);
						$('#flybaseLink').text(flybase);
						$('#flybaseLinkRelease').attr('html', 'ftp://ftp.flybase.net/releases/' + flybase);
						$('#flybaseLinkRelease').text(flybase);
						$('#flybaseRelesedOn').text($('#flybase').text().replace(flybase + ' released on','Released by FlyBase on'));
					}
				});
				</script>
			[<a id="flybaseLink" href="ftp://ftp.flybase.net/releases/" title="Current FlyBase DataBase in use" target="_blank"><jsp:include page="/flybase" /></a>]
			[<a href="<jsp:include page="/owldate" />" target="_blank" title="Current VFB OWL ontology in use" > <jsp:include page="/owldate" /></a>]
			[<a href="<jsp:include page="/owlIndRev" />" target="_blank" title="Current VFB OWL individuals in use" > <jsp:include page="/owlIndRev" /></a>]
		</div>
		<!-- END version display -->
		<!-- Bootstrap core JavaScript
			================================================== -->
			<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
			<script src="/jsp/includes/js/ie10-viewport-bug-workaround.js"></script>
			<script src="/jsp/includes/js/offcanvas.js"></script>
