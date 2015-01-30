package uk.ac.ed.vfb.model;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * POJO class for a publication entry. Used as addition to OntBean to pull human-readable description 
 */

public class PubBean {
	private String id; //miniref id, eg FBrf0047289
	private String miniref;// eg Bodmer and Jan, 1987, Roux Arch. dev. Biol. 196(2): 69--77
	private static final Log LOG = LogFactory.getLog(OntBean.class);
	
	public PubBean(String id, String miniref) {
		super();
		this.id = id;
		this.miniref = miniref;
	}

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getMiniref() {
		return miniref;
	}
	public void setMiniref(String miniref) {
		this.miniref = miniref;
	}
	
	public String getShortref() {
		//LOG.debug("Shortref requested for: " + id + " with a current miniref of " + miniref);
		if (miniref!=null){
			if (miniref.contains(",")){
				String[] parts = miniref.split(",");
				LOG.debug("Returning: " + parts[0] + "," + parts[1]);
				return (parts[0] + "," + parts[1]);
			}
			LOG.debug("Returning: " + miniref);
			return miniref;
		}
		LOG.debug("Returning nothing");
		return "";
	}
	
	public String getWebLink() {
		String weblink = "#";
		if (id.contains("FBrf")){
			weblink = "http://flybase.org/reports/" + id.replace("FlyBase:", "") +  ".html";
			return weblink;
		}
		if (id.contains("FlyBrain_NDB")){
			String[] parts = id.split(":");
			weblink = "http://flybrain-ndb.iam.u-tokyo.ac.jp/fmi/xsl/browserecord.xsl?-lay=NDB&Accession+number=" + parts[1] + "&-find=-find";
			return weblink;
		}
		if (id.contains("http")){
			try{
				weblink = URLDecoder.decode(id, "UTF-8");
			}catch(Exception ex){
				LOG.error("getWebLink decoding url: " + id);
				ex.printStackTrace();
				weblink = id;
			}
			return weblink;
		}
		weblink = "https://www.google.com/search?q=" + id;
		return weblink;
	}
	
	public String toString(){
		return this.id + " : " + this.miniref;
	}
}
