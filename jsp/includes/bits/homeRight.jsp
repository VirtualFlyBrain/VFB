	<div class="row-fluid visible-desktop" align="center">

		<div class="span2" style="min-width:240px" align="center">

			<div class="well">
				<jsp:include page="/jsp/includes/bits/wpRssReader.jsp" />
			</div>

			<div class="well">


				<!-- START Twitter code -->
				<div id="tw-root" style="margin-top:2px"></div>
				<div style="overflow:hidden; width:100%"
				<div class="t-page">
					<a class="twitter-timeline" href="https://twitter.com/virtualflybrain" data-widget-id="450466505088454656" data-theme="light" data-border-color="#C4E3F3" data-tweet-limit="3">
						Tweets by @virtualflybrain
					</a>
					<script>
						!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
							if(!d.getElementById(id)){
								js=d.createElement(s);
								js.id=id;
								js.src=p+"://platform.twitter.com/widgets.js";
								fjs.parentNode.insertBefore(js,fjs);
							}
						}(document,"script","twitter-wjs");
					</script>
				</div>
				<!-- END twitter code -->
				</div> <!-- border -->
			</div> <!-- well -->
			
			<div class="well-white"> <!-- new news well-->
			
			<section class="shortcuts transparent" id="news-container">
   <div id="news">
      <h3 class="pane-title">
         <a href=“#”>News</a>
         <div title="News Feed" style="overflow:hidden; width:100%" class="icon-right socialmedia lastshortcut" onclick="document.location=“http://vfbblog.inf.ed.ac.uk/“><img src="/images/vfb/utils/rss.png"/></div>
         <div title="Facebook Logo" class="icon-right socialmedia" onclick="document.location=“https://www.facebook.com/virtualflybrain"><img src="/images/vfb/utils/facebook.logo.png"/></div>
         <div title="Twitter Logo" class="icon-right socialmedia" onclick="document.location=“http://twitter.com/virtualflybrain”><img src="/images/vfb/utils/TwitterLogo_55acee.png"/></div>
         <div title="Blog Logo" class="icon-right socialmedia" onclick="document.location=“http://vfbblog.inf.ed.ac.uk/"><img src="/images/vfb/utils/plus.png"/></div>
      </h3>
      <div id="newsection">
         <ul>
            <li>
               <p><a href=“#”>Forthcoming changes</a>
			<br/>Planned changes for VFB
               </p>
            </li>
            <li>
               <p><a href=“#”>VFB item 1</a><br/>
                  This is new   
               </p>
            </li>
            <li>
               <p><a href=“#”>VFB item 1</a><br/>
                  This is new too
               </p>
            </li>
            <li>
               <p><a href=“#”>VFB item 1</a><br/>
                 And this
               </p>
            </li>
         </ul>
      </div>
      <br clear="all"/>
<a href=“#” data-icon=";" class="icon icon-generic newsArchiveLink">News archive</a>
   </div>
</section>


		</div><!-- end of new news well-->
			

		</div>

	</div> <!--  row -->
