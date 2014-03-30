	<div id="cellar">
	  | <a href="/site/vfb_site/sitemap.htm">Sitemap</a> |
	  <a href="/">Virtual Fly Brain</a> |
	  <script>mail2("support","virtualflybrain",1,"","Email us")</script> |
	  <a href="/site/vfb_site/privacy_cookies.htm">Privacy and Cookies</a> |
	  <!--<a href="https://github.com/VirtualFlyBrain/VFB/issues/new" target="_blank">Site Feedback</a> |-->
	</div>

	
	<br />
	
	<!-- BEGIN feedback tab code -->
    <c:if test="${not pageContext.request.requestURI.contains('/index')}">
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js" type="text/javascript">jQuery.noConflict(true);</script>
		<script src="/thirdParty/tabSlideOut/js/jquery.tabSlideOut.v1.3.js"></script>
		 
			 <script>
			 $(function(){
				 $('.slide-out-feedback-div').tabSlideOut({
					 tabHandle: '.handle',                              //class of the element that will be your tab
					 pathToTabImage: '/thirdParty/tabSlideOut/images/feedback_tab.gif',          //path to the image for the tab (optionaly can be set using css)
					 imageHeight: '167px',                               //height of tab image
					 imageWidth: '32px',                               //width of tab image    
					 tabLocation: 'left',                               //side of screen where tab lives, top, right, bottom, or left
					 speed: 300,                                        //speed of animation
					 action: 'click',                                   //options: 'click' or 'hover', action to trigger animation
					 topPos: '200px',                                   //position from the top
					 fixedPosition: false                               //options: true makes it stick(fixed position) on scroll
				 });
			 });

			 </script>
		 
			 <style type="text/css" media="screen">
	
				.slide-out-feedback-div {
				   padding: 20px;
					width: 250px;
					background: #f2f2f2;
					border: #29216d 2px solid;
				}
	
			</style>

		<div class="slide-out-feedback-div">
			<a class="handle" href="/site/vfb_site/about_us.htm">Content</a>
			<h3>Feedback</h3>
		
			<script>var theURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;</script>
			<p>We really appreciate any feedback you could give us.</p>
			<p>You can simply <b>
			<script>
			var theURL = window.location.pathname;
			mail2("support","virtualflybrain",1,"?subject=Feedback about " + theURL,"email us")
			</script></b> with details.</p>
		
			<p>Alternatively, as VFB is an opensource project,   
			you can engage directly with our developer community on GitHub 
			[<a href="https://github.com/VirtualFlyBrain/VFB" target="_new">VirtualFlyBrain/VFB</a>].</p> 
			<p>You can easily raise a new issue by clicking   
			<a href="https://github.com/VirtualFlyBrain/VFB/issues/new" target="_new" 
			alt="https://github.com/VirtualFlyBrain/VFB/issues/new">here</a>.
			</p>
			<p> This could simply be a question or a new feature request, but if you have found a bug we missed please include 
			the page address and your browsers details to help us resolve any issue as quickly as possible.</p>
			<br />
			<p>Thank you for your involvement.</p>
		</div>
		<!-- END feedback tab code -->
		<!-- BEGIN version display -->
		<div id="VFBversion" style="position:relative; left: 0; bottom: 0; font-size: xx-small;">
			<jsp:include page="/branch" />- <jsp:include page="/revision" /> [ <jsp:include page="/flybase" />]
		</div>
	</c:if>
	<!-- END version display -->