package uk.ac.ed.vfb.tools.autocomplete;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.commons.logging.*;
import uk.ac.ed.vfb.dao.db.AQueryDAO;
import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.OntBeanManager;

/**
 * Provides the methods for retrieving and manipulation with a list of synonyms for autocomplete box on a jsp page
 * The format for the list is the one required by the current autocomplete js implementation
 * @author nmilyaev
 */

public class AutocompleteDAO extends AQueryDAO {
	private static final Log LOG = LogFactory.getLog(AutocompleteDAO.class); 
	/** Set of all found ontology beans corresponding to the ont query for current type of AutocompleteDAO. 
	 * Do bear in mind that there is one instance of the SynSet per type of autocompleteDAO (neuron, neuropil, etc) per application
	 * So this value is treated as static per session per type */
	private Set<OntBean> synSet;
	/** Map of all found synonyms for current type of AutocompleteDAO. 
	 * Do bear in mind that there is one instance of the SynList per type of autocompleteDAO (neuron, neuropil, etc) per session
	 * So this value is treated as static per session per type */
	private Map<String, String> synMap;
	private OntBeanManager obm;
	/** prefix used to distinguish synonyms */
	private static final String synPrefix = " (synonym)";
	/** Specifies autocompleteDAO instance's type, eg "neuron", "neuropil" */
	public static Map<String, String> TYPES = createMap();
	private String type;

	/**
	 * Init method for actionDefs
	 * @return
	 */
	static Map<String,String> createMap() {
		Map<String, String> map = new HashMap<String, String>();
		/** BFO_0000050 = part_of, RO_0002131 = overlaps, RO_0002134 = innervates, FBbt_00003004 = adult, FBbt_00005095 = brain, FBbt_00003624 = adult brain.
		/** Neuropil: 'adult brain' or (('ganglion' or 'synaptic neuropil block' or 'synaptic neuropil domain' or 'synaptic neuropil subdomain') and part_of some 'adult brain') */
		map.put("neuropilAB", "subclass&FBbt_00005095 that BFO_0000050 some  FBbt_00003624, FBbt_00005137 that BFO_0000050 some  FBbt_00003624, FBbt_00041000 that BFO_0000050 some FBbt_00003624, FBbt_00040007 that BFO_0000050 some  FBbt_00003624, FBbt_00040006 that BFO_0000050 some  FBbt_00003624, " + 
				"FBbt_00005095 that BFO_0000050 some FBbt_00003004");
		/** Neuron: neuron that overlaps some ('adult brain' or part_of some 'adult brain') */
		map.put("neuronAB", "subclass&FBbt_00005106 that RO_0002131 some FBbt_00003624");
		/** Tract: 'neuron projection bundle' that 'innervates' some 'adult brain' */
		map.put("tractAB", "subclass&FBbt_00005099 that RO_0002134 some FBbt_00003624");
		/** lineage_clone: 'lineage clone that part_of some 'adult brain' */
	    	map.put("lineage_clone", "subclass&FBbt_00007683 that RO_0002131 some FBbt_00003624");
		/** Both Neuron and Neuropil: combination of the above */
		map.put("allAB", "subclass&FBbt_00005095 that BFO_0000050 some  FBbt_00003624, FBbt_00005137 that BFO_0000050 some FBbt_00003624, FBbt_00041000 that BFO_0000050 some FBbt_00003624, FBbt_00040007 that BFO_0000050 some  FBbt_00003624, FBbt_00040006 that BFO_0000050 some  FBbt_00003624, "+
				"FBbt_00005106 that RO_0002131 some FBbt_00003624, " +
				"FBbt_00005099 that RO_0002134 some FBbt_00003624, " + 
				"FBbt_00005095 that BFO_0000050 some FBbt_00003004");
		/** Neuropil: 'brain' or 'ganglion' or 'synaptic neuropil block' or 'synaptic neuropil domain' or 'synaptic neuropil subdomain' */
		map.put("neuropil", "subclass&FBbt_00005095, FBbt_00005137, FBbt_00041000, FBbt_00040007, FBbt_00040006");
		/** Neuron: neuron*/
		map.put("neuron", "subclass&FBbt_00005106");
		/** Tract: 'neuron projection bundle' */
		map.put("tract", "subclass&FBbt_00005099");
		/** All Nervous system + sense organs:  'sense organ' or 'nervous system' or (overlaps some 'nervous system')  */
		map.put("all", "subclass&FBbt_00005155, FBbt_00005093, RO_0002131 some FBbt_00005093");
		return map;
	}	

