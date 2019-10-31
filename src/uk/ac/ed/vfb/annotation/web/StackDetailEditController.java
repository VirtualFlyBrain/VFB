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
import uk.ac.ed.vfb.web.exception.UserPermissionsException;

public class StackDetailEditController extends SimpleFormController {
	private StackBeanManager sbm;
	private StackBean stackBean = null;
	private static final Log LOG = LogFactory.getLog(StackDetailEditController.class);

	@Override
	protected Object formBackingObject(HttpServletRequest request) throws Exception {
		if (stackBean!=null) return stackBean;
		String stackId = request.getParameter("stackId");
		if (stackId == null || stackId.equals("")) return null;
		stackBean = sbm.getStackBean(stackId);
		boolean hasAutorityToDelete = false;
		hasAutorityToDelete = (stackBean.getUserName().equals(UserManager.getCurrentUserName()));
		if (!hasAutorityToDelete) {
			throw new UserPermissionsException(stackBean.getStackName());
		}
//		LOG.debug("Current bean : " + stackBean.getStackName() + stackBean.getStackId());
		return stackBean;
	}

	public ModelAndView onSubmit(Object stackBean,  BindException errors) throws ServletException {
		ModelAndView mav = new ModelAndView(new RedirectView(getSuccessView()));
		StackBean sb = (StackBean)stackBean;
		LOG.debug("Current bean : " + sb.getStackName() + sb.getStackId());
		String result = sbm.saveStack(sb);
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
