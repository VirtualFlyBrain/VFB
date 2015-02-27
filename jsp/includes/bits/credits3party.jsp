<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<%@page import="org.springframework.web.context.*,org.springframework.web.context.support.*,uk.ac.ed.vfb.service.*, uk.ac.ed.vfb.model.*"%>
<%
//fOR SINGLE STACKS -FINDSTACK BY ID AND ADD TO THE VIEW
ServletContext servletContext = this.getServletContext();
WebApplicationContext wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
ThirdPartyBeanManager tpbm = (ThirdPartyBeanManager)wac.getBean("thirdPartyBeanManager");
try {
	ThirdPartyBean tpb = tpbm.getBeanForVfbId(request.getParameter("tpbid"));
	if (tpb==null) {
		tpb = tpbm.createThirdPartyBean(request.getParameter("tpbid"));
	}
	pageContext.setAttribute("tpb", tpb );
}
catch(Exception ex){/*tpb not found :-( */  }
//System.out.println("COMPOSITE:" + request.getSession().getAttribute("colours"));
%>
<script type="text/javascript">
var id = "${tpb.vfbId}";

function getMeta(id) {
	if ($('annotation_content')!=null){
		console.log("loading bean");
		$('annotation_content').load('/do/ont_bean.html?id='+ id);
	}
}

<c:if test="${!empty tpb || param.type!='COMPOSITE'}">
window.addEvent('load', function() {
	console.log("loading!");
	getMeta(id);
})
</c:if>

</script>
</head>
<body>
<jsp:include page="/jsp/includes/js/tag.jsp" />
<div style="position:absolute; bottom: 10px; height:auto; width:96%; font-size:.9em; padding:0 4px;" >
	<b>Stack actions:</b> <br/>
	<!-- Displaying single stack -->
	<c:if test="${(!empty tpb) && (param.type!='COMPOSITE')}">
		<a href="#" onclick="getMeta('${tpb.vfbId}');return false;">About <b>${tpb.name}</b></a><br/>
		<a href="/do/composite_view.html?id=${tpb.vfbId}&action=add" ><b>Add to composite view</b></a>
	</c:if>
	<!-- Displaying composite -->
	<c:if test="${param.type=='COMPOSITE'}">
	<c:forEach items="${composite.stacks}" var="curr" varStatus="status">
		<input type="text" style="background-color:${colours[status.index]}" class="colour_pick" name="colours" id="colour${status.index}"></input>
		<a href="#" onclick="getMeta('${curr.vfbId}');return false;">About <b>${curr.name}</b></a><br/>
	</c:forEach>
	</c:if>
</div>
</body>
</html>
