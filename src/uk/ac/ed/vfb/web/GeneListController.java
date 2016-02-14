package uk.ac.ed.vfb.web;

import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.GeneBeanManager;
import uk.ac.ed.vfb.service.OntBeanManager;

/**
 * Controller providing the front-end for the /do/gene_list.html view.
 * @author nmilyaev
 */

public class GeneListController implements Controller{
	private GeneBeanManager gbm;
	private OntBeanManager obm;
	private static final Log LOG = LogFactory.getLog(GeneListController.class);

	@SuppressWarnings("unchecked")
	public synchronized ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
		String params = req.getQueryString();
		//LOG.info(">>> Manager: " + gbm + " > " + params);
		ModelAndView modelAndView = new ModelAndView("do/geneList");
		String id = req.getParameter("id");
		String action = req.getParameter("action");
		String page = req.getParameter("page");
		String perPage = req.getParameter("perPage");
		Set<OntBean> results = null;
		// Initial request - here we initialise the bean and run the query
		if (action.equals("transgene")) {
			gbm.getTransgeneList(action, id);
		}
		else if (action.equals("geneex")) {
			gbm.getExpressionList(action, id);
		}
		else if (action.equals("phenotype")) {
			gbm.getPhenotypeList(action, id);
		}
		results = gbm.getResultSet();

		params = gbm.getUsefulParams(params);
		modelAndView.addObject("geneList", results);
		String actionDesc = WebQueryUtils.getDescString(action) + "<i>" + obm.getBeanForId(id).getName()+ "</i>";
		modelAndView.addObject("query", actionDesc);
		String[] columns = {"Driver/reporter", "Expressed in", "Reference", " View "};
		if (action.equals("phenotype")){
			columns = new String[]{"Allele", "Phenotype in", "Reference", " View "};
		}
		if (action.equals("geneex")){
			columns = new String[]{"Gene", "Expressed in", "Reference", " View "};
		}
		modelAndView.addObject("transgeneColumns", columns);
		String[] columnLinks = {"http://flybase.org/reports/", "http://flybase.org/cgi-bin/cvreport.html?rel=is_a&id=FBbt:"};
		modelAndView.addObject("transgeneLinks", columnLinks);
		modelAndView.addObject("nav", gbm.getNav(params));
		modelAndView.addObject("paramItems", params.split("&"));
		modelAndView.addObject("paramString", params);
		String queryDesc = (String)WebQueryUtils.getDescString(action);
		queryDesc = queryDesc.substring(0, queryDesc.indexOf(" ") -1);
		modelAndView.addObject("queryDesc", queryDesc);
		return modelAndView;
	}

	public void setGbm(GeneBeanManager gbm) {
		this.gbm = gbm;
	}

	public void setObm(OntBeanManager obm) {
		this.obm = obm;
	}

}
