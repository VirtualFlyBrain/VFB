package uk.ac.ed.vfb.dao.client_server.server_includes;

import java.util.*;

import org.semanticweb.owlapi.model.OWLAnnotationProperty;
import org.semanticweb.owlapi.model.OWLClass;
import org.semanticweb.owlapi.model.OWLEntity;
import org.semanticweb.owlapi.model.OWLObject;
import org.semanticweb.owlapi.model.OWLObjectProperty;
import org.semanticweb.owlapi.model.OWLOntology;
import org.semanticweb.owlapi.model.OWLSubClassOfAxiom;

import owltools.graph.OWLGraphWrapper.ISynonym;
import uk.ac.ed.vfb.model.OntBean;

/**
 * Author: NM
 * For the anatomy file in memory, and given a term id it parses the term info to extract core properties
 * Works for classes
 * such as name, synonyms, etc.
 * Uses OWLTools
 */
public class OwlResultParserClass extends AOwlResultParser {

	public OwlResultParserClass(OWLOntology ontology) {
		super(ontology);
	}

	/**
	 * Convenience wrapper method to retrieve OntBean by OWLEntity
	 * @param id
	 * @return
	 */
	public OntBean getOntBeanForEntity(OWLEntity entity){
		//LOG.debug("Entity: " + entity);
		OWLObject oo = (OWLObject)entity;
		OntBean result = getOntBeanForClass(oo);
		//LOG.debug("ID: " + entity + " OO " + oo);
		return result;
	}