	/**
	 * Queries the tables to extract all synonyms for the ontology terms from the OntBean set 
	 * @return List of all found synonyms; the main OntBean names are returned, too
	 */
	@SuppressWarnings("unchecked")
	private List getByList(Set<OntBean> ontBeans) {
		List<LinkedHashMap> results;
		StringBuffer sb = new StringBuffer();
		Iterator<OntBean> it = ontBeans.iterator();
		while (it.hasNext()){
			OntBean ob = it.next();
			sb.append("," + "'" + ob.getId()+ "'"); 
		}
		String ids = sb.substring(1);	
		String query = "SELECT DISTINCT dbx.accession, c.name as name, syn.name as synName FROM db " +
				"INNER JOIN dbxref dbx ON  (db.db_id = dbx.db_id) " +
				"INNER JOIN cvterm c ON (dbx.dbxref_id = c.dbxref_id) " +
				"LEFT OUTER JOIN  cvtermsynonym syn ON (c.cvterm_id = syn.cvterm_id) WHERE  db.name ='FBbt'" +
				" AND dbx.accession in (" + ids + ") ORDER BY name";
		//LOG.debug("Autocomplete query: " + query); 
		results = null;
		try {
			results = this.jdbcTemplate.queryForList(query);
		}
		catch (Exception ex) {
			ex.printStackTrace();
		}
		return results;
	}

	/** Method called from a jsp for just-in-time retreival of the neuropil synonym set
	 * @return
	 */
	public Set<OntBean> getSynSet() {
		if (this.synSet == null || this.synSet.size() == 0 ){
			createSynSet();
		}
		return this.synSet;
	}

	@SuppressWarnings("unchecked")
	/**
	 * Creates the set of synonyms by querying Chado DB
	 */
	public void createSynSet(){
		//Check if it already exists
		if (this.synSet != null && this.synSet.size() >0 ) return;
		// Generate list of all known OntBeans for the OWL_QUERY				
		String query = TYPES.get(this.type);
//		//LOG.debug("Type: "+ this.type + " Query: " + query);
		Set<OntBean> results = obm.getBeanListForQuery(query);
		// Feed a list of ids to the SQL runner and obtain a list of records 
		List records = this.getByList(results);
		synSet = new TreeSet<OntBean>();
		// The list items are <LinkedHashMap>
		Iterator<LinkedHashMap> it1 = records.iterator();
		OntBean ob = null;
		//Iterate through the list and create the set of OntBeans
		int i = 0;
		while (it1.hasNext()){
			LinkedHashMap curr = (LinkedHashMap)it1.next();
			String id = "FBbt:" + curr.get("accession");
			ob = findBean(synSet, id);
			// Create a new bean if null. set its name and add a synomym and add to the set
			if (ob == null){
				ob = new OntBean(id);
				ob.setName(curr.get("name").toString());
				ob.setSynonyms(new ArrayList());
				Object syn = curr.get("synname");
				if (syn != null ){
					ob.getSynonyms().add(syn.toString());
				}
				synSet.add(ob);
			}
			// Simply add a synonym to the set
			else{
				try{
					ob.getSynonyms().add(curr.get("synname").toString());
				} catch (Exception ex) {
					LOG.error("Exception finding synname for: " + id.toString() + " - " + ob.getName());
					ex.printStackTrace();
				}
			}
		}
		//LOG.debug("createSynSet: " + synSet.size());
		// Obtain a list of synonyms if needed (just an example here)
		//		getSynList(synSet);
	}

