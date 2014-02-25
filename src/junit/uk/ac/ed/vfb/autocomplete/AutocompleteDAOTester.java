package junit.uk.ac.ed.vfb.autocomplete;

/**
 * Queries two databases and creates a mapping table between neuron id->FbId for driver -> FBName for driver  
 * Obsolete:Implements query handling for the 3 gene-related queries (transgene, gene expression and phenotype)
 * @author nmilyaev
 */

import java.io.*;
import java.util.*;

import junit.framework.TestCase;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.*;
import uk.ac.ed.vfb.tools.autocomplete.AutocompleteDAO;

public class AutocompleteDAOTester extends TestCase {
	AutocompleteDAO adao;
	private static final Log LOG = LogFactory.getLog(AutocompleteDAOTester.class); 

	protected void setUp() {
		Resource res = new FileSystemResource("build/classes/beans.xml");
		XmlBeanFactory factory = new XmlBeanFactory(res);
		adao = (AutocompleteDAO) factory.getBean("autocompleteDAOAll");
		adao.createSynSet();
		adao.createSynMap();
	}

	//	public void testOptimiseTable(){
	//		eo.optimiseTransgeneTable();1
	//		assertTrue(true);
	//	}

	public void testAutocompletePatternMatcher(){
		BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
		String s, cumulative = "";
		String response; 
		try {
			while ((s = in.readLine()) != null && s.length() != 0){
				long startTime = System.currentTimeMillis();
				cumulative += s;
				if (s.equals("0")) cumulative = "";
				System.out.println("===================================" + cumulative + ":\n");
				response = adao.getMatchingBeansByPattern(cumulative, "itunes");
				System.out.println(response);	
				long endTime = System.currentTimeMillis();
				System.out.println("Time: " + (endTime - startTime));	
				// An empty line or Ctrl-Z terminates the program
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		assertTrue(true);
	}

	//	public static void main(String[] args){
	//		System.out.println("Start...");
	//		ExpressionOptimiserTester eo = new ExpressionOptimiserTester();
	//		eo.obm = new OntBeanManager();
	//		eo.optimiseTransgeneTable();
	//	}

}
