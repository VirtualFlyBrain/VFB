package uk.ac.ed.vfb.model.tree;

import java.util.*;

import javax.swing.tree.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import uk.ac.ed.vfb.model.OntBean;

/**
 * Single node of the anatomy tree
 */

public class OntNode extends DefaultMutableTreeNode {
	public static final String[] roots = {"FBbt:00003624", "FBbt:00000354"};
	private OntBean ontBean;
	private String id = null; // =OntBean.FBbtId
	public static int numNodes=0;
	public static List<OntNode> ontNodes = new ArrayList<OntNode>();
	/** isProtected means the node has already found its parent and is not movable, Used in getModel() */
	private boolean isProtected= false;
	private String nodeJson;
	/** Node id used in javacript. Used to propagate jsNodeId between tree structure and tree content of the node */
	private int jsTreeNodeId;
	private static final Log LOG = LogFactory.getLog(OntNode.class);
	
	/**
	 * Basic constructor 
	 */
	public OntNode(){
		super();
	}
	
	/**
	 * Creates a node per ontBean
	 * @param ontBean
	 */
	public OntNode(OntBean ontBean){
		this.id = ontBean.getFbbtId();
		this.ontBean = ontBean;
		OntNode.ontNodes.add(this);
	}

	/**
	 * Links the nodes from the ontNodes list into a tree-like linked structure
	 * On linking, a node is removed from the ontNode list
	 * @param ontNode
	 * @return
	 */
	public OntNode getModel() {
		for (OntNode curr: ontNodes){
			for(String currParent: curr.ontBean.getParents()){
				if(this.id.equals(currParent)){
					//isProtected means the node has already found its parent and is not movable
					if(!curr.isProtected) {
						this.add(curr);
						curr.isProtected = true;
					}
					else {
						OntNode pp = ((OntNode)curr.parent);
						if(pp.getLevel()<this.getLevel()){
							this.add(curr);
						}
						else if (pp.getLevel()==this.getLevel()){
							// clone the node and insert where you need it
							// perhaps you need to check the type of relationship to make sure it's a is_A
						}
					}					
					curr.getModel();
				}
			}
		}
		return this;
	}
	/**
	 * Generates a string containing as many tabs how deep the node is down the tree 
	 * @return
	 */
	private String addTabs(){
		String tabs = "";
		for (int i=0; i<this.getLevel(); i++){
			tabs = tabs + "\t";
		}
		return tabs;
	}

	/**
	 * Locates an OntNode based on node id (FBBtId)
	 * @param id
	 * @return
	 */
	public OntNode getNodeForId(String id){
		OntNode result = null;
		for(OntNode curr: OntNode.ontNodes) {
			if (curr.id.equals(id)){
				result = curr;
				break;
			}
		}
		return result;
	}

	/**
	 * Counts number of all nodes of the tree;
	 * @return int number of nodes in the tree;
	 */
	public int countNodes(int count){
		count++;
		if(!this.isLeaf()){
			for (OntNode child: (Vector<OntNode>)this.children){
				count = child.countNodes(count);
			}
		}
		return count;
	}

