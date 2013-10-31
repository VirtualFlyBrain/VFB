package uk.ac.ed.vfb.dao.client_server.server_includes;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.semanticweb.owlapi.model.OWLEntity;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLOntologyCreationException;

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
		catch (OWLOntologyCreationException ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * Convenience wrapper method to retrieve OntBean by id 
	 * @param id
	 * @return
	 */
	public OntBean getOntBeanForId(String id) {
		//LOG.debug("OGW: " + this.ogw + " ID: " + id);
		OWLEntity oo = (OWLEntity)this.ogw.getOWLObjectByIdentifier(OntBean.idAsOBO(id));
		return this.getOntBeanForEntity(oo);
	}
	
	public abstract OntBean getOntBeanForEntity(OWLEntity entity);

	public OWLGraphWrapper getOGW() {
		return this.ogw;
	}

}
