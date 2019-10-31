package uk.ac.ed.vfb.ont_query.model;

import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.APageable;
import uk.ac.ed.vfb.service.OntBeanManager;
import uk.ac.ed.vfb.web.WebQueryUtils;

/**
 * This represent a ontology query.
 * A query consists of the type definition and a list of arguments.
 * The arguments are "ANDed" by default
 * The inclusion/exclusion is no currently used
 */

public class OntQueryManager extends APageable{
	private List<Argument> arguments;
	/** A map representing query type: 
	 * a key == text in the choice box, 
	 * String[]:
	 * 1 - human-readable text for the interface,
	 * 2 - core of the OWL query
	 * 3 - clause for each of the arguments */ 
	public static final String[] relations = {"include", "exclude"};
	private static final Log LOG = LogFactory.getLog(OntQueryManager.class); 

	public OntQueryManager() {
		this.arguments = new ArrayList<Argument>();
	}

	public OntQueryManager(String queryType) {
		this.arguments = new ArrayList<Argument>();	
	}

	public List<Argument> getArguments() {
		return arguments;
	}

	/**
	 * Adds an argument to the list.
	 * Returns true if successfully added, 
	 * false if element with this fbbtId already exists 
	 * @param arg
	 * @return
	 */
	public boolean addArgument(Argument arg){
		Iterator<Argument> it = this.arguments.iterator();
		boolean found = false;
		while (it.hasNext()){
			if (arg.getOntBean().getId().equals(it.next().getOntBean().getId())){
				found = true;
				break;
			}
		}
		if (!found){
			this.arguments.add(arg);
		}
		return !found;
	}
	
	/** Convenience method */
	public Argument getArgumentAt(int index) {
		Argument arg = null;
		try {
			arg = arguments.get(index);
		}
		catch(IndexOutOfBoundsException ex){} 
		return arg;
	}

	/** Sets argument at index to a new ontBean as specified by fbId parameter 
	 * that allows changing a query argument
	 */
	public void setArgumentAt(int index, String fbId) {
		// to do stuff
	}

	public void deleteArgumentAt(int index){
		try{
			this.arguments.remove(index);
		}
		catch(IndexOutOfBoundsException ex){
			LOG.error("Trying to delete non-existing entry at " + index);
		}
	}

	/**
	 * Provides a human-readable query text, eg "Find all neurons that have synaptic terminals in adult antennal lobe"
	 * @return
	 */
	public String getQueryText(){
		StringBuffer sb = new StringBuffer();
		String invalidQuery = "Invalid query: ";
		if (this.arguments.size()==0) return null;
		List<Argument> positives = new ArrayList<Argument>();
		List<Argument> negatives = new ArrayList<Argument>();
		Iterator<Argument> it = this.arguments.iterator();
		while (it.hasNext()){
			Argument arg = it.next();
			// AND
			if (arg.getRelation().equals(relations[0])){
				positives.add(arg);
			}
			// NOT 
			else if (arg.getRelation().equals(relations[1])){
				negatives.add(arg);
			}
		}
		if (positives.size() == 0){
			invalidQuery = invalidQuery + "You need to specify at least one positive leg first";
			sb.append(invalidQuery);
		}
		else {
			sb.append("Find all neurons that <br/>");
			it = positives.iterator();
			int i = 0;
			while (it.hasNext()){
				Argument arg = it.next();
				if (i++ > 0) {
					sb.append(" and ");
				}
				sb.append(WebQueryUtils.getInterfaceString(arg.getType()) + "<i>" + arg.getOntBean().getName() + "</i><br/>");
			}
			if (negatives.size() > 0){
				sb.append(" excluding neurons that ");
			}
			it = negatives.iterator();
			i = 0;
			while (it.hasNext()){
				Argument arg = it.next();
				if (i++ > 0) {
					sb.append(" or ");
				}				
				sb.append(arg.getOntBean().getName() + "<br/>");
			}
		}
		//LOG.info(sb);
		return sb.toString().trim();
	}
	
	/**
	 * Fires a query and returns the result as a set of OntBeans
	 * @param obm
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public SortedSet<OntBean> executeQuery(OntBeanManager obm){
		resultSet = new TreeSet<OntBean>();
		Iterator<Argument> it = this.arguments.iterator();
		int i=0;
		while (it.hasNext()){
			//construct individual queries
			Argument arg = it.next();
			String query = WebQueryUtils.getDefString(arg.getType(), arg.getOntBean().getFbbtId());
			//run query and extract all the OntBeans.
			Set<OntBean> queryResults = obm.getBeanListForQuery(query);
			LOG.debug("Query: " + query + " : " + queryResults);
			// If resultSet is not empty, and it is the first leg, add/subtract result set from the intBeans set.
			if (resultSet.size()==0 && i++ == 0){
				resultSet.addAll(queryResults);
			}
			else {
				// AND, aka INTERSECTION
				if (arg.getRelation().equals(relations[0])){
					resultSet.retainAll(queryResults);
				}
				// NOT, aka DIFFERENCE
				else if (arg.getRelation().equals(relations[1])){
					resultSet.removeAll(queryResults);
				}
			}
		}
		//LOG.info("Found: " + resultSet.size());
		return resultSet;
	}

}
