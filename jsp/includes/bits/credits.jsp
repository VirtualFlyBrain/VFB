<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  
<c:set var="credits" value="${param.stackInfoBrief}" />

<div style="position:absolute; bottom: 0px; height:auto; width:96%; font-size:.9em; padding:0 4px;" >
	<a href="/site/credits.htm?stackInfo=${param.stackInfo}" target="_stackinfo">&nbsp;full info</a>
	<b>Stack Info:</b><br/>${credits} <br/>
</div>

