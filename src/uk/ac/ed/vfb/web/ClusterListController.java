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
 * Controller providing the front-end for the /do/cluster_list.html view.
 * @author nmilyaev
 */

public class ClusterListController extends AbstractController{
	private OntBeanManager obm;
	private static final Log LOG = LogFactory.getLog(IndividualListController.class);

	@SuppressWarnings("unchecked")
	public ModelAndView handleRequestInternal(HttpServletRequest req, HttpServletResponse res) throws Exception {
		ModelAndView modelAndView = new ModelAndView("do/clusterList");
		String params = req.getQueryString();
		//LOG.debug(">>> Manager: " + obm + " > " + params);
		String id = req.getParameter("id");
		String action = req.getParameter("action");
		String page = req.getParameter("page");
		String perPage = req.getParameter("perPage");
		Set<OntBean> results = null;
		// Initial request - here we initialise the bean and run the query
		String actionStr;
		actionStr = WebQueryUtils.getDefString(action, id);
		this.obm.getBeanListForQuery(actionStr);
		results = obm.getCompleteSet();
		modelAndView.addObject("ontBeanList", results);
		modelAndView.addObject("type", "obm");
		params = obm.getUsefulParams(params);
		String structName = "<i>" + obm.getBeanForId(OntBean.idAsOBO(id)).getName() + "</i>";
		String actionDesc = WebQueryUtils.getDescString(action).replace("XXX", structName);
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
