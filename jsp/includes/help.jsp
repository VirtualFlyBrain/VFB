<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<jsp:include page="/jsp/includes/1ColHead.jsp">
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|Help@/ "/>
	<jsp:param name="title" value="${param.head}" />	
	<jsp:param name="css" value="/css/vfb/utils/help.css;" />
</jsp:include>

<!-- THE TEMPLATE CONTENT BOX HEADER -->
<div id="help_wrapper">
<div id="help_head_wrapper">
	<h1 id="help_header">${param.head}</h1>
   </div>
 </div>
  <div id="help_content">
	${param.content}
  </div>
</div>
  
<jsp:include page="/jsp/includes/homeFoot.jsp" />
