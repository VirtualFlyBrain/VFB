package uk.ac.ed.vfb.web;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.validation.BindException;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.SimpleFormController;
import org.springframework.web.servlet.view.RedirectView;

import uk.ac.ed.vfb.dao.security.UserManagerDAO;
import uk.ac.ed.vfb.model.security.UserBean;
import uk.ac.ed.vfb.service.UserManager;

/**
 * Controller providing the front-end for the /do/user_bean.html view.
 * @author nmilyaev
 */

public class UserController extends SimpleFormController {
	UserManager manager;
	private String action = "";
	private HttpSession session; 
	private static final Log LOG = LogFactory.getLog(UserController.class);

	@Override
	protected Object formBackingObject(HttpServletRequest request) throws Exception {
		this.session = request.getSession();
		action = request.getParameter("action");
		LOG.debug("ACTION: " + action);
		//trying to access new user detail for a non-logged in user (needed to edit new user's detail)
		UserBean userBean = (UserBean)session.getAttribute("currUser");
		userBean = (userBean!=null)?userBean:manager.getCurrentUserBean();		
		return userBean;
	}

	public ModelAndView onSubmit(Object userBean,  BindException errors) throws ServletException {
		ModelAndView mav = new ModelAndView(new RedirectView(getSuccessView()));
		LOG.debug("Current bean : " + userBean);
		if (this.action.equals("new")){
			String result = manager.saveUser((UserBean)userBean, this.action);
			LOG.debug("SaveUser reslut : " + result);
			if (!result.equals(UserManagerDAO.OK)){
				LOG.debug("Razing error!!!! : " + result);
				mav = new ModelAndView(getFormView(), errors.getModel());
				errors.rejectValue("username", "username.userexists");
			}
		}
		else {
			manager.saveUser((UserBean)userBean, action);
		}
		errors.getModel();
		this.session.setAttribute("currUser", userBean);
		return mav;
	}

//	@Override
//	protected Map referenceData(HttpServletRequest request, Object command, Errors errors) throws Exception {
//		Map referenceData = new HashMap();
//		Object result = getResult(request, command, errors);
//		referenceData.put("result", result);
//		return referenceData;
//	}

	public UserManager getManager() {
		return manager;
	}

	public void setManager(UserManager manager) {
		this.manager = manager;
	}

}