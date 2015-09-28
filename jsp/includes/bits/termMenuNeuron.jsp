<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%-- Presume ontBean is passed as parameter--%>

<script type="text/javascript">
var currBeanId = "${param.fbbtId}";
</script>

<nav class="navbar navbar-default navbar-condensed">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Query for</a>
    </div>

		<!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
				<li><a href="/do/ont_bean_list.html?action=subclass&id=${param.fbbtId}" target="_top">Subclasses</a></li>
        <li><a href="/do/ont_bean_list.html?action=parts&id=${param.fbbtId}" target="_top">Parts of</a></li>
				<li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Expression/Phenotypes found here: <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">
            <li><a href="/do/gene_list.html?action=transgene&id=${param.fbbtId}" target="_top">Transgenes expressed here</a></li>
            <li><a href="/do/gene_list.html?action=geneex&id=${param.fbbtId}" target="_top">Genes expressed here</a></li>
						<li><a href="/do/gene_list.html?action=phenotype&id=${param.fbbtId}" target="_top">Phenotypes here</a></li>
          </ul>
        </li>
			</ul>
		</div>
	</div>
</nav>
