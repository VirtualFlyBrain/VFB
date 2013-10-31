package uk.ac.ed.vfb.annotation.web;

/**
 * Controller providing the front-end for the /do/user_bean.html view.
 * @author nmilyaev
 */

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.validation.BindException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.SimpleFormController;
import org.springframework.web.servlet.view.RedirectView;

import uk.ac.ed.vfb.annotation.model.StackBean;
import uk.ac.ed.vfb.annotation.service.StackBeanManager;
import uk.ac.ed.vfb.service.UserManager;
import uk.ac.ed.vfb.web.exception.StackExistsException;

public class StackDetailController extends SimpleFormController {
	private StackBeanManager sbm;
	private static final Log LOG = LogFactory.getLog(StackDetailController.class);

	@Override
	protected Object formBackingObject(HttpServletRequest request) throws Exception {
		StackBean stackBean = sbm.getStackBean();
		if (stackBean.getUserName() == null || stackBean.getUserName().equals("")) {
			stackBean.setUserName(UserManager.getCurrentUserName());
		}
		return stackBean;
	}

	public ModelAndView onSubmit(Object stackBean,  BindException errors) throws ServletException {
		ModelAndView mav = new ModelAndView(new RedirectView(getSuccessView()));	
		LOG.debug("Current bean : " + ((StackBean)stackBean).getStackName());
		String result = sbm.saveStack((StackBean)stackBean);
		LOG.debug("SaveStack done!" + result);
		if (!result.equals(StackBeanManager.OK)){
			LOG.debug("Raising error!!!! : " + result);
			mav = new ModelAndView(getFormView(), errors.getModel());
			errors.rejectValue("stackName", "unidentifiedError");
		}
		//		mav.addObject("command",stackBean);
		return mav;
	}

	public void setSbm(StackBeanManager sbm) {
		this.sbm = sbm;
	}

}