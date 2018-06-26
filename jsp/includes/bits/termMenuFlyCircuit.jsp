<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%-- Presume ontBean is passed as parameter--%>

<script type="text/javascript">
    var currBeanId = "${param.fbbtId}";
</script>

<nav class="navbar navbar-default navbar-condensed">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1">
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
                <li>
                    <a href="http://nblast.virtualflybrain.org:8080/NBLAST_on-the-fly/?all_query=${param.name}&all_use_mean=TRUE"
                       target="_blank">Similar neurons (NBLAST)</a>
                </li>
                <li>
                    <a href="http://nblast.virtualflybrain.org:8080/NBLAST_on-the-fly/?gal4_query=${param.name}&tab=GAL4"
                       target="_blank">Potential GAL4 matches (NBLAST)</a></li>
            </ul>
        </div>
    </div>
</nav>
