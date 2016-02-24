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
		String showMin = req.getParameter("showMin");
		if (showMin == null || showMin.equals("")){
			showMin = "2";
		}
		String showMax = req.getParameter("showMax");
		if (showMax == null || showMax.equals("")){
			showMax = "6";
		}
		String action = req.getParameter("action");
		Set<OntBean> results = null;
		// Initial request - here we initialise the bean and run the query
		String actionStr;
		actionStr = WebQueryUtils.getDefString(action, id);
		try{
			this.obm.getBeanListForQuery(actionStr);
		}catch (Exception e){
			LOG.error("Failed to load filmstrip bean list for query: " + actionStr + " with error " + e.toString());
		}
		results = obm.getCompleteSet();

		modelAndView.addObject("ontBeanList", results);
		modelAndView.addObject("type", "obm");
		params = obm.getUsefulParams(params);
		String actionDesc = WebQueryUtils.getDescString(action) + "<i>" + obm.getBeanForId(region).getName() + "</i>";
		modelAndView.addObject("region", region);
		modelAndView.addObject("query", actionDesc);
		modelAndView.addObject("paramItems", params.split("&"));
		modelAndView.addObject("paramString", params);
		modelAndView.addObject("showMin", showMin);
		modelAndView.addObject("showMax", showMax);
		return modelAndView;
	}

	public void setObm(OntBeanManager obm) {
		this.obm = obm;
	}

}
