package uk.ac.ed.vfb.service;

import java.util.HashMap;
import java.util.Set;
import java.util.SortedSet;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.ac.ed.vfb.dao.client_server.OWLClient;
import uk.ac.ed.vfb.dao.client_server.server_includes.OwlResultParserClass;
import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.model.ThirdPartyBean;
import uk.ac.ed.vfb.web.exception.SessionExpiredException;

/** Retrieves, creates and manages a OntBean entity - either single one or a list 
 * The entity is created and its fields are populated based on text parsing on ontology OBO file
 * NB: the way of creating annotation fields may be changed to anything as required, eg OWL API.
 * @author nmilyaev
 */ 

public class OntBeanManager extends APageable {
	/** Content of the ontology file */
	private static final String GET_ALL_INDIVIDUALS = "individual&FBbt_10000000";
	public static HashMap<String, OntBean> ontBeans = new HashMap<String, OntBean>();
	/* How many individual beans there are in the ontology.
	 * We first guess there should be at least 1000 and then put proper number in the  getIndividuals() method  */
	private static int individualBeanCount = 1000;
	private static ThirdPartyBeanManager tpbm = null;
	/** Ontology client - used for ontology querying */
	private OWLClient ontClient;
	private static final Log LOG = LogFactory.getLog(OntBeanManager.class);
	
	/** Individuals for id can not be found in run-time, so we need to 
		 pre-create all the individual beans first*/
	private void getIndividuals() {
		LOG.debug(">>>>>>>>>>>>>>>>>>>>>>>>> Trying to create individuals, found beans: " +  " > " + ontBeans.size()) ;
		if (ontBeans.size() < individualBeanCount) {
			Set<OntBean> individuals = getBeanListForQuery(GET_ALL_INDIVIDUALS);
			addBeansToHash(individuals);
			individualBeanCount = ontBeans.size();
			LOG.debug(">>>>>>>>>>>>>>>>>>>>>>>>> Individuals created" + ontBeans.size() + "> " + individuals.size());
		}
	}
	
	/**
	 * Queried the ontology and returns a list of OntBeans satisfying the query 
	 * @param query
	 * @return
	 */
	public Set<OntBean> getBeanListForQuery(String query){
		LOG.debug("OWL Query: " + query);
		long startTime = System.currentTimeMillis();
		//LOG.debug("REsultSEt: " + this.resultSet);
		this.resultSet.clear();
		this.resultSet = (SortedSet<OntBean>) ontClient.askQuery(query);
		//Only use setThirdPartyBeans if tpbm is not null.
		// Server-side instance will not have it
		if (tpbm != null){
			setThirdPartyBeans(resultSet);
		}
		addBeansToHash(this.resultSet);
		long endTime = System.currentTimeMillis();
		LOG.debug("Total time creating all the beans is : "+ (endTime-startTime) + " Bean count: " + resultSet.size());
		return resultSet;
	}

	/** Stores all found beans in the hash for future use */
	private void addBeansToHash(Set<OntBean> beans){
		if (beans == null || beans.size() < 1)return;
		for (OntBean bean:beans){
			ontBeans.put(bean.getFbbtId(), bean);
		}
	}

	public OntBean getBeanForId(String fbbtId){
		LOG.debug("getBeanForId: " + fbbtId + " as OWL: " + OntBean.idAsOBO(fbbtId));
		OntBean result = this.ontBeans.get(OntBean.idAsOBO(fbbtId));
		LOG.debug("bean = " + result);
		if (result == null) {
			LOG.debug("Creating new bean");
			result = ontClient.getBeanForId(fbbtId);
			ThirdPartyBean tpb =  tpbm.getBeanForVfbId(OntBean.idAsOWL(result.getFbbtId()));
			if ( tpb!=null){
				tpb.setName(result.getName());
			}
			result.setThirdPartyBean(tpb);
			LOG.debug("OBM result: " + result);
			this.ontBeans.put(result.getFbbtId(), result);
			LOG.debug("new bean:  " + result);
		}
		return result;
	}

	protected void setThirdPartyBeans(Set<OntBean> ontBeans){
		//LOG.debug("ThirdPartyBeans : "+ tpbm);
		for (OntBean ob: ontBeans) {
			ThirdPartyBean tpb =  tpbm.getBeanForVfbId(OntBean.idAsOWL(ob.getFbbtId()));
			if ( tpb!=null){
				tpb.setName(ob.getName());
			}
			ob.setThirdPartyBean(tpb);
//			LOG.debug("Curr bean: " + ob.idAsOWL(ob.getFbbtId()) + " TPB: " + ob.getThirdPartyBean() + " parent: " + tpb.getParentFBbt());
		}
	}
	
	public void setOntClient(OWLClient ontClient) {
		this.ontClient = ontClient;
	}

	public void setTpbm(ThirdPartyBeanManager tpbm) {
		this.tpbm = tpbm;
		// That should be inside the setOntClient, but since the TPBM is assigned to an obm instance second, do it here
		this.getIndividuals();
	}	
	
}
