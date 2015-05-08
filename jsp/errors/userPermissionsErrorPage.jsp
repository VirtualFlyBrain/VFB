<jsp:include page="/jsp/includes/1ColHead.jsp">
	<jsp:param name="title" value="Oops! Something went wrong" />
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/features.htm|Tools@#|Error@ " />
</jsp:include>
 
<h2>${exception.customMsg}</h2>
 
</div>  

<jsp:include page="/jsp/includes/homeFoot.jsp" />
