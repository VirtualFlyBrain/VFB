package uk.ac.ed.vfb.dao.db;

import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.RowMapper;

import org.springframework.jdbc.core.JdbcTemplate;
import javax.sql.DataSource;

import uk.ac.ed.vfb.dao.db.pojo.*;
import uk.ac.ed.vfb.model.PubBean;



/**
 * Implements query handling for the 3 publication queries
 * @author nmilyaev
 */

public class PubDAO extends AQueryDAO {
	private static final Log LOG = LogFactory.getLog(PubDAO.class); 
	private ApplicationContext applicationContext = new ClassPathXmlApplicationContext("/WEB-INF/classes/db.xml");
	
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
	
	public PubBean getByRef(String ref) {
		DataSource ds = (DataSource)connec.getBean("dataSource");
		JdbcTemplate jdbc = new JdbcTemplate(ds);
		LOG.debug("MiniRef for ref: " + ref);
		String query = this.getQueryForName("pubminirefbyref").replace("XXX", ref);
		LOG.debug("MiniRef by ref query: " + query);
		PubBean results = null;
		try {
			LOG.debug("jdbcTemplate: " + jdbc);
			List<String> entry = jdbc.queryForList(query, String.class);
			LOG.debug("DB returned: " + entry);
			results = new PubBean(ref, entry.get(0));
		}
		catch (Exception ex) {
			LOG.error("Error resolving: " + query);
			ex.printStackTrace();
		}
		LOG.debug("MiniRef query results: " + results);
		if (results == null){
			LOG.error("Error resolving ref: " + ref);
			results = new PubBean(ref, ref);
		}
		return results;
	}
	public String toString(){
		return "PubDAO";
	}
}
