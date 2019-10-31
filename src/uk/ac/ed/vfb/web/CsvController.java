package uk.ac.ed.vfb.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import uk.ac.ed.vfb.ont_query.model.OntQueryManager;
import uk.ac.ed.vfb.service.GeneBeanManager;
import uk.ac.ed.vfb.service.OntBeanManager;
import uk.ac.ed.vfb.web.csvviewer.CsvGeneView;
import uk.ac.ed.vfb.web.csvviewer.CsvOntView;
import uk.ac.ed.vfb.web.csvviewer.CsvQueryView;
import uk.ac.ed.vfb.web.csvviewer.CsvViewer;

/**
 * Controller providing the front-end for the /do/csv_report.html view.
 * @author nmilyaev
 */

public class CsvController extends MultiActionController{
	private GeneBeanManager gbm;
	private OntBeanManager obm;
	private OntQueryManager oqm;
	/** Possible values for the "type" parameter */
	public final static String[] VIEWER_TYPES = new String[]{"obm", "gbm", "oqm"};
	private static final Log LOG = LogFactory.getLog(CsvController.class); 

	@SuppressWarnings("unchecked")
	/**
	 * Redirects to CsvOntView or CsvGeneView depending on the request parameters
	 */
	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
		String type = req.getParameter("type");
		LOG.debug("param:" + type);
		CsvViewer view = null;
		if(type.equals(VIEWER_TYPES[0])) {
			view = new CsvOntView(obm);
			LOG.debug("View: " + view + " : " + obm);
		}
		else if(type.equals(VIEWER_TYPES[1])) { 
			view = new CsvGeneView(gbm);
			LOG.debug("View: " + view);
		}
		else if(type.equals(VIEWER_TYPES[2])) { 
			view = new CsvQueryView(oqm);
		}
		ModelAndView modelAndView = new ModelAndView(view);
		return modelAndView;
	}
	
	public void setGbm(GeneBeanManager gbm) {
		this.gbm = gbm;
	}

	public void setObm(OntBeanManager obm) {
		this.obm = obm;
	}
	
	public void setOqm(OntQueryManager oqm) {
		LOG.debug(oqm);
		this.oqm = oqm;
	}
}