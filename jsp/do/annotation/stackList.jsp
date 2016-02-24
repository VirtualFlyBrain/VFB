<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<jsp:include page="/jsp/includes/1ColHead.jsp">
	<jsp:param name="title" value="User Stack Details" />
	<jsp:param name="navpath" value="The VFB Site@/site/vfb_site/features.htm|Tools@#|User Stack Details@ " />
	<jsp:param name="css" value="/css/vfb/layout/layout-query.css;/css/vfb/layout/datatable.css;/css/vfb/utils/help.css;" />
</jsp:include>

<div id="center_wide">

<FORM name="mainForm" id="mainFormID" action="tdbsearch" method="get" onSubmit="submitTDBSearchForm(); return false;">
<input type="hidden" name="mode" value="search">
<input type="hidden" name="page">

  <table width="100%" id="datatable" class="datatable">
    <TR>
      <TH class="datatable" style="font-weight:normal">
      <DIV style="padding-bottom:7px">
      &nbsp;Search&nbsp;
      <SELECT name="searchField">
          <OPTION value="All"  SELECTED>All Fields</OPTION>
          <OPTION value="" DISABLED>-------------</OPTION>
          <!--header fields retrieved using TDBSearchBean.java-->
          <OPTION value="StackNamwe" >Stack Name</OPTION>
          <OPTION value="GeneName" >Gene Name</OPTION>
          <OPTION value="User" >User</OPTION>
          <OPTION value="ResourceName" >Resource</OPTION>
     </SELECT>
     &nbsp;in&nbsp;
     <INPUT name="searchValue" id="searchValueID" type="text" size="10" value="" onClick="javascript:select();">&nbsp;

    <div id="extendedQueryDivID" name="extendedQueryDiv" style="font-weight:normal; font-size:100%;padding-top:7px; border-top:1px solid #ffffff; display:none; display:blockdisplay:none">
    &nbsp;Show assays with&nbsp;
    <SELECT id="anatomySetNamesListID" name="anatomySetNames" style="font-size:90%"></SELECT>
    <script>populateAnatomySetsList()</script>
    
    	<script>setAnatomySetList('')</script>
    
    &nbsp;having&nbsp;expression strength&nbsp;
    <SELECT id="expressionStrengthOperatorListID" name="expressionStrengthOperator" style="font-size:90%">
    <option value="g" >greater than</option>
    <option value="e" >equal to</option>
    <option value="l" >less than</option>
    </SELECT>
    <input type="text" size="3" name="expressionStrengthValue" id="expressionStrengthValueID" value="" style="font-size:90%">

    &nbsp;&nbsp;and&nbsp;&nbsp;coverage&nbsp;
    <SELECT id="coverageOperatorListID" name="coverageOperator" style="font-size:90%">
    <option value="g" >greater than</option>
    <option value="e" >equal to</option>
    <option value="l" >less than</option>
    </SELECT>
    <input type="text" size="3" name="coverageValue" id="coverageValueID" value="" style="font-size:90%">

    </div>
     </TH>

    <TH class="datatable center">
        <INPUT type="submit" name="Submit" value="Find" class="formButton">
    </TH>
    <TH class="datatable center" width="90">
        <a class="white" href="tdbsearch?mode=search&searchField=All&searchValue=*&getStandardAtlas=yes&getMultistageAtlas=yes&groupSelection=Group_All&findEverything=yes&Submit=Go&recordsPP=20&anatomySetNames=0&expressionStrengthOperator=g&coverageOperator=g" onClick="loadurl('tdbsearch');">Show All</a>
    </TH>
    </TR>

  </table>
  
	<span style="width:100%; ">
		<form name="perPage" action="?${paramString}">
			${nav} &nbsp; Records per page: 
			<c:forEach items="${paramItems}" var="curr">
				<input type="hidden" name="${fn:split(curr, '=')[0]}" value="${fn:split(curr, '=')[1]}"/> 
			</c:forEach>
			<select id="perPage" name="perPage" onchange='this.form.submit()'>
  				<option value="10" ${(perPage==10)?"selected":""} >10</option>
  				<option value="20" ${(perPage==20)?"selected":""} >20</option>
				<option value="50" ${(perPage==50)?"selected":""} >50</option>
				<option value="100" ${(perPage==100)?"selected":""} >100</option>
			</select>
			<a id="csv" style="float:right; margin-right:10px" href="/do/csv_report.html?type=gbm&filename=${fileName}">Save as CSV</a>
		</form>
	</span>

	<table width="100%" class="datatable">
	<thead> 
		<tr align="center">
		<c:forEach items="${columns}" var="curr">
			<th >${curr}</th>
		</c:forEach>
		</tr>
	</thead>
	<tbody>
		<c:forEach items="${stackList}" var="stackBean" varStatus="status">		
			<tr>
				<td><a href="${transgeneLinks[0]}${geneBean.reference}.html">${stackBean.stackName}</a></td>
				<td><a href="${transgeneLinks[0]}${geneBean.driverRef}.html">${stackBean.geneId}</a></td>
				<td><a href="/do/ont_bean.html?fbId=FBbt:${geneBean.locationRef}&popup=true">${stackBean.geneName}</a></td>
				<td><a href="${stackBean.thirdPartyURL}&popup=true" title="view original page" target="_blank">${stackBean.thirdPartyURL}</a></td>
				<!-- td><a href="">${stackBean.userName}</a></td -->
				<c:set var="stackMetaUrl"><%=((uk.ac.ed.vfb.annotation.model.StackBean)pageContext.getAttribute("stackBean")).getStackWoolzDir() %></c:set>
				<c:set var="stackId"><%=((uk.ac.ed.vfb.annotation.model.StackBean)pageContext.getAttribute("stackBean")).getStackId() %></c:set>
				<c:set var="thumb"><%=((uk.ac.ed.vfb.annotation.model.StackBean)pageContext.getAttribute("stackBean")).getThumb("lsm") %></c:set>
				<td><a href="/site/tools/view_stack/lsmStack.htm?stackId=${stackId}"><img src="${thumb}"/></a></td>
				<c:set var="stackMetaUrl"><%=((uk.ac.ed.vfb.annotation.model.StackBean)pageContext.getAttribute("stackBean")).getStackWoolzDir("cmtk") %></c:set>
				<c:set var="thumb"><%=((uk.ac.ed.vfb.annotation.model.StackBean)pageContext.getAttribute("stackBean")).getThumb("cmtk") %></c:set>
				<td><a href="/site/tools/view_stack/warpedStack.htm?woolz=${stackMetaUrl}"><img src="${thumb}"/></a></td>
				<td width="60" align="centre">
					<a href="/do/annotation/stack_edit.html?stackId=${stackId}" title="Edit stack info"><img src="/images/vfb/utils/edit.png" height="16"/></a>
					&nbsp;
					<a href="/site/tools/upload_stack/deleteStack.jsp?stackId=${stackId}&stackName=${stackBean.stackName}" title="Delete stack"><img src="/images/vfb/utils/delete.png"/ height="16"></a>
				</td>
			</tr>
		</c:forEach>	 
	</tbody>
	</table>
   
</div>  
</FORM>	<jsp:include page="/jsp/includes/homeFoot.jsp" />
