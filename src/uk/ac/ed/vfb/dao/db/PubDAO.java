package uk.ac.ed.vfb.dao.db;

import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.RowMapper;

import uk.ac.ed.vfb.dao.db.pojo.*;
import uk.ac.ed.vfb.model.PubBean;



/**
 * Implements query handling for the 3 publication queries
 * @author nmilyaev
 */

public class PubDAO extends AQueryDAO {
	private static final Log LOG = LogFactory.getLog(PubDAO.class); 

	/**
	 * Queries the tables to extract publication data for specified term id
	 * @param id - FBbt id of the term
	 */
	public List<PubBean> getById(String id) {
		String query = this.getQueryForName("pubminiref").replace("XXX", id);
		LOG.debug("MiniRef query: " + query);
		List<PubBean> results = null;
		try {
			results = this.jdbcTemplate.query(query, new Object[] { }, (RowMapper)new PubQueryResultSetExtractor()); 
		}
		catch (Exception ex) {
			LOG.error("Error!!!!" + ex.getLocalizedMessage());
		}
		LOG.debug("MiniRef query results: " + results);
		if (results == null){
			LOG.error("Error resolving ref: " + id);
		}
		return results;
	}
	
	public List<PubBean> getByRef(String ref) {
		LOG.debug("MiniRef for ref: " + ref);
		String query = this.getQueryForName("pubminirefbyref").replace("XXX", ref);
		LOG.debug("MiniRef by ref query: " + query);
		List<PubBean> results = null;
		try {
			results = this.jdbcTemplate.query(query, new Object[] { }, (RowMapper)new PubQueryResultSetExtractor()); 
		}
		catch (Exception ex) {
			LOG.error("Error!!!!" + ex.getLocalizedMessage());
		}
		LOG.debug("MiniRef query results: " + results);
		if (results == null){
			LOG.error("Error resolving ref: " + ref);
		}
		return results;
	}
}
