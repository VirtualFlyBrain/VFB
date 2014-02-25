package uk.ac.ed.vfb.servlets;

import java.util.*;
import javax.servlet.http.HttpServletRequest;

/**
 * A collection of useful tricks that could be invoked from a servlet, eg printing a list of parameters.
 * Borrowed from Eurexpress  
 * @author nmilyaev
 */

public class ServletUtil {
	
	/**
	 * Prints list of ALL HTTP request parameters
	 * @param req
	 */
	public static void printParams(HttpServletRequest req){
		System.out.println("\n----Request Parameters-----"); 
		Enumeration headerNames = req.getParameterNames();
		while(headerNames.hasMoreElements()) {
			String el = (String)headerNames.nextElement();
			System.out.print(el + " : "+ req.getParameter(el)+ "\n");
		}
		System.out.println("----Request Parameters End-----");
	}

	/**
	 * Prints list of HTTP request parameter with given name
	 * @param req
	 */
	public static List<String> getParameterValuesforName(HttpServletRequest req, String name){
		List<String> result = new ArrayList<String>();
		Enumeration headerNames = req.getParameterNames();
		while(headerNames.hasMoreElements()) {
			String el = (String)headerNames.nextElement();
			if (el.startsWith(name)) {
				result.add(req.getParameter(el));
			}
		}
		return result;
	}

}
