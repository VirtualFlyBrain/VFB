package uk.ac.ed.vfb.model.tree;

import java.io.*;
import java.util.*;
import javax.swing.*;
import javax.swing.tree.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.OntBeanManager;

//Fix me (if needed?):

///**
// * Driver class for creating a JTree from given ontology and domainData files.
// */
//
//public class OntTreeManager {
//	public  JTree tree;
//	private OntNode root;
//	public OntBeanManager obm;
//	public static String INITIAL_QUERY = "FBbt_00003624 or (FBbt_00005137 or FBbt_00041000 or FBbt_00040007 or FBbt_00040006) and part_of some FBbt_00003624";
//	/** a hash map of all the attribute values retrieved from the domainData.txt file. Used for JSON generation */
//	private Map<String, Map<String, String>> treeNodeEntries = new HashMap<String, Map<String,String>>();
//	/** Attributes used in the tree node for Json generation */
//	protected static final String[] ATTRIBUTE_NAMES = {"id", "open", "domainId", "colour", "domainCentre"};
//	private static final Log LOG = LogFactory.getLog(OntTreeManager.class);
//
//	public OntTreeManager(){
//		String url = getClass().getProtectionDomain().getCodeSource().getLocation().getFile();
//		LOG.debug(url);
//		Resource res = new FileSystemResource(url + "beans.xml");
//		XmlBeanFactory factory = new XmlBeanFactory(res);
//		obm = (OntBeanManager) factory.getBean("ontBeanManager");
//	}
//
//	/**
//	 * Generates tree structure and draws the tree as specifued:
//	 * if the param root is null all the tree nodes are generated from 
//	 * scratch; otherwise the provided tree structure with the root node is 
//	 * used to create a JTree  
//	 * @param root
//	 * @return
//	 */
//	public JTree createTree(OntNode root){
//		if (root == null){
//			Set<OntBean> ontBeans = this.obm.getBeanListForQuery(INITIAL_QUERY);
//			root = new OntNode(this.obm.getBeanForId(OntNode.roots[0]));
//			this.root = root;
//			OntNode newChild;
//			for (OntBean curr : ontBeans){
//				if(!curr.getFbbtId().equals(OntNode.roots[0])){
//					newChild = new OntNode(curr);
//				}
//			}
//			OntNode.numNodes = ontBeans.size() + 1;
//			root.getModel();
//		}
//		JFrame frame = new JFrame("Tree");
//		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);	
//		this.tree = new JTree(root);
//		JScrollPane pane = new JScrollPane(this.tree);
//		frame.getContentPane().add(pane);
//		frame.setSize(500, 500);
//		frame.show();
//		return this.tree;
//	}
//
//	/**
//	 * Generates a Json StringBuffer for the tree content and saves as a file with given name
//	 * @param filename
//	 * @return
//	 */
//	public StringBuffer getTreeContentAsJson(String filename){		
//		OntNode.numNodes = 0;
//		StringBuffer result = new StringBuffer("[\n");
//		// result will hold the tree json after that operation:
//		((OntNode)root).getTreeContentAsJson(result, treeNodeEntries);
//		result = new StringBuffer(result.subSequence(0, result.length()-2));
//		result.append("\n]");
//		LOG.debug(result);
//		saveToFile(filename, result.toString());
//		return result;
//	}
//
//	/**
//	 * Generates a Json String for the tree structure and saves as a file with given name
//	 * @param filename
//	 * @return
//	 */
//	public String getTreeStructAsJson(String filename){		
//		OntNode.numNodes = 0;
//		String result = "";
//		// result will hold the tree json after that operation:
//		result = ((OntNode)root).getTreeStructureAsJson(result);
//		LOG.debug(result);		
//		saveToFile(filename, result.toString());
//		return result;
//	}
//
//	/**
//	 * Prunes a tree according to the domainData file (or rather according to the treeNodeEntries hash)
//	 * Keeps only those nodes included in the file and the connecting nodes; discards the rest.
//	 * Currently not used.
//	 * @param treeDataFileName
//	 */
//	@SuppressWarnings("unchecked")
//	public void pruneTree(){
//		Set<OntBean> nodesToKeep = new TreeSet<OntBean>();
//		List<OntNode> currNodesToKeep;
//		Iterator it = treeNodeEntries.entrySet().iterator();
//		OntNode foundNode;
//		Map.Entry<String, Map<String, String>> currEntry;
//		while (it.hasNext()) {
//			currEntry = (Map.Entry<String, Map<String, String>>)it.next();
//			foundNode = root.getNodeForId(currEntry.getKey());
//			TreeNode[] path = foundNode.getPath();
//			for (TreeNode currNode: path){
//				nodesToKeep.add(((OntNode)currNode).getOntBean());
//			}
//	//			LOG.debug(currEntry.getKey() + " = " + currEntry.getValue() + ">>>" + currNodesToKeep);
//		}
//		// Prune the tree to contain only those found Paths
//		OntNode.numNodes = 0;
//		root.pruneToList(nodesToKeep);
//	}
//
//	// Fix me (if needed?):
////	
////	/**
////	 * Reads node data from domainData file and parses it as a Hash usable by further JSON generation code.
////	 * @return HashMap 
////	 */
////	private void getTreeNodeEntries(String treeDataFileName){
////		ResourceBundle bundle = ResourceBundle.getBundle("resources");
////		String url = getClass().getProtectionDomain().getCodeSource().getLocation().getFile().split("/classes")[0] + 
////		bundle.getString("resource_path") + treeDataFileName;
////		LOG.debug(".............url: "+ url);
////		 
////error->		StringBuffer fileContent = this.obm.initFileContent(url);
////		// Get the list of all nodes as a hash map
////		String[] lines = fileContent.toString().split("\n");
////		Map<String, String> attributes;
////		String tmp;
////		int numLines = 0;
////		for (String currLine: lines){
////			if (currLine.startsWith("#")) continue;
////			attributes = new HashMap<String, String>();
////			for (int i=1; i<ATTRIBUTE_NAMES.length; i++){
////				tmp = getStrValue(currLine, ATTRIBUTE_NAMES[i] + ":", ";");
////				attributes.put(ATTRIBUTE_NAMES[i], tmp);
////			}
////			// id 
////			tmp = getStrValue(currLine, ATTRIBUTE_NAMES[0] + ":", ";");
////			treeNodeEntries.put(tmp, attributes);		
////			numLines ++; 
////		}
////	}
//	
//	/**
//	 * Utility method - called from getTreeNodeEntries().
//	 * @param string
//	 * @param start
//	 * @param end
//	 * @return
//	 */
//	private String getStrValue(String string, String start, String end){
//		String[] parts = string.split(start);
//		if (parts.length < 2) return "";
//		int endIndex = parts[1].indexOf(end)!=-1?parts[1].indexOf(end):parts[1].length();
//		return parts[1].substring(0, endIndex).replaceAll("\"", "").trim();
//	}
//	
//	/**
//	 * Utility method - used by getTreeStructAsJson() and getTreeContentAsJson()
//	 * @param fileName
//	 * @param content
//	 */
//	private void saveToFile(String fileName, String content){
//		ResourceBundle bundle = ResourceBundle.getBundle("resources");
//		String url = getClass().getProtectionDomain().getCodeSource().getLocation().getFile().split("build/")[0] + 
//		bundle.getString("web_tree_path") + fileName;
//		LOG.debug(".............url: "+ url);
//		Writer out = null;
//		try {
//			out = new OutputStreamWriter(new FileOutputStream(url), "UTF-8");
//			out.write(content);
//		}
//		catch(Exception ex){
//			LOG.error(ex.getMessage());
//		}
//		finally {
//			try {
//				out.close();
//			}
//			catch(Exception ex){
//				LOG.error(ex.getMessage());
//			}
//		}
//	}
//
//	/**
//	 * Poorly wrapped-up method; creates trees as needed - please see the method code for examples
//	 * @param args
//	 */
//	public static void main(String args[]) {
//		long startTime = System.currentTimeMillis();
//		OntTreeManager mgr = new OntTreeManager();
//		mgr.createTree(null);
//		System.out.println("TREE CREATION TIME " + (System.currentTimeMillis() - startTime)/1000);
////		LOG.debug("CountNodes: " + mgr.root.countNodes(0));
//		mgr.getTreeNodeEntries("domainData.txt");
//		// If desired, the tree could be pruned down as outlined in the domainData file; 
//		// currently not used
////		mgr.pruneTree();
//		mgr.createTree(mgr.root);
//		mgr.getTreeStructAsJson("treeStructure.jso");
////		LOG.debug("CountNodes: " + mgr.root.countNodes(0));	
//		mgr.getTreeContentAsJson("treeContent.jso");
//		// If needed, we can also generate tree for Janelia stack. 
////		mgr.getTreeNodeEntries("domainData_Jan.txt");
////		mgr.createTree(mgr.root);
////		mgr.getTreeContentAsJson("treeContentJan.jso");
//	
//		long endTime = System.currentTimeMillis();
//		System.out.println("TOTAL TIME " + (endTime - startTime)/1000);
//	}
//}
