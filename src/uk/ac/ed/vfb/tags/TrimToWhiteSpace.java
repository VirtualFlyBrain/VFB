package uk.ac.ed.vfb.tags;
import javax.servlet.jsp.*;
import javax.servlet.jsp.tagext.*;

/**
 * Trims arbitrary text string to a white space with maximum size as specified by the "size" 
 * Usage: in the jsp: 
 * <%@ taglib uri="/WEB-INF/classes/vfbUtils.tld" prefix="vfbUtil" %>
 * <vfbUtil:trimToWhite string="${ontBean.def}" size="150"/>
 * 
 * Perhaps there is a better way of hooking it in...
 * @author nmilyaev
 */

public class TrimToWhiteSpace extends TagSupport{
	// String to be trimmed
	private String string = "";
	// Size of string after trimming
	private int size = 0;
	/**
	 * Getter/Setter for the attributes as defined in the tld file 
	 * for this tag
	 */
	public String getString() {
		return string;
	}
	
	public void setString(String string) {
		this.string = string;
	}
	
	public int getSize() {
		return size;
	}
	
	public void setSize(int size) {
		this.size = size;
	}
	
	/**
	 * doStartTag is called by the JSP container when the tag is encountered
	 */
	public int doStartTag() {
		try {
			JspWriter out = pageContext.getOut();
			if (string != null && size != 0 && string.length() > size) {
			    string = string.substring(0, size);
			    StringBuffer sb =  new StringBuffer(string).reverse();
			    string = sb.toString();
			    string = string.replaceFirst("^\\S+\\s+|^\\S+\\s+", "");
			    if (!string.startsWith(".")&& !string.startsWith(" .")) {
			    	string = "... " + string;  
			    }
			    string = new StringBuffer(string).reverse().toString();
//				System.out.println(":::::" + string + " > " + size);
			}
		    out.println(string);
		} catch (Exception ex) {
			ex.printStackTrace();
			throw new Error("All is not well in the world.");
		}
		// Must return SKIP_BODY because we are not supporting a body for this 
		// tag.
		return SKIP_BODY;
	}

	/**
	 * doEndTag is called by the JSP container when the tag is closed
	 */
//	public int doEndTag(){
//		try {
//			JspWriter out = pageContext.getOut();
//			out.println("</table>");
//		} catch (Exception ex){
//			throw new Error("All is not well in the world.");
//		}
//		return 1;
//	}
}
