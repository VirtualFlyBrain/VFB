package uk.ac.ed.vfb.web.csvviewer;

import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.view.AbstractView;
import uk.ac.ed.vfb.service.APageable;

/**
 * Parent class for the two CsvViewer classes. Implements the required wiring and HTTP header setting 
 * @author nmilyaev
 */

public abstract class CsvViewer extends AbstractView{
	protected String fileName;
	protected PrintWriter writer;
	protected APageable manager;
	protected static final Log LOG = LogFactory.getLog(CsvViewer.class); 
		
	public CsvViewer(APageable manager) {
		super();
		this.manager = manager;
	}

	protected void renderMergedOutputModel(Map model, HttpServletRequest req, HttpServletResponse res) throws Exception {
		setHeaders(req, res);
		writer = res.getWriter();
		renderOutput();
		writer.flush(); 
		writer.close();		
	}
	
	private void setHeaders(HttpServletRequest req, HttpServletResponse res){
		fileName = req.getParameter("filename") + ".csv";
//		LOG.debug("FILEMANE: " + fileName);
		res.setHeader("Content-type", "text/csv");
		res.setHeader("Content-Disposition","attachment; filename=\"" + fileName + "\"");
	}
	
	/** Methiod to be implemented in child classes */
	protected abstract void renderOutput();

}
