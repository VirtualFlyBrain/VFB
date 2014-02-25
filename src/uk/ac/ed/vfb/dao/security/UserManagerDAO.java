package uk.ac.ed.vfb.dao.security;

import org.apache.commons.logging.*;
import org.springframework.jdbc.core.RowMapper;

import uk.ac.ed.vfb.dao.db.AQueryDAO;
import uk.ac.ed.vfb.dao.db.pojo.UserBeanQueryResultSetExtractor;
import uk.ac.ed.vfb.model.security.UserBean;

/**
 * Implements query handling for DB-based user authentication
 * @author nmilyaev
 */

public class UserManagerDAO extends AQueryDAO{
	private static final Log LOG = LogFactory.getLog(UserManagerDAO.class);
	private static final String ROLE_USER = "ROLE_USER";
	public static final String USER_EXISTS = "The user already exists!";
	public static final String USER_NOT_EXISTS = "The user does not exist yet!";
	public static final String OK = "ok";

	/**
	 * Queries the tables to extract salient information (feature structure name, reference details) for a transgene query 
	 */
	public UserBean getUser(String username) throws IndexOutOfBoundsException {
		String query = this.getQueryForName("userForId").replace("XXX", username);
		LOG.debug("Fetching user SQL : " + query);		
		return (UserBean)this.jdbcTemplate.query(query, new Object[] {}, (RowMapper)new UserBeanQueryResultSetExtractor()).get(0);
	}


	/**
	 * Creates records for the relevant tables for a newly created user.
	 * Checks if a user with such a name already exists. 
	 * @param user
	 * @return String - "OK" or error message - typically if the user already exists 
	 */
	public String saveUser(UserBean user, String action) {
		String result = UserManagerDAO.OK;
		String username = user.getUsername();
		String query = "start transaction";
		try {
			this.jdbcTemplate.execute(query);
			UserBean ub = null;
			try {
				ub = this.getUser(username);
				// If the user record already exists - saving revised user
				LOG.debug("The user HAS BEEN found, all good...");
				if (action.equals("edit")){
					query = "UPDATE users SET password=md5('" + user.getPassword() + "') WHERE username='" + username + "'";
					LOG.debug("Updating a user SQL : " + query);	
					this.jdbcTemplate.execute(query);
					query = "UPDATE user_detail SET firstname='" + user.getFirstname() + "', surname='" + user.getSurname() + 
							"', institution='" + user.getInstitution() + "', position='" + user.getPosition() + 
							"', email='" + user.getEmail() + "', phone='" + user.getPhone() + 
							"', notes='" + user.getNotes() + "' WHERE username = '" + username + "'" ;
					LOG.debug("Updating user detail SQL : " + query);
					this.jdbcTemplate.execute(query);				
				}
				else {
					result = "Error: " + UserManagerDAO.USER_NOT_EXISTS;
				}
			}
			// The user should not be found - exception is thrown instead 
			catch (IndexOutOfBoundsException ex){
				// If the user record does not already exists - create a new user
				LOG.debug("The user not found, all good...");
				if (action.equals("new")){
					query = "INSERT INTO users VALUES('" + user.getUsername() + "', md5('" + user.getPassword() + "'), true)";
					this.jdbcTemplate.execute(query);
					query = "INSERT INTO authorities VALUES('" + user.getUsername() + "', '" + UserManagerDAO.ROLE_USER + "')";
					LOG.debug("Creating a user SQL : " + query);	
					this.jdbcTemplate.execute(query);
					query = "INSERT INTO user_detail VALUES('" + user.getUsername() + "', '" + user.getFirstname() + "', '" + user.getSurname() + 
							"', '" + user.getInstitution() + "', '" + user.getPosition() +
							"', '" + user.getEmail() + "', '" + user.getPhone() +
							"', '" + user.getNotes() + "')";
					LOG.debug("Creating user detail SQL : " + query);	
					this.jdbcTemplate.execute(query);
				}
				else {
					result = "Error: " + UserManagerDAO.USER_EXISTS;
				}
			}
		}
		finally{
			query = "commit transaction";
			this.jdbcTemplate.execute(query);
		}
		return result;
	}

}
