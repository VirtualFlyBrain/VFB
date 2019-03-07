package uk.ac.ed.vfb.dao.client_server.server_includes;

import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import uk.ac.ebi.brain.core.Brain;
import uk.ac.ebi.brain.error.ClassExpressionException;
import uk.ac.ed.vfb.model.OntBean;
//import uk.ac.ed.vfb.service.ThirdPartyBeanManager;

/**
 * Author: Nestor Milyaev<br>
 * The University of Edinburgh<br>
 * Date: 13-Dec-2012
 */

public class DLQueryEngineBrain extends ADLQueryEngine{
	protected static int numThreads = 0;
	protected Brain brain;  // Changed from static.  Don't want this bound to class.
	//private QueryThread queryThread;

	public DLQueryEngineBrain(String ontologyURL) {
		super(ontologyURL);
		try {
			this.brain = new Brain("http://purl.obolibrary.org/obo/", "http://purl.obolibrary.org/obo/fbbt.owl", 32);
			//LOG.debug("BRAIN': " + brain + " this " + this);
			brain.learn(ontologyURL);
		} 
		catch (Exception e) {
			e.printStackTrace();
		}
		//LOG.debug("Ontology: " + this.ontology);
		this.orp = new OwlResultParserClass(this.ontology);
	}
	
	public synchronized Set<OntBean> askQuery(OntQueryQueue oqq) {
		Set<OntBean> results = new TreeSet<OntBean>();
		List<String> queries = oqq.getQueries();
		for (String currExpr: queries){
			//LOG.debug("currExpr: " + currExpr);		
			List<String> subClasses = null;
			try {
				subClasses = this.brain.getSubClasses(currExpr, false);
			} catch (ClassExpressionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			//Iterates over the list and print the result.
			for (String subClass : subClasses) {
				//LOG.debug("subclas: " + subClass + " results : " + results.size() + " orp : " + orp);
				results.add(this.orp.getOntBeanForId(subClass));
			}
		}
		//setThirdPartyBeans(results);
		return results;
	}

}
