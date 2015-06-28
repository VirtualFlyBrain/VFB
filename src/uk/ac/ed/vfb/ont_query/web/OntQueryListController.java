package uk.ac.ed.vfb.ont_query.web;

import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.ont_query.model.Argument;
import uk.ac.ed.vfb.ont_query.model.OntQueryManager;
import uk.ac.ed.vfb.service.OntBeanManager;

/**
 * Front-facing controller for query builder results.
 * Wraps the /do/count_results.html or forwards to /do/ont_bean_list.html depending on the parameters provided
 */

public class OntQueryListController extends AbstractController{
	private OntQueryManager ontQuery;
	private OntBeanManager obm;
	private static final Log LOG = LogFactory.getLog(OntQueryListController.class);

	@SuppressWarnings("unchecked")
	public ModelAndView handleRequestInternal(HttpServletRequest req, HttpServletResponse res) throws Exception {
		String params = req.getQueryString();
		//LOG.debug(">>> Manager: " + ontQuery + " > " + params);
		String[] ids = req.getParameterValues("id");
		String[] rels = req.getParameterValues("rel");
		String[] types = req.getParameterValues("type");
//		//LOG.debug(">>> ids: " + ids[0] + "," + ids[1]);
//		//LOG.debug(">>> types: " + types[0] + "," + types[1]);
		//Retrofitted adding terms as url parameters - done for running queries on
		//home page
		if (ids!= null && ids.length ==2 && rels!=null && rels.length ==2 && types!= null && types.length ==2){
			ontQuery = new OntQueryManager();
			for (int i=0; i<ids.length; i++){
				OntBean ob = obm.getBeanForId(ids[i]);
				Argument arg = new Argument(ob, rels[i], types[i]);
				if (!ontQuery.addArgument(arg)){
					//Skip adding - already exists
				}
				//LOG.debug("Arguments: " + ontQuery.getArguments());
			}
		}
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
		modelAndView.addObject("type", "oqm");
		params = ontQuery.getUsefulParams(params);
		String actionDesc = ontQuery.getQueryText();
		if (actionDesc == null || actionDesc == ""){
			actionDesc = "";
		}else{
			actionDesc = actionDesc.replaceAll("<br/>", " ");
		}
		modelAndView.addObject("query", actionDesc);
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
