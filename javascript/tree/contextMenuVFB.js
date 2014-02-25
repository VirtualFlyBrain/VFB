/**
name: ContextMenuVFB
description: provides processing for the context menu 

@author: NM
 */
//create a context menu
function createMenu(tree, offset) {
	//alert("createMenu " + offset)
	var context = new ContextMenu({
		targets: 'span.mif-tree-name', //menu only spans element with given id
		menu: 'contextmenu',
		actions: {
			subclass:function(element, ref){
				//console.log("currId: " + currBeanId + "element: " + element.id);
				//action used to display query name, id used for the query
				fireQuery("/do/ont_bean_list.html?action=subclass&id=", tree, element);
				//fireLightBox("/do/ont_bean_list.html?action=found&id=" + currNode.fbId, 600, 800);
			},
			found:function(element, ref){
				//console.log("currId: " + currBeanId + "element: " + element.id);
				//action used to display query name, id used for the query
				fireQuery("/do/ont_bean_list.html?action=found&id=", tree, element);
				//fireLightBox("/do/ont_bean_list.html?action=found&id=" + currNode.fbId, 600, 800);
			},
			synaptic:function(element, ref){
				//action used to display query name, id used for the query
				fireQuery("/do/ont_bean_list.html?action=synaptic&id=", tree, element);
				//fireLightBox("/do/ont_bean_list.html?action=synaptic&id=" + currNode.fbId, 600, 800);
			},
			presynaptic:function(element, ref){
				//action used to display query name, id used for the query
				fireQuery("/do/ont_bean_list.html?action=presynaptic&id=", tree, element);
				//fireLightBox("/do/ont_bean_list.html?action=presynaptic&id=" + currNode.fbId, 600, 800);
			},
			postsynaptic:function(element, ref){
				//action used to display query name, id used for the query
				fireQuery("/do/ont_bean_list.html?action=postsynaptic&id=", tree, element);
				//fireLightBox("/do/ont_bean_list.html?action=postsynaptic&id=" + currNode.fbId, 600, 800);
			},	
			cluster_found:function(element, ref){
				//console.log("currId: " + currBeanId + "element: " + element.id);
				//action used to display query name, id used for the query
				fireQuery("/do/cluster_list.html?action=cluster_found&id=", tree, element);
				//fireLightBox("/do/ont_bean_list.html?action=found&id=" + currNode.fbId, 600, 800);
			},
			tract:function(element, ref){
				//action used to display query name, id used for the query
				fireQuery("/do/ont_bean_list.html?action=tract&id=", tree, element);
				//fireLightBox("/do/ont_bean_list.html?action=tract&id=" + currNode.fbId, 600, 800);
			},
			transgene:function(element, ref){
				//action used to display query name, id used for the query
				fireQuery("/do/gene_list.html?action=transgene&id=", tree, element);
				//fireLightBox("/do/gene_list.html?action=transgene&id=" + currNode.fbId, 600, 800);
			},
			geneex:function(element, ref){
				//action used to display query name, id used for the query
				fireQuery("/do/gene_list.html?action=geneex&id=", tree, element);
				//fireLightBox("/do/gene_list.html?action=geneex&id=" + currNode.fbId, 600, 800);
			},
			phenotype:function(element, ref){
				//action used to display query name, id used for the query
				fireQuery("/do/gene_list.html?action=phenotype&id=", tree, element);
				//fireLightBox("/do/gene_list.html?action=phenotype&id=" + currNode.fbId, 600, 800);
			},
			include:function(element, ref){
//				alert("include "+ parent.$("query_builder"));					
				var currNode = tree.selected;
				parent.$('query_builder').set('src', '/do/query_builder.html?action=add&rel=include&fbId='+currNode.fbId);
//				parent.$('query_builder').set('src', '/do/query_builder.html');
			},
			exclude:function(element, ref){
				var currNode = tree.selected;
//				alert("exclude "+ parent.$("query_builder"));
				parent.$('query_builder').set('src', '/do/query_builder.html?action=add&rel=exclude&fbId='+currNode.fbId);
//				parent.$('query_builder').set('src', '/do/query_builder.html');
			},
			copy: function(element,ref) { //copy action changes the element's color to green and disables the menu
				element.setStyle('color','#090');
				ref.disable();
			}
		},
		offsets: offset
	}); 
	return false;
}

/**
 * Saves recent query into the cookie and fires the query in the lightbox
 * Before firing it extracts the id as follows:
 * If element has an id - it is used
 * otherwise used the id of the selected tree node.
 * That is done so as to allow firing of the query off the stan-alone hooks and links
 * @param action
 */
function fireQuery(action, tree, element){
	//alert("saving "+ action);
	//alert("fireQuery : " + element + " : " + element.id);
	var currNode = tree.selected;
	var id = null;
	if(currNode === undefined || currNode == null){
		id = element.id;
	}
	else
	{
		id = currNode.fbId;
	}	
	//alert("fireQuery : " + id);
	action = action + id;
	if (id === undefined || id == null || id == "") {
		alert("Unable to run query: you need to choose an anatomy term first");
	}
	else{
		Cookie.write("recentQuery", action);
		fireLightBox(action, 600, 800);
	}
}

/**
 * Toggles the $('recent_query') link visible or hidden depending on whether the recent query exists or not 
 */
function toggleResultLink(){
	var cookieValue = Cookie.read("recentQuery");
	//alert("cookie: "+ cookieValue);
	if (cookieValue!==undefined && cookieValue!=null && cookieValue!=''){
		//$('recent_query').removeStyle('display');
		$('recent_query').setStyle('display','block');
	}
	else {
		//$('recent_query').removeStyle('display');
		if ($('recent_query') !=null && $('recent_query') !== undefined) {
			$('recent_query').setStyle('display','none');
		}
	}
}