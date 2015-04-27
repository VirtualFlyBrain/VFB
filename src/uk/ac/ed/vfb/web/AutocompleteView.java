package uk.ac.ed.vfb.web;

import java.io.PrintWriter;
import java.util.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.view.AbstractView;
import uk.ac.ed.vfb.tools.autocomplete.AutocompleteDAO;

/**
 * View for the controller providing the front-end for the /do/autocomplete.html view.
 * @author nmilyaev
 */

public class AutocompleteView extends AbstractView{
	private AutocompleteDAO autocompleteDAO;
	private static String SYN_STR="\t{\"id\": \"ID\", \"text\": \"VALUE\"},\n";
	private static final Log LOG = LogFactory.getLog(AutocompleteView.class);

	public AutocompleteView(AutocompleteDAO autocompleteDAO) {
		super();
		this.autocompleteDAO = autocompleteDAO;
		this.autocompleteDAO.createSynMap();
	}

	@Override
	protected void renderMergedOutputModel(Map arg0, HttpServletRequest req, HttpServletResponse res) throws Exception {
		String q = req.getParameter("q");
		//limit param is not used
		String limit = req.getParameter("limit");
		PrintWriter writer = res.getWriter();
		writer.write(getAutocompleteListAsJson(q, limit));
		writer.flush();
		writer.close();
	}

	private String getAutocompleteListAsJson(String q, String limit){ 
		return autocompleteDAO.getMatchingBeansByPattern(q,  "itunes");
	}

}
