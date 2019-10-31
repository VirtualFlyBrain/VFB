package uk.ac.ed.vfb.annotation.dao;

/**
 * Implements query handling for the 3 gene-related queries (transgene, gene expression and phenotype)
 * @author nmilyaev
 */

import java.util.List;

import org.apache.commons.logging.*;
import org.springframework.jdbc.core.RowMapper;

import uk.ac.ed.vfb.annotation.dao.pojo.StackBeanQueryResultSetExtractor;
import uk.ac.ed.vfb.annotation.model.StackBean;
import uk.ac.ed.vfb.annotation.service.StackBeanManager;
import uk.ac.ed.vfb.dao.db.AQueryDAO;
import uk.ac.ed.vfb.dao.db.pojo.GeneQueryResult;
import uk.ac.ed.vfb.dao.db.pojo.GeneQueryResultSetExtractor;

public class StackManagerDAO extends AQueryDAO{
	private static final Log LOG = LogFactory.getLog(StackManagerDAO.class);

	/**
	 * Queries the tables to extract salient information (feature structure name, reference details) for a transgene query 
	 */
	public StackBean getStack(String stackId) throws IndexOutOfBoundsException {
		LOG.debug(">>>>>>>>>>>>>>>>>>>>> Fetching a stack : " + stackId);		
		String query = this.getQueryForName("stackForId").replace("XXX", stackId);
		LOG.debug(">>>>>>>>>>>>>>>>>>>>> SQL : " + query);
		List <StackBean> list = this.jdbcTemplate.query(query, new Object[] {}, (RowMapper)new StackBeanQueryResultSetExtractor());
		LOG.debug(">>>>>>>>>>>>>>>>>>>>> GOT BEAN : " + list.get(0).getStackId());
		return list.get(0);
	}

	/**
	 * Queries the tables to extract salient information (feature structure name, reference details) for a transgene query 
	 */
	public List<StackBean> getStacksAll() {
		LOG.debug(">>>>>>>>>>>>>>>>>>>>> Fetching list of all stack : ");		
		String query = this.getQueryForName("stacksAll");
		LOG.debug(">>>>>>>>>>>>>>>>>>>>> SQL : " + query);
		List<StackBean> results = this.jdbcTemplate.query(query, new Object[] {}, (RowMapper)new StackBeanQueryResultSetExtractor());
		return results;
	}

	/**
	 * Creates records for the relevant tables for a newly created user.
	 * Checks if a user with such a name already exists. 
	 * @param user
	 * @return String - "OK" or error message - typically if the user already exists 
	 */
	public String saveStack(StackBean stackBean) {
		String result = StackBeanManager.OK;
		LOG.debug(" Saving a stackBean : " + stackBean);
		String query = "start transaction";
		try {
			this.jdbcTemplate.execute(query);
			StackBean sb = null;
			try {
				sb = this.getStack(stackBean.getStackId());
				// If the stack already exists - saving revised stack
				LOG.debug("The stack HAS BEEN found, updating...");
				//result = StackBeanManager.EXISTS_STACK;
				query = this.getQueryForName("updateStack");	
				LOG.debug("SQL : " + query);					
				this.jdbcTemplate.update(query, new Object[] {stackBean.getStackName(), stackBean.getSize(), stackBean.getUserName(), stackBean.getGeneId(), 
						stackBean.getGeneName(), stackBean.getStackURL(), stackBean.getThirdPartyURL(), stackBean.getDescription(), stackBean.getStackId()});
			}
			// If the stack is not be found (new stack) - exception is thrown instead 
			catch (IndexOutOfBoundsException ex){
				// If the user record does not already exists - create a new stack
				LOG.debug("The stack not found, creating new one...");
				//result = StackBeanManager.NEW_STACK;
				query = this.getQueryForName("insertIntoStack");	
				LOG.debug("SQL : " + query);					
				this.jdbcTemplate.update(query, new Object[] {stackBean.getStackId(), stackBean.getStackName(), stackBean.getUserName(), 
						stackBean.getGeneName(), stackBean.getGeneId(), stackBean.getStackURL(), 
						stackBean.getDescription(), stackBean.getSize(), stackBean.getThirdPartyURL()});
			} 
		}
		catch(Exception ex){
			//SQL error happened - flagging it up
			ex.printStackTrace();
			result = "Error occurred!";
		}
		finally{
			query = "commit transaction";
			this.jdbcTemplate.execute(query);
		}
		return result;
	}

	public String deleteStack(String stackId) {
		String result = StackBeanManager.OK;
		LOG.debug("Deleting a stack : " + stackId);
		String query = "start transaction";
		try {
			this.jdbcTemplate.execute(query);
			StackBean sb = null;
			sb = this.getStack(stackId);
			// If the stack already exists - saving revised stack
			LOG.debug("The stack HAS BEEN found, deleting...");
			//result = StackBeanManager.EXISTS_STACK;
			query = this.getQueryForName("deleteStack").replace("XXX", stackId);	
			LOG.debug("SQL : " + query);					
			this.jdbcTemplate.execute(query);
		}
		// If the stack is not be found (new stack) - exception is thrown instead 
		catch (IndexOutOfBoundsException ex){
			// If the user record does not already exists - create a new stack
			LOG.error("The stack not found, unable to delete...");
			//result = StackBeanManager.NEW_STACK;
		}
		catch(Exception ex){
			//SQL error happened - flagging it up
			ex.printStackTrace();
			result = "Error occurred!";
		}
		finally{
			query = "commit transaction";
			this.jdbcTemplate.execute(query);
		}
		return result;
	}

}
