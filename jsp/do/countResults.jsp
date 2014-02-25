<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

	<span style="width:100%; ">
		<form name="perPage" action="?${paramString}">
			${fn:substringBefore(nav,"Page")} 
