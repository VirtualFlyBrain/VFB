package uk.ac.ed.vfb.model;

import java.io.Serializable;
import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.apache.commons.lang.StringUtils;

import uk.ac.ed.vfb.model.PubBean;
import uk.ac.ed.vfb.service.PubBeanManager;

/**
 * POJO class for anatomy term. The most important POJO class
 */

public class OntBean implements Comparable<Object>, Serializable{
	protected String fbbtId;
	protected String name;
	protected String def;
	protected String comment;	
	protected List<String> synonyms;
	protected List<PubBean> refs;
	/** List of key:value[] pairs describing relationships, eg "FBbt:00000020 :[part_of, abdomen]" */
	protected Hashtable<String, String[]> relationships;
	/** Map of key:value pairs, eg., "FBbt:00000006 : head segment" */
	protected HashMap<String, String> isa;
	protected String id; //Pure numerical id, without "FBbt:"
	protected ThirdPartyBean thirdPartyBean; // used for integration with third party sources - use driverRef for linking.
	private static final Log LOG = LogFactory.getLog(OntBean.class);
	private PubBeanManager pbm;

	/**
	 * Static factory-like method - only creates new bean if the FBbt returned != "Nothing"
	 * Used when creating beans after outcome from OWLClient query.
	 */
	public static OntBean getOntBean(String value){
		if (value.equals("Nothing")) return null;
		//Bring id to OBO format just to be sure...
		return new OntBean(value.replace("_", ":"));
	}

	public OntBean() {
		super();
		this.isa = new HashMap<String, String>();
		this.relationships = new Hashtable<String, String[]>();
	}

	public OntBean(String fbbtId) {
		this();
		this.fbbtId = OntBean.idAsOBO(fbbtId);
	}

	public String getFbbtId() {
		return fbbtId;
	}

	public void setFbbtId(String fbbtId) {
		this.fbbtId = fbbtId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDef() {
		return def;
	}

	public void setDef(String def) {
		this.def = def;
	}

	public List<String> getSynonyms() {
		return synonyms;
	}

	public void setSynonyms(List<String> synonyms) {
		this.synonyms = synonyms;
	}

	public List<PubBean> getRefs() {
		return refs;
	}

	public void setRefs(List<String> refs) {
		List<PubBean> results = null;
		LOG.debug("Adding refs: " + StringUtils.join(refs, ",");
		for (String ref:refs) {
			if (ref != null && !ref.isEmpty()){
				try {
					if (ref.contains(":")){
						String[] parts = ref.split(":");
						results.add(pbm.getBeanByRef(parts[1]));	
					}else
						results.add(pbm.getBeanByRef(ref));
				}
				catch (Exception ex) {
					
					LOG.error("Cant find ref: " + ex.toString());
					results.add(new PubBean(ref,ref));
					LOG.error("Defaulting on ref: " + ref );
				}
			}	
		}
		this.refs = results;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Hashtable<String, String[]> getRelationships() {
		return relationships;
	}

	public void setRelationships(Hashtable<String, String[]> relationships) {
		this.relationships = relationships;
	}

	public HashMap<String, String> getIsa() {
		return isa;
	}

	public void setIsa(HashMap<String, String> isa) {
		this.isa = isa;
	}

	
	public ThirdPartyBean getThirdPartyBean() {
		return thirdPartyBean;
	}

	public void setThirdPartyBean(ThirdPartyBean thirdPartyBean) {
		this.thirdPartyBean = thirdPartyBean;
	}

	/**
	 * Returns Id in the format required by OWL queries, eg Fbbt_00000000
	 * @return
	 */
	public String getFbbtIdAsOWL() {
		return fbbtId.replace(":", "_").replace("fbbt","FBbt");
	}

	/**
	 * Returns Id in OBO format, eg Fbbt:00000000
	 * @return
	 */
	public String getFbbtIdAsOBO() {
		return fbbtId.replace("_", ":").replace("fbbt","FBbt");
	}
	
	/**
	 * A quick-fixs method so as to not bother with bean creation
	 * Converts ":" id to "_" 
	 * @param fbbtId
	 * @return
	 */
	public static String idAsOWL(String fbbtId) {
		return fbbtId.replace(":", "_").replace("fbbt","FBbt");
	}
	
	/**
	 * A quick-fixs method so as to not bother with bean creation
	 * Converts "_" id to ":"  
	 * @param fbbtId
	 * @return
	 */
	public static String idAsOBO(String fbbtId) {
		return fbbtId.replace("_", ":").replace("fbbt","FBbt");
	}

	/**
	 *  Returns numerical Id of the ontBean
	 */
	public String getId() {
		return fbbtId.substring(5);
	}

	@Override
	public int compareTo(Object o) {
		OntBean typeO = (OntBean)o; 
		return (this.name).compareToIgnoreCase(typeO.name);
	}

	@Override
	public String toString() {
		return "OntBean [" + fbbtId + " " + name + " TPB: " + thirdPartyBean +  "]";
	}

}
