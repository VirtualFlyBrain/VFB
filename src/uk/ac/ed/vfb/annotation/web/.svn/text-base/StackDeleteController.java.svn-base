package uk.ac.ed.vfb.annotation.web;

/**
 * Controller providing the front-end for the /do/gene_list.html view.
 * @author nmilyaev
 */

import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;
import org.springframework.web.servlet.view.RedirectView;

import uk.ac.ed.vfb.annotation.model.StackBean;
import uk.ac.ed.vfb.annotation.service.StackBeanManager;
import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.UserManager;
import uk.ac.ed.vfb.web.exception.UserPermissionsException;

public class StackDeleteController implements Controller{
	private StackBeanManager sbm;
	private String confirmView;
	private static final Log LOG = LogFactory.getLog(StackDeleteController.class); 

	@SuppressWarnings("unchecked")
	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
		String params = req.getQueryString();
		LOG.debug(">>> Manager: " + sbm + " > " + params);
		String stackId = req.getParameter("stackId");
		StackBean stackBean = sbm.getStackBean(stackId);
		//@TODO: check user name 
		boolean hasAutorityToDelete = false;
		hasAutorityToDelete = (stackBean.getUserName().equals(UserManager.getCurrentUserName()));
		if (!hasAutorityToDelete) {
			throw new UserPermissionsException(stackBean.getStackName());
		}
		ModelAndView modelAndView = new ModelAndView(new RedirectView(getConfirmView()));
		sbm.deleteStack(stackBean.getStackId());
		String command = Utils.SCRIPT_DIR + "deleteStack.bsh " + stackBean.getStackURL(); 
		Utils.runCommand(command.split(" "));
		return modelAndView;
	}
	
	public void setSbm(StackBeanManager sbm) {
		this.sbm = sbm;
	}
	
	public void setConfirmView(String confirmView) {
		this.confirmView = confirmView;
	}

	public String getConfirmView() {
		return confirmView;
	}
	
	public static void deleteStack(StackBean stackBean) {
	}
	
}