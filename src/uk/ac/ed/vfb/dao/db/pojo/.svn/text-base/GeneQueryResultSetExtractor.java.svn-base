package uk.ac.ed.vfb.dao.db.pojo;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;

/**
 * Wrapper class that produces GeneQueryResult entities given a gene query result set
 * called from uk.ac.ed.vfb.dao.db.GeneQueryDAO
 */

public class GeneQueryResultSetExtractor implements ResultSetExtractor, RowMapper {
	private static final Log LOG = LogFactory.getLog(GeneQueryResultSetExtractor.class);

	public Object extractData(ResultSet rs) throws SQLException {
		GeneQueryResult res = new GeneQueryResult();
		//One query returns 3 columns, the other one 4
		try{
			res.setLocation(rs.getString(1));
			res.setLocationRef(rs.getString(6));				
			rs.getString(4);
			res.setDriver(rs.getString(2));
			res.setDriverRef(rs.getString(3));
			res.setReferenceRef(rs.getString(4));			
			res.setReference(rs.getString(5));
			res.setFlag(false); //default to false;
		}
		catch (SQLException e){
			//Error parsing bean - WTF?!
		}
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


