package junit.uk.ac.ed.vfb.ontology;

import java.util.Iterator;
import java.util.Set;

import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import junit.framework.TestCase;
import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.OntBeanManager;

public class OntBeanManagerTest extends TestCase {
	OntBeanManager obm;

	protected void setUp() {
    	Resource res = new FileSystemResource("build/classes/beans.xml");
    	XmlBeanFactory factory = new XmlBeanFactory(res);
    	obm = (OntBeanManager) factory.getBean("ontBeanManager");
	}

	protected void tearDown() {
		obm = null;
	}

	public void testGetBeanForId(){
		String id = "FBbt_00003924";
		OntBean result = obm.getBeanForId(id);
		System.out.println(result.getFbbtId()+ " : " + result.getId()); 
		assertTrue(result!=null);
	}

	public void testGetBeanListForQuery(){
		String query = "part_of some ";
		Set<OntBean> results = obm.getBeanListForQuery("FBbt_00003624");
		System.out.println(results.size());
		Iterator<OntBean> it = results.iterator();
		while (it.hasNext()){
			OntBean ob = it.next();
			System.out.println(ob.getFbbtId()+ " : " + ob.getName()); 
		}
		assertTrue(results.size()==12);
	}

}
