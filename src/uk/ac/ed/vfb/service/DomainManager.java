package uk.ac.ed.vfb.service;

import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.ac.ed.vfb.model.OntBean;

/** Manages a llist of selected domains. Used by uk.ac.ed.vfb.web.DomainController 
 * CURRENTLY NOT USED!!! Was superseeded by cookies-based approach 
 * @author nmilyaev
 * @see DomainController
 */ 

public class DomainManager extends APageable{
	/** Default OBM */
	protected OntBeanManager obm;
	/** Basic query to find all children prior to blasting the search on each of them */ 
	@SuppressWarnings("unused")
	private static final Log LOG = LogFactory.getLog(DomainManager.class); 
	
	
	public DomainManager() {
		super();
		obm = new OntBeanManager();
	}

	/**
	 * Adds given bean to the resultSet, based on the FBbt id given 
	 * @param id
	 */
	@SuppressWarnings("unchecked")
	public void addBean(String id){
		OntBean ontBean = obm.getBeanForId(id);
		obm.resultSet.add(ontBean);
	}

	/**
	 * Removes given bean from the resultSet, based on the FBbt id given
	 * @param id
	 */
	public void removeBean(String id){
		OntBean ontBean = obm.getBeanForId(id);
		obm.resultSet.remove(ontBean);
	}
	
	@SuppressWarnings("unchecked")
	public SortedSet<String> getDomainIdList(){
		SortedSet<String> domainIdList = new TreeSet<String>();
		Iterator<OntBean> it = obm.getResultSet().iterator(); 
		while (it.hasNext()){
			domainIdList.add(it.next().getFbbtId());
		}
		return domainIdList;
	}

	public OntBeanManager getObm() {
		return obm;
	}

	public void setObm(OntBeanManager obm) {
		this.obm = obm;
	}
	
}
