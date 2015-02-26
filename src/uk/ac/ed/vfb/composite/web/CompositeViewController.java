package uk.ac.ed.vfb.composite.web;

import java.io.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import uk.ac.ed.vfb.annotation.web.Utils;
import uk.ac.ed.vfb.composite.model.CompositeViewBean;
import uk.ac.ed.vfb.model.ThirdPartyBean;
import uk.ac.ed.vfb.service.ThirdPartyBeanManager;
import uk.ac.ed.vfb.servlets.ServletUtil;

/**
 *  @author nmilyaev
 * Controller providing the front-end for the /do/composite_view.html view.
 * Allows editing of the composite view
 */

public class CompositeViewController extends MultiActionController{
	private CompositeViewBean cvb;
	private ThirdPartyBeanManager tpbm;  
	private static final Log LOG = LogFactory.getLog(CompositeViewController.class);	

	@SuppressWarnings("unchecked")
	/**
	 * Redirects to CsvOntView or CsvGeneView depending on the request parameters
	 */
	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
		String action = req.getParameter("action");
		String[] ids = req.getParameterValues("id");
		String errorMsg = null;
		//ServletUtil.printParams(req);
		LOG.debug("PARAMS: " + ids + " ? " + action);
		if ( ids!=null && ids.length > 0){
			if (action != null & action.equals("add")){
				//adding stack to the view - presume add ing one at a time
				//Only allow up to 3 stacks in the composite
				if (cvb.getStackCont()<3){
					String id = ids[0];
					LOG.debug("Composite View adding - ID: " + id);
					ThirdPartyBean tpb = tpbm.getBeanForVfbId(id);
					LOG.debug("Composite View adding - TPB: " + tpb);
					errorMsg = cvb.addStack(tpb);
				}
				else{
					// throw exception to let the user know it's only up to 3 stacks.
					LOG.error("Over 3 stacks added to composite view exisitng: " + cvb.toString() + " trying to add: " + ids);
					errorMsg = "The composite view is limited to a maximum of 3 stacks, \\n you cannot add any more \\n" +
								"You can try removing any current stacks and try again.";
				}
			}
			else if (action != null & action.equals("Delete selected")){
				//removing stacks from the view
				for (String id : ids){
					LOG.debug("Composite View removing - ID: " + id);
					ThirdPartyBean tpb = tpbm.getBeanForVfbId(id);
					LOG.debug("Composite View removing - TPB: " + tpb);
					errorMsg = cvb.removeStack(tpb);
				}
			}		
		}
		ModelAndView modelAndView = new ModelAndView("do/compositeView");
		modelAndView.addObject("render", false);
		if (action != null & action.equals("View composite")){
			cvb.serialize();
			cvb.save();		
			modelAndView.addObject("render", true);
		}
		else if (action != null & action.equals("startNew")){
			modelAndView.addObject("oldUUID", cvb.getUuid());
			if (!cvb.isImmutable()) {
				cvb.serialize();
				cvb.save();
			}
			cvb = cvb.startNewComposite();
			//modelAndView.addObject("render", true);
		}
		else if (action != null & action.equals("load")){
			String uuid = req.getParameter("uuid");
			// Read from file and create new CVB.
			try{
				cvb = CompositeViewBean.deserialize(uuid);
				cvb.setUuid(uuid);
			}
			catch (Exception e) {
				// Unable to load composite - scavenge the error message and pass it on to the page
				errorMsg = e.getMessage();
			}
		}
		modelAndView.addObject("composite", cvb);
		LOG.debug(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Composite.stacks : " + cvb.getStacks().size());
		if (modelAndView.getModelMap().get("colours") == null) {
			modelAndView.addObject("colours", CompositeViewBean.COLOUR_NAMES);
		}
		if (errorMsg != null){
			modelAndView.addObject("errorMsg", errorMsg);
		}
		return modelAndView;
	}
	
	public void setCvb(CompositeViewBean cvb) {
		this.cvb = cvb;
	}

	public void setTpbm(ThirdPartyBeanManager tpbm) {
		this.tpbm = tpbm;
	}

}
