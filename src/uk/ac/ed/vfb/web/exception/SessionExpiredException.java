package uk.ac.ed.vfb.web.exception;

/**
 * Spring-compliant exception wrapper
 * @author nmilyaev
 *
 */

public class SessionExpiredException extends RuntimeException{
	private String customMsg;
	private static final String DEFAULT_MSG = "<h2>It looks like your session has expired</h2><p>That might happen because of inactivity or network error.</p><p>Refreshing the page you were on might sort it. If you were querying a database, please start your querying from the beginning.</p>";

	public SessionExpiredException(String customMsg) {
		this.customMsg = customMsg;
	}

	
	public SessionExpiredException() {
		super();
	}

	//getter and setter methods
	public String getCustomMsg() {
		return (customMsg==null||customMsg.equals(""))?DEFAULT_MSG:customMsg;
	}

}
