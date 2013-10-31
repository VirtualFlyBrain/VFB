package uk.ac.ed.vfb.annotation;

/**
 * Controller providing the front-end for the /do/woolz_regsiter.html view.
 * @author nmilyaev
 */

import java.io.DataInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FilePermission;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

public class WoolzRegisterController implements Controller {
	private static final Log LOG = LogFactory.getLog(WoolzRegisterController.class);	
	
	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception{
		ModelAndView modelAndView = new ModelAndView("do/woolzRegister");
		
			if(null != req.getParameter("txtboxout")) {
				System.out.println("params are:"+req.getParameter("txtboxout"));
				String[] params = req.getParameter("txtboxout").split("&");
				String writeText = "!+TYPEDSTREAM+1.1-";
				writeText = writeText+"affine_xform+{-";
				writeText = writeText+"xlate+0+0+0-";
				String rol="",pit="",yaw="",dst="",fxp = "";
				for(int i=0;i<params.length;i++) {
					if(params[i].contains("rol")) {
						rol = params[i].substring(params[i].indexOf("=")+1,params[i].length());
					} else if (params[i].contains("pit")) {
						pit = params[i].substring(params[i].indexOf("=")+1,params[i].length());
					} else if (params[i].contains("yaw")) {
						yaw = params[i].substring(params[i].indexOf("=")+1,params[i].length());
					} else if (params[i].contains("dst")) {
						dst = params[i].substring(params[i].indexOf("=")+1,params[i].length());
					} else if (params[i].contains("fxp")) {
						fxp = params[i].substring(params[i].indexOf("=")+1,params[i].length());
					}
				}
				writeText = writeText+"rotate+"+rol+"+"+pit+"+"+yaw+"-";
				if(dst == "0") {dst="1";}
				writeText = writeText+"scale+"+dst+"+"+dst+"+"+dst+"-";
				writeText = writeText+"shear+0+0+0-";
				String[] center = fxp.split(",");
				writeText = writeText+"center+"+center[0]+"+"+center[1]+"+"+center[2]+"-";
				writeText = writeText+"}";
				
				String command = "/disk/data/tomcat/fly/webapps/vfbsb/scripts/writexform.sh "+writeText;
	    		System.out.println("Command is "+command);
	    		Process p001 = Runtime.getRuntime().exec(command);
				
	    		
			}
		return modelAndView;
	}
	
}