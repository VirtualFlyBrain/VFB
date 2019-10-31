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
	PubDAO dao;
	protected static final Log LOG = LogFactory.getLog(PubBeanManager.class);
	
	public void setDao(PubDAO dao) {
		this.dao = dao;
	}
	
	public List<PubBean> getBeanListById(String id){
		LOG.debug("getBeanListById: " + id);
		List<PubBean> beanList = dao.getById(id);
		LOG.debug("Returned beanlist: " + beanList);
		return beanList;
	}
	
	public List<PubBean> getBeanListByRefIds(List<String> ids){
		LOG.debug("getBeanListByRefId: " + ids);
		List<PubBean> beanList = dao.getByRefIds(ids);
		LOG.debug("Returned beanlist: " + beanList);
		return beanList;
	}

}
