package junit.uk.ac.ed.vfb.dao;

import java.util.*;

import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import junit.framework.TestCase;
import uk.ac.ed.vfb.dao.db.GeneQueryDAO;
import uk.ac.ed.vfb.dao.db.pojo.GeneQueryResult;
import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.DomainManager;
import uk.ac.ed.vfb.service.GeneBeanManager;
import uk.ac.ed.vfb.service.OntBeanManager;
import uk.ac.ed.vfb.web.WebQueryUtils;

public class GeneQueryDaoTest extends TestCase {
	GeneBeanManager gbm;
	OntBeanManager obm;

	protected void setUp() {
//		ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
//		queryDAO = (GeneQueryDAO) context.getBean("queryDAO");
		Resource res = new FileSystemResource("build/classes/beans.xml");
	    XmlBeanFactory factory = new XmlBeanFactory(res);
	    obm = (OntBeanManager) factory.getBean("ontBeanManager");
		gbm = (GeneBeanManager) factory.getBean("geneBeanManager");
		System.out.println("testGetTransgeneList");
//		obm = new OntBeanManager();
	}

	protected void tearDown() {
		gbm = null;
		obm = null;
	}

	public void testGetTransgeneList(){
		System.out.println("testGetTransgeneList");
//		String id = "FBbt_00003924";
		String id = "FBbt_00007401";// antennal lobe
		String query = WebQueryUtils.getDefString("found", id);
		Set<OntBean> ontBeans = obm.getBeanListForQuery(query);
		System.out.println("OntBeans: " + ontBeans.size());
		Set<GeneQueryResult> geneResult = gbm.getTransgeneList(ontBeans);
		Iterator<GeneQueryResult> it = geneResult.iterator();
		while (it.hasNext()){
			GeneQueryResult curr = it.next();
			System.out.println(curr.getDriver() + " > " + curr.getLocation());
		}
		System.out.println("Total: " + geneResult.size());
		assertTrue(geneResult.size()>0);
	}

	public void testGetExpressionList(){
//		String id = "FBbt_00003924";
		String id = "FBbt_00007401";// antennal lobe
		String query = WebQueryUtils.getDefString("found", id);
		Set<OntBean> ontBeans = obm.getBeanListForQuery(query);
		System.out.println("OntBeans: " + ontBeans.size());
		gbm.getExpressionList(ontBeans);
		Set<GeneQueryResult> geneResult = gbm.getResultSet();
		Iterator<GeneQueryResult> it = geneResult.iterator();
		while (it.hasNext()){
			GeneQueryResult curr = it.next();		
			System.out.println(curr.getDriver() + curr.getLocation());
		}
		System.out.println("Total: " + geneResult.size());
		assertTrue(geneResult.size()>0);
	}

}
