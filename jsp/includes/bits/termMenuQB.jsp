<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%-- Presume ontBean is passed as parameter--%>

<script type="text/javascript">
var currBeanId = "${param.fbbtId}";
</script>

<nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Actions</a>
    </div>

		<!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
				<li><a href="#"
					onClick="parent.$('query_builder').set('src', '/do/query_builder.html?action=add&rel=include&fbId='+currBeanId);">
					Add to query</a>
				</li>
			</ul>
		</div>
	</div>
</nav>
