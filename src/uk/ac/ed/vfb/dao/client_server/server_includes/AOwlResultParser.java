package uk.ac.ed.vfb.dao.client_server.server_includes;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.semanticweb.owlapi.model.OWLEntity;
// import org.semanticweb.owlapi.model.OWLObject;
import org.semanticweb.owlapi.model.OWLOntology;
// import org.semanticweb.owlapi.model.IRI;
import org.semanticweb.owlapi.util.BidirectionalShortFormProvider;
import org.semanticweb.owlapi.util.BidirectionalShortFormProviderAdapter;
import org.semanticweb.owlapi.util.SimpleShortFormProvider;

import java.util.Set;
import java.util.TreeSet;

import owltools.graph.OWLGraphWrapper;
import uk.ac.ed.vfb.model.OntBean;

/**
 * Author: NM
 * For the anatomy file in memory, and given a term id it parses the term info to extract core properties 
 * such as name, synonyms, etc. 
 * Uses OWLTools  
 */
public abstract class AOwlResultParser {

	protected OWLGraphWrapper ogw;
	protected OWLOntology ontology;
	protected BidirectionalShortFormProvider bsfp;
	protected static final Log LOG = LogFactory.getLog(AOwlResultParser.class); 

	public AOwlResultParser(OWLOntology ontology) {
		try {
			this.ontology = ontology;
			this.ogw = new OWLGraphWrapper(ontology);
			Set<OWLOntology> ontset = new TreeSet<OWLOntology>();
	        ontset.add(this.ontology);
	        SimpleShortFormProvider ssfp = new SimpleShortFormProvider();
	        this.bsfp = new BidirectionalShortFormProviderAdapter(ontset, ssfp);	
		}
		catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * Convenience wrapper method to retrieve OntBean by id 
	 * @param id
	 * @return
	 */
	
	public OntBean getOntBeanForId(String id) {
		try {
			OWLEntity oe =  this.bsfp.getEntity(OntBean.idAsOWL(id));
			if (oe == null) {
				LOG.error("Failed to get entity for " + OntBean.idAsOWL(id) + " from ontology " + this.ontology.toString());
			}
			return this.getOntBeanForEntity(oe);
		}
		catch (Exception ex) {
			ex.printStackTrace();
			LOG.error("Failed to get entity for " + OntBean.idAsOWL(id) + " (requested as " + id + ") from ontology " + this.ontology.toString());
			return null;
		}
 	}
	
	public abstract OntBean getOntBeanForEntity(OWLEntity entity);

	public OWLGraphWrapper getOGW() {
		return this.ogw;
	}

}
