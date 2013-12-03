#!/usr/bin/env jython

import sys
from com.ziclix.python.sql import zxJDBC # DB connection
from dict_cursor import dict_cursor  # Handy local module for turning JBDC cursor output into dicts
from uk.ac.ebi.brain.error import BrainException
from uk.ac.ebi.brain.core import Brain
import obo_tools


# Notes
## This script is written in almost completely independent chunks. The few globar

# Gobals - limited to brain objects, prefixes and DB handle(s)/cursors

# Get DB connection & cursor: global
conn = zxJDBC.connect("jdbc:mysql://localhost/flycircuit", sys.argv[1], sys.argv[2], "org.gjt.mm.mysql.Driver") 
# For production use, this needs to be changed to use a path and port spec that works in conjunction with an ssh tunnel to master. 

cursor = conn.cursor()

# Code to build a generic lookup for external objects.  Commenting for for offline testing as requires web access to pull ontologies for URIs
#cursor.execute("SELECT DISTINCT ontology_URI from owl_entity")
#dc = dict_cursor(cursor)

#ext_ont = Brain()
#for d in dc:
#	ext_ont.learn(d)	# Can one Brain learn from multiple ontologies?

# Brain objects - global
fbbt = Brain()
#fbbt.learn("http://purl.obolibrary.org/fbbt/fbbt-simple.owl")
fbbt.learn("file:///repos/fbbtdv/fbbt/releases/fbbt-simple.owl") # local path for debugging.  Replace by URL above to make generic
vfb_ind = Brain("http://www.virtualflybrain.org/owl/", "http://www.virtualflybrain.org/owl/vfb_ind.owl")

# base URIs - global
obo = "http://purl.obolibrary.org/obo/"
vfb = "http://www.virtualflybrain.org/owl/"
fb = "http://flybase.org/reports/"


# Add predeclared OWL entities

### Get OBO annotation properties
obo_tools.addOboAnnotationProperties(vfb_ind)

### Predeclare foriegn OWL entities used in axioms (these live in the owl_entity table)

cursor.execute("SELECT baseURI, shortFormID, owl_type FROM owl_entity")

dc = dict_cursor(cursor)
for d in dc:
	if d['owl_type'] == "class":
		vfb_ind.addClass(d['baseURI']+ d['shortFormID'])
		if not fbbt.knowsClass(d['shortFormID']):
			sys.stderr.write("Unknown class d['shortFormID'].")
			continue
		# Also need a check for obsoletions status. But how to do this without triggering non-existent AP axiom error?
	if d['owl_type'] == "objectProperty":
		vfb_ind.addObjectProperty(d['baseURI']+ d['shortFormID'])

# Add individual flycircuit neurons and basic typing - default and from neuron table.

cursor.execute("SELECT vut.vfbid as vid, n.name, n.Gender, n.gene_name, Driver FROM neuron n JOIN vfbid_uuid_type vut ON (n.uuid=vut.uuid)")
dc = dict_cursor(cursor)
for d in dc:
	vfb_ind.addNamedIndividual(d['vid'])
	vfb_ind.label(d['vid'], d['name'])
	vfb_ind.type('FBbt_00005106', d['vid'])  #  default typing as neuron
	vfb_ind.type("BFO_0000050 some FBbt_00003624", d['vid'])  # default typing as part of some 'adult brain'
	defn = "A neuron of an " # Begin rolling def.
	if d['Gender'] == 'M':
		vfb_ind.type("BFO_0000050 some FBbt_00007004", d['vid'])  # Part of some male organism
		defn += "adult male brain "
	if d['Gender'] == 'F':
		vfb_ind.type("BFO_0000050 some FBbt_00007011", d['vid'])  # Part of some female organism
		defn += "adult female brain "
	vfb_ind.annotation(d['vid'], "hasExactSynonym", d['gene_name']) 	#  Add gene_name as exact synonym.  Note shortFormID on splits on '#'
	defn += " expressing " + d['Driver'] + "." # Need a lookup for Driver name to FB.
	vfb_ind.annotation(d['vid'], "IAO_0000115", defn) # Start rolling def 	
	# Add expresssion assertion

cursor.execute("SELECT e.vfbid, e.expresses FROM expression e JOIN vfbid_uuid_type vut ON (vut.vfbid=e.vfbid) JOIN neuron n ON (vut.uuid=n.uuid)")
dc = dict_cursor(cursor)
for d in dc:
	if not vfb_ind.knowsClass(d['expresses']):
		vfb_ind.addClass(fb + d['expresses'])
	vfb_ind.type("RO_0002292 some "+ d['expresses'], d['vfbid'])  # RO_0002292 = expresses


# Roll lookup for BrainName shorthand

cursor.execute("SELECT * FROM BrainName_to_OWL")

BN_dict = {}  # Guess there's no harm in this being global, but could limit scope
dc = dict_cursor(cursor)

