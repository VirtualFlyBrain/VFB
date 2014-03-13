package uk.ac.ed.vfb.servlets;

import java.io.IOException;
import javax.servlet.*;

/**
 * This is to enable the web pages to display UTF-8 text properly
 * Wired in using Spring
 */

public class CharsetEncodingFilter implements Filter {
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        
        servletRequest.setCharacterEncoding("UTF-8");
        servletResponse.setContentType("text/html;charset=UTF-8");      
        filterChain.doFilter(servletRequest, servletResponse);
    }

    public void destroy() {
    }
}