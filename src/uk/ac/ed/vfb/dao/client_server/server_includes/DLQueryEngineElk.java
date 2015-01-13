package uk.ac.ed.vfb.dao.client_server.server_includes;

import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.UUID;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.obolibrary.macro.ManchesterSyntaxTool;
import org.semanticweb.elk.owlapi.ElkReasonerConfiguration;
import org.semanticweb.elk.owlapi.ElkReasonerFactory;
import org.semanticweb.elk.reasoner.config.ReasonerConfiguration;
import org.semanticweb.owlapi.apibinding.OWLManager;
import org.semanticweb.owlapi.expression.ParserException;
import org.semanticweb.owlapi.model.IRI;
import org.semanticweb.owlapi.model.OWLAxiom;
import org.semanticweb.owlapi.model.OWLClass;
import org.semanticweb.owlapi.model.OWLClassExpression;
import org.semanticweb.owlapi.model.OWLDataFactory;
import org.semanticweb.owlapi.model.OWLEntity;
import org.semanticweb.owlapi.model.OWLNamedIndividual;
import org.semanticweb.owlapi.model.OWLOntologyManager;
import org.semanticweb.owlapi.reasoner.OWLReasoner;
import org.semanticweb.owlapi.reasoner.OWLReasonerFactory;
import org.semanticweb.owlapi.util.SimpleShortFormProvider;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.model.OntBeanIndividual;
import uk.ac.ed.vfb.service.ThirdPartyBeanManager;

/**
 * Author: Matthew Horridge<br>
 * The University of Manchester<br>
 * Bio-Health Informatics Group<br>
 * Date: 13-May-2010
 */
public class DLQueryEngineElk extends ADLQueryEngine {

	//	private OWLReasonerFactory reasonerFactory = new ElkReasonerFactory();
	private static final Log LOG = LogFactory.getLog(DLQueryEngineElk.class); 

	public DLQueryEngineElk(String ontologyURL) {
		super(ontologyURL);
		shortFormProvider = new SimpleShortFormProvider();
		parser = new ManchesterSyntaxTool(this.ontology);
		LOG.debug("QueryEngine: " + this + " parser: " + parser);
		this.orp = new OwlResultParserIndividual(this.ontology);
	}

	public Set<OntBean> askQuery(OntQueryQueue oqq) {
		StringBuffer sb = new StringBuffer();
		Set<OntBean> results = new TreeSet<OntBean>();
		String queryType = oqq.getQueryType();
		List<String> queries = oqq.getQueries();
		//individuals
		for (String currExpr: queries){
			LOG.debug("currExpr: " + currExpr);
			OWLReasoner reasoner = null;
			reasoner = createReasoner();
			OWLClassExpression classExpression = null;
			OWLClass query = null;
			Set<OWLNamedIndividual> individuals = null;
			try {
				classExpression = getOWLClassExpression(currExpr.trim());
                LOG.debug("OWL Class Exp: " + classExpression.toString() + "\n");
			} catch (Exception e) {
				LOG.debug("DLQueryEngineElk Exception: " + e.toString() + "\n");
			}
			// NodeSet<OWLClass> subClasses = reasoner.getSubClasses(classExpression, true);
			OWLDataFactory dataFactory = this.man.getOWLDataFactory();
			// Create a fresh name for the query.
			String id = "http://www.virtualflybrain.org/scratch/" + UUID.randomUUID().toString();
			query = dataFactory.getOWLClass(IRI.create(id));
			// Make the query equivalent to the fresh class
			OWLAxiom definition = dataFactory.getOWLEquivalentClassesAxiom(query, classExpression);
            LOG.debug("OWL Axiom Def: " + definition.toString() + "\n");
			man.addAxiom(reasoner.getRootOntology(), definition);
			// the query class by using its new name instead.
			individuals = reasoner.getInstances(query, false).getFlattened();
			LOG.debug("Query: " + query.toString() + " Found: " + individuals.size());
			//addIds(individuals.getFlattened(), results);
			if (!individuals.isEmpty()) {
				for(OWLEntity entity : individuals) {
					LOG.debug("Entity : " + entity + "\n");
					results.add(this.orp.getOntBeanForEntity(entity));
				}
			}			
			reasoner.interrupt();
			reasoner.dispose();
			reasoner = null;
		}
		addBeansToHash(results);
		//setThirdPartyBeans(results);
		return results;
	}

	private OWLReasoner createReasoner(){ 
		// Create an ELK reasoner.
		OWLOntologyManager man = OWLManager.createOWLOntologyManager();
		// Create an ELK reasoner configuration
		final ElkReasonerConfiguration elkConfig = new ElkReasonerConfiguration();
		// Set the number of workers to 8 or any other number
		elkConfig.getElkConfiguration().setParameter(ReasonerConfiguration.NUM_OF_WORKING_THREADS, "8");
		// Create an ELK reasoner using the configuration
		OWLReasonerFactory reasonerFactory = new ElkReasonerFactory();
		OWLReasoner reasoner = reasonerFactory.createReasoner(ontology, elkConfig); 		
		//		OWLReasonerFactory reasonerFactory = new ElkReasonerFactory();
		//		OWLReasoner reasoner = reasonerFactory.createReasoner(ontology);
		LOG.debug(" Create ELK Reasoner: " + reasoner);
		return reasoner;
	}
	
}
