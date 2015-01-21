package uk.ac.ed.vfb.model;

/**
 * POJO class for a publication entry. Used as addition to OntBean to pull human-readable description 
 */

public class PubBean {
	private String id; //miniref id, eg FBrf0047289
	private String miniref;// eg Bodmer and Jan, 1987, Roux Arch. dev. Biol. 196(2): 69--77
	
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
	public String getShortref() {
		if (this.minref.contains(",")){
			String[] parts = miniref.split(",");
			return (parts[0] + "," + parts[1]);
		}
		return this.miniref;
	}
	public void setMiniref(String miniref) {
		this.miniref = miniref;
	}
	public String getWebLink() {
		if (id.contains("FBrf")){
			return ("http://flybase.org/reports/" + id +  ".html");
		}else{
			if (id.contains("FlyBrain_NDB")){
				String[] parts = id.split(":");
				return ("http://flybrain-ndb.iam.u-tokyo.ac.jp/fmi/xsl/browserecord.xsl?-lay=NDB&Accession+number=" + parts[1] + "&-find=-find");
			}
		}
		return ("https://www.google.com/search?q=" + id);
	}
	
	public String toString(){
		return this.id + " : " + this.miniref;
	}
}