for d in dc:
	BN = d["BrainName_abbv"]
	owl_class = d["owl_class_id"]
	BN_dict[BN] = owl_class
	#	if not vfb_ind.knowsClass(owl_class): 
	#	vfb_ind.addClass(obo+owl_class)    
    
BN_abbv_list = BN_dict.keys()


# Adding typing based on domain overlap

cursor.execute("SELECT vut.vfbid as vid, sj.* " \
			   "FROM spatdist_jfrc sj " \
			   "JOIN neuron n ON (sj.idid=n.idid) " \
			   "JOIN vfbid_uuid_type vut ON (n.uuid=vut.uuid)") # How to make these prettier!  need to be able to add newlines.  Presumbaly there's an escape character for this?

dc = dict_cursor(cursor)
for d in dc:
	above_cutoff = {} # Dict containing all domains above cutoff as keys and the voxel overlap as value
	voxel_overlap_txt = "From analysis of a registered 3D image, this neuron is predicted to overlap the following neuropils: "
	for abbv in BN_abbv_list:
		if d[abbv] > 1000:  # Using crude cutoff for now - but could make this ratio based instead, given data from Marta.
			above_cutoff[BN_dict[abbv]] = (d[abbv])
	while above_cutoff:
		dom = above_cutoff.popitem()  # pop item from dict (dom now has a list of key, value
		typ = "RO_0002131 some " + dom[0]
		vfb_ind.type(typ,d["vid"])
		voxel_overlap_txt += str(dom[1]) + " voxels overlap the " + fbbt.getLabel(dom[0])   
		if len(above_cutoff) >= 1:  # Equivalent for keys with iterable?
			voxel_overlap_txt +=  "; "
		else:
			 voxel_overlap_txt += "."
	vfb_ind.comment(d['vid'], voxel_overlap_txt)
	
cursor.execute("SELECT vut.vfbid, akv.owl_mapping " \
			   "FROM annotation a, neuron n, annotation_key_value akv, vfbid_uuid_type vut " \
			   "WHERE n.idid=a.neuron_idid " \
			   "AND n.uuid=vut.uuid " \
			   "AND a.annotation_class=akv.annotation_class " \
			   "AND a.text=akv.annotation_text " \
			   "AND vut.type = 'neuron'")

dc = dict_cursor(cursor)
for d in dc:
	if d['owl_mapping']:
		vfb_ind.type(d['owl_mapping'], d['vfbid'])
	
# Adding clusters               

cursor.execute("SELECT DISTINCT vut.vfbid as cvid, c.cluster as cnum, evut.vfbid as evid, c.clusterv as cversion " \
			   "FROM vfbid_uuid_type vut " \
			   "JOIN cluster c ON (vut.uuid=c.uuid) " \
			   "JOIN clustering cg ON (cg.cluster=c.cluster) " \
			   "JOIN neuron n ON (cg.exemplar_idid=n.idid) " \
			   "JOIN vfbid_uuid_type evut ON (n.uuid=evut.uuid) " \
			   "WHERE cg.clusterv_id = c.clusterv " \
			   "AND vut.type = 'cluster' " \
			   "AND c.clusterv = '3'")

# Note on IDs: At the time of writing this script, queries on individuals all work via OWLtools MS queries with labels. So, labels need to be stable for everything to keep working, but IDs do not.
			   
dc = dict_cursor(cursor)
for d in dc:
	if not vfb_ind.knowsClass(d["cvid"]):
		vfb_ind.addNamedIndividual(d["cvid"])
		vfb_ind.label(d["cvid"], "cluster " + str(d["cversion"]) + "." + str(d["cnum"])) # Note ints returned by query need tobe coerced into strings.
	vfb_ind.objectPropertyAssertion(d["evid"], "c099d9d6-4ef3-11e3-9da7-b1ad5291e0b0", d["cvid"]) # UUID for exemplar as a placeholder - awaiting addition to RO

# Add cluster membership

cursor.execute("SELECT DISTINCT cvut.vfbid AS cvid, nvut.vfbid AS mvid " \
			   "FROM clustering cg " \
			   "JOIN neuron n ON (cg.idid=n.idid) " \
			   "JOIN vfbid_uuid_type nvut ON (n.uuid=nvut.uuid) " \
			   "JOIN cluster c ON (cg.cluster=c.cluster)" \
			   "JOIN vfbid_uuid_type cvut ON (c.uuid=cvut.uuid)" \
			   "WHERE c.clusterv = '3'")

dc = dict_cursor(cursor)
for d in dc:
	vfb_ind.objectPropertyAssertion(d['cvid'], "RO_0002351" ,d['mvid']) #  has_member
	vfb_ind.objectPropertyAssertion(d['mvid'], "RO_0002350", d['cvid']) #  member_of

    
cursor.close()
conn.close()

vfb_ind.save("vfb_ind.owl") 

## Sketch of improved schema for underying DB

# Generic stuff

## Foreign terms:

# Need to list 

### Object properties
### anatomical classes





