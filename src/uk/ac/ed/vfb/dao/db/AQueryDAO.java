package uk.ac.ed.vfb.dao.db;

import java.util.ResourceBundle;
import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * An abstract class- parent of all the QueryDAO classes
 * @author nmilyaev
 */

public abstract class AQueryDAO {
	protected JdbcTemplate jdbcTemplate;
	private ResourceBundle bundle = ResourceBundle.getBundle("queries");

	/**
	 * Setting data source 
	 * @param dataSource
	 */
	public void setDataSource(DataSource dataSource) {
		this.jdbcTemplate = new JdbcTemplate(dataSource);
	}
	
	/**
	 * Reads the queries.properties file and returns the query for a given name
	 * @param name
	 * @return
	 */
	public String getQueryForName(String name){
		String query = bundle.getString(name);
		return query;
	}
		
}
