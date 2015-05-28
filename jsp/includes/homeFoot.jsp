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
         $("img.lazy").lazyload();
       }, 100);
     });
     window.setInterval(function(){
       $("img.lazy").lazyload();
     }, 1000);
   </script>
   <!-- END lazy image loading -->
   </body>

</html>
