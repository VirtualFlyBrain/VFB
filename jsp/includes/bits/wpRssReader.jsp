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
<div id="rss_feed" style="width:100%; font-size:0.9em;">
<div style="font: 16px Arial; font-weight:bold; color:#333; margin-bottom: 6px; text-align: left; margin-left:4px">VFB blog 
	<a href="http://vfbblog.inf.ed.ac.uk/?feed=rss2" style="float:right; margin-right: 4px;" title="Subscribe to RSS feed">
		<img src="/images/vfb/utils/rss.png" height="18"/></a>&nbsp; &nbsp; &nbsp;
</div>
<div class="feedgrabbr_widget" id="fgid_da786e11f533fcb345cc41656"></div>
<script> if (typeof(fg_widgets)==="undefined") fg_widgets = new Array();fg_widgets.push("fgid_da786e11f533fcb345cc41656");</script>
<script src="http://www.feedgrabbr.com/widget/fgwidget.js"></script>

	<div style="height:60px; background-color:#C4E3F3; color:#050608;padding: 0px 5px 0px 5px;">
		<h5 style="font-weight:bold; padding:6px 0px 6px 0px;">Receive updates by email</h5>
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
