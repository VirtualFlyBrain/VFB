package uk.ac.ed.vfb.dao.db.pojo;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import uk.ac.ed.vfb.model.PubBean;

/**
 * Wrapper class that produces PubBean entities given a publication query result set
 * Called from uk.ac.ed.vfb.dao.db.PubDAO
 */

public class PubQueryResultSetExtractor implements ResultSetExtractor, RowMapper {
	private static final Log LOG = LogFactory.getLog(PubQueryResultSetExtractor.class);

	public Object extractData(ResultSet rs) throws SQLException {
		LOG.debug("Extracting data from retult: " + rs);
		PubBean res = new PubBean(rs.getString(1), rs.getString(2));				
		return res;
	}
	
	public Object mapRow(ResultSet rs, int line) {
		try{
			return extractData(rs);
		}
		catch (Exception ex) {
			ex.printStackTrace();
			return null;
		}
	}
}


