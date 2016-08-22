<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

var resolve3D = function(path, callback) { var instance = undefined; try { instance = Instances.getInstance(path + "." + path + "_swc"); } catch (ignore) { } if(instance == undefined){ try { instance = Instances.getInstance(path + "." + path + "_obj"); } catch (ignore) { } } if(instance!=undefined){ instance.getType().resolve(function() { setSepCol(path); if (callback != undefined) { callback(); } }); } };

<c:if test="${fn:length(individuals)>0}">
    <c:forEach items="${individuals}" var="curr" varStatus="status">
        <c:if test="${not empty curr}">
            Model.getDatasources()[0].fetchVariable("${curr}");
            Instances.getInstance("${curr}.${curr}_meta");
            resolve3D("${curr}");
        </c:if>
    </c:forEach>
</c:if>
