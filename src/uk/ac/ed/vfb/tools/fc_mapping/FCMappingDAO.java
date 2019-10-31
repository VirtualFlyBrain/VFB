package uk.ac.ed.vfb.tools.fc_mapping;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

import javax.sql.DataSource;

import org.apache.commons.logging.*;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;

import uk.ac.ed.vfb.dao.db.AQueryDAO;
import uk.ac.ed.vfb.dao.db.pojo.*;
import uk.ac.ed.vfb.model.PubBean;
import uk.ac.ed.vfb.service.GeneBeanManager;
import uk.ac.ed.vfb.service.OntBeanManager;

/**
 * Implements query handling for the 3 gene-related queries (transgene, gene expression and phenotype)
 * @author nmilyaev
 */

public class FCMappingDAO extends AQueryDAO {
	@SuppressWarnings("unused")
	private final String updateSQL = "update third_party_site_lookup set ";
	private static final Log LOG = LogFactory.getLog(FCMappingDAO.class);

	/**
	 * Queries the tables to extract salient information (feature structure name, reference details) for a transgene query
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	public List<Record> getAll() {
		String query = "select * from fc_mapping";
		LOG.debug("Query : " + query);
		long startTime = System.currentTimeMillis();
		List<Record> results = this.jdbcTemplate.query(query, new Object[] { }, (RowMapper)new FCMappingResultSetExtractor());
		return results;
	}

	protected void setUp() {
		Resource res = new FileSystemResource("build/classes/beans.xml");
	    XmlBeanFactory factory = new XmlBeanFactory(res);
	    DataSource vfbDS = (DataSource)factory.getBean("vfbDataSource");
	    this.setDataSource(vfbDS);
	    LOG.debug("data source : " + vfbDS);
	}

	private void process(){
		List<Record> list = this.getAll();
		for (Record curr: list){
			LOG.debug("curr:" + curr);
		}

	}

	public static void main(String[] args){
		FCMappingDAO dao = new FCMappingDAO();
		dao.setUp();
		dao.process();
	}

	private class Record {
		private String vfbid;
		private String id;
		private String longName;
		private String shortName;

		public Record(String vfbid, String id, String longName, String shortName) {
			super();
			this.vfbid = vfbid;
			this.id = id;
			this.longName = longName;
			this.shortName = shortName;
		}

		public String toString(){
			return this.vfbid + " : " + this.longName + " > " + this.shortName;
		}

	}

	private class FCMappingResultSetExtractor implements ResultSetExtractor, RowMapper {

		public Object extractData(ResultSet rs) throws SQLException {
			Record res = new Record(rs.getString(1), rs.getString(2), rs.getString(3), rs.getString(4));
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

}
