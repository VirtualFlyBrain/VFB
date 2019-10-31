package uk.ac.ed.vfb.annotation.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;

import uk.ac.ed.vfb.annotation.model.StackBean;

public class StackDeatailValidator implements org.springframework.validation.Validator {
	private static final Log LOG = LogFactory.getLog(StackDeatailValidator.class);

	@Override
	public void validate(Object target, Errors errors) {
		//For some reason the validator seem to double up the StackId,
		//like "330c64a268a6ef6a502f04555f1d0a8f,330c64a268a6ef6a502f04555f1d0a8f"
		// I had to do manual clean-up ;-(
		LOG.debug("Doing validation on : " + target);
		StackBean sb = (StackBean)target;
		sb.setStackId(sb.getStackId().substring(sb.getStackId().indexOf(",") + 1));
		LOG.debug("Doing validation on : " + sb.getStackId());
		target = sb;
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "userName", "username.required");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "stackId", "stackId.required");
		ValidationUtils.rejectIfEmpty(errors, "stackName", "stackName.required");
		ValidationUtils.rejectIfEmpty(errors, "geneId", "geneId.required");
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "geneName", "geneName.required");
	}

	@Override
	public boolean supports(Class c) {
		// TODO Auto-generated method stub
		return StackBean.class.equals(c);
	}

}
