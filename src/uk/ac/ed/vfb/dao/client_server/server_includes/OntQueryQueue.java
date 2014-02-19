package uk.ac.ed.vfb.dao.client_server.server_includes;

import java.util.*;

import uk.ac.ed.vfb.model.OntBean;

/**
 * Wrapper class for anatomy queries. 
 * A query should be in the form: queryType&Query1,query2...queryn, where 
 * queryType is one of the QUERY_TYPES, and queryk is a query in Manchester syntax form
 * It is presumed that all the queries for a single OntQueryQueue is either subclass or individuals - 
 * no mixing up is allowed. 
 * if multiple queries are specified, their results are "AND"ed into a single result set
 * @author nmilyaev
 */

public class OntQueryQueue implements Comparable<OntQueryQueue> {
	public static final String[] QUERY_TYPES = {"subclass", "individual", "brain"}; 
	private List<String> queries = new ArrayList<String>();
	private String queryType;
	private static String AMP = "&";
	private static String COMMA = ",";
	protected Set<OntBean> results = new TreeSet<OntBean>();
	
	public List<String> getQueries() {
		return queries;
	}
	
	public OntQueryQueue() {
		super();
	}

	public OntQueryQueue(String query) {
		super();
		this.parseQuery(query);
	}

	public void setQueries(List<String> queries) {
		this.queries = queries;
	}

	public String getQueryType() {
		return queryType;
	}

	public void setQueryType(String queryType) {
		this.queryType = queryType;
	}
	
	/**
	 * Parses query to extract queryType and individual sub-queries
	 * NB: Query tab separated by "&", individual sub-queries by ","
	 */
	public void parseQuery(String queryStr) {
		boolean success = false;
    	ArrayList<String> queries = new ArrayList<String>();
    	String[] queryParts = queryStr.split("&");
    	if (queryParts.length == 2){ 
	    	this.queryType = queryParts[0].replace("&", "");
	    	this.queries.addAll(Arrays.asList(queryParts[1].split(",")));
	    	if (this.queryType != null && this.queryType.length() > 0 && this.queries != null && this.queries.size() > 0)
	    		success = true;
    	}
    	else { //Empty query type or query string - do our best
    		// Empty query type - assign 
    		if (this.queryType == null || this.queryType.length() < 1){
    			this.queryType = "";
    			this.queries.addAll(Arrays.asList(queryParts[0].split(",")));
    		}
    	}
	}
	
	public String toString(){
		String value = this.getQueries().toString();
		return value;
	}

	@Override
	public int compareTo(OntQueryQueue o) {
		return (this.toString()).compareToIgnoreCase(o.toString());
	}
	
}
