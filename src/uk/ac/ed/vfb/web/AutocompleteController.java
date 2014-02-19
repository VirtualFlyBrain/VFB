package uk.ac.ed.vfb.web;

import java.util.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;
import uk.ac.ed.vfb.tools.autocomplete.AutocompleteDAO;

/**
 * Controller providing the front-end for the /do/autocomplete_list.html and /do/autocomplete_list_neuropil.html views.
 * @author nmilyaev
 */

public class AutocompleteController extends MultiActionController{
	private AutocompleteDAO autocompleteDAO;
	private AutocompleteView view; 
	private String scope;
	private static Map<String, String[]> SCOPES = createMap();
	private static final Log LOG = LogFactory.getLog(AutocompleteController.class); 

	/**
	 * Init method for actionDefs
	 * @return
	 */
	static Map<String,String[]> createMap() {
		Map<String, String[]> map = new HashMap<String, String[]>();
		map.put("all", new String[]{"autocompleteDAOAll"});
		map.put("allAB", new String[]{"autocompleteDAOAB"});
		return map;
	}	

	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
		String scope = req.getParameter("scope");
		setScope(req, scope);
		ModelAndView modelAndView = new ModelAndView(view);
		return modelAndView;
	}

	private void setScope(HttpServletRequest req, String scope){
		if (scope!=null && !scope.equals("")) {
			this.scope = scope;
			WebApplicationContext wac = WebApplicationContextUtils.getRequiredWebApplicationContext(req.getSession().getServletContext());
			this.autocompleteDAO = (AutocompleteDAO)wac.getBean(SCOPES.get(this.scope)[0]);
			LOG.debug("Scope: " + this.scope + " DAO : " + this.autocompleteDAO);
			this.setAutocompleteDAO(this.autocompleteDAO);
		}
		req.getSession().setAttribute("scope", this.scope);
	}

	private void setScope(String scope){
		this.scope = scope; 
	}

	public void setAutocompleteDAO(AutocompleteDAO autocompleteDAO) {
		this.autocompleteDAO = autocompleteDAO;
		this.view = new AutocompleteView(this.autocompleteDAO);
	}

}