<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>  
<head>
	  <link rel="stylesheet" media="all" type="text/css" href="/css/tree/autocomplete.css" />
      <script type="text/javascript" src="/javascript/thirdParty/json2.js"></script>
      <script type="text/javascript" src="/javascript/thirdParty/mootools-1.2.4-core.js"></script>
      <script type="text/javascript" src="/javascript/thirdParty/mootools-1.2.4.4-more.js"></script>
      <script type="text/javascript" src="/javascript/tree/autocomplete.js"></script>
      	<script type="text/javascript">
      	<%@ page import="java.util.*" %>
      	<%
			      	
      	%>
	   function doOnLoad() {
		   var data = [
	           				{"id": 0, "text": "Brazil"},
	         				{"id": 1, "text": "Ajax"},
	         				{"id": 2, "text": "Options"},
	         				{"id": 3, "text": "Mootools"},
	         				{"id": 4, "text": "Meio"},
	         				{"id": 5, "text": "Código"},
	         				{"id": 6, "text": "Meio.Autocomplete"},
	         				{"id": 7, "text": "Whale"},
	         				{"id": 8, "text": "testing"},
	         				{"id": 9, "text": "so what?"},
	         				{"id": 10, "text": "other chars"},
	         				{"id": 11, "text": "á latin é"},
	         				{"id": 12, "text": "Brasil"},
	         				{"id": 13, "text": "chars test > gg"},
	         				{"id": 14, "text": "chars test < gg"},
	         				{"id": 15, "text": "chars test & gg"},
	         				{"id": 16, "text": "ok"},
	         				{"id": 17, "text": "it\" text"},
	         				{"id": 18, "text": "Brazil"}
	         			];
		   new Meio.Autocomplete.Select($('search_text'), data, {
			    valueField: $('value_field'),
			    valueFilter: function(data){
			        return data.id;
			    },
			    onSelect:function(elements, value){
					alert(value.id);
			    },
				onNoItemToList: function(elements){
					elements.field.node.highlight('#ff0000');
				},
				filter: {
					type: 'contains',
					path: 'text'
				}
				
			});			

	   }    		      
	</script>
</head>
<body onLoad="doOnLoad();">
    <jsp:include page="/jsp/includes/js/tag.jsp" />
	<!--input type="text" name="search_text" id="search_text" select="if (event.keyCode == 13) alert($('search_text').value);"/> <br/-->
	<input type="text" name="search_text" id="search_text" /> <br/>
	<input type="text" name="value_field" id="value_field" /> <br/>
</body>