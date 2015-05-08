<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<jsp:include page="/jsp/includes/1ColHead.jsp">
	<jsp:param name="title" value="Warping Your Stack" />
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/features.htm|Tools@#|User Stack Details@ " />
	<jsp:param name="css" value="/css/vfb/layout/layout-query.css;/css/vfb/annotation/upload.css;" />
</jsp:include>

<div id="center_wide">

	<h2>Warping your stack</h2>
	<p>
	Your stack is being registered onto the reference stack to allow its full support by the VFB. <br/>
	That is a calculation-intensive operation that typically takes a few hours to complete, depending on server load.<br/>
	There are ${jobsRunning} other registration jobs running on the server currently. The estimated completion time for your stack registration is ${(jobsRunning+1)*6} hours.</br>
	Once the registration is complete we will send you an email with the link so that you could review your stack.<br/>
	No further action is required on your part at the moment.<br/>
	You may now navigate away from this page and get on with your work or upload more stacks if you wish to do so.<br/>
	Thank you for uploading your stack and do not forget to check your email!<br/>  
	</p>

	</div>

	<jsp:include page="/jsp/includes/homeFoot.jsp" />
