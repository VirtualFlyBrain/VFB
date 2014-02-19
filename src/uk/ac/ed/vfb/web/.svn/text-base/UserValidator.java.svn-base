package uk.ac.ed.vfb.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import uk.ac.ed.vfb.dao.security.UserManagerDAO;
import uk.ac.ed.vfb.model.security.UserBean;

/**
 * Validator for user detail form /do/user.html?action=edit
 * @author nmilyaev
 *
 */
public class UserValidator implements org.springframework.validation.Validator {
	private UserManagerDAO dao;
	private static final Log LOG = LogFactory.getLog(UserController.class);

	@Override
	public void validate(Object target, Errors errors) {
		LOG.debug("Doing validation");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "username", "username.required");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "password.required");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "confirmPassword", "confirmPassword.required");
		ValidationUtils.rejectIfEmpty(errors, "firstname", "firstname.required");
		ValidationUtils.rejectIfEmpty(errors, "surname", "surname.required");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "institution", "institution.required");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "position", "position.required");
		ValidationUtils.rejectIfEmpty(errors, "email", "email.required");
		UserBean user = (UserBean) target;	 
		if(!(user.getPassword().equals(user.getConfirmPassword()))){
			errors.rejectValue("confirmPassword", "notmatch.password");
		}		
	}

	@Override
	public boolean supports(Class c) {
		// TODO Auto-generated method stub
		return UserBean.class.equals(c);
	}

	public void setDao(UserManagerDAO dao) {
		this.dao = dao;
	}
	
}

