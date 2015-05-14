	<!-- Opening tag is in homeHead.jsp -->
 	</div><!-- contentwrapper -->
	<jsp:include page="/jsp/includes/bits/cellar.jsp"/>

   <!-- START lazy image loading -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min.js"></script>
   <script>
   window.setInterval(function(){
     $("img.lazy").lazyload({
       skip_invisible : true
     });
   }, 10000);
   </script>
   <!-- END lazy image loading -->
   </body>

</html>
