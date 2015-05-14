package uk.ac.ed.vfb.service;

import java.net.URLDecoder;
import java.util.*;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import uk.ac.ed.vfb.web.exception.SessionExpiredException;

/**
 * A parent class for all query result sets that are outputted to the user.
 * Provides pagination and navigation between pages; allows to set page size
 * @author nmilyaev
 */

public class APageable {
	/** The bean set to work with */
	protected SortedSet resultSet;
	/** How many entries per page - default value */
	private int perPage = 999999999;
	/** number of current page */
	private int currPage; 	// Min = 1
	/** Records displayed on the current page */
	private SortedSet pageRecords;
	private static final Log LOG = LogFactory.getLog(APageable.class);

	public APageable() {
		resultSet = new TreeSet();
	}

	public void setPerPage(HttpServletRequest req) {
		int perPageI;
		String perPage = req.getParameter("perPage");
		try{
			perPageI = Integer.parseInt(perPage);
		}
		catch (NumberFormatException ex){
			// No or invalid Per "page" request parameter; try session, if failed set to 0
			try{
				perPageI = (Integer)req.getSession().getAttribute("perPage");
			}
			catch (Exception nex){
				perPageI=100;
			}
		}
		this.setPerPage(perPageI);
		req.getSession().setAttribute("perPage", perPageI);
	}

	public void setPerPage(int perPage) {
		// Cheap trick to assign 0 to Integer.MAX_VALUE, because 0 is a parameter ;-[ ]
		perPage = (perPage==0)?Integer.MAX_VALUE:perPage;
		this.perPage = perPage;
		this.currPage = 1;
	}

	public int getPerPage() {
		// Cheap trick to assign 0 to Integer.MAX_VALUE
		return (perPage==Integer.MAX_VALUE)?0:perPage;
	}

	public int getCurrPage() {
		return this.currPage;
	}

	public void setCurrPage(int currPage) {
		this.currPage = currPage;
	}

	public Set getResultSet() {
		return resultSet;
	}

	/**
	 * Returns records for current page as specified by the currPage variable
	 * @param pageNumber
	 * @return
	 */
	public Set getPageRecords(){
		//LOG.info("CurrPage: " + currPage + " Per page: " + this.perPage + " Pages: " + getMaxPage() + " Records: " + resultSet.size());
		int start = (currPage-1) * perPage;
		int end = (currPage * perPage) - 1;
		return getSubSet(start, end);
	}

	/**
	 * Returns records for page as specified by the pageNumber parameter
	 * @param pageNumber
	 * @return
	 */
	public Set getPageNumber(int pageNumber){
		currPage = pageNumber;
		return getPageRecords();
	}

	/**
	 * Returns records for next page re currPage
	 * @param pageNumber
	 * @return
	 */
	public Set getNextPage(){
		int maxPage = getMaxPage();
		currPage = (currPage>=maxPage)?currPage:currPage + 1;
		return getPageRecords();
	}

	/**
	 * Max(last) page number
	 * @return
	 */
	private int getMaxPage(){
		try{
			return (int)(Math.round((resultSet.size()-1)/perPage + .5d));
		}
		catch(NullPointerException ex){
			throw new SessionExpiredException("");
		}
	}

	/**
	 * Returns records for previous page re currPage
	 * @param pageNumber
	 * @return
	 */
	public Set getPreviousPage(){
		currPage = (currPage<=1)?1:currPage - 1;
		return getPageRecords();
	}

	/**
	 * Returns the navigation bar as an HTML String, ready for inserting in jsp
	 * @param params
	 * @return
	 */
	public String getNav(String params){
		String result = "";
		int maxPage = getMaxPage();
		int startInd = currPage - 2;
		if (currPage < 3) {
			startInd = 1;
		}
		if (currPage > maxPage - 3){
			startInd = maxPage - 4;
		}
		int navSize = 5;
		if (maxPage < 5){
			navSize = maxPage;
			startInd = 1;
		}
		StringBuffer pageLinks = new StringBuffer();
		for (int i = 0; i<navSize; i++){
			pageLinks.append( (currPage==startInd+i)?(startInd+i) + "&nbsp;":getLink(startInd+i, params)  );
		}
		result = "Records found: " + resultSet.size() + " Page "+ currPage + " of " + maxPage +
		((maxPage > 1)?" <a href=\"?" + params + "&page=prev\">Previous</a>&nbsp;":"") +
		((maxPage > 1)?pageLinks.toString():"") +
		((maxPage > 1)?"<a href=\"?" + params + "&page=next\">Next</a>":"");
		return result;
	}

	/**
	 * 	Get the "useful" parameters as an array.
	 *  "Useful" parameters means those except the "page" and "perPage" params, that are really volatile.
	 */
	public String getUsefulParams(String params) throws Exception {
		if (params == null)
			params = "";
		params = URLDecoder.decode(params, "UTF-8");
		int paramInd = params.indexOf("&perPage");
		if (paramInd >= 1){
			params = params.substring(0, paramInd);
		}
		paramInd = params.indexOf("&page");
		if (paramInd >= 1){
			params = params.substring(0, paramInd);
		}
		return params;
	}

	private String getLink(int ind, String params){
		return "<a href=\"?" + params + "&page=" + ind + "\">" + ind + "</a>&nbsp;";
	}

	/** Returns only a subset of values as specified by the start and end parameters
	 * Used to produce a per-page result sets
	 */
	private Set getSubSet(int start, int end) {
		Set result = new TreeSet();
		Iterator it = resultSet.iterator();
		int i = 0;
		while (it.hasNext()) {
			Object curr = it.next();
			if (i >= start && i <= end) {
				result.add(curr);
			}
			i++;
		}
		return result;
	}

	public Set getCompleteSet() {
		return resultSet;
	}

}
