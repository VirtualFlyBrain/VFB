<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<jsp:include page="/jsp/includes/1ColHead.jsp">
	<jsp:param name="title" value="Edit Composite View " />
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/home.htm|Stacks@#|Composite view" />
	<jsp:param name="css" value="/css/vfb/utils/resultList.css;" />
	<jsp:param name="helpURL" value="/site/tools/help/composite_help.htm" />
</jsp:include>

<script type="text/javascript">
function startNew(url){
	// Whether to create or no new composite 
	var result = false;
    var conf = confirm("Are you sure you want to start new blank composite?\nYour current composite will no longer be editable, and will only be available via permalink");
    if(conf == true){
         alert("Take a note of the permalink to the current composite: \n"+url);
         result = true;
    }
    return result;
}
</script>

<c:set var="emptyComposite" value="${fn:length(composite.stacks)<1}" />

	<c:if test="${render}" >
	 <jsp:forward page="/site/tools/view_stack/3rdPartyStack.htm?json=${composite.uuid}/wlz_meta/tiledImageModelData.jso&type=COMPOSITE"/>
	</c:if>	
		
	<h2>Composite view: <a >${composite.uuid}</a></h2>
	<form action="/do/composite_view.html" >
	<table border="0">
	<c:forEach items="${composite.stacks}" var="curr" varStatus="status">
		<tr>
		<td>
			<input type="checkbox" name="id" id="${curr.vfbId}" value = "${curr.vfbId}"></input>
			<input type="text" style="background-color:${colours[status.index]}" class="colour_pick" name="colours" id="colour${status.index}"></input>${curr.name}</span>
		</td>
		<td>
			<img src="${curr.thumbUrl}" class="thumb" />
		</td></tr>
	</c:forEach>
	</table>
	<input type="submit" name="action" value="Delete selected" <c:if test="${emptyComposite}">disabled</c:if>  />
	<input type="submit" name="action" value="View composite" <c:if test="${emptyComposite}">disabled</c:if> />
	</form>
	
	<c:if test="${emptyComposite}">Your composite is empty. You can add stacks to it using the "Add to composite view" link from any image displayed in the Viewer, such as single neurons or lineage clones.<br/><br/></c:if>
	
	<c:set var="serverURL" value="<%=request.getServerName() %>"/>
	<c:set var="serverURL" value="http://${serverURL}"/>
	<c:if test="${fn:length(composite.stacks)>1}">
				
		<br/>
		<c:if test="${!composite.immutable}">
			<a href="/do/composite_view.html?action=startNew" onclick="return startNew('${serverURL}/do/composite_view.html?action=load&uuid=${composite.uuid}');">Get permalink and start new composite</a>
			&nbsp; 
			<a class="help smoothbox" href="/site/tools//help/new_permalink.htm?height=600&width=800&TB_iframe=true" style="top:0px; float:none; margini-left:10px" title="Quick help">&nbsp;How does that work? - check before you do it!</a>
			<br/>
			<br/>
		</c:if>
		<c:if test="${composite.immutable}">
			<a href="/do/composite_view.html?action=startNew" onclick="return startNew('${serverURL}/do/composite_view.html?action=load&uuid=${composite.uuid}');">Leave this composite and start new one</a>
			&nbsp; 
			<a class="help smoothbox" href="/site/tools//help/new_permalink.htm?height=600&width=800&TB_iframe=true" style="top:0px; float:none; margini-left:10px" title="Quick help">&nbsp;How does that work? - check before you do it!</a>
			<br/>
			<br/>
		</c:if>
		
		<!-- a href="/do/composite_view.html?action=startNew" onclick="return startNew('${serverURL}/do/composite_view.html?action=load&uuid=${composite.uuid}');">Save and start new composite</a>
		&nbsp; -->
	</c:if>
	
	<c:if test="${!empty oldUUID}">
	<p>
		You are working on a new composite view now. The permalink for the previous composite is: <a href="/site/tools/view_stack/3rdPartyStack.htm?json=${oldUUID}/wlz_meta/tiledImageModelData.jso&type=COMPOSITE">${serverURL}/do/composite_view.html?action=load&uuid=${oldUUID}</a>
	</p>
	</c:if> 
	
	<c:if test="${composite.immutable}">
	<p>
		You are viewing the composite via permalink. You can share this permalink with your collaborators, but you can not edit the current composite.<br/>
		The permalink for the current composite is: <a href="/do/composite_view.html?action=load&uuid=${composite.uuid}">${serverURL}/do/composite_view.html?action=load&uuid=${composite.uuid}</a><br/> 
	</p>		
	</c:if> 
	
<c:if test="${!empty errorMsg}" >
<script type="text/javascript">
	alert("${errorMsg}");
</script>
</c:if>

	
<jsp:include page="/jsp/includes/homeFoot.jsp" />


