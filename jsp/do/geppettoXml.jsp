<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %><%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%><?xml version="1.0" encoding="UTF-8"?>
<tns:geppettoModel xmlns:tns="http://www.openworm.org/simulationSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openworm.org/simulationSchema ../../main/resources/schema/simulation/simulationSchema.xsd">
    <tns:entity>
        <tns:id>flybrain</tns:id>
        <tns:aspect>
            <tns:id>morphology</tns:id>
        </tns:aspect>
        <tns:entity>
            <tns:id>regions</tns:id>
            <tns:aspect>
                <tns:id>morphology</tns:id>
            </tns:aspect>
<c:forEach items="${domains}" var="curr" varStatus="status">      <tns:entity>
                <tns:id>${domHead}<fmt:formatNumber type="number" minIntegerDigits="5" groupingUsed="false" value="${curr}" /></tns:id>
                <tns:aspect>
                    <tns:id>morphology</tns:id>
                    <tns:model>
                        <tns:modelInterpreterId>objModelInterpreterService</tns:modelInterpreterId>
                        <tns:modelURL>SERVER_ROOT/appdata/vfb/${domDir}/domain${curr}.obj</tns:modelURL>
                    </tns:model>
                </tns:aspect>
            </tns:entity>
        </c:forEach></tns:entity>
        <tns:entity>
            <tns:id>neurons</tns:id>
            <tns:aspect>
                <tns:id>morphology</tns:id>
            </tns:aspect><c:if test="${fn:length(indxml)>0}">${indxml}</c:if>
        </tns:entity>
    </tns:entity>
</tns:geppettoModel>
