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
		LOG.debug("DAO: " + this.dao);
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
			LOG.debug("Finding fbref: " + fbbtId);
			Hashtable<String, String[]> relationships = subBean.getRelationships();
			Enumeration links = relationships.keys();
			String str = "";
			while(links.hasMoreElements()){
				str = (String) links.nextElement();
				LOG.debug("Found relationship:" + str);
				if (str.contains("http://flybase.org/reports/")){
					LOG.debug("Checking: " + relationships.get(str)[0]);
					if (relationships.get(str)[0] == "expresses"){
						fbbtId = str.replace("http://flybase.org/reports/", "");
						LOG.debug("Using: " + fbbtId);
					}
				}
			}
			LOG.debug("Finished with fb ref of: " + fbbtId);
			// Resolving dataset source - TBD resolve from OWL
			String source = "See the listed reference";
			String link = "/site/vfb_site/image_data_downloads.htm";
			LOG.debug("Finding source: " + source);
			if (subBean.getRefs()!=null){
				List<String> refs = subBean.getRefs(); 
				LOG.debug("Found " + refs.size() + " reference(s)");
				for (String curr : refs) {
					/**	Yu2013			PMID:23541733	FBrf0221412		
					*	Ito2013			PMID:23541729	FBrf0221438
					*	CacheroOstrovsky2010	PMID:20832311	FBrf0211926	
					*/ 
					source=curr;
					LOG.debug("Found source: " + source);
					if (curr.contains("PMID:20832311") || curr.contains("FBrf0211926")){
						source="CacheroOstrovsky2010";
						link="/site/vfb_site/image_data_downloads.htm#CacheroOstrovsky2010";
					}
					if (curr.contains("PMID:23541729") || curr.contains("FBrf0221438")){
						source="Ito2013";
						link="/site/vfb_site/image_data_downloads.htm#Ito2013";
					}
					if (curr.contains("PMID:23541733") || curr.contains("FBrf0221412")){
						source="Yu2013";
						link="/site/vfb_site/image_data_downloads.htm#Yu2013";
					}
				}
			}else{
				LOG.debug("Found no references!");
			}
			LOG.debug("Finished with source: " + source + " -> " + link);
			ThirdPartyBean bean = new ThirdPartyBean(vfbId, fbbtId, subBean.getName(), source, link);
			thirdPartyBeansFbId.put(bean.getFbId(), bean);
			thirdPartyBeansVfbId.put(bean.getVfbId(), bean);
			LOG.debug("Returning: " + bean);
			return bean;
		}else{
			LOG.error("Creating blank tpb (This should not happen!)");
			ThirdPartyBean bean = new ThirdPartyBean(vfbId, null, "See Details", "See Reference", "/site/vfb_site/image_data_downloads.htm");
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
		LOG.debug("id: " + id + " > " + this.thirdPartyBeansFbId.get(id));
		return this.thirdPartyBeansFbId.get(id);				
	}
	
	/**
	 * Retrieves a thirdPartyBean instance based on VFBid 
	 * @param id
	 * @return
	 */
	public ThirdPartyBean getBeanForVfbId(String id){
		LOG.debug("id: " + id + " > " + this.thirdPartyBeansVfbId.get(id));
		return this.thirdPartyBeansVfbId.get(id);				
	}

	public void setDao(ThirdPartyDAO dao) {
		this.dao = dao;
		generateThirdPartyBeans();
	}
	
}
