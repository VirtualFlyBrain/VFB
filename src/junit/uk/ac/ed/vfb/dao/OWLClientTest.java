package junit.uk.ac.ed.vfb.dao;

import java.util.*;
import java.util.concurrent.*;

import org.springframework.beans.factory.xml.*;
import org.springframework.core.io.*;

import uk.ac.ebi.brain.error.ClassExpressionException;
import uk.ac.ed.vfb.model.*;
import uk.ac.ed.vfb.service.OntBeanManager;
import uk.ac.ed.vfb.dao.client_server.OWLClient;
import uk.ac.ed.vfb.dao.client_server.server_includes.DLQueryEngineBrain;
import uk.ac.ed.vfb.dao.client_server.server_includes.OntQueryQueue;
import uk.ac.ed.vfb.dao.client_server.server_includes.OwlResultParserClass;

import junit.framework.TestCase;

public class OWLClientTest extends TestCase {
	private OWLClient client;
	protected static int numThreads = 0;
	
    protected void setUp() {
    	Resource res = new FileSystemResource("build/classes/beans.xml");
    	XmlBeanFactory factory = new XmlBeanFactory(res);
    	client = (OWLClient) factory.getBean("ontClient");
    	//client.createSocket();   	
     }

     protected void tearDown() {
    	 client = null;
     }

     public void testGetEntitiesForQuery(){
    	String query = "subclass&overlaps some medulla";
    	//Set<OntBean> results = client.askQuery(query);
//		Iterator<OntBean> it = results.iterator();
//		while (it.hasNext()) {
//			System.out.println(it.next()); 
//		}
    	query = "subclass&FBbt_00005095 that BFO_0000050 some  FBbt_00003624, FBbt_00005137 that BFO_0000050 some  FBbt_00003624, FBbt_00041000 that BFO_0000050 some FBbt_00003624, FBbt_00040007 that BFO_0000050 some  FBbt_00003624, FBbt_00040006 that BFO_0000050 some  FBbt_00003624";//subclass&BFO_0000050 some FBbt_00005801";
    	System.out.println(query); 
    	Set<OntBean> results = client.askQuery(query);
    	Iterator <OntBean> it = results.iterator();
    	System.out.println(results.size()); 
//		while (it.hasNext()) {
//			System.out.println(it.next()); 
//		}
    	query = "subclass&FBbt_00007002 that RO_0002131 some FBbt_00003626"; //FBbt_00005106";
    	System.out.println(query);
    	results = client.askQuery(query);
    	it = results.iterator();
//		while (it.hasNext()) {
//			System.out.println(it.next()); 
//		}
		query = "subclass&FBbt_00005095 that BFO_0000050 some  FBbt_00003624, FBbt_00005137 that BFO_0000050 some  FBbt_00003624, FBbt_00041000 that BFO_0000050 some FBbt_00003624, FBbt_00040007 that BFO_0000050 some  FBbt_00003624, FBbt_00040006 that BFO_0000050 some  FBbt_00003624";//subclass&BFO_0000050 some FBbt_00005801";
		System.out.println(query);
    	results = client.askQuery(query);
    	it = results.iterator();
//		while (it.hasNext()) {
//			System.out.println(it.next()); 
//		}
//    	query = "brain&FBbt_00007002 that RO_0002131 some FBbt_00005801";
//    	results = client.askQuery(query);
//    	it = results.iterator();
//		while (it.hasNext()) {
//			System.out.println(it.next()); 
//		}
    	//Individual neurons ovarlapping XXX
//    	query = "individual&'exemplar_of' some ('cluster' that 'has_exemplar' some ('neuron' that 'overlaps' some FBbt_00007401))";
//    	results = client.askQuery(query);
//    	it = results.iterator();
//		while (it.hasNext()) {
//			System.out.println(it.next()); 
//		}
		// Individual clones that overlap XXX
    	query = "individual&'exemplar_of' some (FBbt_00007683 that RO_0002131 some FBbt_00003684)";
    	results = client.askQuery(query);
    	it = results.iterator();
		while (it.hasNext()) {
			System.out.println(it.next()); 
		}		
		assertTrue(results.size()==13);
     }
           
}
