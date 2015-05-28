	<!-- Opening tag is in homeHead.jsp -->
 	</div><!-- contentwrapper -->
	<jsp:include page="/jsp/includes/bits/cellar.jsp"/>

   <!-- START lazy image loading -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js"></script>
   <script>
     $(window).scroll(function() {
       $("img.lazy").lazyload();
     });
     $("div.carousel").on('slide.bs.carousel', function() {
       window.setInterval(function(){
         $("img.lazy").lazyload({
           skip_invisible: false,
           threshold: 200,
           effect: "fadeIn"
         });
       }, 50);
     });
     $(window).click(function() {
       window.setInterval(function(){
         $("img.lazy").lazyload({
           skip_invisible: false,
           threshold: 200,
           effect: "fadeIn"
         });
       }, 10);
     });
     $(document).ready( function () {
       $("img.lazy").lazyload({
         skip_invisible: false,
         threshold: 200
       });
     });
   </script>
   <!-- END lazy image loading -->
   </body>

</html>