	/**
	 * For a given id, finds a OntBean in the synList with this id.
	 * Returns the bean found or null otherwise
	 * @param collection
	 * @param id
	 * @return
	 */
	private OntBean findBean(Set<OntBean> collection, String id){
		Iterator<OntBean> it = collection.iterator();
		OntBean result = null;
		while (it.hasNext()){
			OntBean ob = it.next();
			if (ob.getFbbtId().equals(id)){
				result = ob;
				break;
			}
		}
		return result;
	}

	/**
	 * Given a pattern string finds a list of matching beans.
	 * Returns the list in a format accepted by autocomplete front-end: [id, string]
	 * @param collection
	 * @param id
	 * @return
	 */
	public String getMatchingBeansByPattern(String pattern, String filter){
		List<String[]> synList = null;
		if (filter.equals("itunes")){
			synList = filterItune(pattern);
		}
		else if (filter.equals("contatins")){
			synList = filterItune(pattern);
		}
		return getSynListAsJson(synList); 
	}
	
	private List<String[]> filterItune(String pattern){
		List<String[]> synList = new ArrayList<String[]>();
		Set<String> keySet = synMap.keySet();	
	    String regex = "^[^\\*]{0,}XXX{0,1}[^\\*]{0,}$"; 
		String[] tokens = pattern.split(" ");
		Pattern[] pats = new Pattern[tokens.length];
	    for (int i = 0; i<tokens.length; i++){
		    pats[i] = Pattern.compile(regex.replace("XXX", tokens[i]), Pattern.CASE_INSENSITIVE);
		    //LOG.debug("patt["+ i+ "] " + pats[i]);
	    }
	    Matcher m;
		for (String synStr: keySet){
			boolean isMatch = true;
			for (int i = 0; i<tokens.length; i++){
				m = pats[i].matcher(synStr);
				isMatch = (isMatch && m.find());
				if (! isMatch) break;  
			}
			if (isMatch) {
				synList.add(new String[]{synMap.get(synStr), synStr});
			}
		}
		//LOG.debug(synList);
		return synList; 
	}

	/**
	 * Generates a map of value-id pairs for all known id/name(synonym pairs), eg ["Name", "FbbtId"] for all OntBeans in the synList
	 * Checks if synList exists first - if it does not that gets created
	 * returns Map of these <String, String>
	 * @param synSet
	 * @return
	 */
	public void createSynMap(){
		//only create synMap and SynSet if empty or null
		if (synMap == null || synMap.size() == 0){
			if (synSet == null || synSet.size() == 0){
				createSynSet();
			}
			synMap = new TreeMap<String, String>();
			Iterator<OntBean> it = synSet.iterator();
			int i = 0;
			while (it.hasNext()){
				OntBean ob = it.next();
				synMap.put(ob.getName(), ob.getFbbtId());
				Iterator<String> it1 = ob.getSynonyms().iterator();
				while (it1.hasNext()){
					//idValue = new String[]{ob.getFbbtId(), it1.next() + synPrefix};
					synMap.put(it1.next() + synPrefix, ob.getFbbtId());
				} 
			}
		}
	}
	
	/**
	 * Converts a list of id-value pairs into a JSON string, eg
	 * [ {"id": "00045003", "text": "accessory medulla"} ]
	 * @param synSet
	 * @return
	 */
	public String getSynListAsJson(List<String[]> synList){
		Iterator<String[]> it = synList.iterator();
		String[] curr;
		StringBuffer sb = new StringBuffer();
		sb.append("[\n");
		while (it.hasNext()){
			curr = it.next();
			sb.append("\t{\"id\": \"" + curr[0] + "\", \"text\": \"" + curr[1] + "\"}");
			if(it.hasNext()){
				sb.append(",\n");
			}
			else{
				sb.append("\n");
			}
		}
		sb.append("]");
		//System.out.println("getSynListAsString: " + synList.size());
		return sb.toString();
	}

	public void setObm(OntBeanManager obm) {
		this.obm = obm;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
