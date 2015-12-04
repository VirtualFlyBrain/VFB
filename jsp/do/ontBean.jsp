<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@page import="org.springframework.web.context.*,org.springframework.web.context.support.*,uk.ac.ed.vfb.tools.autocomplete.*"%>
<%
//test the spring framework
ServletContext servletContext = this.getServletContext();
WebApplicationContext wac = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);

AutocompleteDAO acdao = (AutocompleteDAO)wac.getBean("autocompleteDAONeuropil");
pageContext.setAttribute("aclNeuropil", acdao.getSynSet());


acdao = (AutocompleteDAO)wac.getBean("autocompleteDAONeuron");
pageContext.setAttribute("aclNeuron", acdao.getSynSet());

acdao = (AutocompleteDAO)wac.getBean("autocompleteDAOTract");
pageContext.setAttribute("aclTract", acdao.getSynSet());

acdao = (AutocompleteDAO)wac.getBean("autocompleteDAOClone");
pageContext.setAttribute("aclClone", acdao.getSynSet());
%>

<c:choose>
	<c:when test="${headAtt == true}">
		<!-- Google Analytics -->
			<script>
				dataLayer.push({'event':'sendVirtualPageview','vpv':'/do/ont_bean.html?fbId=${ontBean.fbbtId}'});
			</script>
		<!-- End Google Analytics -->

	</c:when>
	<c:otherwise>
		<jsp:include page="/jsp/includes/1ColHead.jsp">
			<jsp:param name="title" value="${ontBean.name}" />
		</jsp:include>
		<c:set var="needFoot" value="true" />
	</c:otherwise>
</c:choose>

<c:forEach items="${aclNeuron}" var="neuron" varStatus="i"><c:if test="${ontBean.fbbtId == neuron.fbbtId}"><c:set var="isNeuron" value="true" scope="request"/></c:if></c:forEach>
<c:forEach items="${aclNeuropil}" var="neuropil" varStatus="i"><c:if test="${ontBean.fbbtId == neuropil.fbbtId}"><c:set var="isNeuropil" value="true" scope="request"/></c:if></c:forEach>
<c:forEach items="${aclTract}" var="tract" varStatus="i"><c:if test="${ontBean.fbbtId == tract.fbbtId}"><c:set var="isTract" value="true" scope="request"/></c:if></c:forEach>
<c:forEach items="${aclClone}" var="clone" varStatus="i"><c:if test="${ontBean.fbbtId == clone.fbbtId}"><c:set var="isClone" value="true" scope="request"/></c:if></c:forEach>

<c:if test="${sessionScope.currURL!='/site/tools/query_builder/'}"><c:set var="termMenu" value="termMenuNeuron.jsp"/></c:if>
<c:if test="${isNeuropil && sessionScope.currURL!='/site/tools/query_builder/'}"><c:set var="termMenu" value="termMenuNeuropil.jsp"/></c:if>
<c:if test="${isTract && sessionScope.currURL!='/site/tools/query_builder/'}"><c:set var="termMenu" value="termMenuTract.jsp"/></c:if>
<c:if test="${isClone && sessionScope.currURL!='/site/tools/query_builder/'}"><c:set var="termMenu" value="termMenuClone.jsp"/></c:if>
<c:if test="${fn:contains(sessionScope.currURL,'/site/tools/query_builder/')}"><c:set var="termMenu" value="termMenuQB.jsp"/></c:if>

<c:if test="${beanType=='ont'}">
	<jsp:include page="/jsp/includes/bits/${termMenu}">
		<jsp:param name="fbbtId" value="${ontBean.fbbtId}" />
	</jsp:include>
</c:if>

