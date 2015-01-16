package uk.ac.ed.vfb.annotation.web;

/**
 * Controller providing the front-end for the /do/gene_list.html view.
 * @author nmilyaev
 */

import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import uk.ac.ed.vfb.annotation.service.StackBeanManager;
import uk.ac.ed.vfb.model.OntBean;

public class StackListController implements Controller{
	private StackBeanManager sbm;
	private static final Log LOG = LogFactory.getLog(StackListController.class); 

	@SuppressWarnings("unchecked")
	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
		String params = req.getQueryString();
		//LOG.info(">>> Manager: " + sbm + " > " + params);
		
		ModelAndView modelAndView = new ModelAndView("do/annotation/stackList");
		String id = req.getParameter("id");
		String action = req.getParameter("action");
		String page = req.getParameter("page");
		String perPage = req.getParameter("perPage");
		Set<OntBean> results = null;
		// Initial request - here we initialise the bean and run the query
		if ( (page == null || page.equals(""))  && (perPage==null || perPage.equals("")) ){
			sbm.setCurrPage(1);
			sbm.setPerPage(req);
			sbm.getStackBeansAll();
			results = sbm.getPageRecords();
		}
		// Set per page first
		else if (perPage != null) {
			sbm.setPerPage(req);
			results = sbm.getPageNumber(sbm.getCurrPage());
		}
		// Now, deal with the rest of the request
		else if (page != null){	
			try{
				int pageI = Integer.parseInt(page);
				results = sbm.getPageNumber(pageI);
			}
			catch(NumberFormatException ex){
				if (page.equals("next")) {
					results = sbm.getNextPage();
				}
				if (page.equals("prev")) {
					results = sbm.getPreviousPage();
				}
			}
		}		
		params = sbm.getUsefulParams(params);		
		modelAndView.addObject("stackList", results);
		String[] columns = {"Stack Name", "Gene Symbol", "Gene Name", "3rd Party Resource", "Preview", "3D", "Actions"};
		modelAndView.addObject("columns", columns);
		String[] columnLinks = {"http://flybase.org/reports/", "http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=FBbt:"};
		modelAndView.addObject("transgeneLinks", columnLinks);
		modelAndView.addObject("nav", sbm.getNav(params));
		modelAndView.addObject("paramItems", params.split("&"));
		modelAndView.addObject("paramString", params);
		return modelAndView;
	}
	
	public void setSbm(StackBeanManager sbm) {
		this.sbm = sbm;
	}

}