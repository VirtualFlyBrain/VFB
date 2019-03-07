package uk.ac.ed.vfb.dao.client_server.server_includes;

import java.io.File;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;
import java.util.TreeSet;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.obolibrary.macro.ManchesterSyntaxTool;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.expression.ParserException;
import org.semanticweb.owlapi.model.OWLClassExpression;
import org.semanticweb.owlapi.model.OWLEntity;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLOntologyManager;
import org.semanticweb.owlapi.reasoner.OWLReasoner;
import org.semanticweb.owlapi.util.ShortFormProvider;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.model.OntBeanIndividual;
import uk.ac.ed.vfb.model.ThirdPartyBean;
import uk.ac.ed.vfb.service.ThirdPartyBeanManager;

/**
 * An abstract class that serves as a template for QueryEngines
 * Includes short form provider and Manchester syntax parser
 */

public abstract class ADLQueryEngine {
	protected OWLReasoner reasoner;
	protected ShortFormProvider shortFormProvider;
	protected OWLOntologyManager man;
	protected ManchesterSyntaxTool parser;
	protected OWLOntology ontology;
	protected AOwlResultParser orp;
	protected static final Log LOG = LogFactory.getLog(ADLQueryEngine.class);
	/** beans cache */
	private static HashMap<String, OntBean> ontBeans = new HashMap<String, OntBean>();


	public ADLQueryEngine() {
		super();
	}

	public ADLQueryEngine(String ontologyURL) {
		//LOG.debug("Loading ontology for: " + this.getClass() + "...");
		try {
			//LOG.debug("Ontology: " + ontologyURL);
			this.man = OWLManager.createOWLOntologyManager();
			this.ontology = this.man.loadOntologyFromOntologyDocument(new File(ontologyURL));
		}
		catch (Exception ex) {
			LOG.error("Error loading ontology:" + ontologyURL);
			ex.printStackTrace();
		}
	}

	/**
	 * Queries given ontology against the specified query
	 * @param oqq
	 * @return
	 * String - "\n"-separated list of ids for found anatomy terms
	 */
	public abstract Set<OntBean> askQuery(OntQueryQueue oqq);

	protected TreeSet<OntBean> getOntBeans(Set<OWLEntity> entities){
		TreeSet<OntBean> resultSet = new TreeSet<OntBean>();
		Iterator<OWLEntity> it = entities.iterator();
		OWLEntity currId;
		OntBean currBean;
		while (it.hasNext()){
			currId = it.next();
			LOG.debug("currId : " + currId + " equals? " + currId.toString().equals("owl:Nothing"));
			// Skip if it's nothing
			if (currId.toString().equals("owl:Nothing")) {continue;}
			currBean = this.orp.getOntBeanForEntity(currId);
			if (currBean == null) continue;
			resultSet.add(currBean);
		}
		addBeansToHash(resultSet);
		//setThirdPartyBeans(resultSet);
		return resultSet;
	}

	/** Convenience method - retrieves OntBean for known id
	 *
	 * @param entityid
	 * @return
	 */
	protected OntBean getOntBeanForId(String entityid) {
		//LOG.debug("Cache " + this.ontBeans);
		OntBean result = this.ontBeans.get(OntBean.idAsOBO(entityid));
		LOG.debug("bean = " + result);
		if (result == null) {
			LOG.debug("Creating new bean");
			result = orp.getOntBeanForId(entityid);
			this.ontBeans.put(result.getFbbtId(), result);
			LOG.debug("new bean:  " + result);
		}
		return result;
	}

	/** Stores all found beans in the hash for future use */
	protected void addBeansToHash(Set<OntBean> beans){
		if (beans == null || beans.size() < 1)return;
		for (OntBean bean:beans){
			this.ontBeans.put(bean.getFbbtId(), bean);
		}
	}

	/**
	 * Convenience method: arbitrary string class expression and converts it into OWLClassExpression
	 * @param classExpressionString The string from which the class expression will be parsed.
	 * @return The OWLClassExpression
	 * @throws ParserException If there was a problem parsing the class expression.
	 */
	public OWLClassExpression getOWLClassExpression(String classExpressionString) throws ParserException {
		if(classExpressionString.trim().length() == 0) {
			return null;
		}
		OWLClassExpression classExpression = parser.parseManchesterExpression(classExpressionString);
		return classExpression;
	}

    protected void addIds(Set<? extends OWLEntity> entities, Set<OWLEntity> idSet) {
		if (!entities.isEmpty()) {
			for(OWLEntity entity : entities) {
				LOG.debug("Entity : " + entity + "\n");
				idSet.add(entity);
			}
		}
		else {
			// Add nothing
		}
	}

	public OWLOntology getOntology(){
		return this.ontology;
	}

}
