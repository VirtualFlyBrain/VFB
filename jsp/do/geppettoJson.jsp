<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>{
    "id": 1,
    "name": "Virtual Fly Brain",
    "activeExperimentId": 1,
    "experiments": [
        {
            "id": 1,
            "name": "Only morphologies, no simulation",
            "status": "COMPLETED",
            "script": "http://www.virtualflybrain.org/do/geppettoJs.html?<c:if test="${fn:length(diffsjson)>0}">d=${diffsjson}&</c:if><c:if test="${fn:length(tempjson)>0}">t=${tempjson}&</c:if><c:if test="${fn:length(itemsjson)>0}">i=${itemsjson}</c:if>",
            "description": "Adult Fly Brain",
            "lastModified": "${time}",
            "aspectConfigurations": []
        }
    ],
    "geppettoModel": {
        "id": 9,
        "url": "http://www.virtualflybrain.org/do/geppettoXml.xmi?<c:if test="${fn:length(tempjson)>0}">t=${tempjson}&</c:if><c:if test="${fn:length(itemsjson)>0}">i=${itemsjson}</c:if>",
        "type": "GEPPETTO_PROJECT"
    }
}
