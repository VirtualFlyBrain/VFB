package uk.ac.ed.vfb.model;

import java.io.*;
import uk.ac.ed.vfb.annotation.web.Utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Used to integrate GeneQueryResult with third party sources, eg BrainTrap 
 * Represents a third party source in a generic way (eg, what is a typical base URL) 
 */

public class ThirdPartyBean implements Comparable<ThirdPartyBean>, Serializable {
	/** VFB inernal id for individuals */
	private String vfbId;
	/** VFB inernal id for image */
	private String vfbIm;
	/** Fbid used by flybase */
	private String fbId;
	/** Name - as given in the parent individual or ontBean  - currently not used*/
	private String name;
	/** Id used by the third party source to identify the record */
	private String remoteId;
	/** Name of the 3rd party source such as "braintrap". That name is also used for displaying the link name on the result page  */
	private String sourceName;
	/** Url used to link to the external source page, eg "http://fruitfly.inf.ed.ac.uk/braintrap/line/show?FBti=" */
	private String baseUrl;
	/** file name for thumbnail */
	private String thumbName;
	/** Local path to the thumbnail, relative to THIRD_PARTY_INTEGRATION_DIR folder */
	private String thumbUrl;
	/** Relative path to the stack's json file = stack name from the DB*/
	private String stackName;
	/** Absolute path to the stack's json file*/
	private String stackUrl;
	/** Textual description for the stack/data set*/
	private String descr;
	/** Short string that is displayed for a stack name on web pages*/
	private String displayName;
	/** Extra fields required for filtering transgenes and partial expression stuff - introduced by DOS */
	/** Stack type - eg 'adult brain' */
	private String stackType;
	/** complete_expression_pattern - true or false */
	private boolean completeExpressionPattern;	
	private static final Log LOG = LogFactory.getLog(ThirdPartyBean.class);
		
	public ThirdPartyBean() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ThirdPartyBean(String vfbId, String fbId, String remoteId, String resourceName, String thumbName, String stackName, String baseUrl, String thumbUrl, String stacksBaseUrl, 
			String descr, String displayName, String stackType, boolean completeExpressionPattern) {
		super();
		this.vfbId = vfbId;
		this.fbId = fbId;
		this.remoteId = remoteId;
		this.sourceName = resourceName;
		this.baseUrl = baseUrl;
		this.thumbName = thumbName;
		this.vfbIm = getVFBidAsImageRef(vfbId);
		this.thumbUrl = "/owl/" + vfbIm + "/thumbnail.png";
		this.stackUrl = "/owl/" + vfbIm + "/data.jso";
		this.stackName = stackName;
		this.descr = descr;
		this.displayName = displayName;
		this.stackType = stackType;
		this.completeExpressionPattern = completeExpressionPattern;
	}
	
	public ThirdPartyBean(String vfbId, String fbId, String remoteId, String resourceName, String baseUrl, 
			String descr, String displayName) {
		super();
		this.vfbId = vfbId;
		this.fbId = fbId;
		this.remoteId = remoteId;
		this.sourceName = resourceName;
		this.baseUrl = baseUrl;
		this.thumbName = "thumbnail.png";
		this.vfbIm = getVFBidAsImageRef(vfbId);
		this.thumbUrl = "/owl/" + vfbIm + "/" + thumbName;
		this.stackUrl = "/owl/" + vfbIm + "/data.jso";
		this.stackName = displayName;
		this.descr = descr;
		this.displayName = displayName;
		this.stackType = "adult brain";
		this.completeExpressionPattern = true;
	}
	
	public ThirdPartyBean(String vfbId, String fbId, String displayName, String resourceName) {
		super();
		this.vfbId = vfbId;
		this.fbId = fbId;
		this.remoteId = "";
		this.sourceName = resourceName;
		this.baseUrl = "/site/vfb_site/image_data_downloads.htm";
		this.thumbName = "thumbnail.png";
		this.vfbIm = getVFBidAsImageRef(vfbId);
		this.thumbUrl = "/owl/" + vfbIm + "/" + thumbName;
		this.stackUrl = "/owl/" + vfbIm + "/data.jso";
		this.stackName = displayName;
		this.descr = "";
		this.displayName = displayName;
		this.stackType = "adult brain";
		this.completeExpressionPattern = true;
	}
	
