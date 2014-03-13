package uk.ac.ed.vfb.annotation.model;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.ac.ed.vfb.annotation.service.StackBeanManager;
import uk.ac.ed.vfb.annotation.web.Utils;

/**
 * POJO class for an Annotation entry. 
 */

public class StackBean implements Comparable {
	private String stackId; //uploaded stack ID (MD5)
	private String stackName;//name of the stack (fileName)
	private int size;//size of the image part of the stack (in bytes)	
	private String userName; //user who uploaded the stack
	private String geneId;// id of the known gene
	private String geneName;//name of expressed gene
	private String stackURL;// URL of the stack where it is stored, relative to the root /stacks folder
	private String thirdPartyURL;// URL of the stack where it is stored
	private String description; //Textual description of the stack/experiment - optional
	private String defaultRegistration; //What is default registration method for this stack (values from DEFAULT_REGISTRATIONS);
	private static final Log LOG = LogFactory.getLog(StackBean.class);
	
	public static String[][] DEFAULT_REGISTRATIONS = new String[][]{{"lsm", "USER_STACKS_LSM_STACK_DIR"}, 
																	{"cmtk", "USER_STACKS_CMTK_STACK_DIR"}, 
																	{"ba", "USER_STACKS_BA_STACK_DIR"}};
		
	public StackBean() {
		super();
		// TODO Auto-generated constructor stub
	}

	public StackBean(String stackId, String stackName, int size, String userName, String geneId, 
			String geneName, String stackURL, String thirdPartyURL, String description) {
		super();
		this.stackId = stackId;
		this.stackName = stackName;
		this.size = size;
		this.userName = userName;
		this.geneId = geneId;
		this.geneName = geneName;
		this.stackURL = stackURL;
		this.thirdPartyURL = thirdPartyURL;
		this.description = description;
	}

	public String getStackName() {
		return stackName;
	}

	public void setStackName(String stackName) {
		this.stackName = stackName;
	}
	
	public String getStackId() {
		return stackId;
	}

	public void setStackId(String stackId) {
		this.stackId = stackId;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getStackURL() {
		return stackURL;
	}

	public void setStackURL(String stackURL) {
		this.stackURL = stackURL;
	}

	public String getThirdPartyURL() {
		return thirdPartyURL;
	}

	public void setThirdPartyURL(String thirdPartyURL) {
		this.thirdPartyURL = thirdPartyURL;
	}

	public String getGeneName() {
		return geneName;
	}

	public void setGeneName(String geneName) {
		this.geneName = geneName;
	}

	public String getGeneId() {
		return geneId;
	}

	public void setGeneId(String geneId) {
		this.geneId = geneId;
	}


	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	
	public String getDefaultRegistration() {
		//return defaultRegistration;
		return DEFAULT_REGISTRATIONS[0][1];
	}

	public void setDefaultRegistration(String defaultRegistration) {
		this.defaultRegistration = defaultRegistration;
	}

	@Override
	public int compareTo(Object o) {
		StackBean typeO = (StackBean)o; 
		return (this.stackName).compareToIgnoreCase(typeO.stackName);
	}
	
	/**
	 * Returns a path to the stack metadata jso file depending on the registration method specified
	 * @param regType - specifies the type of stack registration (ls, cmtk, ba - see Utils.getStackPath)
	 * @return
	 */
	public String getStackWoolzDir(String regType){
		//set it to default metadata path first
		///usr/local/tomcat-6/webapps/vfbStacks/stacks/1198MaleDualA/cmtk/wlz_meta
		//LSM
		String path = "wlz_meta/tiledImageModelData.jso";
		if (regType.equals(DEFAULT_REGISTRATIONS[0][0])) {
			path = Utils.getProp(DEFAULT_REGISTRATIONS[0][1]) + path;
		}
		//CMTK
		else if (regType.equals(DEFAULT_REGISTRATIONS[1][0])) {
		 	path = Utils.getProp(DEFAULT_REGISTRATIONS[1][1]) + path;
		}
		//BA
		else if (regType.equals(DEFAULT_REGISTRATIONS[2][0])) {
		 	path = Utils.getProp(DEFAULT_REGISTRATIONS[2][1]) + path;
		}		
		path = stackURL + path;
		return path;
	}

	/**
	 * Returns a path to the stack thumbnail file depending on the registration method specified
	 * @param regType - specifies the type of stack registration (ls, cmtk, ba - see Utils.getStackPath)
	 * @return
	 */
	public String getThumb(String regType){
		//set it to default metadata path first
		///usr/local/tomcat-6/webapps/vfbStacks/stacks/1198MaleDualA/cmtk/wlz_meta
		//LSM
		String path = "wlz_meta/tiledImageModelData.jso";
		if (regType.equals(DEFAULT_REGISTRATIONS[0][0])) {
			path = Utils.getThumbPath(DEFAULT_REGISTRATIONS[0][0], this);
		}
		//CMTK
		else if (regType.equals(DEFAULT_REGISTRATIONS[1][0])) {
		 	path = Utils.getThumbPath(DEFAULT_REGISTRATIONS[1][0], this);
		}
		//BA
		else if (regType.equals(DEFAULT_REGISTRATIONS[2][0])) {
		 	path = Utils.getThumbPath(DEFAULT_REGISTRATIONS[2][0], this);
		}		
		//path = stackURL + path;
		return path;
	}

	/**
	 * Returns a default path to the stack metadata jso file for lsm
	 * @param 
	 * @return 
	 */
	public String getStackWoolzDir(){
		return getStackWoolzDir("lsm");
	}

}
