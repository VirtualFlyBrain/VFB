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
            servletRequest.setCharacterEncoding("UTF-8");
            servletResponse.setContentType("text/html;charset=UTF-8");      
            filterChain.doFilter(servletRequest, servletResponse);
        } catch (Exception ex) {
			LOG.error("Exception running CharsetEncodingFilter: request:" + servletRequest.toString() + " response:" + servletResponse.toString());
		    ex.printStackTrace();
		}
        
    }

    public void destroy() {
    }
}