	/**
	 * Given a tree structure and the map of node data produces tree content as Json in a StringBuffer
	 * @param result
	 * @param treeNodeEntries
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public StringBuffer getTreeContentAsJson(StringBuffer result, Map<String, Map<String, String>> treeNodeEntries){
		Map<String, String> attributes = treeNodeEntries.get(this.id);
		String NODE_STRING = "TABS{\n" +
		"TABS  \"nodeId\":\"NODE_ID\",\n" +
		"TABS  \"name\":\"NODE_NAME\",\n" +
		"TABS  \"nodeState\":{\"open\":\"OPEN\", \"selected\":\"false\"},\n"+
		"TABS  \"extId\":[\"EXT_ID\"],\n" +
		"TABS  \"domainData\":{\"domainId\":\"DOMAIN_ID\", \"domainSelected\":\"false\", \"domainColour\":DOMAIN_COLOUR, \"domainCentre\":DOMAIN_CENTRE}\n" +			
		"TABS},\n";
		String nodeJson;
		nodeJson = NODE_STRING.replace("NODE_ID", ""+this.jsTreeNodeId).
		replace("NODE_NAME", this.ontBean.getName()).
		replace("EXT_ID", this.ontBean.getFbbtId());
		//all nodes listed in the domainData file are considered open by default;
		//all those not listed are considered closed by default;
		//all those not listed nodes additionally get the "domainId" removed - that disables the checkbox in javascript 
		if(attributes == null || getAttribute(attributes, "open").equals("")){
			nodeJson = nodeJson.replace("OPEN", "false").replace("\"domainId\":\"DOMAIN_ID\", ", "");
		}
		else {
			nodeJson = nodeJson.replace("OPEN", getAttribute(attributes, "open")).replace("DOMAIN_ID", getAttribute(attributes, "domainId"));
		}
		String tmp = getAttribute(attributes, "colour");
		if(tmp.equals("")){
			nodeJson = nodeJson.replace(", \"domainColour\":DOMAIN_COLOUR", "");
		}
		else{
			nodeJson = nodeJson.replace("DOMAIN_COLOUR", tmp);
		}
		tmp = getAttribute(attributes, "domainCentre");
		if(tmp.equals("")){
			nodeJson = nodeJson.replace(", \"domainCentre\":DOMAIN_CENTRE", "");
		}
		else{
			nodeJson = nodeJson.replace("DOMAIN_CENTRE", tmp);
		}
		nodeJson = nodeJson.replaceAll("TABS", "");
		result.append(nodeJson);
		if(!this.isLeaf()){
			for(OntNode child:(Vector<OntNode>)this.children){
				child.getTreeContentAsJson(result, treeNodeEntries);
			}
		}
		return result;
	}
	
	/**
	 * A wrapper for safe attribute retrieval from a map. 
	 * Returns an attribute value if found, and "" if not found or a map is null
	 * Used by getTreeContentAsJson method
	 */
	private String getAttribute(Map<String, String> attributes, String attrName){
		String result = null;
		if(attributes == null) {
			return "";
		}
		else {
			result = attributes.get(attrName);
		}
		return result==null?"":result;		
	}

	/**
	 * Given a tree structure produces tree structure as Json in a String
	 * @param result
	 * @param treeNodeEntries
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String getTreeStructureAsJson(String result){
		String NODE_STRUCT = "\nTABS{\"node\":{" +
		"\nTABS\"nodeId\":\"NODE_ID\"," +
		"\nTABSCHILDREN" +
		"\nTABS}\nTABS}";
		String CHILDREN_STRUCT = "\"children\":[CHILDREN" +
		"\nTABS]";
		this.jsTreeNodeId = OntNode.numNodes++;
		this.nodeJson = NODE_STRUCT.replace("NODE_ID", ""+jsTreeNodeId);
		result = result + nodeJson;
		String childJson = "";
		if(!this.isLeaf()){
			String currChildJson = "";
			for(OntNode child:(Vector<OntNode>)this.children){
				currChildJson = "";
				currChildJson = child.getTreeStructureAsJson(currChildJson);
				childJson = childJson + currChildJson + ", ";
			}
			childJson = childJson.substring(0, childJson.length()-2);
			childJson = CHILDREN_STRUCT.replace("CHILDREN", childJson).replaceAll("TABS", addTabs());
			nodeJson = nodeJson.replace("CHILDREN", childJson);
		}
		else {
			nodeJson = nodeJson.replace("{\nTABS\"nodeId\"", "{\"nodeId\"").replace(",\nTABSCHILDREN\nTABS", "").replaceAll("TABS", addTabs());
		}
		nodeJson = nodeJson.replaceAll("TABS", addTabs());
		return nodeJson;
	}


	/**
	 * Prunes the tree only keeping only the nodes given in the list and those connecting nodes. 
	 * Deletes the rest of the nodes by removing from parent.
	 */
	@SuppressWarnings("unchecked")
	public void pruneToList(Set<OntBean> list){
		List<OntNode> childrenToRemove = new ArrayList<OntNode>();
		if(!this.isLeaf()){
		for(OntNode on: (Vector<OntNode>)this.children){
			boolean found = false;
			for (OntBean bean:list){
				if(on.id.equals(bean.getFbbtId())){
					found = true;
					break;
				}
			}
			if (!found){
				childrenToRemove.add(on);
			}
		}
		}
		if(!this.isLeaf()){
			for(OntNode on: (Vector<OntNode>)this.children){
				on.pruneToList(list);
		}
		}
		for (OntNode on:childrenToRemove){
			this.remove(on);
			on = null;
			OntNode.numNodes ++;
		}
	}

	public String toString(){
		return (this.id + " : "+ this.ontBean.getName()); 
	}

	public OntBean getOntBean() {
		return ontBean;
	}

	public void setOntBean(OntBean ontBean) {
		this.ontBean = ontBean;
	}

	public boolean isLeaf(){
		return (this.getChildCount()<1);
	}
}
