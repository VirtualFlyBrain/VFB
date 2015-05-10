<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@page import="java.net.URL"%>
<%@page import="javax.xml.parsers.DocumentBuilder"%>
<%@page import="javax.xml.parsers.DocumentBuilderFactory"%>
<%@page import=" org.w3c.dom.CharacterData"%>
<%@page import=" org.w3c.dom.Document"%>
<%@page import="org.w3c.dom.Element"%>
<%@page import="org.w3c.dom.Node"%>
<%@page import="org.w3c.dom.NodeList"%>
<%@page import="java.lang.*"%>
<%@page import="java.text.*"%>
<%
DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
URL u = new URL("http://vfbblog.inf.ed.ac.uk/?feed=rss2"); // feed address
Document doc = builder.parse(u.openStream());
String title;
NodeList nodes = doc.getElementsByTagName("item"); %>
<div id="rss_feed" style="width:235px; font-size:0.9em;">
<div style="font: 16px Arial; font-weight:bold; color:#333; margin-bottom: 6px; text-align: left; margin-left:4px">News 
	<a href="http://vfbblog.inf.ed.ac.uk/?feed=rss2" style="float:right; margin-right: 4px;" title="Subscribe to RSS feed">
		<img src="/images/vfb/utils/rss.png" height="18"/></a>&nbsp; &nbsp; &nbsp; 
</div>
<div style="height:400px; overflow-y: auto; overflow-x: hidden; border:1px solid gray;">
	<% for(int i=0;i<3;i++) {
	Element element = (Element)nodes.item(i); 
	SimpleDateFormat formatter = new SimpleDateFormat("MMMM d, yyyy");%>
		<div style="padding:2px;>
			<p style="margin: 0; font-size:0.9em; font-weight:bold; color:#99BCDB"><b><%=formatter.format(new java.util.Date(getElementValue(element,"pubDate")))%></b></p><br/>
			<p style="margin: 0; font-size:1.2em; font-weight:bold"><a href="<%=getElementValue(element,"link")%>"><%=getElementValue(element,"title")%></a></p><br/>
			<%--fmt:formatDate value="${newsletter.createdOn}" pattern="MM/dd/yyyy"/>
			<tr><td>comments:</td><td><%=getElementValue(element,"wfw:comment")%></td></tr--%>
			<%=getElementValue(element,"description")%><br/>
			<hr style="width:180px; border:0; background:#5b5b5b; height:1px"/>
		</div>
	<%} %>
	</div>
	<div style="height:98px; background-color:#99BCDB; color:#333; border:1px solid gray;padding: 2px 5px 8px 5px;">
		<h5 style="font-weight:bold; margin-top:6px;">Receive updates by email</h5>
		<form id="feedburner_email_widget_sbef" action="http://feedburner.google.com/fb/a/mailverify" method="post" onsubmit="window.open('http://feedburner.google.com/fb/a/mailverify?uri=ac/RAmc', 'popupwindow', 'scrollbars=yes,width=550,height=470');return true;" target="popupwindow">
		<!--<label>email</label> -->
		<input id="feedburner_email_widget_sbef_email" name="email" type="text" placeholder="Your email"/>
		<input type="hidden" value="ac/RAmc" name="uri"/>
		<input type="hidden" name="loc" value="en_US"/>
		<input id="feedburner_email_widget_sbef_submit" type="submit" value="subscribe" />
		</form>		
	</div>
</div>

<%!
public String getElementValue(Element parent,String label) {
return getCharacterDataFromElement((Element)parent.getElementsByTagName(label).item(0));
}
public String getCharacterDataFromElement(Element e) {
try {
Node child = e.getFirstChild();
if(child instanceof CharacterData) {
CharacterData cd = (CharacterData) child;
String result = cd.getData().replace("Continue reading", "More");
return result;
}
} catch(Exception ex) {
}
return " ";
}
%>
