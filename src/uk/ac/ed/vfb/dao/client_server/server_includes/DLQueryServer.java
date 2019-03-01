package uk.ac.ed.vfb.dao.client_server.server_includes;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
//import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.Set;
import java.util.TreeSet;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
//import org.semanticweb.owlapi.model.OWLEntity;

import uk.ac.ed.vfb.model.OntBean;
//import uk.ac.ed.vfb.service.ThirdPartyBeanManager;

/**
 * @author nmilyaev
 * Top-level wrapper class for query server.
 * Creates all required query engines ands loads ontologies
 * Upon receiving a quiery request forks the query to a desired engine depending on the
 * query type (class or individual)
 */

public class DLQueryServer {

//    private static final IRI ONTOLOGY_IRI = IRI.create("http://obo.cvs.sourceforge.net/viewvc/obo/obo/ontology/anatomy/gross_anatomy/animal_gross_anatomy/fly/fly_anatomy_XP.obo");
	final String lang = System.getProperty("user.language");
	//final String locale = System.getProperty("user.language")+"-"+System.getProperty("user.region");
	//Engine for Elk reasoner
	private ADLQueryEngine engineIndividual;  // Can keep typing as superclass
	//Engine for JFAct reasoner
//	private ADLQueryEngine engineClass;
	//Engine for Brain reasoner
	private ADLQueryEngine engineBrain;
	private static final Log LOG = LogFactory.getLog(DLQueryServer.class);

    public DLQueryServer() {
    	ResourceBundle bundle = ResourceBundle.getBundle("resources");
			String url1 = "";
			String url2 = "";
			try{
				// change "/classes" to "/build" to run locally (in eclipse)
				url1 = getClass().getProtectionDomain().getCodeSource().getLocation().getFile().split("/classes")[0] + bundle.getString("resource_path") + bundle.getString("ont_file_owl");
				url2 = getClass().getProtectionDomain().getCodeSource().getLocation().getFile().split("/classes")[0] + bundle.getString("resource_path") + bundle.getString("ont_file_owl_individuals");
				//LOG.debug("Creating Brain Class reasoner....");
				engineBrain = new DLQueryEngineBrain(url1);
				//LOG.debug("Creating Brain Ind reasoner....");
	    	engineIndividual = new DLQUeryEngineBrainInd(url2);
			}catch (Exception ex) {
				LOG.error("Error creating resoners");
				if (url1!="") {LOG.error("Creating Brain Class reasoner for:" + url1);}
				if (url2!="") {LOG.error("Creating Brain Ind reasoner for:" + url2);}
				ex.printStackTrace();
			}
    }

	/**
	 * Main querying method. Receives and processes the query by invoking corresponding method on
	 * one of the target query engines
	 * A query should be in the form: queryType&Query1,query2...queryn
	 * @param query
	 * @return
	 * @throws IOException
	 */
	public Set<OntBean> askQuery(String query) {
		Set<OntBean> result = new TreeSet<OntBean>();
		String resultStr = "Nohting";
		//LOG.debug("Asking Query: "+ query);
		OntQueryQueue oqq = new OntQueryQueue();
		try{
			oqq.parseQuery(query);
		}
		catch (IndexOutOfBoundsException ex){
			//Thrown is the query string
			return result;
		}
		ADLQueryEngine queryEngine = null;
		if (oqq.getQueryType().equals(OntQueryQueue.QUERY_TYPES[0])){
			//Sublcass
			//queryEngine = engineClass; - obsolete as engineClass was superseeded by engineBrain
			queryEngine = engineBrain;
		}
		else if (oqq.getQueryType().equals(OntQueryQueue.QUERY_TYPES[1])){
			//Individuals
			queryEngine = engineIndividual;
		}
		else if (oqq.getQueryType().equals(OntQueryQueue.QUERY_TYPES[2])){
			//Brain
			queryEngine = engineBrain;
		}
		//LOG.debug("running: " + queryEngine);
		Set<OntBean> entities = queryEngine.askQuery(oqq);
		if (entities != null && !resultStr.isEmpty()){
			result =  entities;
		}
		LOG.info("DLQueryServer returning " + result.size() + " result(s)");
		return result;
	}

	private static String readInput() throws IOException {
		InputStream is = System.in;
		InputStreamReader reader = new InputStreamReader(is);
		BufferedReader br = new BufferedReader(reader);
		return br.readLine();
	}

	private <P> Map<P, List<String>> createLangMap(P p, String lang) {
		final Map<P, List<String>> lMap = new HashMap<P, List<String>>();
		if (lang.length() > 0){
			List<String> langs = new ArrayList<String>();
			langs.add(lang);
			langs.add(""); // default to no language
			lMap.put(p, langs);
		}
		return lMap;
	}

	/** Returns an OntBean given an Id - only works for classes*/
	public OntBean getBeanForId(String fbbtId){
		OntBean result = null;
		if (OntBean.idAsOWL(fbbtId).contains("VFB_")) {
			fbbtId = OntBean.idAsOWL(fbbtId);
		}else{
			fbbtId = OntBean.idAsOBO(fbbtId);
		}
		try {
			//LOG.debug("Trying to retrrieve class for id: " + fbbtId);
			result = engineBrain.getOntBeanForId(fbbtId);
			//LOG.debug("Found?: " + result);
		}
		catch(java.lang.NullPointerException npx){
			LOG.error(npx.getMessage());
			LOG.error("Trying to retrieve individual for id: " + fbbtId);
			try {
				result = engineIndividual.getOntBeanForId(fbbtId);
				LOG.error("Found?: " + result);
			}catch(java.lang.NullPointerException ex){
				LOG.error(ex.getMessage());
				LOG.error("failed to find individual: " + fbbtId);
				result = null;
			}
		}
		return result;
	}

}
