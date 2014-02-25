package uk.ac.ed.vfb.ont_query.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.SimpleFormController;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.ont_query.model.*;
import uk.ac.ed.vfb.service.OntBeanManager;
import uk.ac.ed.vfb.tools.autocomplete.AutocompleteDAO;
import uk.ac.ed.vfb.web.*;

/**
 * Front-facing controller for query builder. Wraps the /do/query_builder.html
 */

public class OntQueryController extends SimpleFormController {
	private OntQueryManager ontQuery;
	private OntBeanManager obm;
	private AutocompleteDAO acd;
	private static final Log LOG = LogFactory.getLog(OntQueryController.class); 

	public OntQueryController() {
		setCommandClass(OntQueryManager.class);
		setCommandName("ontQuery");
		setFormView("do/queryBuilder");
		setSuccessView("do/queryBuilder");
	}

	@Override
	protected Object formBackingObject(HttpServletRequest request) throws Exception {
		return new OntQueryManager();
	}

	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
		ModelAndView modelAndView = new ModelAndView("do/queryBuilder");
		//ServletUtil.printParams(req);
		String [] types = req.getParameterValues("type");
		String submit = req.getParameter("submit");
		String action = req.getParameter("action");
		String rel = req.getParameter("rel");
		String fbId = req.getParameter("fbId");
		String index = req.getParameter("index");
		LOG.debug("FBId: " + fbId + " action: " + action + " rel: " + rel);
		String errorMsg = "";
		int indexI = -1;
		try {
			indexI = Integer.parseInt(index);
		}
		catch (NumberFormatException ex){
			//figure out later
		}
		if (action!=null && action.equals("add")){
			if (fbId == null || fbId.equals("")){
				errorMsg = "Unrecognised entity. Please select an item from the list";
			}
			else {
				OntBean ob = obm.getBeanForId(fbId);
				if (!ontQuery.addArgument(new Argument(ob, rel))){
					errorMsg = "The term '" + ob.getName() + "' is already included";
				}
			}
		}
		//Request to delete a query leg fired
		else if (action!=null && action.equals("delete")){		
			ontQuery.deleteArgumentAt(indexI);
		}
		//Query submitted (Execute button pressed)
		else if (submit!=null && !submit.equals("")){		
			action = "multiquery";
		}
		//Form (re)submitted; Perhaps change of a leg type or similar - 
		//go through query parameters and re-assign arguments' properties 
		else if (types!=null && ontQuery.getArguments()!=null && ontQuery.getArguments().size()>=types.length){
			for(int i=0; i<types.length; i++){
				ontQuery.getArgumentAt(i).setType(types[i]);
			}
		}
		modelAndView.addObject("action", action);
		modelAndView.addObject("errorMsg", errorMsg);
		modelAndView.addObject("queryText", ontQuery.getQueryText());
		modelAndView.addObject("ontQuery", ontQuery);
		modelAndView.addObject("typeDefs", WebQueryUtils.getQueryBuilderDefs());
		modelAndView.addObject("arguments", ontQuery.getArguments());
		return modelAndView;
	}

	public void setOntQuery(OntQueryManager ontQuery) {
		this.ontQuery = ontQuery;
	}

	public void setObm(OntBeanManager obm) {
		this.obm = obm;
	}

	public void setAcd(AutocompleteDAO acd) {
		this.acd = acd;
	}

}
