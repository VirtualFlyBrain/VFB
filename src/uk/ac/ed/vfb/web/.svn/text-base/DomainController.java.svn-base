package uk.ac.ed.vfb.web;

import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.DomainManager;

/**
 * Controller providing the front-end for managing selected domains.
 * CURRENTLY NOT USED!!! Was superseeded by cookies-based approach
 * @author nmilyaev
 */

public class DomainController extends AbstractController{
	private DomainManager dm;
	private static final Log LOG = LogFactory.getLog(OntBeanListController.class); 

	@SuppressWarnings("unchecked")
	public ModelAndView handleRequestInternal(HttpServletRequest req, HttpServletResponse res) throws Exception {
		ModelAndView modelAndView = new ModelAndView("do/ontBeanList");
		String params = req.getQueryString();
		LOG.debug(">>> Manager: " + dm + " > " + params);
		String id = req.getParameter("id");
		String action = req.getParameter("action");
		String page = req.getParameter("page");
		String perPage = req.getParameter("perPage");
		Set<OntBean> results = null;
		// Initial request - here we initialise the bean and run the query
		if ( (page == null || page.equals("")) && (perPage==null || perPage.equals("")) ){
			dm.setCurrPage(1);
			dm.setPerPage(req);
			String actionStr;
			actionStr = WebQueryUtils.getDefString(action, id);
			//this.dm.getBeanListForQuery(actionStr);
			results = dm.getPageRecords();
		}
		// Set per page first
		else if (perPage != null) {
			dm.setPerPage(req);			
			results = dm.getPageNumber(dm.getCurrPage());
		}
		// Now, deal with the rest of the request	
		else if (page != null){
			try{
				int pageI = Integer.parseInt(page);
				results = dm.getPageNumber(pageI);
			}
			catch(NumberFormatException ex){
				if (page.equals("next")) {
					results = dm.getNextPage();
				}
				if (page.equals("prev")) {
					results = dm.getPreviousPage();
				}
			}
		}		
		modelAndView.addObject("ontBeanList", results);
		modelAndView.addObject("type", "obm");		
		params = dm.getUsefulParams(params);
		//String actionDesc = WebQueryUtils.getDescString(action) + "<i>" + dm.getBeanForId(id).getName() + "</i>";
		//modelAndView.addObject("query", actionDesc);
		modelAndView.addObject("paramItems", params.split("&"));
		modelAndView.addObject("paramString", params);
		modelAndView.addObject("nav", dm.getNav(params));
		return modelAndView;			
	}

	public void setDm(DomainManager dmm) {
		this.dm = dm;
	}

}