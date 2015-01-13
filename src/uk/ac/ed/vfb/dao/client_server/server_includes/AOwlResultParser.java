package uk.ac.ed.vfb.dao.client_server.server_includes;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.semanticweb.owlapi.model.OWLEntity;
import org.semanticweb.owlapi.model.OWLObject;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.IRI;

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
	protected static final Log LOG = LogFactory.getLog(AOwlResultParser.class); 

	public AOwlResultParser(OWLOntology ontology) {
		try {
			this.ontology = ontology;
			this.ogw = new OWLGraphWrapper(ontology);
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
			LOG.debug("OGW: " + this.ogw + " ID: " + OntBean.idAsOWL(id));
			String iri = "http://vfbsandbox.inf.ed.ac.uk/owl/" + OntBean.idAsOWL(id);
			LOG.debug("IRI: " + iri );
			OWLObject oo = this.ogw.getOWLIndividualByIdentifier(iri);
			LOG.debug("OO: " + oo);
			OWLEntity oe = (OWLEntity)oo;
			LOG.debug("OE: " + oe);
			LOG.debug("from ontology: " + this.ontology.toString());
			return this.getOntBeanForEntity(oe);
		}
		catch (Exception ex) {
			ex.printStackTrace();
			LOG.debug("Failed to get entity for" + id + "from ontology" + this.ontology.toString());
			return null;
		}
 	}
	
	public abstract OntBean getOntBeanForEntity(OWLEntity entity);

	public OWLGraphWrapper getOGW() {
		return this.ogw;
	}

}
