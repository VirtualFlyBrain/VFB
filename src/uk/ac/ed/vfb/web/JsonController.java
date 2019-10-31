package uk.ac.ed.vfb.web;

import java.io.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.multiaction.MultiActionController;

import uk.ac.ed.vfb.annotation.web.Utils;

/**
 *  @author nmilyaev
 * Controller providing the front-end for the /do/get_json.html view.
 * Gets the location of required JSON file (tiledImageModelData) from the request parameters
 * and replaces the "SERVER_NAME" with the server name as specified in the resources.properties file
 * This way any web application (vfb, vfbdev, vfbsandbox) can use the same image data without the need 
 * to tweak it or conflicts  

 */

public class JsonController extends MultiActionController{
	private static String SERVER_NAME = Utils.getProp("server_name");
	private static String SERVER_NAME_PLACEHOLDER = Utils.getProp("SERVER_NAME_PLACEHOLDER");
	private static final Log LOG = LogFactory.getLog(JsonController.class);	

	@SuppressWarnings("unchecked")
	/**
	 * Redirects to CsvOntView or CsvGeneView depending on the request parameters
	 */
	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
		String json = req.getParameter("json");
		String type = req.getParameter("type");
		ModelAndView modelAndView = new ModelAndView("do/getJson");
		modelAndView.addObject("json", getJsonAsString(json, type));
		return modelAndView;
	}

	/**
	 * Given the json parameter and type constructs a full path to the metadata file
	 * @param url - path to the json file relative to the specified type's based dir name
	 * @param type - stack type as specified by Utils.TYPES 
	 * @return
	 */
	private String getJsonAsString(String url, String type){
		LOG.debug("URL: " + url + " type: " + type);
		String fileName = Utils.getStackPathForType(url, type);
		LOG.debug("fileName: " + fileName);
		FileInputStream inputStream = null;
		String fileContent = "";
		try {
			inputStream = new FileInputStream(fileName);
			fileContent = IOUtils.toString(inputStream);
			fileContent = fileContent.replace(SERVER_NAME_PLACEHOLDER, SERVER_NAME);
		} 
		catch (FileNotFoundException fex){
			LOG.error("File not found: " + fileName);
		}
		catch (IOException ex){
			LOG.error("File could not be read: " + fileName);
		}
		finally 
		{
			try {
				inputStream.close();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				LOG.error(e.getMessage());
			}
		}
		return fileContent;
	}

}