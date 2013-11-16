#!/usr/bin/env jython
    
def addOboAnnotationProperties(brain):
	brain.addAnnotationProperty("http://purl.obolibrary.org/obo/IAO_0000115") # definition
	brain.addAnnotationProperty("http://purl.obolibrary.org/obo/IAO_xref") # ??
	brain.addAnnotationProperty("http://www.geneontology.org/formats/oboInOwl#hasExactSynonym")
	brain.addAnnotationProperty("http://www.geneontology.org/formats/oboInOwl#hasBroadSynonym")
	brain.addAnnotationProperty("http://www.geneontology.org/formats/oboInOwl#hasNarrowSynonym")
	brain.addAnnotationProperty("http://www.geneontology.org/formats/oboInOwl#hasRelatedSynonym")
	brain.addAnnotationProperty("http://www.geneontology.org/formats/oboInOwl#hasDbXref")
	return brain
