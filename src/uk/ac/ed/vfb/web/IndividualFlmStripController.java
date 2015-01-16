package uk.ac.ed.vfb.web;

import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.OntBeanManager;

/**
 * Controller providing the front-end for the /do/neuron_film_strip.html view.
 * @author nmilyaev
 */

public class IndividualFlmStripController extends AbstractController{
	private OntBeanManager obm;
	private static final Log LOG = LogFactory.getLog(IndividualListController.class); 

	@SuppressWarnings("unchecked")
	public ModelAndView handleRequestInternal(HttpServletRequest req, HttpServletResponse res) throws Exception {
		ModelAndView modelAndView = new ModelAndView("do/individualFilmStrip");
		String params = req.getQueryString();
		//LOG.debug(">>> Manager: " + obm + " > " + params);
		String id = req.getParameter("id");
		// Since the second query is fired off with a neuron id, we need to capture the id of 
		// the original region (clicked neuropil)
		String region = req.getParameter("region");
		if (region == null || region.equals("")){
			region = id;
		}
		String action = req.getParameter("action");
		String page = req.getParameter("page");
		String perPage = req.getParameter("perPage");
		Set<OntBean> results = null;
		// Initial request - here we initialise the bean and run the query
		if ( (page == null || page.equals("")) && (perPage==null || perPage.equals("")) ){
			obm.setCurrPage(1);
			obm.setPerPage(req);
			String actionStr;
			actionStr = WebQueryUtils.getDefString(action, id);
			this.obm.getBeanListForQuery(actionStr);
			results = obm.getPageRecords();
		}
		// Set per page first
		else if (perPage != null) {
			obm.setPerPage(req);			
			results = obm.getPageNumber(obm.getCurrPage());
		}
		// Now, deal with the rest of the request	
		else if (page != null){
			try{
				int pageI = Integer.parseInt(page);
				results = obm.getPageNumber(pageI);
			}
			catch(NumberFormatException ex){
				if (page.equals("next")) {
					results = obm.getNextPage();
				}
				if (page.equals("prev")) {
					results = obm.getPreviousPage();
				}
			}
		}		
		modelAndView.addObject("ontBeanList", results);
		modelAndView.addObject("type", "obm");		
		params = obm.getUsefulParams(params);
		String actionDesc = WebQueryUtils.getDescString(action) + "<i>" + obm.getBeanForId(region).getName() + "</i>";
		modelAndView.addObject("region", region);
		modelAndView.addObject("query", actionDesc);
		modelAndView.addObject("paramItems", params.split("&"));
		modelAndView.addObject("paramString", params);
		modelAndView.addObject("nav", obm.getNav(params));
		return modelAndView;			
	}

	public void setObm(OntBeanManager obm) {
		this.obm = obm;
	}

}