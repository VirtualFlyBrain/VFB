package uk.ac.ed.vfb.dao.db.pojo;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;

import uk.ac.ed.vfb.model.security.UserBean;

/**
* Wrapper class that produces UserBean entities given a user bean query result set
* Called from uk.ac.ed.vfb.dao.db.security.UserManagerDAO
*/

public class UserBeanQueryResultSetExtractor implements ResultSetExtractor, RowMapper {
	private static final Log LOG = LogFactory.getLog(UserBeanQueryResultSetExtractor.class);

	private String username;
	private String password;
	private String firstname;
	private String surname;
	private String institution;
	private String position;
	private String email;
	private String phone;
	private String notes;
	private String[] autorities;
	private boolean isEnabled = true;
	
	public Object extractData(ResultSet rs) throws SQLException {
		//Creating new bean, skipping the authority for now.
		UserBean res = new UserBean(/*username*/rs.getString(1), /*password*/rs.getString(2), 
									/*firstname*/rs.getString(3), /*surname*/rs.getString(4), 
									/*institution*/rs.getString(5), /*position*/rs.getString(6),
									/*email*/rs.getString(7), /*phone*/rs.getString(8),
									/*notes*/rs.getString(9), /*isEnabled*/ rs.getBoolean(10) 
									/*authorities rs.getArray(11)*/);				
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


