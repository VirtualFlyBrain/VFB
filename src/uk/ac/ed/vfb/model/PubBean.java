package uk.ac.ed.vfb.model;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.net.URLDecoder;

import java.util.*;

/**
 * POJO class for a publication entry. Used as addition to OntBean to pull human-readable description
 */

public class PubBean {
	private String id; //miniref id, eg FBrf0047289
	private String miniref;// eg Bodmer and Jan, 1987, Roux Arch. dev. Biol. 196(2): 69--77
	private static final Log LOG = LogFactory.getLog(OntBean.class);
	Map<String, String> rep = fbXx();


	private static Map<String, String> fbXx () {
		Map<String, String> rep = new HashMap<String, String>();
		rep.put("FBab", "aberration");
		rep.put("FBal", "allele");
		rep.put("FBba", "balancer/genotype variant");
		rep.put("FBcl", "clone");
		rep.put("FBgn", "gene");
		rep.put("FBim", "image");
		rep.put("FBig", "interaction");
		rep.put("FBlc", "large dataset metadata");
		rep.put("FBmc", "molecular construct");
		rep.put("FBms", "molecular segment");
		rep.put("FBpp", "polypeptide");
		//rep.put("FBrf", "reference"); // handled seperatly
		rep.put("FBsf", "sequence feature");
		rep.put("FBst", "stock");
		rep.put("FBtc", "cell line");
		rep.put("FBti", "transposable element insertion");
		rep.put("FBtp", "transgenic construct or natural transposon");
		rep.put("FBtr", "transcript");
		return rep;
	}

	public PubBean(String id, String miniref) {
		super();
		this.id = id;
		this.miniref = miniref;
		//LOG.debug("Created PubBean with id: " + id + " and miniref: " + miniref);
	}

	public PubBean(String id) {
		super();
		this.id = id;
		this.miniref = decodeId2miniref(id);
		//LOG.debug("Created PubBean from id: " + id + " which resolved with miniref: " + miniref);
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

	public String getTarget() {
		if (getWebLink().contains("http")){
			return "_new";
		}
		return "_top";
	}

	public String getWebLink() {
		String weblink = "#";
		if (id.contains("FBrf")){
			weblink = "http://flybase.org/reports/" + id.replace("FlyBase:", "");
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
			if (miniref.contains(" and ")){
				return "https://www.google.com/search?q=" + miniref.replace("FlyBase Curator [","").replace("]","").replace("FlyBase Consultant [","").replace(" and "," ");
			}
			if (id.contains("DOS")){
				return "http://orcid.org/0000-0002-7073-9172";
			}
			if (id.contains("MMC")){
				return "http://orcid.org/0000-0001-5948-3092";
			}
			if (id.contains("FlyBase") || id.contains("auto_generated_definition")){
				return "http://flybase.org";
			}
			// TBR: to handle block consultant links.
			if (miniref.contains("Consultant")){ 
				return "http://flybase.org";
			}
			return "http://www.pubfacts.com/author/" + miniref.replace("FlyBase Curator [","").replace("]","").replace("FlyBase Consultant [","").replace(" ","+");
		}
		if (id.contains("CARO:MAH")){
			return "http://www.pubfacts.com/author/" + miniref.replace("Common Anatomy Reference Ontology: ","").replace(" ","+");
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
		if (id.contains("GO:")){
			return "http://gowiki.tamu.edu/wiki/index.php/Category:" + id;
		}
		if (id.contains("FBbt:")){
			return "/site/stacks/index.htm?id=" + id;
		}
		if (id.contains("doi:")){
			return id.replace("doi:", "https://doi.org/");
		}
		//handling FBxx other types
		for (String key:rep.keySet()){
			if (id.contains(key)){
				return "http://flybase.org/reports/" + id;
			}
		}
		LOG.error("Unresolved weblink for id: " + id + " with miniref: " + miniref);
		weblink = "https://www.google.com/search?q=" + miniref;
		return weblink;
	}

	public String decodeId2miniref(String id){
		String result = id;
		if (id.contains("FBC:")){
			result = id.replace("FBC:", "FlyBase Curator [").replace("-", " and ").replace("gg","Gary Grumbling").replace("VH","Volker Hartenstein").replace("MMC","Marta Mesquita da Costa").replace("AJ","Arnim Jenett").replace("ds555","David Osumi-Sutherland").replace("DS","David Osumi-Sutherland").replace("MA","Michael Ashburner").replace("SR","Simon Reeve").replace("SPR","Simon Reeve").replace("DOS","David Osumi-Sutherland").replace("KI","Kei Ito") + "]";
			if (id.contains("VH") || id.contains("AJ") || id.contains("GJ") || id.contains("KI")){
				result = result.replace("Curator","Consultant");
				result = "FlyBase"; // TBR: once the Consultants are approved.
			}
			return result;
		}
		if (id.contains("CARO:")){
			result = id.replace("CARO:", "Common Anatomy Reference Ontology: ");
			result = result.replace("MAH", "Melissa Haendel");
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
		if (id.contains("GO:")){
			result = id.replace("GO:","Gene Ontology Term [GO:") + "]";
			return result;
		}
		if (id.contains("FBbt:")){
			result = id.replace("FBbt:","Anatomy Term [FBbt:") + "]";
			return result;
		}
		if (id.contains("doi:")){
			result = id.replace("doi:","Digital Object Identifier [doi:") + "]";
			return result;
		}
		//handling FBxx other types
		for (String key:rep.keySet()){
			if (id.contains(key)){
				result = "FlyBase " + rep.get(key) + " report [" + id.replace("F","&#70;") + "]";
				return result;
			}
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
			if (id.contains("GO:")){
				return id;
			}
			if (id.contains("FBbt:")){
				return id;
			}
			if (id.contains("doi:")){
				return id;
			}
			if (id.contains("CARO:")){
				return id;
			}
			if (id.contains("VFB_vol:")){
				return "VFB volume [FBbt:" + id.replace("VFB_vol:","") + "]";
			}
			//handling FBxx other types
			for (String key:rep.keySet()){
				if (id.contains(key)){
					return id;
				}
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
