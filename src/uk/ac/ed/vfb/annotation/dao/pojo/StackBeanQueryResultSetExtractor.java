package uk.ac.ed.vfb.annotation.dao.pojo;

/**
 * Wrapper class that produces UserBean entities given a publication query result set
 * Called from uk.ac.ed.vfb.dao.db.PubDAO
 */

import java.sql.ResultSet;
import java.sql.SQLException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;
import uk.ac.ed.vfb.annotation.model.StackBean;

public class StackBeanQueryResultSetExtractor implements ResultSetExtractor, RowMapper {
	private static final Log LOG = LogFactory.getLog(StackBeanQueryResultSetExtractor.class);
	
	// id, name, size, username, geneid, genename, url, third_party_url, description
	public StackBean extractData(ResultSet rs) throws SQLException {
		//Creating new bean, skipping the authority for now.
		StackBean res = new StackBean(rs.getString("id"), rs.getString("name"), rs.getInt("size"),
									rs.getString("username"), rs.getString("geneid"), 
									rs.getString("genename"), rs.getString("url"),
									rs.getString("third_party_url"), rs.getString("description"));	
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


