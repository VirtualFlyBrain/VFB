<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  
<c:set var="credits" value="${param.stackInfoBrief}" />

<div style="position:absolute; bottom: 0px; height:auto; width:96%; font-size:.9em; padding:0 4px;" >
	<b>Stack Info:</b>
	<a class="smoothbox" style="margin-top:0px; float:right" href="/site/credits.htm?height=500&width=980&stackInfo=${param.stackInfo}&TB_iframe=true" ><span class="glyphicon glyphicon-question-sign"></span>&nbsp;More</a>
	<br/>${credits} <br/>
</div>

