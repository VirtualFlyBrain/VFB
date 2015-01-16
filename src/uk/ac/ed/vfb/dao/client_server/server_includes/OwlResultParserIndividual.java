package uk.ac.ed.vfb.dao.client_server.server_includes;

import java.util.*;

import org.semanticweb.owlapi.model.OWLAnnotationProperty;
import org.semanticweb.owlapi.model.OWLClass;
import org.semanticweb.owlapi.model.OWLClassExpression;
import org.semanticweb.owlapi.model.OWLEntity;
import org.semanticweb.owlapi.model.OWLIndividual;
import org.semanticweb.owlapi.model.OWLObject;
import org.semanticweb.owlapi.model.OWLObjectProperty;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLSubClassOfAxiom;

import owltools.graph.OWLGraphWrapper.ISynonym;
import uk.ac.ed.vfb.model.*;

/**
 * Author: NM
 * For the anatomy file in memory, and given a term id it parses the term info to extract core properties 
 * such as name, synonyms, etc. 
 * Works for individuals
 * Uses OWLTools  
 */
public class OwlResultParserIndividual extends AOwlResultParser {

	public OwlResultParserIndividual(OWLOntology ontology) {
		super(ontology);
	}

	/**
	 * Convenience wrapper method to retrieve OntBean by id 
	 * @param id
	 * @return
	 */
	public OntBean getOntBeanForEntity(OWLEntity entity){
		OWLObject oo = (OWLObject)entity; //ogw.getOWLIndividualByIdentifier(id);
		OntBean result = getOntBeanForClass(oo);
		//LOG.debug("ID: " + result.getId() + " OO " + oo);
		return result;
	}

	/**
	 * The main parsing method. 
	 * Invoke:   OntBean ontBean = getOntBeanForClass(result);
	 * @param result
	 * @return
	 */
	private OntBean getOntBeanForClass(OWLObject result) {
		String fbbtId =  ogw.getIdentifier(result);
		OntBeanIndividual ob = null;
		try {
			ob = new OntBeanIndividual(fbbtId);
			ob.setName(ogw.getLabelOrDisplayId(result));
			OWLAnnotationProperty defPropery = ogw.getAnnotationProperty("def");
			ob.setDef(ogw.getAnnotationValue(result, defPropery));
			OWLAnnotationProperty commentPropery = ogw.getAnnotationProperty("comment");
			ob.setComment(ogw.getAnnotationValue(result, commentPropery));
			//LOG.debug(result + " : " + "\n" + fbbtId + " > " + ogw.getLabel(result) + "\ndef: " + ogw.getAnnotationValue(result, defPropery) + "\ncomment: " + ogw.getAnnotationValue(result, commentPropery));
			//xrefs
			List<String> xrefs = ogw.getXref(result);  
			//LOG.debug("=========== xrefs ==============");
			for (String xref:xrefs){
				//LOG.debug("Xref: " + xref + "\n");
			}
			List<String> axioms = ogw.getDefXref(result);
			//LOG.debug("=========== xrefs ==============");
			for (String axiom:axioms){
				//LOG.debug(axiom.toString() + "\n");
			}
			ob.setRefs(axioms);
			//synonyms
			List<ISynonym> synonyms = ogw.getOBOSynonyms(result);
			List<String> syns = new ArrayList<String>();
			ob.setSynonyms(syns);
			//classification
			OWLIndividual indiv = (OWLIndividual)result;
			Set<OWLClassExpression> types = indiv.getTypes(this.ontology);
			String currRel = "";
			String relName = "";
			OWLAnnotationProperty nameProperty = ogw.getAnnotationProperty("name");
			for (OWLClassExpression classExp: types){
				if (classExp.isAnonymous()) {
					//Anonymous class = relationship on individual
					//LOG.debug("=========== rel props ==============" + ob.getRelationships());
					Set<OWLObjectProperty> props = classExp.getObjectPropertiesInSignature();
					int propI = 0;
					for (OWLObjectProperty prop:props){
						currRel = ogw.getAnnotationValue(prop, nameProperty);
					}
					Set<OWLClass> clas = classExp.getClassesInSignature();
					OWLClass targetClass= null;
					for (OWLClass currClass:clas){
						//We assume there will only ever be 1(one) class in signature. 
						//This complies with VFB convention, not with OWL  
						targetClass = currClass;
					}		
					//currRel = currRel + " " + ogw.getIdentifier(targetClass) + " ! " + ogw.getAnnotationValue(targetClass, nameProperty);
					//if props is empty that's a plain SubclassOf relation!!! "Parent classes"
					String[] vals = {currRel, ogw.getAnnotationValue(targetClass, nameProperty)};
					ob.getRelationships().put(ogw.getIdentifier(targetClass), vals);
					//LOG.debug("=========== rel prop" + ogw.getIdentifier(targetClass) +  vals);
				}
				else {
					// Type = is_a for individuals
					//LOG.debug("=========== types ==============" + ob.getTypes());
					OWLClass clas = classExp.asOWLClass();
					//LOG.debug("=========== type : "+ clas + ogw.getLabelOrDisplayId(clas));
					ob.getTypes().put(ogw.getIdentifier(clas),ogw.getLabelOrDisplayId(clas));
				}
			}
		}
		catch(NullPointerException ex) { 
			//shit happened, keep goin' 
			//ex.printStackTrace();
		}
		//LOG.debug("OB: " + ob + " types: " + ob.getTypes()) ;
		return ob;
	}

	/**
	 * Convenience wrapper method to retrieve OntBean by id 
	 * @param id
	 * @return
	 */
	// public OntBean getOntBeanForId(String id) {
	// 	//LOG.debug("OwlResultParserIndividual OGW: " + this.ogw + " ID: " + OntBean.idAsOBO(id));
	// 	OWLEntity oo = (OWLEntity)this.ogw.getOWLObjectByIdentifier(OntBean.idAsOBO(id));
	// 	//LOG.debug("OWLEntity: " + oo);
	// 	return this.getOntBeanForEntity(oo);
	// }
	
}
