package uk.ac.ed.vfb.model;

import java.io.Serializable;
import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * POJO class for individuals (neurons, clones). 
 */

public class OntBeanIndividual extends OntBean implements Serializable{
	/** Moved to the main OntBean class */
	//private ThirdPartyBean thirdPartyBean; // used for integration with third party sources - use driverRef for linking
	/** Map of all types that the individual is a child of in the form key:value eg., "FBbt:00000006 : head segment" */
	private HashMap<String, String> types;
	
	private static final Log LOG = LogFactory.getLog(OntBeanIndividual.class);

	public OntBeanIndividual(String fbbtId) {
		super(fbbtId);
		this.types = new HashMap<String, String>();
	}

	public ThirdPartyBean getThirdPartyBean() {
		return thirdPartyBean;
	}

	public void setThirdPartyBean(ThirdPartyBean thirdPartyBean) {
		this.thirdPartyBean = thirdPartyBean;
	}

	public HashMap<String, String> getTypes() {
		return types;
	}

	public void setTypes(HashMap<String, String> types) {
		this.types = types;
	}
	
	@Override
	public String getFbbtId() {
		return OntBean.idAsOWL(fbbtId);
	}

	@Override
	public void setFbbtId(String fbbtId) {
		this.fbbtId = OntBean.idAsOWL(fbbtId);
	}
	
}
