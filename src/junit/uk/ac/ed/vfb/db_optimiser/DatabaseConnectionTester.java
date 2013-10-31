package junit.uk.ac.ed.vfb.db_optimiser;

/**
 * Queries two databases and creates a mapping table between neuron id->FbId for driver -> FBName for driver  
 * Obsolete:Implements query handling for the 3 gene-related queries (transgene, gene expression and phenotype)
 * @author nmilyaev
 */

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import junit.framework.TestCase;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

public class DatabaseConnectionTester extends TestCase {
	DataSource flybaseDS;
	DataSource vfbDS;
	private static final Log LOG = LogFactory.getLog(DatabaseConnectionTester.class); 

	protected void setUp() {
		Resource res = new FileSystemResource("build/classes/beans.xml");
		XmlBeanFactory factory = new XmlBeanFactory(res);
		flybaseDS = (DataSource) factory.getBean("dataSource");
		vfbDS = (DataSource) factory.getBean("vfbDataSource");
	}

	//	public void testOptimiseTable(){
	//		eo.optimiseTransgeneTable();1
	//		assertTrue(true);
	//	}

	public void testQueryTable() throws SQLException{
		Connection conVFB = vfbDS.getConnection();
		conVFB.setAutoCommit(true);
		System.out.println("Doing stuff");
		Connection conFB = flybaseDS.getConnection();
		conFB.setAutoCommit(true);
		PreparedStatement pstmtVFB = 
				conVFB.prepareStatement("SELECT id, fbid FROM third_party_flybase_lookup");
		PreparedStatement pstmtFB1 = 
				conFB.prepareStatement("SELECT name FROM feature where uniquename = ?");
		PreparedStatement pstmtVFB1 = 
				conVFB.prepareStatement("update third_party_flybase_lookup set driver_name = ? where id = ?");
		ResultSet rs1 = pstmtVFB.executeQuery();
		ResultSet rs2 = null;
		System.out.println("Sales Department:");
		while (rs1.next()) {
			String id = rs1.getString("id");
			String fbid = rs1.getString("fbid");
			System.out.println(id + "  ;" + fbid);
			pstmtFB1.setString(1, fbid);
			rs2 = pstmtFB1.executeQuery();
			while (rs2.next()) {
				String name = rs2.getString("name");
				System.out.println(name);
				pstmtVFB1.setString(1, name);
				pstmtVFB1.setString(2, id);
				pstmtVFB1.execute();
			}
		}
		rs1.close();
		pstmtVFB.close();
		rs2.close();
		pstmtFB1.close();
		conFB.close();
		pstmtVFB1.close();
		conVFB.close();

		assertTrue(true);
	}

	//	public static void main(String[] args){
	//		System.out.println("Start...");
	//		ExpressionOptimiserTester eo = new ExpressionOptimiserTester();
	//		eo.obm = new OntBeanManager();
	//		eo.optimiseTransgeneTable();
	//	}

}
