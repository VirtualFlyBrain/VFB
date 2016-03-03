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
 * Controller providing the front-end for the /do/ont_bean_list.html view.
 * @author nmilyaev
 */

public class OntBeanListController extends AbstractController{
	private OntBeanManager obm;
	private static final Log LOG = LogFactory.getLog(OntBeanListController.class);

	@SuppressWarnings("unchecked")
	public ModelAndView handleRequestInternal(HttpServletRequest req, HttpServletResponse res) throws Exception {
		ModelAndView modelAndView = new ModelAndView("do/ontBeanList");
		String params = req.getQueryString();
		//LOG.debug(">>> Manager: " + obm + " > " + params);
		String id = OntBean.idAsOBO(req.getParameter("id"));
		String action = req.getParameter("action");
		Set<OntBean> results = null;
		String actionStr;
		actionStr = WebQueryUtils.getDefString(action, id);
		this.obm.getBeanListForQuery(actionStr);
		results = obm.getCompleteSet();
		modelAndView.addObject("ontBeanList", results);
		modelAndView.addObject("type", "obm");
		params = obm.getUsefulParams(params);
		String actionDesc = WebQueryUtils.getDescString(action) + "<i>" + obm.getBeanForId(id).getName() + "</i>";
		modelAndView.addObject("query", actionDesc);
		modelAndView.addObject("paramItems", params.split("&"));
		modelAndView.addObject("paramString", params);
		return modelAndView;
	}

	public void setObm(OntBeanManager obm) {
		this.obm = obm;
	}

}
