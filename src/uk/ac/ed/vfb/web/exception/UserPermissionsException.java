package uk.ac.ed.vfb.web.exception;

/**
 * Spring-complying exception wrapper
 * @author nmilyaev
 *
 */

public class UserPermissionsException extends RuntimeException{
	private String customMsg;
	private static String forwardURL = "/do/annotation/stack_list.html";
	private static final String DEFAULT_MSG = "<h2>We are sorry, you do not have permissions to modify the 'XXX' stack. </h2><br/> " +
												"Either you are not the owner of the stack or you are not currently logged in. " +
												"You can log in <a href='/site/tools/login/login.htm?action=login'>here</a>.   " +
												"Only the owner (the user who uploaded the stack) can edit or delete the stack. <br/> " +
												"If you are the owner of the stack you can edit stack details or delete a stack by following " +
												"the 'Edit' and 'Delete' links on the <a href=\"" +	forwardURL +"\">stack list page</a>.<br/>" + 
												"If you think there is a problem please let us know via email: <a href='mailto:support@virtualflybrain.org'>support@virtualflybrain.org</a> and we'll be glad to help. <br/>";

	public UserPermissionsException(String customMsg) {
		this.customMsg = UserPermissionsException.DEFAULT_MSG.replace("XXX", customMsg);
	}

	//getter and setter methods
	public String getCustomMsg() {
		return (customMsg==null||customMsg.equals(""))?DEFAULT_MSG:customMsg;
	}

}
