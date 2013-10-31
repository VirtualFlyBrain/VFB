package uk.ac.ed.vfb.dao.db.pojo;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;

import uk.ac.ed.vfb.model.ThirdPartyBean;

/** Wrapper class that produces ThirdPartyBean entities given a third party query result set
 * Called from uk.ac.ed.vfb.dao.db.ThirdPartyDAO
 */

public class ThirdPartyQueryResultSetExtractor implements RowMapper, ResultSetExtractor {
	private static final Log LOG = LogFactory.getLog(ThirdPartyQueryResultSetExtractor.class);

	public Object extractData(ResultSet rs) throws SQLException {
		//Creating new bean, skipping the authority for now.
		ThirdPartyBean res = new ThirdPartyBean(rs.getString("vfbid"), rs.getString("fbid"), rs.getString("remoteid"), 
				rs.getString("source_name"), rs.getString("thumb_name"),  rs.getString("local_stack_url"), 
				rs.getString("base_url") , rs.getString("thumb_local_base"), rs.getString("stack_local_base"), 
				rs.getString("descr"), rs.getString("display_name"), rs.getString("stack_type"), rs.getBoolean("complete_expression_pattern"));				
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
