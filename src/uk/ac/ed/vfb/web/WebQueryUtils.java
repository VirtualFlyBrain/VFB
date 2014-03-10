package uk.ac.ed.vfb.web;

import java.util.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import uk.ac.ed.vfb.model.OntBean;

/**
 * Provides data structures and convenience methods for running queries from the right-click menu and on the QueryBuilder
 * A better way of encoding the static strings would be using Java messages
 * @author nmilyaev
 */

public class WebQueryUtils {
	/** A map representing query type: 
	 * a key == text in the choice box / string for the interface 
	 * String[]:
	 * 1 - human-readable text for interface,
	 * 2 - human-readable description for query,
	 * 3 - core of the OWL query */ 
	private static final Map<String, String[]> actionDefs = createMap1();
	private static final Log LOG = LogFactory.getLog(WebQueryUtils.class); 

	/**
	 * Init method for actionDefs
	 * @return
	 */
	static Map<String,String[]> createMap1() {
		Map<String, String[]> ad = new HashMap<String, String[]>();
		//Subclasses
		ad.put("subclass", new String[]{"subclass", "Subclasses of ","subclass&XXX"});
		ad.put("found", 
				new String[]{"found in", "Neurons with some part in ",
				"subclass&FBbt_00005106 that RO_0002131 some XXX"
		});
		ad.put("synaptic", 
				new String[]{"have synaptic terminals in ", "Neurons with synaptic terminals in ", 
				"subclass&FBbt_00005106 that RO_0002130 some XXX"
		});
		ad.put("presynaptic", 
				new String[]{"have presynaptic terminals in ", "Neurons with presynaptic terminals in ", 
				"subclass&FBbt_00005106 that RO_0002113 some XXX"
		}); // or 'BFO_0000050' some XXX)"
		ad.put("postsynaptic", 
				new String[]{"have postsynaptic terminals in ", "Neurons with postsynaptic terminals in ", 
				"subclass&FBbt_00005106 that RO_0002110 some XXX"
		});
		ad.put("tract", 
				new String[]{"tracts in ", "Tracts/nerves innervating ", 
				"subclass&FBbt_00005099 that RO_0002134 some XXX"
		});
		ad.put("fasciculate", 
				new String[]{"fasciculating ", "Neurons fasciculating ", 
				"subclass&FBbt_00005106 that RO_0002101 some XXX"
		});
		ad.put("transgene", 
				new String[]{"transgenes expressed in ", "Transgenes expressed in ", 
				"subclass&XXX",
				"subclass&BFO_0000050 some XXX",
				"subclass&FBbt_00007002 that RO_0002131 some XXX"
		});
		ad.put("geneex", 
				new String[]{"genes expressed in ", "Genes expressed in ", 
				"subclass&XXX",
				"subclass&BFO_0000050 some XXX",
				"subclass&FBbt_00007002 that RO_0002131 some XXX"
		}); 
		ad.put("phenotype", 
				new String[]{"phenotypes expressed in ", "Phenotypes expressed in ", 
				"subclass&XXX",
				"subclass&BFO_0000050 some XXX",
				"subclass&FBbt_00007002 that RO_0002131 some XXX"
		});
		ad.put("multiquery", 
				new String[]{"multi-leg ", "Multi-leg query ", 
				"we do not need expresssion here, refer to OntQuery class"
		});
		//Cluster of Individuals
		ad.put("cluster_found", 
				new String[]{"found in", "Neurons with some part in XXX, clustered by shape",
				"individual&'exemplar_of' some ('cluster' that 'has_exemplar' some ('neuron' that 'overlaps' some XXX))"
		});
		//Individual neurons 
		ad.put("neuron_found", 
				new String[]{"found in", "Neurons with shape similar to XXX ",
				"individual&'member_of' some ('has_exemplar' value XXX)"
		});
		ad.put("exemplar_neuron", 
				new String[]{"exemplar neurons", "Examples of XXX",
				"individual&XXX"
		});
		//Lineage clones 
		ad.put("lineage_clone", 
				new String[]{"lineage clones", "Lineage clones found in ",
				"subclass&FBbt_00007683 that RO_0002131 some XXX"
		});
		//Lineage clones 
		ad.put("component_neuron", 
				new String[]{"components", "Components of ",
				"subclass&BFO_0000050 some XXX"
		});
		return ad; 
	}

	/**
	 * Returns OWL action definition string, eg "FBbt_00005106 and overlaps some (XXX or 'part_of'  some XXX)"
	 * @param action - action name acting as a Hash key 
	 * @param fbbtId - FbbtId to be weaved into the query instead the "XXX"s
	 * @param index - 0-starting index for the query (for those operations involving >1 DL queries to complete)
	 * @return
	 */
	public static String getDefString(String action, String fbbtId, int index){
		int startIndex = 2;
		String result = actionDefs.get(action)[startIndex + index];
		return result.replaceAll("XXX", OntBean.idAsOWL(fbbtId));
	}

	/** 
	 * Wrapper to return 0-th DL queries for the queries only requiring 1 DL query (eg. neuron search queries) 
	 * @param action
	 * @param fbbtId
	 * @return
	 */
	public static String getDefString(String action, String fbbtId){
		return getDefString(action, fbbtId, 0);
	}

	/**
	 * Returns human-readable action description string, eg "Neurons that innervate..."
	 * @param action
	 * @return
	 */
	public static String getDescString(String action){
		String result = actionDefs.get(action)[1];
		return result;
	}

	/**
	 * Returns interface string, eg "found in ..."
	 * @param action
	 * @return
	 */
	public static String getInterfaceString(String action){
		LOG.debug(action);
		String result = actionDefs.get(action)[0];
		return result;
	}

	/** Constructs and returns a hash for only typedefs useful for query builder */ 
	public static Map<String, String[]> getQueryBuilderDefs(){
		Map<String, String[]> ad = new HashMap<String, String[]>();
		ad.put("synaptic", actionDefs.get("synaptic"));
		ad.put("presynaptic", actionDefs.get("presynaptic"));
		ad.put("postsynaptic", actionDefs.get("postsynaptic"));
		return ad;
	}

}
