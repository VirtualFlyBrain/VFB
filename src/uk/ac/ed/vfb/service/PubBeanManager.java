package uk.ac.ed.vfb.service;

import java.util.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import uk.ac.ed.vfb.dao.db.PubDAO;
import uk.ac.ed.vfb.model.PubBean;

/** Retrieves, creates and manages a PubBean entity - either single one or a list 
 * The entity is created and its fields are populated based on SQL query
 * @author nmilyaev
 */ 

public class PubBeanManager {
	protected PubDAO dao;
	private static final Log LOG = LogFactory.getLog(PubBeanManager.class);
	
	public void setDao(PubDAO dao) {
		this.dao = dao;
		LOG.debug("PubBeanManager created dao: " + dao);
	}
	
	public List<PubBean> getBeanListById(String id){
		LOG.debug("getBeanListById: " + id);
		List<PubBean> beanList = dao.getById(id);
		LOG.debug("Returned beanlist: " + beanList.toString());
		return beanList;
	}
	
	public PubBean getBeanByRef(String ref){
		//PubDAO dao = new PubDAO();
		LOG.debug("getBeanByRef: " + ref);
		PubBean bean = new PubBean(ref, ref);
		try{
			if (ref.contains("FlyBase")){
				String[] parts = ref.split(":");
				LOG.debug("FlyBase ref: " + parts[1]);
				LOG.debug("dao: " + dao);
				bean = dao.getByRef(parts[1]);
				LOG.debug("Returned FlyBase bean: " + bean.toString());
				return bean;
			}
			if (ref.contains("FlyBrain_NDB")){
				bean = new PubBean(ref, "FlyBrain Neuron DB");
				LOG.debug("Returned FlyBrain NDB bean: " + bean.toString());
				return bean;
			}
			if (ref.contains("FBC")){
				bean = new PubBean(ref, ref.replace("FBC:", "FlyBase Curator: " ));
				LOG.debug("Returned FBC bean: " + bean.toString());
				return bean;
			}
			LOG.error("Unknown ref: " + ref);
			LOG.debug("Returned bean: " + bean.toString());
			return bean;
		}catch (Exception ex){
			LOG.error("getBeanByRef for: " + ref);
			ex.printStackTrace();
			if (bean!=null){
				LOG.error("returning: " + bean);
				return bean;
			}else{
				LOG.error("returning: null");
				return null;
			}
		}
		
	}
	
	public String toString(){
		return "PubBeanManager";
	}
	
}
