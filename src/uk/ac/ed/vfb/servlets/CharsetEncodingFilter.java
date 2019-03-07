package uk.ac.ed.vfb.servlets;

import java.io.IOException;
import javax.servlet.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * This is to enable the web pages to display UTF-8 text properly
 * Wired in using Spring
 */

public class CharsetEncodingFilter implements Filter {

    private static final Log LOG = LogFactory.getLog(CharsetEncodingFilter.class);
	
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        
        try{
	    LOG.debug("servletRequest Content Type: " + servletRequest.getContentType());
	    LOG.debug("servletRequest CharEncoding: " + servletRequest.getCharacterEncoding());
            LOG.debug("servletRepsonse Content Type: " + servletResponse.getContentType());
	    LOG.debug("servletResponse CharEncoding: " + servletResponse.getCharacterEncoding());
            servletRequest.setCharacterEncoding("UTF-8");
            servletResponse.setContentType("text/html;charset=UTF-8");
	    LOG.debug("servletRequest Content Type: " + servletRequest.getContentType());
	    LOG.debug("servletRequest CharEncoding: " + servletRequest.getCharacterEncoding());
            LOG.debug("servletRepsonse Content Type: " + servletResponse.getContentType());
	    LOG.debug("servletResponse CharEncoding: " + servletResponse.getCharacterEncoding());
            filterChain.doFilter(servletRequest, servletResponse);
        } catch (Exception ex) {
			LOG.error("Exception running CharsetEncodingFilter: " + servletRequest.getParameterMap().toString() + " " + servletRequest.getRemoteHost());
		    ex.printStackTrace();
		}
        
    }

    public void destroy() {
    }
}
