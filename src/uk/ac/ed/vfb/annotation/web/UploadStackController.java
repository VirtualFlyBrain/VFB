package uk.ac.ed.vfb.annotation.web;

/**
 * Controller providing the front-end for the /do/file_upload.html view.
 * Uploads the LSM stack, creates the stackBean and initiates processing LSm to Woolz
 * (lsm/processLsm.bsh) in a background
 * @author nmilyaev
 */

import java.io.*;
import java.util.ResourceBundle;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;
import org.springframework.web.servlet.view.RedirectView;

import uk.ac.ed.vfb.annotation.model.StackBean;
import uk.ac.ed.vfb.annotation.service.StackBeanManager;
import uk.ac.ed.vfb.web.exception.StackExistsException;

public class UploadStackController implements Controller {

	private StackBeanManager sbm;
	private StackDetailController sdc;
	private static final Log LOG = LogFactory.getLog(UploadStackController.class);

	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception{
		ModelAndView modelAndView = new ModelAndView(new RedirectView("/do/annotation/stackDetail.html"));
		Runtime s_runtime = Runtime.getRuntime ();
		LOG.debug("Total Memory1: " + s_runtime.totalMemory()/1024 + " Free Memory : " + s_runtime.freeMemory()/1024);
		String contentType = req.getContentType();
		String tmpFileName = null;
		if ((contentType == null) || (contentType.indexOf("multipart/form-data") < 0)) {
			// @ TODO: do proper error handling
			LOG.error("Error file uploading, shit happened!");
		}
		DataInputStream in = new DataInputStream(req.getInputStream());
		//we are taking the length of Content type data
		int formDataLength = req.getContentLength();
		byte dataBytes[] = new byte[formDataLength];
        in.readFully(dataBytes);//(dataBytes, totalBytesRead, formDataLength);
        in.close();
        //The only way to fix it for now - UTF-8 does not work for some reason :-(
		String file = new String(dataBytes, "ISO-8859-1");
		//for saving the file name
		String stackName = file.substring(file.indexOf("filename=\"") + 10);
		stackName = stackName.substring(0, stackName.indexOf("\n"));
		stackName = stackName.substring(stackName.lastIndexOf("\\") + 1,stackName.indexOf("\""));
		int lastIndex = contentType.lastIndexOf("=");
		String boundary = contentType.substring(lastIndex + 1,contentType.length());
		//extracting the index of file
		int startPos = 0;
		startPos = file.indexOf("filename=\"");
		startPos = file.indexOf("\n", startPos) + 1;
		startPos = file.indexOf("\n", startPos) + 1;
		startPos = file.indexOf("\n", startPos) + 1;
		int boundaryLocation = file.indexOf(boundary, startPos)-4;
		int endPos = boundaryLocation;
		int imageDataLength = (endPos-startPos);
		LOG.debug("Data length: " + file.length() + " Image data length: "+ imageDataLength);
		// creating a new file with the same name and writing the content in new file
		tmpFileName = Utils.TMP_DIR + stackName;
		LOG.debug("lsmFile: "+ stackName +" finalPathFile "+tmpFileName);
		File lsmFile = new File(tmpFileName);//new File(tmpFileName.substring(0, tmpFileName.indexOf(".")));
		FileOutputStream fileOut = new FileOutputStream(tmpFileName);
		fileOut.write(dataBytes, startPos, (endPos - startPos));
		fileOut.flush();
		fileOut.close();

		String[] cmd={"md5sum", tmpFileName};
		// You need to trim it since the return result starts with "\n"
		String stackId = Utils.runCommand(cmd).split(" ")[0].trim();

		LOG.debug("Total Memory2: " + s_runtime.totalMemory()/1024 + " Free Memory : " + s_runtime.freeMemory()/1024);
		StackBean stackBean = sbm.getStackBean(stackId);
		//check if the stack exists - the existing stack will have non-empty name!!!
		LOG.debug("Stack exists? "+ (stackBean.getStackName() == null || stackBean.getStackName().equals("")));
		if (stackBean.getStackName() == null || stackBean.getStackName().equals("")){
			//running stack generation in background
			String command = Utils.SCRIPT_DIR + "lsm/processLsm.bsh " + lsmFile.getName() + " &";
			Utils.runCommand(command);
			LOG.debug(command);
			//assign stckBean attributes
			stackBean.setStackName(stackName);
			stackBean.setSize(imageDataLength);
			stackBean.setStackURL(stackName);
			stackBean.setStackId(stackId);
		}
		else{
			//skip stack generation - do nothing and proceed to cleaning up the memory
			dataBytes=null; file=null; req = null; res = null; file = null;
			System.gc();
			//Uncomment before deploying!
			throw new StackExistsException(stackBean.getStackName());
		}
		//modelAndView.addObject("stackname",stackBean.getStackName());
		LOG.debug("dataBytes : " + dataBytes.length + " file : " + file.length());
		dataBytes=null; file=null; req = null; res = null; file = null;
		System.gc();
		s_runtime = Runtime.getRuntime ();
		LOG.debug("Total Memory3: " + s_runtime.totalMemory()/1024 + " Free Memory : " + s_runtime.freeMemory()/1024);
		return modelAndView;
	}

	public void setSbm(StackBeanManager sbm) {
		this.sbm = sbm;
	}

	public void setSdc(StackDetailController sdc) {
		this.sdc = sdc;
	}







}
