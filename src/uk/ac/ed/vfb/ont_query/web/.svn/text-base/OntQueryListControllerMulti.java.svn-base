package uk.ac.ed.vfb.ont_query.web;

import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.ont_query.model.OntQueryManager;
import uk.ac.ed.vfb.service.OntBeanManager;

/**
 * Front-facing controller for query builder results
 * Wraps the /do/count_results.html or forwards to /do/ont_bean_list.html depending on the parameters provided 
 */

public class OntQueryListControllerMulti extends AbstractController{
	private OntQueryManager ontQuery;
	private OntBeanManager obm;
	private static final Log LOG = LogFactory.getLog(OntQueryListController.class); 

	@SuppressWarnings("unchecked")
	public ModelAndView handleRequestInternal(HttpServletRequest req, HttpServletResponse res) throws Exception {
		String params = req.getQueryString();
		LOG.debug(">>> Manager: " + ontQuery + " > " + params);
		String action = req.getParameter("action");
		ModelAndView modelAndView = null;
		if (action!=null && action.equals("count")){
			modelAndView = new ModelAndView("do/countResults");
		}
		else {
			modelAndView = new ModelAndView("do/ontBeanList");
		}
		String page = req.getParameter("page");
		String perPage = req.getParameter("perPage");
		Set<OntBean> results = null;
		// Initial request - here we initialise the bean and run the query
		if ( (page == null || page.equals("")) && (perPage==null || perPage.equals("")) ){
			ontQuery.executeQuery(obm);
			ontQuery.setCurrPage(1);
			ontQuery.setPerPage(req);
			results = ontQuery.getPageRecords();
		}
		// Set per page first
		else if (perPage != null) {
			ontQuery.setPerPage(req);
			results = ontQuery.getPageNumber(ontQuery.getCurrPage());
		}
		// Now, deal with the rest of the request	
		else if (page != null){
			try{
				int pageI = Integer.parseInt(page);
				results = ontQuery.getPageNumber(pageI);
			}
			catch(NumberFormatException ex){
				if (page.equals("next")) {
					results = ontQuery.getNextPage();
				}
				if (page.equals("prev")) {
					results = ontQuery.getPreviousPage();
				}
			}
		}		
		modelAndView.addObject("ontBeanList", results);
		modelAndView.addObject("type", "oq");		
		params = ontQuery.getUsefulParams(params);
		String actionDesc = ontQuery.getQueryText();
		modelAndView.addObject("query", actionDesc.replaceAll("<br/>", " "));
		modelAndView.addObject("paramItems", params.split("&"));
		modelAndView.addObject("paramString", params);
		modelAndView.addObject("nav", ontQuery.getNav(params));
		return modelAndView;			
	}

	public void setObm(OntBeanManager obm) {
		this.obm = obm;
	}

	public void setOntQuery(OntQueryManager ontQuery) {
		this.ontQuery = ontQuery;
	}
}