package uk.ac.ed.vfb.model;

import java.io.Serializable;
import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * POJO class for anatomy term. The most important POJO class
 */

public class OntBean implements Comparable<Object>, Serializable{
	protected String fbbtId;
	protected String name;
	protected String def;
	protected String comment;
	protected List<String> synonyms;
	protected List<String> refs;
	/** List of key:value[] pairs describing relationships, eg "FBbt:00000020 :[part_of, abdomen]" */
	protected Hashtable<String, String[]> relationships;
	/** Map of key:value pairs, eg., "FBbt:00000006 : head segment" */
	protected HashMap<String, String> isa;
	protected String id; //Pure numerical id, without "FBbt:"
	protected ThirdPartyBean thirdPartyBean; // used for integration with third party sources - use driverRef for linking.
	private static final Log LOG = LogFactory.getLog(OntBean.class);

	/**
	 * Static factory-like method - only creates new bean if the FBbt returned != "Nothing"
	 * Used when creating beans after outcome from OWLClient query.
	 */
	public static OntBean getOntBean(String fbbtId){
		if (fbbtId.equals("Nothing")) return null;
		fbbtId = OntBean.correctIdFormat(fbbtId);
		return new OntBean(fbbtId);
	}

	public OntBean() {
		super();
		this.isa = new HashMap<String, String>();
		this.relationships = new Hashtable<String, String[]>();
	}

	public OntBean(String fbbtId) {
		this();
		fbbtId = OntBean.correctIdFormat(fbbtId);
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

	public List<String> getRefs() {
		return refs;
	}

	public void setRefs(List<String> refs) {
		this.refs = refs;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Hashtable<String, String[]> getRelationships() {
		//LOG.debug("Id:" + fbbtId);
		//LOG.debug("Relationships:" + relationships);
		return relationships;
	}

	public void setRelationships(Hashtable<String, String[]> relationships) {
		this.relationships = relationships;
		//LOG.debug("Id:" + fbbtId);
		//LOG.debug("Relationships:" + relationships);
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

	public static String correctIdFormat(String fbbtId) {
		if (fbbtId.contains("VFB")) {
			fbbtId = OntBean.idAsOWL(fbbtId);
		}else{
			fbbtId = OntBean.idAsOBO(fbbtId);
		}
		return fbbtId;
	}

	public String correctIdFormat() {
		return correctIdFormat(fbbtId);
	}

	/**
	 *  Returns numerical Id of the ontBean
	 */
	public String getId() {
		if (fbbtId.contains("_")){
			return fbbtId.substring(fbbtId.indexOf("_")+1);
		}
		return fbbtId.substring(fbbtId.indexOf(":")+1);
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