	/**
	 * The main parsing method.
	 * Invoke:   OntBean ontBean = getOntBeanForClass(result);
	 * @param result
	 * @return
	 */
	private OntBean getOntBeanForClass(OWLObject oo) {
		OWLClass result = (OWLClass) oo;
		String fbbtId =  ogw.getIdentifier(result);
		OntBean ob = null;
		try {
			ob = new OntBean(fbbtId);
			ob.setName(ogw.getLabelOrDisplayId(result));
			OWLAnnotationProperty defPropery = ogw.getAnnotationProperty("def");
			ob.setDef(ogw.getAnnotationValue(result, defPropery));
			OWLAnnotationProperty commentPropery = ogw.getAnnotationProperty("comment");
			ob.setComment(ogw.getAnnotationValue(result, commentPropery));
			//LOG.debug("NAME: " + ogw.getLabelOrDisplayId(result) + " ; " + ogw.getAnnotationValue(result, defPropery) + " :  "  + ogw.getAnnotationValue(result, commentPropery));
			//xrefs
			List<String> axioms = ogw.getDefXref(result);
			//LOG.debug("=========== xrefs ==============" + axioms.size());
			//for (String axiom:axioms){
				//LOG.debug(axiom.toString() + "\n");
			//}

			//synonyms
			//ogw.getAnnotationValues(arg0, arg1)
			List<ISynonym> synonyms = ogw.getOBOSynonyms(result);
			//LOG.debug("=========== synonyms ==============" + synonyms.size());
			List<String> syns = new ArrayList<String>();
			List<String> synXrefs = new ArrayList<String>();
			Boolean refExists = false;
			Integer refI = 1;
			String refIs = "";
			if (synonyms != null && !synonyms.isEmpty()) {
				for (ISynonym syn:synonyms){
					//LOG.debug(syn.getLabel() + "\nxrefs: " + (syn.getXrefs()!=null?Arrays.toString(syn.getXrefs().toArray()):""));
					refIs = "";
					refExists = false;
					// adding synonyn xrefs to references list
					if (syn.getXrefs()!=null) {
						synXrefs = new ArrayList<String>(new HashSet<String>(syn.getXrefs()));
						for (String synXref:synXrefs){
							refExists = true;
							if (synXref != ""){
								if (refIs != ""){
									refIs = refIs + "," + synXref;
								}else{
									refIs = synXref;
								}
								axioms.add(synXref);
								refI = refI +1;
							}
						}
					}
					if (refExists){
						syns.add(syn.getLabel() + " (" + refIs + ")");	
					}else{
						syns.add(syn.getLabel());
					}
					
				}
				ob.setSynonyms(syns);
			}
			// removing duplicates and adding full ref list
			axioms = new ArrayList<String>(new HashSet<String>(axioms));
			//LOG.debug("======== extended xrefs =========" + axioms.size());
			//for (String axiom:axioms){
			//	//LOG.debug(axiom.toString() + "\n");
			//}
			ob.setRefs(axioms);
			//relationships
			Set<OWLSubClassOfAxiom> rels = this.ontology.getSubClassAxiomsForSubClass(result);
			//LOG.debug("=========== rels ==============" + rels.size());
			int relI = 0;
			String currRel = "";
			String relName = "";
			OWLAnnotationProperty namePropery = ogw.getAnnotationProperty("name");
			for (OWLSubClassOfAxiom rel:rels){
				//LOG.debug("rel" + relI++ + " : " + rel.toString() + " > " + "\n");
				//LOG.debug("=========== rel props ==============");
				Set<OWLObjectProperty> props = rel.getObjectPropertiesInSignature();
				int propI = 0;
				for (OWLObjectProperty prop:props){
					//LOG.debug("prop"+ propI++ + " : " + prop.toString() + " > " + ogw.getAnnotationValue(prop, namePropery) + " / " + ogw.getIdentifier(prop) + "\n ");
					currRel = ogw.getAnnotationValue(prop, namePropery);
					//LOG.debug("Relationship property: " + currRel);
					//OWLObject result1 = this.ogw.getOWLObjectByIdentifier(prop.getNamedProperty());
				}
				Set<OWLClass> clas = rel.getClassesInSignature();
				//LOG.debug("=========== rel classes ==============" + clas.size());
				// We assume the class that is not equal to result(current OWL object) is the relation's target class
				OWLClass targetClass= null;
				for (OWLClass currClass:clas){
					if (!currClass.getIRI().equals(result.getIRI())) {
						targetClass = currClass;
					}
				}
				//String currRel1 = currRel + " @ " + ogw.getIdentifier(targetClass) + " ! " + ogw.getAnnotationValue(targetClass, namePropery);
				//if props is empty that's a plain SubclassOf relation!!! "Parent classes"
				if (props == null || props.size() == 0){
					Iterator<OWLClass> clasI = clas.iterator();
					OWLClass oc = clasI.next();
					currRel = ogw.getIdentifier(targetClass) + " ! " + ogw.getAnnotationValue(targetClass, namePropery);
					//LOG.debug("CurrRel: " + currRel);
					ob.getIsa().put(ogw.getIdentifier(targetClass), ogw.getAnnotationValue(targetClass, namePropery));
				}
				else {
					//LOG.debug("CurrRel: " + currRel);
					String[] vals = {currRel, ogw.getAnnotationValue(targetClass, namePropery)};
					//LOG.debug("vals: " + Arrays.toString(vals));
					ob.getRelationships().put(ogw.getIdentifier(targetClass), vals);
				}
			}
		}
		catch (Exception e) {
			// TODO: handle exception
			//Return whatever OntBean is created so far
			LOG.error("Exception in getOntBeanForClass for OWLObject: " + oo.toString());
			LOG.error(e.getMessage());
			e.printStackTrace();
		}
		//Set<OWLSubClassOfAxiom> axioms1 = this.ontology.getSubClassAxiomsForSuperClass((OWLClass)result);
		//LOG.debug(axioms);
		return ob;
	}

	/**
	 * Convenience wrapper method to retrieve OntBean by id
	 * @param id
	 * @return
	 */
	//public OntBean getOntBeanForId(String id) {
		//LOG.debug("OwlResultParserClass OGW: " + this.ogw + " ID: " + id);
	//	OWLEntity oo = (OWLEntity)this.ogw.getOWLObjectByIdentifier(OntBean.idAsOBO(id));
		//LOG.debug("OWLEntity: " + oo);
	//	return this.getOntBeanForEntity(oo);
	//}

}
