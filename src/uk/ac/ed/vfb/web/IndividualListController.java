package uk.ac.ed.vfb.web;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.AbstractController;
import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.OntBeanManager;

/**
 * Controller providing the front-end for the /do/individual_list.html view.
 * @author nmilyaev
 */

public class IndividualListController extends AbstractController{
	private OntBeanManager obm;
	private static Map<String, String[]> drivers;
	private DataSource vfbDS;
	private static final Log LOG = LogFactory.getLog(IndividualListController.class);

	@SuppressWarnings("unchecked")
	public synchronized ModelAndView handleRequestInternal(HttpServletRequest req, HttpServletResponse res) throws Exception {
		ModelAndView modelAndView = new ModelAndView("do/individualList");
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
		String actionStr;
		actionStr = WebQueryUtils.getDefString(action, id);
		this.obm.getBeanListForQuery(actionStr);
		results = obm.getCompleteSet();
		modelAndView.addObject("ontBeanList", results);
		modelAndView.addObject("type", "obm");
		params = obm.getUsefulParams(params);
		String structName = "<i>" + obm.getBeanForId(OntBean.idAsOBO(id)).getName() + "</i>";
		String actionDesc = WebQueryUtils.getDescString(action).replace("XXX", structName);
		modelAndView.addObject("region", region);
		modelAndView.addObject("query", actionDesc);
		modelAndView.addObject("paramItems", params.split("&"));
		modelAndView.addObject("paramString", params);
		if (IndividualListController.drivers != null) {
			modelAndView.addObject("drivers", drivers);
		}
		else {
			Connection conVFB = vfbDS.getConnection();
			conVFB.setAutoCommit(true);
			PreparedStatement pstmtVFB =
					conVFB.prepareStatement("SELECT vfbid, fbid, driver_name FROM third_party_flybase_lookup order by (vfbid)");
			//LOG.debug("conVFB " + conVFB);
			ResultSet rs1 = pstmtVFB.executeQuery();
			IndividualListController.drivers = new HashMap<String, String[]>();
			String nueronId, fbId, driver;
			while (rs1.next()) {
				nueronId = rs1.getString("vfbid");
				fbId = rs1.getString("fbid");
				driver = rs1.getString("driver_name");
				//LOG.debug(nueronId + "  ;" + fbId + " ;" + driver);
				String[] driverDetails = {fbId, driver};
				drivers.put(nueronId, driverDetails);
			}
			conVFB.close();
		}
		modelAndView.addObject("drivers", drivers);
		//LOG.debug("Drivers size: " + drivers.size());
		return modelAndView;
	}

	public void setObm(OntBeanManager obm) {
		this.obm = obm;
	}

	public void setVfbDS(DataSource vfbDS) {
		this.vfbDS = vfbDS;
	}

}