	public ThirdPartyBean(String vfbId, String fbId, String displayName, String resourceName, String link) {
		super();
		this.vfbId = vfbId;
		this.fbId = fbId;
		this.remoteId = "";
		this.sourceName = resourceName;
		this.baseUrl = link;
		this.thumbName = "thumbnail.png";
		this.vfbIm = getVFBidAsImageRef(vfbId);
		this.thumbUrl = "/owl/" + vfbIm + "/" + thumbName;
		this.stackUrl = "/owl/" + vfbIm + "/data.jso";
		this.stackName = displayName;
		this.descr = "";
		this.displayName = displayName;
		this.stackType = "adult brain";
		this.completeExpressionPattern = true;
	}

	public String getVfbId() {
		return vfbId;
	}

	public void setVfbId(String vfbId) {
		this.vfbId = vfbId;
	}
	
	public String getVfbIm() {
		return vfbIm;
	}

	public void setVfbIm(String vfbIm) {
		this.vfbIm = vfbIm;
	}

	public String getFbId() {
		return fbId;
	}

	public void setFbId(String fbId) {
		this.fbId = fbId;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRemoteId() {
		return remoteId;
	}

	public void setRemoteId(String remoteId) {
		this.remoteId = remoteId;
	}

	public String getSourceName() {
		return sourceName;
	}

	public void setSourceName(String reourceName) {
		this.sourceName = reourceName;
	}

	public String getBaseUrl() {
		return baseUrl;
	}

	public void setBaseUrl(String baseUrl) {
		this.baseUrl = baseUrl;
	}

	public String getThumbName() {
		return thumbName;
	}

	public void setThumbName(String thumbName) {
		this.thumbName = thumbName;
	}

	public String getThumbUrl() {
		return thumbUrl;
	}

	public void setThumbUrl(String thumbUrl) {
		this.thumbUrl = thumbUrl;
	}
	
	public String getStackUrl() {
		return stackUrl;
	}

	public void setStackUrl(String stackUrl) {
		this.stackUrl = stackUrl;
	}
	
	public String getDescr() {
		return descr;
	}

	public void setDescr(String descr) {
		this.descr = descr;
	}

	public String getStackName() {
		return stackName;
	}

	public void setStackName(String stackName) {
		this.stackName = stackName;
	}
	

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
	
	public String getStackType() {
		return stackType;
	}

	public void setStackType(String stackType) {
		this.stackType = stackType;
	}

	public boolean isCompleteExpressionPattern() {
		return completeExpressionPattern;
	}

	public void setCompleteExpressionPattern(boolean completeExpressionPattern) {
		this.completeExpressionPattern = completeExpressionPattern;
	}
	public String getVFBidAsImageRef(String vfbId) {
		return vfbId.toLowerCase().replace(":", "_").replace("vfb_","VFBi_");
	}
	
	public String getImageDir() {
		String result = vfbId;
		result = result.toLowerCase().replace("vfb_","");
		result = "/disk/data/VFB/IMAGE_DATA/VFB/i/" + result.substring(0, 4) + "/" + result.substring(4) + "/";
		//LOG.debug(vfbId + " resolved to image directory " + result);
		return result;
	}

	@Override
	public String toString() {
		return "ThirdPartyBean [vfbId=" + vfbId + ", fbId=" + fbId + ", sourceName=" + sourceName
				+ ", thumbName=" + thumbName + ", stackUrl=" + stackUrl + "]";
	}

	@Override
	public int compareTo(ThirdPartyBean o) {
		return (this.vfbId).compareToIgnoreCase(o.vfbId);
	}

}
