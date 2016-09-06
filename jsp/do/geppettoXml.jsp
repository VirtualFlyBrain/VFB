<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%><%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %><%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%><?xml version="1.0" encoding="ASCII"?>
<gep:GeppettoModel xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gep="https://raw.githubusercontent.com/openworm/org.geppetto.model/development/src/main/resources/geppettoModel.ecore" xmlns:gep_1="https://raw.githubusercontent.com/openworm/org.geppetto.model/development/src/main/resources/geppettoModel.ecore#//types">
  <libraries
      id="SWCLibrary"
      name="SWC"/>
  <libraries
      id="OBJLibrary"
      name="OBJ"/>
  <libraries
      id="OWLLibrary"
      name="OWL"/>
  <libraries
      id="ontology"
      name="Ontology">
    <types xsi:type="gep_1:SimpleType"
        id="Individual"
        name="Individual"/>
    <types xsi:type="gep_1:SimpleType"
        id="Class"
        name="Class"/>
    <types xsi:type="gep_1:SimpleType"
        id="Neuron"
        name="Neuron"/>
    <types xsi:type="gep_1:SimpleType"
        id="Tract"
        name="Tract"/>
    <types xsi:type="gep_1:SimpleType"
        id="Clone"
        name="Clone"/>
    <types xsi:type="gep_1:SimpleType"
        id="Synaptic_neuropil"
        name="Synaptic Neuropil"/>
    <types xsi:type="gep_1:SimpleType"
        id="VFB"
        name="Virtual Fly Brain"/>
    <types xsi:type="gep_1:SimpleType"		
        id="Orphan"		
        name="No Meta Data"/>
    <types xsi:type="gep_1:SimpleType"		
        id="Obsolete"		
        name="Obsolete"/>
    <types xsi:type="gep_1:SimpleType"		
        id="Synaptic_neuropil_domain"		
        name="Synaptic Neuropil Domain"/>
    <types xsi:type="gep_1:SimpleType"		
        id="Synaptic_neuropil_subdomain"		
        name="Synaptic Neuropil Subdomain"/>
    <types xsi:type="gep_1:SimpleType"		
        id="Synaptic_neuropil_block"		
        name="Synaptic Neuropil Block"/>
    <types xsi:type="gep_1:SimpleType"		
        id="FBDV"		
        name="FlyBase Development CV"/>
    <types xsi:type="gep_1:SimpleType"		
        id="FBCV"		
        name="FlyBase Controlled Vocabulary"/>
    <types xsi:type="gep_1:SimpleType"		
        id="FBBI"		
        name="FlyBase Biological Imaging Methods"/>
    <types xsi:type="gep_1:SimpleType"		
        id="Root"		
        name="Top Object"/>
    <types xsi:type="gep_1:SimpleType"		
        id="pub"		
        name="Publication"/>
    <types xsi:type="gep_1:SimpleType"		
        id="Resource"		
        name="Resource"/>
  </libraries>
  <libraries
      id="vfbLibrary"
      name="VFB"/>
  <dataSources
      id="neo4JDataSourceService"
      name="neo4JDataSourceService"
      dataSourceService="neo4jDataSource"
      url="http://www.virtualflybrain.org/neo4jdb/data/transaction"
      dependenciesLibrary="//@libraries.3"
      targetLibrary="//@libraries.4">
    <libraryConfigurations
        library="//@libraries.0"
        modelInterpreterId="swcModelInterpreterService"
        format="swc"/>
    <libraryConfigurations
        library="//@libraries.1"
        modelInterpreterId="objModelInterpreterService"
        format="obj"/>
    <libraryConfigurations
        library="//@libraries.2"
        modelInterpreterId="owlModelInterpreterService"
        format="owl"/>
    <fetchVariableQuery
        xsi:type="gep:CompoundQuery"
        name="The compound query for augmenting a type"
        description="">
      <queryChain
          xsi:type="gep:SimpleQuery"
          name="Get id/name/superTypes/description/comment/synonyms"
          description="Fetches essential details."
          query="MATCH (n { short_form: '$ID' } ) RETURN n.label as name, n.short_form as id, n.description as description, n.`annotation-comment` as comment, labels(n) as supertypes, n.synonym as synonyms LIMIT 1"
          countQuery="MATCH (n { short_form: '$ID' } ) RETURN count(n) as count"/>
      <queryChain
          xsi:type="gep:ProcessQuery"
          name="This processing step will populate a Variable with the superType resulting from the previous query"
          description=""
          queryProcessorId="vfbTypesQueryProcessor"/>
      <queryChain
          xsi:type="gep:SimpleQuery"
          name="Fetch relationships and references for Class"
          description="Pull all relationships and references"
          query="MATCH (n:VFB:Class { short_form: '$ID' } )-[r:SUBCLASSOF|Related|has_reference]->(sc) RETURN r as relationship, sc.label as relName, sc.short_form as relId, sc.miniref as relRef, sc.FlyBase as relFBrf, sc.PMID as relPMID, sc.DOI as relDOI"
          countQuery="MATCH (n:VFB:Class { short_form: '$ID' } )-[r:SUBCLASSOF|Related|has_reference]->(sc) RETURN count(*) as count">
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
      </queryChain>
      <queryChain
          xsi:type="gep:ProcessQuery"
          name="This processing step will populate a Variable with the synonyms and references resulting from the previous query"
          description="This processing step will populate a Variable with the synonyms and references resulting from the previous query"
          queryProcessorId="vfbImportTypesSynonymQueryProcessor">
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
      </queryChain>
      <queryChain
          xsi:type="gep:SimpleQuery"
          name="Fetch related and references for individuals"
          description="Fetch related and references for individuals"
          query="MATCH (n:VFB:Individual { short_form: '$ID' } )-[r:INSTANCEOF|Related|has_reference]->(sc) RETURN r as relationship, sc.label as relName, sc.short_form as relId, sc.miniref as relRef, sc.FlyBase as relFBrf, sc.PMID as relPMID, sc.DOI as relDOI"
          countQuery="MATCH (n:VFB:Individual { short_form: '$ID' } )-[r:INSTANCEOF|Related|has_reference]->(sc) RETURN count(n) as count">
        <matchingCriteria
            type="//@libraries.3/@types.0"/>
      </queryChain>
      <queryChain
              xsi:type="gep:ProcessQuery"
              name="This processing step will populate a Variable with the related and references resulting from the previous query"
              description="This processing step will populate a Variable with the related and references resulting from the previous query"
              queryProcessorId="vfbImportTypesRelatedQueryProcessor">
        <matchingCriteria
            type="//@libraries.3/@types.0"/>
      </queryChain>
      <queryChain
          xsi:type="gep:SimpleQuery"
          name="Fetch 6 example individuals for classes"
          description="Fetch 6 example individuals"
          query="MATCH (n:VFB:Class { short_form: '$ID' } )&lt;-[:SUBCLASSOF*]-()&lt;-[:INSTANCEOF]-(i) RETURN i.short_form as exId, i.label as exName LIMIT 6"
          countQuery="MATCH (n:VFB:Class { short_form: '$ID' } )&lt;-[:SUBCLASSOF*]-()&lt;-[:INSTANCEOF]-(i) RETURN count(n) as count">
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
      </queryChain>
      <queryChain
          xsi:type="gep:ProcessQuery"
          name="This processing step will populate the Variable with the different import type"
          description=""
          queryProcessorId="vfbImportTypesQueryProcessor">
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
      </queryChain>
      <queryChain
          xsi:type="gep:ProcessQuery"
          name="Add Thumbnail for VFB Individuals"
          description="Add Thumbnail for VFB Individuals"
          queryProcessorId="vfbImportTypesThumbnailQueryProcessor">
        <matchingCriteria
            type="//@libraries.3/@types.0"/>
      </queryChain>
    </fetchVariableQuery>
  </dataSources>
  <dataSources		
      id="aberOWLDataSourceService"		
      name="aberOWLDataSourceService"		
      dataSourceService="aberOWLDataSource"		
      url="http://aber-owl.net/service/api/runQuery.groovy"		
      dependenciesLibrary="//@libraries.3"		
      targetLibrary="//@libraries.4">		
    <queries		
        xsi:type="gep:SimpleQuery"		
        name="Part of"		
        description="Part of"		
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/BFO_0000050%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB_Ind"		
        countQuery="">		
      <matchingCriteria		
          type="//@libraries.3/@types.1"/>		
    </queries>		
    <queries		
        xsi:type="gep:SimpleQuery"		
        name="Neurons"		
        description="Neurons with some part here"		
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/FBbt_00005106%3E%20that%20%3Chttp://purl.obolibrary.org/obo/RO_0002131%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB_Ind"		
        countQuery="">		
      <matchingCriteria		
          type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>		
    </queries>		
    <queries		
        xsi:type="gep:SimpleQuery"		
        name="Neurons Synaptic"		
        description="Neurons with synaptic terminals here"		
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/FBbt_00005106%3E%20that%20%3Chttp://purl.obolibrary.org/obo/RO_0002130%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB_Ind"		
        countQuery="">		
      <matchingCriteria		
          type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>		
    </queries>		
    <queries		
        xsi:type="gep:SimpleQuery"		
        name="Neurons Presynaptic"		
        description="Neurons with presynaptic terminals here"		
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/FBbt_00005106%3E%20that%20%3Chttp://purl.obolibrary.org/obo/RO_0002113%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB_Ind"		
        countQuery="">		
      <matchingCriteria		
          type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>		
    </queries>		
    <queries		
        xsi:type="gep:SimpleQuery"		
        name="Neurons Postsynaptic"		
        description="Neurons with postsynaptic terminals here"		
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/FBbt_00005106%3E%20that%20%3Chttp://purl.obolibrary.org/obo/RO_0002110%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB_Ind"		
        countQuery="">		
      <matchingCriteria		
          type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>		
    </queries>		
  </dataSources>
</gep:GeppettoModel>
