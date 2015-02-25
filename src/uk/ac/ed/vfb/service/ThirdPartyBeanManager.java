package uk.ac.ed.vfb.service;

import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.ac.ed.vfb.dao.db.ThirdPartyDAO;
import uk.ac.ed.vfb.model.ThirdPartyBean;
import uk.ac.ed.vfb.model.OntBean;

/** Retrieves, creates and manages a ThirdPartyean entity - either single one or a list 
 * The entity is created and its fields are populated based SQL querying 
 * @author nmilyaev
 */ 

public class ThirdPartyBeanManager {
	/** Content of the ontology file */
	private ThirdPartyDAO dao;
	/** May be an overkill at this stage Stick to a list for now is a better solution? */
	/** HashMap for all TPB keyed by fbIds */
	private HashMap<String, ThirdPartyBean> thirdPartyBeansFbId = new HashMap<String, ThirdPartyBean>();
	/** May be an overkill at this stage Stick to a list for now is a better solution? */
	/** HashMap for all TPB keyed by fbIds */
	private HashMap<String, ThirdPartyBean> thirdPartyBeansVfbId = new HashMap<String, ThirdPartyBean>();
	private static final Log LOG = LogFactory.getLog(ThirdPartyBeanManager.class);
	
	/**
	 * Generates a HashTable of all OntBeans from the anatomy file.
	 * For each bean, it retrieves a block of ontology including name, def, etc. corresponding to a single ontology term
	 * Terms start with a "[Term]", and end where next term starts
	 * @param url - full filename of the ontology file 
	 * @return
	 */
	private void generateThirdPartyBeans(){
		//LOG.debug("DAO: " + this.dao);
		List<ThirdPartyBean> beans = dao.getThirdPartyBeans();
		for (ThirdPartyBean bean: beans) {
			thirdPartyBeansFbId.put(bean.getFbId(), bean);
			thirdPartyBeansVfbId.put(bean.getVfbId(), bean);
		}
		LOG.debug("Third Party BEAN LIST GENERATED: " + beans.size());
	}
	
	public ThirdPartyBean createThirdPartyBean(String vfbId, String fbId, String displayName, String resourceName){
		LOG.debug("Creating Third Party Bean: " + vfbId);
		ThirdPartyBean bean = new ThirdPartyBean(vfbId, fbId, displayName, resourceName);
		thirdPartyBeansFbId.put(bean.getFbId(), bean);
		thirdPartyBeansVfbId.put(bean.getVfbId(), bean);
		LOG.debug("Returning: " + bean);
		return bean;
	}
	public ThirdPartyBean createThirdPartyBean(String vfbId){
		LOG.debug("Creating Third Party Bean form ID: " + vfbId);
		OntBean subBean = OntBean.getOntBean(vfbId);
		if (subBean!=null){
			// Resolving fb expression ref
			String fbbtId = vfbId;
			Hashtable<String, String[]> relationships = subBean.getRelationships();
			Enumeration links = relationships.keys();
			String str = "";
			while(links.hasMoreElements()){
				str = (String) links.nextElement();
				if (str.contains("http://flybase.org/reports/")){
					if (relationships.get(str)[0] == "expresses"){
						fbbtId = str.replace("http://flybase.org/reports/", "");
					}
				}
			}
			// Resolving dataset source
			
			ThirdPartyBean bean = new ThirdPartyBean(vfbId, fbbtId, subBean.getName(), "See Ref");
			thirdPartyBeansFbId.put(bean.getFbId(), bean);
			thirdPartyBeansVfbId.put(bean.getVfbId(), bean);
			LOG.debug("Returning: " + bean);
			return bean;
		}else{
			LOG.error("Creating blank tpb (This should not happen!)");
			ThirdPartyBean bean = new ThirdPartyBean(vfbId, null, "See Details", "See Reference");
			thirdPartyBeansFbId.put(bean.getFbId(), bean);
			thirdPartyBeansVfbId.put(bean.getVfbId(), bean);
			LOG.debug("Returning: " + bean);
			return bean;		
		}
	}
	/**
	 * Retrieves a thirdPartyBean instance based on FBid 
	 * @param id
	 * @return
	 */
	public ThirdPartyBean getBeanForFbId(String id){
		//LOG.debug("id: " + id + " > " + this.thirdPartyBeansFbId.get(id));
		return this.thirdPartyBeansFbId.get(id);				
	}
	
	/**
	 * Retrieves a thirdPartyBean instance based on VFBid 
	 * @param id
	 * @return
	 */
	public ThirdPartyBean getBeanForVfbId(String id){
		//LOG.debug("id: " + id + " > " + this.thirdPartyBeansVfbId.get(id));
		return this.thirdPartyBeansVfbId.get(id);				
	}

	public void setDao(ThirdPartyDAO dao) {
		this.dao = dao;
		generateThirdPartyBeans();
	}
	
}
