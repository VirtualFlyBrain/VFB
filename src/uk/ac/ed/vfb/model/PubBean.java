package uk.ac.ed.vfb.model;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.net.URLDecoder;

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

	public PubBean(String id) {
		super();
		this.id = id;
		this.miniref = decodeId2miniref(id);
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
		return produceShortref(id, miniref);
	}
	
	public String getYear() {
		//LOG.debug("Year requested for: " + id + " with a current miniref of " + miniref);
		if (miniref!=null){
			if (miniref.contains(",") && id.contains("FBrf")){
				String[] parts = miniref.split(",");
				//LOG.debug("Returning: "+ parts[1]);
				return parts[1];
			}
		}
		return "";
	}
	
	public String getAuthors() {
		//LOG.debug("Author(s) requested for: " + id + " with a current miniref of " + miniref);
		if (miniref!=null){
			if (miniref.contains(",") && id.contains("FBrf")){
				String[] parts = miniref.split(",");
				//LOG.debug("Returning: "+ parts[0]);
				return parts[0];
			}
		}
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
		if (id.contains("FBC:")){
			if (id.contains("DOS")){
				return "http://orcid.org/0000-0002-7073-9172";
			}
			if (id.contains("MMC")){
				return "http://orcid.org/0000-0001-5948-3092";
			}
			return "http://www.pubfacts.com/author/" + miniref.replace("FlyBase Curator [","").replace("]","").replace("FlyBase Consultant [","").replace(" ","+");
		}
		if (id.contains("ISBN:")){
			return "https://www.google.com/search?q=" + id.replace("-","");
		}
		if (id.contains("PMID:")){
			return "http://www.ncbi.nlm.nih.gov/pubmed/" + id.replace("PMID:","");
		}
		if (id.contains("VFB_vol:")){
			return "/site/stacks/index.htm?add=FBbt:" + id.replace("VFB_vol:","");
		}
		LOG.error("Unresolved weblink for id: " + id + " with miniref: " + miniref);
		weblink = "https://www.google.com/search?q=" + miniref;
		return weblink;
	}

	public String decodeId2miniref(String id){
		String result = id;
		if (id.contains("FBC:")){
			result = id.replace("FBC:", "FlyBase Curator [").replace("-", " and ").replace("gg","Gary Grumbling").replace("VH","Volker Hartenstein").replace("MMC","Marta Mesquita da Costa").replace("AJ","Arnim Jenett").replace("ds555","David Osumi-Sutherland").replace("DS","David Osumi-Sutherland").replace("MA","Michael Ashburner").replace("SR","Simon Reeve").replace("SPR","Simon Reeve").replace("DOS","David Osumi-Sutherland") + "]";
			if (id.contains("VH") || id.contains("AJ") || id.contains("GJ")){
				result = result.replace("Curator","Consultant");
			}
			return result;
		}
		if (id.contains("FlyBrain_NDB:")){
			result = id.replace("FlyBrain_NDB:", "FlyBrain Neuron DataBase [") + "]";
			return result;
		}
		if (id.contains("http")){
			result = id;
			return result;
		}
		if (id.contains("ISBN:")){
			result = id.replace("ISBN:","Publication ref ISBN:");
			return result;
		}
		if (id.contains("PMID:")){
			result = id.replace("PMID:","PubMed ref PMID:");
			return result;
		}
		if (id.contains("VFB_vol:")){
			result = "Virtual Fly Brain painted volume [FBbt:" + id.replace("VFB_vol:","") + "]";
			return result;
		}
		LOG.error("Unresolved miniref for: " + id);
		return result;
	}

	public String produceShortref(String id, String miniref) {
		//LOG.debug("Shortref requested for: " + id + " with a current miniref of " + miniref);
		if (miniref!=null){
			if (miniref.contains(",") && id.contains("FBrf")){
				String[] parts = miniref.split(",");
				//LOG.debug("Returning: " + parts[0] + "," + parts[1]);
				return (parts[0] + "," + parts[1]);
			}
			if (miniref.contains("http")){
				String[] parts = miniref.split("/");
				return (parts[0].replace(":","") + " link: " + parts[2].replace("www.",""));
			}
			if (miniref.contains("FlyBrain Neuron DataBase")){
				return (id.replace("FlyBrain_NDB:","FlyBrain Neuron DB: "));
			}
			if (id.contains("FBC:")){
				return id;
			}
			if (id.contains("ISBN:")){
				return id;
			}
			if (id.contains("PMID:")){
				return id;
			}
			if (id.contains("VFB_vol:")){
				return "VFB volume [FBbt:" + id.replace("VFB_vol:","") + "]";
			}
			LOG.error("Just returning miniref: " + miniref);
			return miniref;
		}
		LOG.error("Returning id: " + id);
		return id;
	}

	public String toString(){
		return this.id + " : " + this.miniref;
	}
}