<div class="well-white" style="padding-top: 0px;">
	<div class="row">
		<div class="col-xs-12">
			<h2><a href="#details" onclick="openFullDetails('${ontBean.fbbtIdAsOWL}')" title="View details and run queries"><span id="partName">${ontBean.name}</span></a></h2>
			<script>
				detailsUpdating = false;
				function updateDetailButtons(){
					$('#detailButtons').html(
						createControlsBarHTML('FBbt_00007054')
					);
					buttons=$('#detailButtons > div > div > button');
					buttons.each(function(index){
						if ($(this).html().indexOf('eye')>-1 || $(this).html().indexOf('trash')>-1 || $(this).html().indexOf('paperclip')>-1){
							$(this).attr('onclick',$(this).attr('onclick') + "updateDetailButtons();");
							if ($(this).html().indexOf('paperclip')>-1 && parent.$('body').data('available').indexOf('${ontBean.fbbtIdAsOWL}')<0 && '${ontBean.fbbtIdAsOWL}'.indexOf('VFB')<0){
								$(this).attr('disabled','true');
								$(this).attr('title','Not labeled in this stack');
							}
						}
					});
					buttons.first().hide();
					$('button').each(function(index){$(this).attr('data-toggle','tooltip');
						$(this).attr('data-placement','top');
						$(this).tooltip();
					});
				};
				$('body').ready( function () {
					updateDetailButtons();
				});
			</script>
			<div id="detailButtons" style="position:absolute;top:5px;right:5px;"></div>
			<c:if test="${!empty ontBean.fbbtIdAsOWL}">
			<p>
				<b>ID: </b><a id="partId" href="#details" onclick="openFullDetails('${ontBean.fbbtIdAsOWL}');" target="_top" title="View details and run queries" >${ontBean.fbbtIdAsOWL}</a>
			</p>
			<script>document.title = '${ontBean.name}'; if (history.state === null | (history.state !== null && history.state.id !== undefined && history.state.id == "${ontBean.fbbtIdAsOWL}")) {history.replaceState({"id": "${ontBean.fbbtIdAsOWL}"}, "${ontBean.name}", "/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}");}else{history.pushState({"id": "${ontBean.fbbtIdAsOWL}"}, "${ontBean.name}", "/site/stacks/index.htm?id=${ontBean.fbbtIdAsOWL}");}; detailLoad = false; if (typeof jump !== 'undefined' && $.isFunction(jump)) {jump('details')}else{history.go();};</script>
			</c:if>
			<p id="partDef">
				<b>Definition: </b>${ontBean.def}
			</p>
			<c:if test="${!empty ontBean.comment}">
				<p>
					<b>Comment: </b>${ontBean.comment}
				</p>
			</c:if>
			<c:if test="${fn:length(ontBean.synonyms)>0}">
				<p>
					<b>Synonyms: </b><br />
					<div id="partSyn">
						<ul>
						<c:forEach items="${ontBean.synonyms}" var="curr" varStatus="status"><li>${fn:replace(curr, '()', '')}</li></c:forEach>
						</ul>
					</div>
				</p>
			</c:if>
			<c:if test="${fn:length(refs)>0}">
				<p>
					<b>References: </b><br />
					<div id="partRefs">
						<ul>
						<c:forEach items="${refs}" var="curr" varStatus="status"><li><a href="${curr.webLink}" title="${curr.miniref}" target="_blank">${curr.miniref}</script></a></li></c:forEach>
						</ul>
				</div>
				</p>
			</c:if>
			<c:if test="${beanType=='ont'}">
				<c:if test="${fn:length(ontBean.isa)>0}">
					<p>
						<b>Parent classes: </b><br />
						<div id="partParents">
							<ul>
							<c:forEach items="${ontBean.isa}" var="curr" varStatus="status"><span class="hide" id="partParentId">${curr.key}</span><a href="#details" onclick="openFullDetails('${curr.key}')" title="Look up" target="_top"><span id="partParent"><li>${curr.value}</li></span></a></c:forEach>
							</ul>
						</div>
					</p>
				</c:if>
			</c:if>
			<c:if test="${beanType=='ind'}">
				<c:if test="${fn:length(ontBean.types)>0}">
					<p>
						<b>Parent classes: </b><br />
						<div id="partParents">
							<ul>
								<c:forEach items="${ontBean.types}" var="curr" varStatus="status"><c:set var="currParts" value="${fn:split(curr, '=')}" /><c:set var="url" value="${fn:split(currParts[0], ' ')[1]}" /><c:choose>
								<c:when test="${fn:containsIgnoreCase(currParts[0], 'http')}"><a href="${fn:trim(currParts[0])}" title="External look up" target="_blank"><span id="partParent"><li>${currParts[1]}</li></span></a>
								</c:when>
								<c:otherwise><span class="hide" id="partParentId">${fn:trim(currParts[0])}</span>
										<a href="#details" onclick="openFullDetails('${fn:trim(currParts[0])}');" title="Look up" target="_top"><span id="partParent"><li>${currParts[1]}</li></span></a>
								</c:otherwise></c:choose></c:forEach>
							</ul>
						</div>
					</p>
				</c:if>
			</c:if>
			<c:if test="${fn:length(ontBean.relationships)>0}">
				<p>
					<b>Relationships: </b><br />
					<div id="partRel">
						<ul>
						<c:forEach items="${ontBean.relationships}" var="curr" varStatus="status">
							<li><c:choose><c:when test="${fn:containsIgnoreCase(curr.value[2], 'http')}">${curr.value[0]} <a href="${curr.value[2]}" title="External look up" target="_blank">${curr.value[1]}</a></c:when><c:otherwise>${curr.value[0]} <a href="#details" onclick="openFullDetails('${curr.value[2]}');" title="Look up" target="_top">${curr.value[1]}</a></c:otherwise></c:choose>
							<c:forEach items="${aclNeuropil}" var="neuropil" varStatus="i"><c:if test="${curr.value[2] == neuropil.fbbtId}"><span style="border:none;padding-left:0px;padding-right:0px;" id="attach" data-id="${fn:replace(curr.value[2], ':', '_')}"></span></c:if></c:forEach></li>
						</c:forEach>
					</ul>
				</div>
				</p>
			</c:if>
		</div>
		<div class="col-xs-12">
			<c:set var="tpb" value="${ontBean.thirdPartyBean}"/><c:if test="${!empty tpb}">
			<p>
				<b>Image:</b><br/>
				<img class="lazy" data-original="${tpb.thumbUrl}" onclick="openFullDetails('${tpb.vfbId}');addToStackData('${tpb.vfbId}');" alt="Open in stack viewer" style="cursor: pointer;"/>
				<br/>
				<b>Source:</b> <a href="${tpb.baseUrl}${tpb.remoteId}" target="_blank" title="Open in ${tpb.sourceName}" >${tpb.sourceName}</a>
				<br />
				<br />
				<span id="imageViewerOpen" data-id="${fn:replace(tpb.vfbId, ':', '_')}" data-name="${ontBean.name}"></span>
				<br/>
			</p>
			</c:if>

			<c:if test="${isNeuron || isClone}">
				<p>
					<br/>
					<b>Images: </b>
					<br/>
					<jsp:include page="/do/individual_film_strip.html">
						<jsp:param name="action" value="exemplar_neuron" />
						<jsp:param name="id" value="${ontBean.fbbtId}" />
					</jsp:include>
				</p>
			</c:if>

			<c:if test="${beanType=='ont'}">
				<c:if test="${!isNeuron && !isClone}"><c:set var="isNeuropil" value="true"/><p>
					<br />
					<b>Images: </b><br />
					<br />
					<span id="imageViewerOpen" data-id="${ontBean.fbbtIdAsOWL}" data-name="${ontBean.name}"></span>
					<br />
					</p></c:if>
				<p>
					<br />
					<b>External Links: </b><br />
					<br />
					<a href="http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=${ontBean.fbbtId}" target="_blank" title="See in FlyBase" ><img alt="See in FlyBase" src="/images/vfb/project/logos/flybase.gif" height="50px" /></a> &nbsp; &nbsp;
					<a href="http://neurolex.org/wiki/${fn:replace(ontBean.fbbtId, ':', '_')}" target="_blank" title="View/edit in NeuroLex Wiki" ><img alt="View/edit in NeuroLex Wiki" src="/images/vfb/project/logos/neurolex_logo.png" height="50px" /></a>  &nbsp; &nbsp;
					<c:forEach items="${refs}" var="curr" varStatus="status"><c:if test="${fn:contains(curr, 'FlyBrain_NDB')}">
							<a href="${curr.webLink}" target="_blank" title="${curr.miniref}" ><img alt="See in FlyBrain Neuron Database" src="/images/vfb/project/logos/NDB_logo.gif" height="50px" /></a>  &nbsp; &nbsp;
						</c:if></c:forEach>
				</p>
			</c:if>
		</div>
	</div>
</div>

<c:if test="${needFoot == true}">
	<jsp:include page="/jsp/includes/homeFoot.jsp"/>
</c:if>
