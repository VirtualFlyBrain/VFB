package uk.ac.ed.vfb.dao.db;

import java.util.*;

import org.apache.commons.logging.*;
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
		//LOG.debug("MiniRef query: " + query);
		List<PubBean> results = null;
		try {
			results = this.jdbcTemplate.query(query, new Object[] { }, (RowMapper)new PubQueryResultSetExtractor()); 
		}
		catch (Exception ex) {
			LOG.error("Error!!!!" + ex.getLocalizedMessage());
		}
		//LOG.debug("MiniRef query results: " + results);
		if (results == null){
			LOG.error("Error resolving ref: " + id);
		}
		return results;
	}
	
	public List<PubBean> getByRefIds(List<String> ids) {
		try{
			String combId = "";
			List<PubBean> results = new ArrayList<PubBean>();
			List<PubBean> otherRefs = new ArrayList<PubBean>();
			for (String id:ids){
				if (id.contains("FlyBase:FBrf")){
					List<String> part = Arrays.asList(id.split(":"));
					if (combId == ""){
						combId = "'" + part.get(1) + "'";
					}else{
						combId = combId + " or uniquename like '" + part.get(1) + "'";
					}
				}else{
					otherRefs.add(new PubBean(id));
				}
			}
			if (combId != ""){
				String query = this.getQueryForName("pubminirefbyref").replace("XXX", combId);
				//LOG.debug("MiniRef by FB ref query: " + query);
				try {
					results = this.jdbcTemplate.query(query, new Object[] { }, (RowMapper)new PubQueryResultSetExtractor()); 
				}
				catch (Exception ex) {
					LOG.error("MiniRef by FB ref query: " + query);
					LOG.error("Error getting minirefs from DB: " + ex.getLocalizedMessage());
				}
			}
			try {
				if (otherRefs.size() > 0){
					results.addAll(otherRefs); 
				}
			} catch (Exception ex) {
				LOG.error("MiniRef by refs: " + ids);
				LOG.error("Error adding other refs: " + ex.getLocalizedMessage());
			}
			//LOG.debug("MiniRef query results: " + results);
			if (results == null){
				LOG.error("Error resolving ref: " + ids);
			}
		} catch (Exception ex) {
			LOG.error("No publication results for: " + ids);
			ex.printStackTrace();
		}
		return results;
	}

}
