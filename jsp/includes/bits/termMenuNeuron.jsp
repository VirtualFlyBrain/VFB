<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%-- Presume ontBean is passed as parameter--%> 

<script type="text/javascript">
var currBeanId = "${param.fbbtId}";
</script>
	
<div id="term_menu"
	style="">
	<ul id="menubar">
		<li class="header">Query for
		<li><a href="/do/ont_bean_list.html?action=subclass&id=${param.fbbtId}" target="_top">
		SubClasses</a>
		<li><a href="/do/ont_bean_list.html?action=parts&id=${param.fbbtId}" target="_top">
		Parts of</a>
		</li>
		<li><a href="#">Expression/Phenotypes found here:</a>
		<ul>
			<li><a href="/do/gene_list.html?action=transgene&id=${param.fbbtId}" target="_top">
			Transgenes expressed here</a></li>
			<li><a href="/do/gene_list.html?action=geneex&id=${param.fbbtId}" target="_top">
			Genes expressed here</a></li>
			<li><a href="/do/gene_list.html?action=phenotype&id=${param.fbbtId}" target="_top">
			Phenotypes here</a></li>
		</ul>
		</li>
	</ul>
</div> <!-- term_menu -->
<br style="clear:both"/>&nbsp;
