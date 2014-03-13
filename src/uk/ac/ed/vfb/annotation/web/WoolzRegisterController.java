package uk.ac.ed.vfb.annotation.web;

/**
 * Controller providing the front-end for the /do/woolz_regsiter.html view.
 * @author nmilyaev
 */

import java.io.FileOutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import uk.ac.ed.vfb.annotation.model.StackBean;
import uk.ac.ed.vfb.annotation.model.StackRegistrationBean;
import uk.ac.ed.vfb.annotation.service.StackBeanManager;
import uk.ac.ed.vfb.model.security.UserBean;
import uk.ac.ed.vfb.service.UserManager;

public class WoolzRegisterController implements Controller {
	private StackBeanManager sbm;
	private UserManager ubm; 
	private static String XFORM_TEXT = 	"! TYPEDSTREAM 1.1 \n" +  
							"affine_xform {\n" + 
							"xlate XLATE\n" +  
							"rotate ROTATE \n" +  
							"scale SCALE \n" +  
							"shear SHEAR \n" +  
							"center CENTER \n" +
							"}";
	private static final Log LOG = LogFactory.getLog(WoolzRegisterController.class);

	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception{
		ModelAndView modelAndView = new ModelAndView("do/annotation/warpToWoolz");
		boolean reverse = (req.getParameter("reverse")!=null && req.getParameter("reverse").equals("on"));
		LOG.debug("......................>>>>> WoolzRegisterController " + req.getParameter("rotationvalue")+ "reverse? " + reverse);
		if(null != req.getParameter("rotationvalue")) {
			String[] params = req.getParameter("rotationvalue").split(";");
//			String xformText = WoolzRegisterController.XFORM_TEXT;
//			xformText = xformText.replace("XLATE", "0 0 0");
			String rol="",pit="",yaw="",dst="",fxp = "";
			for(int i=0;i<params.length;i++) {
				if(params[i].contains("rol")) {
					rol = params[i].substring(params[i].indexOf("=")+1,params[i].length());
				}; 
				if (params[i].contains("pit")) {
					pit = params[i].substring(params[i].indexOf("=")+1,params[i].length());
				};
				if (params[i].contains("yaw")) {
					yaw = params[i].substring(params[i].indexOf("=")+1,params[i].length());
				} 
				if (params[i].contains("dst")) {
					dst = params[i].substring(params[i].indexOf("=")+1,params[i].length());
				} 
//				if (params[i].contains("fxp")) {
//					fxp = params[i].substring(params[i].indexOf("=")+2,params[i].length()-1);
//				}
			}
//			LOG.debug("FXP: " + fxp);
//			
//			xformText = xformText.replace("ROTATE", rol+" "+pit+" "+yaw);
//			xformText = xformText.replace("SCALE", "1 1 1");
//			xformText = xformText.replace("SHEAR", "0 0 0");
			
//			String[] center = fxp.split(",");
//			String centerVal = center[0].substring(4) + " " + center[1].substring(4) + " " + center[2].substring(4);
//			xformText = xformText.replace("CENTER", centerVal);
//			LOG.debug("xformText: " + xformText);

			// Saving the xform file
//			LOG.debug("stackBean " + stackBean  + " : " + stackBean.getStackName());
//			//Default path for xform file
//			String fileName = Utils.STACKS_DIR + stackBean.getStackURL() + Utils.getProp("USER_STACKS_XFORM_FILENAME");
//			LOG.debug("Filename: " + fileName);
//			FileOutputStream fileOut = new FileOutputStream(fileName);
//			fileOut.write(xformText.getBytes());
//			fileOut.flush();
//			fileOut.close();
			
			StackRegistrationBean srb = new StackRegistrationBean(sbm, ubm.getCurrentUserBean());
			srb.runRegistraiton("cmtk", pit, yaw, rol, reverse);
			modelAndView.addObject("jobsRunning", StackRegistrationBean.JOBS_RUNNING);
		}
		return modelAndView;
	}

	public void setSbm(StackBeanManager sbm) {
		this.sbm = sbm;
	}
	
	public void setUbm(UserManager ubm) {
		this.ubm = ubm;
	}
	
}