	<script src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script src="/jsp/feedback/feedback.js"></script>
    <link rel="stylesheet" href="/jsp/feedback/feedback.min.css" />
    <script type="text/javascript">
        $.feedback({
            ajaxURL: 'http://www.virtualflybrain.org/feedback',
            html2canvasURL: '/jsp/feedback/html2canvas.js'
            postBrowserInfo: true
        });
    </script>
	<div id="cellar">
	  | <a href="/site/vfb_site/sitemap.htm">Sitemap</a> |
	  <a href="/">Virtual Fly Brain</a> |
	  <script>mail2("support","virtualflybrain",1,"","Contact us")</script> |
	  <a href="/site/vfb_site/privacy_cookies.htm">Privacy and Cookies</a> |
	  <a href="https://github.com/VirtualFlyBrain/VFB/issues/new" target="_blank">Site Feedback</a> |
	  <jsp:include page="/jsp/includes/js/ga.jsp" />
	</div>
