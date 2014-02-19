package uk.ac.ed.vfb.dao.db;

import java.util.*;

import org.apache.commons.logging.*;
import org.springframework.jdbc.core.RowMapper;
import uk.ac.ed.vfb.dao.db.pojo.*;

/**
 * Implements query handling for the 3 gene-related queries (transgene, gene expression and phenotype)
 * @author nmilyaev
 */

public class GeneQueryDAO extends AQueryDAO {
	private static final Log LOG = LogFactory.getLog(GeneQueryDAO.class); 

	/**
	 * Queries the tables to extract salient information (feature structure name, reference details) for a transgene query 
	 */
	public List<GeneQueryResult> getListForAction(String action, String ids) {
		String query = this.getQueryForName(action).replace("XXX", ids); 			
		LOG.debug("Transgene query : " + query);
		long startTime = System.currentTimeMillis();
		List<GeneQueryResult> results = this.jdbcTemplate.query(query, new Object[] { }, (RowMapper)new GeneQueryResultSetExtractor());
		long endTime = System.currentTimeMillis();
		LOG.debug("Total elapsed time in querying the DB for expression list is : "+ (endTime-startTime));
		return results;
	}
	
}
