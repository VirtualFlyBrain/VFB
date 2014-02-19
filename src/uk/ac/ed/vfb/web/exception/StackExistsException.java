package uk.ac.ed.vfb.web.exception;

/**
 * Spring-complying exception wrapper
 * @author nmilyaev
 *
 */

public class StackExistsException extends RuntimeException{
	private String customMsg;
	private static final String DEFAULT_MSG = "<h2>The stack <i>XXX</i> already exists</h2><p>It looks like this stack already has been uploaded. <br/> " +
												"Please check the <a href='/do/annotation/stack_list.html'> uploaded stacks</a> page to see if the stack is already listed. <br/> " +
												"If you are the owner of the stack you can edit stack details by following the 'Edit' link on that page.<br/>" +
												"If you think there is a problem please let us know via email: <a href='mailto:support@virtualflybrain.org'>support@virtualflybrain.org</a> and we'll be glad to help. <br/>" +
												"Or you can try <a href='/site/tools/upload_stack/'>uploading</a> another stack</p>";

	public StackExistsException(String customMsg) {
		this.customMsg = StackExistsException.DEFAULT_MSG.replace("XXX", customMsg);
	}

	//getter and setter methods
	public String getCustomMsg() {
		return (customMsg==null||customMsg.equals(""))?DEFAULT_MSG:customMsg;
	}

}
