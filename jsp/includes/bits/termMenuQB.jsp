<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%-- Presume ontBean is passed as parameter--%> 

<script type="text/javascript">
var currBeanId = "${param.fbbtId}";
</script>
	
<div id="term_menu"
	style="">
	<ul id="menubar">
		<li class="header">Actions
		</li>
		<li><a href="#"
		onClick="parent.$('query_builder').set('src', '/do/query_builder.html?action=add&rel=include&fbId='+currBeanId);">
		Add to query</a>
		</li>
	</ul>
</div> <!-- term_menu -->
<br style="clear:both"/>&nbsp;
