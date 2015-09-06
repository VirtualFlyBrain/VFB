	<!-- Opening tag is in homeHead.jsp -->
 	</div><!-- contentwrapper -->
	<jsp:include page="/jsp/includes/bits/cellar.jsp"/>
   <!-- START lazy image loading -->
   <script src="//cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js"></script>
   <script>
     $(window).scroll(function() {
       $("img.lazy").lazyload({
         skip_invisible: false,
         threshold: 2000
       });
     });
     $("div.carousel").on('slide.bs.carousel', function() {
       window.setTimeout(function(){
         $("img.lazy").lazyload({
           skip_invisible: false,
           threshold: 2000
         });
       }, 100);
     });
     $(window).click(function() {
       window.setTimeout(function(){
         $("img.lazy").lazyload({
           skip_invisible: false,
           threshold: 2000
         });
       }, 10);
     });
     $(document).ready( function () {
       $("img.lazy").lazyload({
         skip_invisible: false,
         threshold: 2000
       });
       window.setInterval(function(){
         $("img.lazy").lazyload({
           skip_invisible: false,
           threshold: 2000
         });
       }, 5000);
       window.setTimeout(function(){
         $("img.lazy").lazyload({
           skip_invisible: false,
           threshold: 2000
         });
       }, 200);
     });
   </script>
   <!-- END lazy image loading -->
   </body>
</html>
