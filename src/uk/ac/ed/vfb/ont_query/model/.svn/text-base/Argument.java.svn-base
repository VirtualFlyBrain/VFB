package uk.ac.ed.vfb.ont_query.model;

import uk.ac.ed.vfb.model.OntBean;

/**
 * Represents a query leg
 */

public class Argument{
	private OntBean ontBean;
	/** Relation on each argument, ie "include" or "exclude"*/
	private String relation;
	/** Query type on the given leg, eg "innervates" */
	private String type;

	public Argument(OntBean ontBean, String relation) {
		super();
		this.ontBean = ontBean;
		this.relation = relation;
		this.type = "synaptic";
	}

	public Argument(OntBean ontBean, String relation, String type) {
		this(ontBean, relation);
		this.type = type;
	}
	
	public OntBean getOntBean() {
		return ontBean;
	}

	public void setOntBean(OntBean ontBean) {
		this.ontBean = ontBean;
	}

	public String getRelation() {
		return relation;
	}

	public void setRelation(String relation) {
		this.relation = relation;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	public String toString(){
		return "Argument: " + ontBean + " type: " + type + " rel: " + relation; 
	}
}
