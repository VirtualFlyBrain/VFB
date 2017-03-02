# VFB data pipeline specs

## Architecture

![image](https://cloud.githubusercontent.com/assets/112839/23512676/575f6d54-ff59-11e6-9dfe-191c18aff373.png)

## Components

### VFB NEO KB

A knowledgeBase of images and the anatomical entities depicted in them.  Image data could be confocal, E.M., schematic, painted domains over confocal.  

* Anatomical and image individuals are typed using FBbt and FBbi respectively.  
* The genetic features expressed by anatomical entites are expressed using FB feature IDs.  
* The relationships of anatomical entites to each are stored for imported connectomic data.  
* Images depict anatomical enties.  Images may be registered to other images.

Schema:

Constraints: URIs are unique

* Nodes:
   * Classes: corresponding to ontology class or FB features are stored with minimal information (URI, short_form, name) and no relationships apart from to individuals in the KB.  For export purposes, only the URI is used.
   * Individuals:
   * Relations:
      * Every URI in a :Related edge should correspond to the URI of an object property node.
      * This should be enforced by a check. 
      * Object Property nodes should specified in an loaded from source OWL files.
    * Neo Only:
      * Node id (PMID?) for export purposes + miniref for reference only. 
      * Data source, License  - lots of important attributes on these nodes have to be exported.
    

* Edges:
  * NEO only
    * (:Individual)-[:has_data_source { id_in_data_source: ' } ]-(:data_source)
    * (:data_source)-[:has_reference]-(:Pub)
    * (:data_source)-[:has_license]-(:License)

  * OWL
    * (:Individual)-[:Related { URI: '', name: ''}]-(:Individual)  -> OWL FACT (OPA)
    * (:Individual)-[:Related { URI: '', name: ''}]-(:Class) -> OWL Type: R some C
    * (:Class)-[:Related { URI: '', name: ''}]-(:Individual) -> OWL SubClassOf: R value I
    * (:Individual)-[:INSTANCEOF]-(:Class) -> I OWLType C
    * (:Class)-[:SUBCLASSOF]-(:Class) -> OWL SubClassOf
  
  * Numerical overlap in OWL
    * (:Individual:Channel)-[:Related { URI: '', name: 'overlaps', voxel_overlap : n }]-(:Individual:Channel)

Script KB2Prod generates a standard OWL export based on this mapping pattern and using URIs from nodes and edges.

* Image data schema:

~~~~~~~~~.cql
    (a:Individual:Anatomy)<-[:depicts]-(c:Individual:channel)
    -[:is_in_register_with { domain_id = n }]->(c2:Individualchannel)
    -[:depicts]->(a:Individual:Anatomy:Template)
     
    (c)-[:SUBCLASSOF]-(image)
    (c)-[:output_of]->(confocal microscopy)
    (c)-[:has_data_source]->()
~~~~~~~~~~


## Description of scripts

### KB2Prod

Exports the non-OWL components of the KB to Prod: Image individuals; data_source; pub and related links to inds.

### Generic Neo2OWL

1. Generates a standard OWL export based on generic NEO to OWL mapping (see above) and using full URIs from nodes and edges.
2. Generate SubClassOf edges based on X overlaps Y  with voxel overlap > some cutoff
2. Generates definitions for individuals (with voxel overlap numbers).  This can re-use LMB -> OWL code

### FB2Prod

* Step 1: Load all of the following using two step load:  Node with ID ->  Populate node
  - pubs
  - genotypes
  - features: alleles, genes, constructs, insertions
* Step 2:
  - Load: triples relating features to each other and to genotypes
* Step3:
  * Expression
      - Merge create inds for anatomy X stage
      - Merge pattern following schema: 
  * Phenotype
      - Merge create inds for anatomy X stage
      - Merge pattern following schema: 
      - LOWER PRIORITY: Load phenotype free text.

[Expression schema](https://github.com/obophenotype/expression_patterns/blob/master/doc/expresion_pattern_schema_spec.md):


![Expression schema](https://cloud.githubusercontent.com/assets/112839/19857275/febda88a-9f74-11e6-9fa0-01b1c58b0463.png)

Modified: Make multiple anat by atage nodes - one for each stage expressed at.

### OWL2Prod side loading

Side loading to make up for deficiencies in OLS loader.  This is pretty much done

### Import Clusters

One off script to load clusters.

### Import Annotations

One off script to import annotations

### Import channel overlap 

One off script
