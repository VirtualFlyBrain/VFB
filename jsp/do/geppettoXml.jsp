<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %><%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%><?xml version="1.0" encoding="ASCII"?>
<gep:GeppettoModel xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gep="https://raw.githubusercontent.com/openworm/org.geppetto.model/development/src/main/resources/geppettoModel.ecore" xmlns:gep_1="https://raw.githubusercontent.com/openworm/org.geppetto.model/development/src/main/resources/geppettoModel.ecore#//types">
<c:forEach items="${domains}" var="curr" varStatus="status"><variables id="${domHead}<fmt:formatNumber type="number" minIntegerDigits="5" groupingUsed="false" value="${curr}" />" name="${domHead}<fmt:formatNumber type="number" minIntegerDigits="5" groupingUsed="false" value="${curr}" />" types="//@libraries.0/@types.${status.index}"/>
</c:forEach>
<c:if test="${fn:length(indvar)>0}">${indvar}</c:if>
<libraries id="vfbobj" name="VFB OBJs">
<c:forEach items="${domains}" var="curr" varStatus="status"><types xsi:type="gep_1:ImportType" url="SERVER_ROOT/appdata/vfb/${domDir}/domain${curr}.obj" id="${domHead}<fmt:formatNumber type="number" minIntegerDigits="5" groupingUsed="false" value="${curr}" />" name="${domHead}<fmt:formatNumber type="number" minIntegerDigits="5" groupingUsed="false" value="${curr}" />" modelInterpreterId="objModelInterpreterService"/>
</c:forEach>
<c:if test="${fn:length(indlib)>0}">${indlib}</c:if>
</libraries>
</gep:GeppettoModel>
