	<div class="row-fluid visible-desktop" align="center">

		<div class="span6" style="min-width:240px" align="center">

			<div class="well-white"> <!-- new news well-->

				<section class="shortcuts transparent" id="news-container" style="overflow:hidden">
			   <div id="news">
			      <h3 class="pane-title">
			         <a href="http://vfbblog.inf.ed.ac.uk/">News</a>
			         <div title="News Feed" class="icon-right socialmedia lastshortcut" onclick="window.open('http://vfbblog.inf.ed.ac.uk/?feed=rss2', 'new_window')"><img src="/images/vfb/utils/rss.png" height="20"/></div>
			         <div title="Facebook Logo" class="icon-right socialmedia" onclick="window.open('https://www.facebook.com/pages/Virtual-Fly-Brain/131151036987118','new_window')"><img src="/images/vfb/utils/facebook.logo.png" height="20"/></div>
			         <div title="Twitter Logo" class="icon-right socialmedia" onclick="window.open('http://twitter.com/virtualflybrain', 'new_window')"><img src="/images/vfb/utils/TwitterLogo_55acee.png" height="20"/></div>

			      </h3>
			      <div id="newsection">
			         <ul>
			            <li>
			               <p><a href="http://vfbblog.inf.ed.ac.uk/?p=809">Work with us</a>
						<br/>Job opportunity at VFB
			               </p>
			            </li>
			            <li>
			               <p><a href="http://vfbblog.inf.ed.ac.uk/?p=782">New adult brain stack</a><br/>
			                  Now hosting tricolour adult brain stack from Ito 2014
			               </p>
			            </li>
			            <li>
			               <p><a href="http://vfbblog.inf.ed.ac.uk/?p=774">We're looking for fedback</a><br/>
			                  How do you use VFB?
			               </p>
			            </li>
			         </ul>
			      </div>
			      <br clear="all"/>
						<a href="http://vfbblog.inf.ed.ac.uk/" target="_blank" class="btn btn-info btn-xs outline" role="button" style="text-align:left">More &raquo</a>
			   	</div>
				</section>
			</div><!-- end of news well-->
		</div>

		<div class="span3" style="min-width:240px">
			<div class="well-white"> 
					<jsp:include page="/jsp/includes/bits/wpRssReader.jsp" />
			</div>
		</div>

	</div> <!--  row -->
