<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

window.initVFB();
G.setIdleTimeout(-1);
GEPPETTO.SceneController.setWireframe(false);
G.setOnSelectionOptions({unselected_transparent:false});

<c:if test="${fn:length(individuals)>0}">
    <c:forEach items="${individuals}" var="curr" varStatus="status">
        <c:if test="${not empty curr}">
            Model.getDatasources()[0].fetchVariable("${curr}");
            Instances.getInstance("${curr}.${curr}_meta");
            resolve3D("${curr}");
            <c:if test="${(status.index) eq 0}">
                ${curr}.setOpacity(0.2,true);
            </c:if>
        </c:if>
    </c:forEach>
</c:if>
