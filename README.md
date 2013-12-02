# Virtual Fly Brain web application

[Virtual Fly Brain](http://www.virtualflybrain.org) (VFB) is a data integration hub for Drosophila neurobiology.  It allows users to search, browse and query information about Drosophila neuroanatomy.  

Auto-complete driven searches across an extensive dictionary of structure names and synonyms allow users to find anatomical structures and cell types using almost any term they find in the Drosophila neurobiology literature.  Each term found includes a textual description with references, a list of synonyms, images (if available) and a set of relationships to other terms via which users can browse to find details of related anatomical structures.  A range of queries are available from each term including anatomical queries, queries for images, queries for expression of genes or transgenes and queries for phenotypes.  

Users can also browse a painted 3D stack of a Drosophila brain using a system which allows viewing of virtual sections through the stack in any arbitrary plane. Structures can be identified via tool-tips, prompted by floating the cursor over a region and selected. by clicking on the stack or on a part-tree of painted structures.  We have a large library of annotated 3D images that are registered to the standard brain used in our stack browser.  This includes > 16000 single neuron images from [FlyCircuit](http://www.flycircuit.tw), several thousand GAL4 line images from the [Rubin lab](http://www.janelia.org/lab/rubin-lab) and > 200 images of lineage clones from the labs of [Tzumin Lee](http://www.janelia.org/lab/lee-tzumin-lab) and [Kei Ito](http://www.k.u-tokyo.ac.jp/pros-e/person/kei_ito/kei_ito.htm) (to be released in July 2013).  Users can add 3D images to the stack and view serial sections of them.  A system allowing multiple overlaid to be displayed is under development and will be release shortly.

The central component that binds VFB into a queryable whole is an [ontology of Drosophila anatomy](https://sourceforge.net/p/fbbtdv/) in [OWL2](http://www.w3.org/TR/owl2-primer/). The logical component of this ontology includes axioms about the properties of neurons including synaptic partners and the locations of synaptic terminals \[1\]. All VFB queries use OWL reasoning software to query the ontology, returning inferences about neuroanatomy. For anatomy queries, these are used directly to generate query results pages. For queries of expression and phenotype the resulting lists of anatomy terms are used to query across 10s of thousands of annotations in a local instance of the [FlyBase CHADO database](http://gmod.org/wiki/Public_Chado_Databases).  Queries of images use OWL queries over the ontology combined with a formal representation of what the images depict as OWL individuals.


### Publications

 1. _Osumi-Sutherland D., Reeve S., Mungall C., Ruttenberg A. Neuhaus F, Jefferis G.S.X.E, Armstrong J.D._ (2012) A strategy for building neuro-anatomy ontologies. [Bioinformatics __28__(9): 1262-1269.](http://bioinformatics.oxfordjournals.org/content/28/9/1262.full)
 1. _Milyaev N., Osumi-Sutherland D., Reeve S., Burton N., Baldock R.A., Armstrong J.D._ (2012) The Virtual Fly Brain Browser and Query Interface. [Bioinformatics __28__(3): 411-415](http://bioinformatics.oxfordjournals.org/content/28/3/411.full)

### Annotating your own data using our system

We maintain a page on [the Drosophila anatomy ontology wiki](https://sourceforge.net/p/fbbtdv/wiki/Annotate_your_data/) outlining the advantages of annotating your own data using our system and providing links to resources for doing so.

#### Documentation
Please note.  This is a work in progress. Most documentation currently lives in a google doc. We are in the process of transferring it to this wiki.

 * __Functional Description__
     * [User scenarios](wiki/user_scenarios)
     * [Description and functions of pages](wiki/page_descriptions)
 * __Technical Description__
     * [Static content](wiki/static_content)
     * [Dynamic content](wiki/dynamic_content)
     * [Java](wiki/java)
 * __Data structures__
     * [FlyBase CHADO](wiki/FBChado)
     * [VFB link path DB](wiki/VFB_DB)
     * [Ontologies](wiki/ont)
     * [OWL individuals](wiki/owl_ind)
 * [__Stack Browser__](wiki/stack_browser)
