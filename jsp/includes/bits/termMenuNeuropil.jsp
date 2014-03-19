<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%-- Presume ontBean is passed as parameter--%> 

<script type="text/javascript">
var currBeanId = "${param.fbbtId}";
</script>
	
<div id="term_menu"
	style="">
	<ul id="menubar">
		<li class="header">Query for</li>
		<li><a href="/do/ont_bean_list.html?action=parts&id=${param.fbbtId}"  target="_top">Parts of: </a></li>
		<li><a href="#">Neurons with:</a>
		<ul>
			<li><a href="/do/ont_bean_list.html?action=found&id=${param.fbbtId}"  target="_top">
			. some part here</a></li>
			<li><a href="/do/ont_bean_list.html?action=synaptic&id=${param.fbbtId}" target="_top">
			. . synaptic terminals here</a></li>
			<li><a href="/do/ont_bean_list.html?action=presynaptic&id=${param.fbbtId}" target="_top">
			. . . presynaptic terminals here</a></li>
			<li><a href="/do/ont_bean_list.html?action=postsynaptic&id=${param.fbbtId}" target="_top">
			. . . postsynaptic terminals here</a></li>
		</ul>
		</li>
		<li><a href="#">Individual neurons with:</a>
		<ul>
			<li><a href="/do/cluster_list.html?action=cluster_found&id=${param.fbbtId}" target="_top">
			. some part here (clustered by shape)</a></li>
			<li><a href="/do/individual_list.html?action=ind_neuron_overlap&id=${param.fbbtId}" target="_top">
			. some part here (unclustered)</a></li>
		</ul>
		</li>
		<li><a href="/do/ont_bean_list.html?action=tract&id=${param.fbbtId}" target="_top">
		Tracts/nerves innervating here</a>
		</li>
		<li><a href="#">Lineage clones with:</a>
		<ul>
			<li><a href="/do/ont_bean_list.html?action=lineage_clone&id=${param.fbbtId}" target="_top">
			. some part here</a></li>
		</ul>
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
<br style="clear:both"/> &nbsp;

