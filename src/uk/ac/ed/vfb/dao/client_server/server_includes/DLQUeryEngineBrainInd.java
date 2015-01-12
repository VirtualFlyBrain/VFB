package uk.ac.ed.vfb.dao.client_server.server_includes;

import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import uk.ac.ebi.brain.core.Brain;
import uk.ac.ebi.brain.error.ClassExpressionException;
import uk.ac.ed.vfb.dao.client_server.server_includes.ADLQueryEngine;
import uk.ac.ed.vfb.model.OntBean;


public class DLQUeryEngineBrainInd extends ADLQueryEngine {
	
	protected static int numThreads = 0;
	protected Brain brain;  // Changed this from static - makes no sense for this to be bound to class!
	protected static boolean isFree = true;
	//private QueryThread queryThread;

	public DLQUeryEngineBrainInd(String ontologyURL) {
		super(ontologyURL);
		try {
			this.brain = new Brain("http://purl.obolibrary.org/obo/", "http://purl.obolibrary.org/obo/fbbt.owl", 32);
			LOG.debug("BRAIN': " + brain + " this " + this);
			this.brain.learn(ontologyURL);
		} 
		catch (Exception e) {
			e.printStackTrace();
		}
		LOG.debug("Ontology: " + this.ontology);
		this.orp = new OwlResultParserClass(this.ontology);
	}
	
	public synchronized Set<OntBean> askQuery(OntQueryQueue oqq) {
		Set<OntBean> results = new TreeSet<OntBean>();
		List<String> queries = oqq.getQueries();
		for (String currExpr: queries){
			//LOG.debug("currExpr: " + currExpr);		
			List<String> Instances = null;
			try {
				Instances = this.brain.getInstances(currExpr, false);
			} catch (ClassExpressionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			//Iterates over the list and print the result.
			for (String Instance : Instances) {
				//LOG.debug("subclas: " + subClass + " results : " + results.size() + " orp : " + orp);
				results.add(orp.getOntBeanForId(Instance));
			}
		}
		//setThirdPartyBeans(results);
		return results;
	}

}
