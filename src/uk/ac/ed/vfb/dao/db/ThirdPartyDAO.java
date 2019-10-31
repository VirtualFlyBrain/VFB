package uk.ac.ed.vfb.dao.db;

import java.util.*;

import org.apache.commons.logging.*;
import org.springframework.jdbc.core.RowMapper;

import uk.ac.ed.vfb.dao.db.pojo.ThirdPartyQueryResultSetExtractor;
import uk.ac.ed.vfb.model.ThirdPartyBean;

/**
 * Implements query handling for the 3 gene-related queries (transgene, gene expression and phenotype)
 * @author nmilyaev
 */

public class ThirdPartyDAO extends AQueryDAO {
	private static final Log LOG = LogFactory.getLog(ThirdPartyDAO.class);

	/**
	 * Queries the tables to extract salient information (feature structure name, reference details) for a transgene query 
	 */
	public List <ThirdPartyBean> getThirdPartyBeans() {
		LOG.debug(">>>>>>>>>>>>>>>>>>>>> Fetching third patrty records");		
		String query = this.getQueryForName("getAllThirdParty");
		LOG.debug(">>>>>>>>>>>>>>>>>>>>> SQL : " + query);
		List<ThirdPartyBean> results = this.jdbcTemplate.query(query, (RowMapper)new ThirdPartyQueryResultSetExtractor()); 
		return results;
	}

	public List <ThirdPartyBean> getThirdPartyBeansforId() {
		LOG.debug(">>>>>>>>>>>>>>>>>>>>> Fetching third patrty records");		
		String query = this.getQueryForName("getAllThirdParty");
		LOG.debug(">>>>>>>>>>>>>>>>>>>>> SQL : " + query);
		List<ThirdPartyBean> results = this.jdbcTemplate.query(query, (RowMapper)new ThirdPartyQueryResultSetExtractor()); 
		return results;
	}
}
