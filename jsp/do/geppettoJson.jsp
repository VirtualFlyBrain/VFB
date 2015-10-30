<%@ page import="java.io.*,java.util.*, javax.servlet.*" %><%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>{
    "id": 1,
    "name": "Virtual Fly Brain",
    "activeExperimentId": 1,
    "experiments": [
        {
            "id": 1,
            "name": "Only morphologies, no simulation",
            "status": "COMPLETED",
            "script": "SERVER_ROOT/appdata/vfb/brain/brain1.js",
            description : "Adult Fly Brain",
            "lastModified":"${getTime()}",
            "aspectConfigurations": []
        }
    ],
    "geppettoModel": {
        "id": 9,
        url: "http://www.virtualflybrain.org/do/geppetto.html?<c:if test="${fn:length(indjson)>0}">i=${indjson}</c:if>",
        "type": "GEPPETTO_PROJECT"
    }
}
