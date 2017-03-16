# VFB data pipeline specs

## Architecture

![image](https://cloud.githubusercontent.com/assets/112839/23518012/fbf38b24-ff69-11e6-945a-378b1949ab81.png)

## Components

### VFB NEO KB

A knowledgeBase of images and the anatomical entities depicted in them.  Image data could be confocal, E.M., schematic, painted domains over confocal.  

* Anatomical and image individuals are typed using FBbt and FBbi respectively.  
* The genetic features expressed by anatomical entites are expressed using FB feature IDs.  
* The relationships of anatomical entites to each are stored for imported connectomic data.  
* Images depict anatomical enties.  Images may be registered to other images.

#### Schema:

* Nodes:
   * Primary node identifier = IRI.  Node IRIs are unique. This means we commit to specifying IRIs for all nodes and edge types - not just OWL content. With this assumption, all merges can be specified using IRI.
   * Classes: corresponding to ontology class or FB features are stored with minimal information (IRI, short_form, name) and no relationships apart from to individuals in the KB.  For export purposes, only the IRI is used.
   * Individuals:
   * Relations:
      * Every IRI in a :Related edge should correspond to the IRI of an object property node.
      * This should be enforced by a check. 
      * Object Property nodes should specified in and loaded from source OWL files.
    * Neo Only:
      * Data source. IRI = Path to folder
      * License  - lots of important attributes on these nodes have to be exported.  IRI = CC IRI or some VFB IRI.
      * Pub: IRI = PMID or BioRVx
      * People (TBA) IRI - Use ORCID.
      * Channel (OWL compatible, but NEO only for now): IRI - VFB file path.
      * Site (Some external site we cross-reference e.g. FlyBase, FlyLight, FlyCircuit).
    
* Edges:
  * NEO only
    * Generic linkouts:
      * (n)-[hasDBxref { accession : '' }]->(s:site { link_base: '', URI: '', name: '', png_path: '' })
    * data_source:
       * (:Individual:anat)-[:has_data_source]-(:data_source)
       * (:Individual:anat)-[[hasDBxref { accession : '', is_source = True }]-(s:site)
       * (ds:data_source)-[:has_reference]-(p:Pub)
       * (ds)-[:has_site]-(s)
       * (ds)-[:has_license]-(:License)

  * OWL - Only edges of types Related, INSTANCEOF, SUBCLASSOF are exported to OWL.
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

### IRI SYNC OWL -> NEO

Relevant existing script: 
https://github.com/VirtualFlyBrain/VFB_owl/blob/master/src/code/owl2neo/owl_class_2_simple_node.py

TODO: rewrite using owl2pdm (removing dependence on Brain) and rolling full URIs.


### VFB Neo Prod


### KB2Prod

Exports the non-OWL components of the KB to Prod: Image individuals; data_source; pub and related links to inds.

### Generic Neo2OWL

1. Generates a standard OWL export based on generic NEO to OWL mapping (see above) and using full URIs from nodes and edges.
2. Generate SubClassOf edges based on X overlaps Y  with voxel overlap > some cutoff
2. Generates definitions for individuals (with voxel overlap numbers).  This can re-use LMB -> OWL code

Aim for now is simply to repurpose existing Brain-based Jython code, but should consider rewriting using [SCOWL](https://github.com/phenoscape/scowl/blob/master/src/main/scala/org/phenoscape/scowl/example/OWL2PrimerManchester.scala).  Declarative axiom writing should make this v.easy.

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
      - Merge pattern following schema (see below)
  * Phenotype
      - Merge create inds for anatomy X stage
      - Merge pattern following schema: ...
      - LOWER PRIORITY: Load phenotype free text.

[Expression schema](https://github.com/obophenotype/expression_patterns/blob/master/doc/expresion_pattern_schema_spec.md):


![Expression schema](https://cloud.githubusercontent.com/assets/112839/19857275/febda88a-9f74-11e6-9fa0-01b1c58b0463.png)

Modification: Make multiple anat by stage nodes - one for each stage expressed at.

### OWL2Prod side loading

Side loading to make up for deficiencies in OLS loader.  This is done.  May still need a few minor tweaks.

### Prod2Prod

Denormalization scripts:

* Generate labels from classification 
* Convert edges to use labels for relation names
This job should retain the existing metadata on edges (URI etc)

* Merge down duplicate nodes coming from multiple imports.

One way that this could work: Convert edges job works on short_forms => Edges now present on both import and original.  Now safe to delete import term.  Originals can be identified by having source ontology corresponding to namespace (assuming OBO standard).  Also what about case where there are two import terms and no original. Which one wins?  (Default to VFB?)

* Generate microrefs

* Rule-based inference of classification and partonomy on expression patterns and exp pat fragments respectively

Can do this in Cypher:

~~~~~~~~~.cql

(i:Individual)-[:expresses]-(feat:Class)
(i)-[:Intanceof]-(:Class { label : expression pattern' } )
-> (i:Individual)-[:Intanceof]-(expression pattern of X)

....
(more work needed to fully spec)
~~~~~~~~~~~~

### LMB2KB

Set of scripts to be discared once LMB retired.
All mapping/merging of nodes and edges works on URIs.

###


#### Import Clusters

One off script to load clusters.  Re-use code in fc_ind.owl

#### Import Annotations

One off script to import annotations. Re-use code in fc_ind.owl

### Import channel overlap 

One off script. Re-use code in fc_ind.owl.  See doc on numerical overlap edge above.
