<?xml version="1.0" encoding="ASCII"?>
<gep:GeppettoModel
    xmi:version="2.0"
    xmlns:xmi="http://www.omg.org/XMI"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:gep="https://raw.githubusercontent.com/openworm/org.geppetto.model/development/src/main/resources/geppettoModel.ecore"
    xmlns:gep_1="https://raw.githubusercontent.com/openworm/org.geppetto.model/development/src/main/resources/geppettoModel.ecore#//types"
    xmlns:gep_2="https://raw.githubusercontent.com/openworm/org.geppetto.model/development/src/main/resources/geppettoModel.ecore#//datasources">
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
    <types xsi:type="gep_1:SimpleType"
        id="VFB_00017894"
        name="JFRC2 template"/>
    <types xsi:type="gep_1:SimpleType"
        id="VFB_00030786"
        name="BrainName standard - Ito half brain"/>
    <types xsi:type="gep_1:SimpleType"
        id="Template"
        name="Template"/>
    <types xsi:type="gep_1:SimpleType"
        id="hasExamples"
        name="Has Examples"/>
  </libraries>
  <libraries
      id="vfbLibrary"
      name="VFB"/>
  <dataSources
      id="neo4JDataSourceService"
      name="neo4j Data Source"
      dataSourceService="neo4jDataSource"
      url="http://pdb.virtualflybrain.org/db/data/transaction"
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
    <queries
        xsi:type="gep_2:CompoundQuery"
        name="Get and process 6 example images from Neo4j for class list"
        description=""
        runForCount="false">
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          name="Get max 6 images from Neo4j"
          description="fetch Individual instances from ID list"
          runForCount="false"
          query="MATCH (n:VFB:Class)&lt;-[:SUBCLASSOF|INSTANCEOF*..]-(i:Individual)-[:Related { label : 'depicts' } ]-(j:Individual)-[:Related { label : 'has_signal_channel' } ]-(k:Individual)-[:Related { label: 'has_background_channel' } ]-(m:Individual) WHERE n.short_form IN $ARRAY_ID_RESULTS RETURN n.short_form as class_Id, COLLECT (DISTINCT { image_name: i.label, image_id: i.short_form, image_thumb: 'http://www.virtualflybrain.org/data/'+substring(j.short_form,0,3)+'/'+substring(j.short_form,3,1)+'/'+substring(j.short_form,5,4)+'/'+substring(j.short_form,9,4)+'/thumbnailT.png', template_id: m.short_form}) AS inds LIMIT 6 "
          countQuery="MATCH (n:VFB:Class)&lt;-[:SUBCLASSOF|INSTANCEOF*..]-(i:Individual) WHERE n.short_form IN $ARRAY_ID_RESULTS RETURN count(i) AS count"/>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="Process images"
          queryProcessorId="vfbCreateImagesForQueryResultsQueryProcessor"/>
    </queries>
    <queries
        xsi:type="gep_2:CompoundQuery"
        name="Get and process details from Neo4j for list of inds"
        description=""
        runForCount="false">
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          id="GetMetaForIndList"
          name="Get meta from Neo4j"
          description="Get images for individual list"
          runForCount="false"
          query="MATCH(i:Individual) WHERE i.short_form IN $ARRAY_ID_RESULTS RETURN i.short_form as id, i.label as name, i.description[0] as def,  'http://www.virtualflybrain.org/data/'+substring(i.short_form,0,3)+'/c/'+substring(i.short_form,4,4)+'/'+substring(i.short_form,8,4)+'/thumbnailT.png' AS file"
          countQuery="MATCH(i:Individual) WHERE i.short_form IN $ARRAY_ID_RESULTS RETURN count(i) as count"/>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="Process Images"
          runForCount="false"
          returnType="//@libraries.3/@types.0"
          queryProcessorId="vfbCreateResultListForIndividualsForQueryResultsQueryProcessor"/>
    </queries>
    <queries
        xsi:type="gep_2:CompoundQuery"
        name="Get fellow cluster members"
        description="">
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          id="GetFellowClusterMembers"
          name="Get other cluster members"
          description="$NAME's fellow cluster members"
          query="MATCH (n:Neuron { short_form: '$ID' } )-[r1:Related {label:'member_of'}]->(c:Cluster)-[r2:Related {label:'has_member'}]->(i:Neuron) RETURN i.short_form as id, i.label as name, i.description[0] as def,  'http://www.virtualflybrain.org/data/'+substring(i.short_form,0,3)+'/c/'+substring(i.short_form,4,4)+'/'+substring(i.short_form,8,4)+'/thumbnailT.png' AS file"
          countQuery="MATCH (n:Neuron { short_form: '$ID' } )-[r1:Related {label:'member_of'}]->(c:Cluster)-[r2:Related {label:'has_member'}]->(i:Neuron) RETURN count(i) as count"/>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="Process Images"
          returnType="//@libraries.3/@types.0"
          queryProcessorId="vfbCreateResultListForIndividualsForQueryResultsQueryProcessor"/>
    </queries>
    <queries
        xsi:type="gep_2:CompoundQuery"
        name="Get and process details from Neo4j for list of clusters"
        description=""
        runForCount="false">
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          id="GetMetaForClustList"
          name="Get meta from Neo4j for clusters"
          description="Get images for cluster list"
          runForCount="false"
          query="MATCH(i:Individual)&lt;-[r:Related {label:'member_of'}]-(m:Individual) WHERE i.short_form IN $ARRAY_ID_RESULTS RETURN i.short_form as id, i.label as name, coalesce(i.description[0], 'An NBLAST derived cluster with ' + count(m) + ' members. Individual members are shown in the images column.' as def, COLLECT (DISTINCT { image_name: m.label, image_id: m.short_form, image_thumb: 'http://www.virtualflybrain.org/data/'+substring(m.short_form,0,3)+'/c/'+substring(m.short_form,4,4)+'/'+substring(m.short_form,8,4)+'/thumbnailT.png', template_id: m.short_form}) AS inds"
          countQuery="MATCH(i:Individual) WHERE i.short_form IN $ARRAY_ID_RESULTS RETURN count(i) as count"/>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="Process Images"
          runForCount="false"
          returnType="//@libraries.3/@types.0"
          queryProcessorId="vfbCreateResultListForIndividualsForQueryResultsQueryProcessor"/>
    </queries>
    <queries
        xsi:type="gep_2:CompoundQuery"
        name="Get and process all example images from Neo4j for list "
        description=""
        runForCount="false">
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          name="Get all images from Neo4j"
          description="fetch Individual instances from ID list"
          runForCount="false"
          query="MATCH (n:VFB:Class)&lt;-[:SUBCLASSOF|INSTANCEOF*..]-(i:Individual)-[:Related { label : 'depicts' } ]-(j:Individual)-[:Related { label : 'has_signal_channel' } ]-(k:Individual)-[:Related { label: 'has_background_channel' } ]-(m:Individual) WHERE n.short_form IN $ARRAY_ID_RESULTS RETURN n.short_form as class_Id, COLLECT (DISTINCT { image_name: i.label, image_id: i.short_form, image_thumb: 'http://www.virtualflybrain.org/data/'+substring(j.short_form,0,3)+'/'+substring(j.short_form,3,1)+'/'+substring(j.short_form,5,4)+'/'+substring(j.short_form,9,4)+'/thumbnailT.png', template_id: m.short_form}) AS inds "
          countQuery="MATCH (n:VFB:Class)&lt;-[:SUBCLASSOF|INSTANCEOF*..]-(i:Individual) WHERE n.short_form IN $ARRAY_ID_RESULTS RETURN count(i) AS count"/>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="Process images"
          runForCount="false"
          queryProcessorId="vfbCreateImagesForQueryResultsQueryProcessor"/>
    </queries>
    <queries
        xsi:type="gep_2:CompoundQuery"
        name="All example images for a class"
        description="">
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          name="Fetch all example individuals for Class"
          description="Fetch all example Individual instances of this Class or subclasses"
          returnType="//@libraries.3/@types.0"
          query="MATCH p=(n:Class { short_form: '$ID' } )&lt;-[r:SUBCLASSOF|INSTANCEOF*..]-(i:Individual) WITH i ORDER BY length(p) asc RETURN i.short_form as id, i.label as name, i.description[0] as def,  'http://www.virtualflybrain.org/data/'+substring(i.short_form,0,3)+'/c/'+substring(i.short_form,4,4)+'/'+substring(i.short_form,8,4)+'/thumbnailT.png' AS file"
          countQuery="MATCH (n:VFB:Class { short_form: '$ID' } )&lt;-[r:SUBCLASSOF|INSTANCEOF*..]-(i:Individual) RETURN count(i) as count"/>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="Process Images"
          returnType="//@libraries.3/@types.0"
          queryProcessorId="vfbCreateResultListForIndividualsForQueryResultsQueryProcessor"/>
    </queries>
    <queries
        xsi:type="gep_2:CompoundQuery"
        name="Pass type class ID for Individual"
        description="Pass type class ID for Individual">
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          id="PassTypeID"
          name="Pass type class ID for Individual"
          description="Pass type class ID for Individual"
          query="MATCH (i:Individual {short_form:'$ID'})-[r:INSTANCEOF {label:'type'}]->(c:Synaptic_neuropil) return c.short_form as id LIMIT 1"
          countQuery="MATCH (i:Individual {short_form:'$ID'})-[r:INSTANCEOF {label:'type'}]->(c:Synaptic_neuropil) return count(c) as count"/>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          id="PushReturnedID"
          name="Pass type class ID for Individual"
          description="Pass type class ID for Individual"
          queryProcessorId="vfbPassRetunedIDtoNextQuery"/>
    </queries>
    <queries
        xsi:type="gep_2:CompoundQuery"
        name="Clones developing from"
        description="">
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          id="CloneIndFromCloneClass"
          name="Return Clone Individuals from Clone Class "
          description=""
          query="MATCH (c {short_form:'$ID'})&lt;-[r*0..3]-(i:Individual:Clone) RETURN i.short_form as id, i.label as name, i.description[0] as def,  'http://www.virtualflybrain.org/data/'+substring(i.short_form,0,3)+'/c/'+substring(i.short_form,4,4)+'/'+substring(i.short_form,8,4)+'/thumbnailT.png' AS file"
          countQuery="MATCH (c {short_form:'$ID'})&lt;-[r*0..3]-(i:Individual:Clone) return count(i) as count"/>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="Process Images"
          runForCount="false"
          returnType="//@libraries.3/@types.4"
          queryProcessorId="vfbCreateResultListForIndividualsForQueryResultsQueryProcessor"/>
    </queries>
    <fetchVariableQuery
        xsi:type="gep_2:CompoundQuery"
        name="The compound query for augmenting a type"
        description="">
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          name="Get id/name/superTypes/description/comment"
          description="Fetches essential details."
          query="MATCH (n { short_form: '$ID' } ) with n OPTIONAL MATCH (n)-[r:INSTANCEOF|SUBCLASSOF]->(p:Class) with n,p, CASE type(r) WHEN 'INSTANCEOF' THEN 'An example' ELSE 'Is a subclass' END as t RETURN n.label as name, n.short_form as id, CASE n.description[0] WHEN '.' THEN t + ' of the ' + p.label + ': ' + p.description[0] ELSE n.description[0] END as description, n.`annotation-comment` as comment, labels(n) as supertypes LIMIT 1"
          countQuery="MATCH (n { short_form: '$ID' } ) RETURN count(n) as count"/>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="This processing step will populate a Variable with the superType resulting from the previous query"
          description=""
          queryProcessorId="vfbTypesQueryProcessor"/>
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          name="Fetch relationships and references for Class"
          description="Pull all relationships and references"
          query="MATCH (n:VFB:Class { short_form: '$ID' } )-[r:SUBCLASSOF|Related|has_reference]->(sc) RETURN r as relationship, sc.label as relName, sc.short_form as relId, sc.miniref as relRef, sc.FlyBase as relFBrf, sc.PMID as relPMID, sc.DOI as relDOI, sc.http as relLink"
          countQuery="MATCH (n:VFB:Class { short_form: '$ID' } )-[r:SUBCLASSOF|Related|has_reference]->(sc) RETURN count(*) as count">
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          name="Fetch related and references for individuals"
          description="Fetch related and references for individuals"
          query="MATCH (n:VFB:Individual { short_form: '$ID' } )-[r:INSTANCEOF|Related|has_reference]->(sc) RETURN r as relationship, sc.label as relName, sc.short_form as relId, sc.miniref as relRef, sc.FlyBase as relFBrf, sc.PMID as relPMID, sc.DOI as relDOI, sc.http as relLink"
          countQuery="MATCH (n:VFB:Individual { short_form: '$ID' } )-[r:INSTANCEOF|Related|has_reference]->(sc) RETURN count(n) as count">
        <matchingCriteria
            type="//@libraries.3/@types.0"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="This processing step will populate a Variable with the related and references resulting from the previous query"
          description="This processing step will populate a Variable with the related and references resulting from the previous query"
          queryProcessorId="vfbImportTypesSynonymQueryProcessor">
        <matchingCriteria
            type="//@libraries.3/@types.0"/>
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          name="Image Folder and Template"
          description="Fetch the image folder and template details"
          query="MATCH (i:Individual { short_form: '$ID' } )&lt;-[r1:Related{label:'depicts'}]-(im:Individual)&lt;-[r2:Related {label:'has_signal_channel'}]-(id:Individual) with substring(im.short_form,0,3)+'/c/'+substring(im.short_form,5,4)+'/'+substring(im.short_form,9,4)+'/' as imageDir,i,r1,im,r2,id OPTIONAL MATCH (id)-[r3:Related]->(tc:Individual) with imageDir,i,r1,im,r2,id,r3,tc OPTIONAL MATCH (tc)-[r4:Related{label:'depicts'}]->(t:Template) with imageDir,i,r1,im,r2,id,r3,tc,r4,t OPTIONAL MATCH (tc)-[r5:Related {label:'depicts'}]->(di:Individual)-[r6:INSTANCEOF]->(dp:Class) RETURN COLLECT(imageDir)[0] as imageDir, COLLECT(t.short_form)[0] as tempId, COLLECT(t.label)[0] as tempName,COLLECT([coalesce(r3.index,0),di.short_form,di.label,dp.short_form,dp.label]) as domains"
          countQuery="MATCH (i:Individual { short_form: '$ID' } ) RETURN count(i) as count">
        <matchingCriteria
            type="//@libraries.3/@types.0"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="Add Thumbnail for VFB Individuals"
          description="Add Thumbnail for VFB Individuals"
          queryProcessorId="vfbImportTypesThumbnailQueryProcessor">
        <matchingCriteria
            type="//@libraries.3/@types.0"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          name="Fetch 8 example individuals for Class"
          description="Fetch up to 8 example Individual instances of this Class or subclasses"
          query="MATCH p=(n:Class { short_form: '$ID' } )&lt;-[r:SUBCLASSOF|INSTANCEOF*..]-(i:Individual) WITH i ORDER BY length(p) asc MATCH (i)&lt;-[:Related{label:'depicts'}]-(c:Individual)&lt;-[:Related{label:'has_signal_channel'}]-(id:Individual)-[r3:Related {label:'has_background_channel'}]->(tc:Individual)-[r4:Related{label:'depicts'}]->(t:Template) RETURN DISTINCT i.short_form as exId, i.label as exName, substring(c.short_form,0,3)+'/'+substring(c.short_form,3,1)+'/'+substring(c.short_form,5,4)+'/'+substring(c.short_form,9,4)+'/thumbnailT.png' as exThumb, t.short_form as exTemp LIMIT 8"
          countQuery="MATCH (n:VFB:Class { short_form: '$ID' } )&lt;-[r:SUBCLASSOF|INSTANCEOF*..]-(i:Individual) RETURN count(i) as count">
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          id="templateDomains"
          name="Get Template Domains"
          description="Get All Template Painted Domains"
          query="MATCH (t:Template { short_form: '$ID' } )&lt;-[:Related {label:'depicts'}]-(c:Individual)&lt;-[:Related {index:0}]-(i:Individual)-[r:Related{label:'has_signal_channel'}]->(dc:Individual)-[:Related {label:'depicts'}]->(d:Individual)-[:INSTANCEOF]->(a:Class) RETURN d.short_form as exId, d.label as exName,substring(dc.short_form,0,3)+'/c/'+substring(dc.short_form,5,4)+'/'+substring(dc.short_form,9,4)+'/thumbnailT.png' as exThumb, t.short_form as exTemp"
          countQuery="MATCH (t:Template { short_form: '$ID' } )&lt;-[:Related {label:'depicts'}]-(c:Individual)&lt;-[:Related {index:0}]-(i:Individual)-[r:Related{label:'has_signal_channel'}]->(dc:Individual) RETURN count(dc) as count">
        <matchingCriteria
            type="//@libraries.3/@types.0 //@libraries.3/@types.20"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="Add Example thumbnails"
          description="Add example thumbnails for Individual instances of this Class or subclasses"
          queryProcessorId="vfbImportTypesQueryProcessor">
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
        <matchingCriteria
            type="//@libraries.3/@types.0 //@libraries.3/@types.20"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="External Links"
          description="Add External Links for Classes"
          queryProcessorId="vfbImportTypesExtLinkQueryProcessor">
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          name="Ind References"
          description="References for Individual"
          query="MATCH (n:Class { short_form: '$ID' } )-[r:INSTANCEOF|Related|has_reference]->(sc) where sc.miniref is not null RETURN distinct '&lt;b>' + split(sc.miniref,',')[0] + ' (' + sc.year + ')&lt;/b> ' + sc.title + ' ' + split(sc.miniref,',')[2] + '. (' + coalesce('&lt;a href=\\'http://flybase.org/reports/' + sc.FlyBase + '\\' target=\\'_blank\\'>FlyBase:' + sc.FlyBase + '&lt;/a>; ', '') + coalesce('&lt;a href=\\'http://www.ncbi.nlm.nih.gov/pubmed/' + sc.PMID + '\\' target=\\'_blank\\'>PMID:' + sc.PMID + '&lt;/a>; ', '') + coalesce('&lt;a href=\\'http://dx.doi.org/' + sc.DOI + '\\' target=\\'_blank\\'>doi:' + sc.DOI + '&lt;/a>)', ')') as bib ORDER BY bib ASC"
          countQuery="MATCH (n:Class { short_form: '$ID' } )-[r:INSTANCEOF|Related|has_reference]->(sc) where sc.miniref is not null RETURN count(distinct sc) as count">
        <matchingCriteria
            type="//@libraries.3/@types.0"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:SimpleQuery"
          name="Class References"
          description="References for Class"
          query="MATCH (n:Individual { short_form: '$ID' } )-[r:SUBCLASSOF|Related|has_reference]->(sc) where sc.miniref is not null RETURN distinct '&lt;b>' + split(sc.miniref,',')[0] + ' (' + sc.year + ')&lt;/b> ' + sc.title + ' ' + split(sc.miniref,',')[2] + '. (' + coalesce('&lt;a href=\\'http://flybase.org/reports/' + sc.FlyBase + '\\' target=\\'_blank\\'>FlyBase:' + sc.FlyBase + '&lt;/a>; ', '') + coalesce('&lt;a href=\\'http://www.ncbi.nlm.nih.gov/pubmed/' + sc.PMID + '\\' target=\\'_blank\\'>PMID:' + sc.PMID + '&lt;/a>; ', '') + coalesce('&lt;a href=\\'http://dx.doi.org/' + sc.DOI + '\\' target=\\'_blank\\'>doi:' + sc.DOI + '&lt;/a>)', ')') as bib ORDER BY bib ASC"
          countQuery="MATCH (n:Individual { short_form: '$ID' } )-[r:SUBCLASSOF|Related|has_reference]->(sc) where sc.miniref is not null RETURN count(distinct sc) as count">
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="External Links"
          description="Add References for either Class of Ind"
          queryProcessorId="vfbImportTypesRefsQueryProcessor">
        <matchingCriteria
            type="//@libraries.3/@types.0"/>
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
      </queryChain>
      <queryChain
          xsi:type="gep_2:ProcessQuery"
          name="Queries Links"
          description="Add queries links to metadata"
          queryProcessorId="vfbAddQueriesToMetadataQueryProcessor">
        <matchingCriteria
            type="//@libraries.3/@types.0"/>
        <matchingCriteria
            type="//@libraries.3/@types.1"/>
      </queryChain>
    </fetchVariableQuery>
  </dataSources>
  <dataSources
      id="aberOWLDataSource"
      name="Aber OWL Data Source"
      dataSourceService="aberOWLDataSource"
      url="http://owl.virtualflybrain.org/api/runQuery.groovy"
      dependenciesLibrary="//@libraries.3"
      targetLibrary="//@libraries.4">
    <queries
        xsi:type="gep_2:ProcessQuery"
        name="Retains id, name and definition"
        queryProcessorId="vfbAberOWLQueryProcessor"/>
    <queries
        xsi:type="gep_2:SimpleQuery"
        name="Part of"
        description="Part of $NAME"
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/BFO_0000050%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB"
        countQuery="">
      <matchingCriteria
          type="//@libraries.3/@types.1"/>
    </queries>
    <queries
        xsi:type="gep_2:SimpleQuery"
        id="Overlaps"
        name="Overlaps"
        description="Overlaps $NAME"
        returnType="//@libraries.3/@types.1"
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/RO_0002131%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB"
        countQuery="">
      <matchingCriteria
          type="//@libraries.3/@types.1"/>
    </queries>
    <queries
        xsi:type="gep_2:SimpleQuery"
        name="Neurons"
        description="Neurons with some part here"
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/FBbt_00005106%3E%20that%20%3Chttp://purl.obolibrary.org/obo/RO_0002131%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB"
        countQuery="">
      <matchingCriteria
          type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>
    </queries>
    <queries
        xsi:type="gep_2:SimpleQuery"
        name="Neurons Synaptic"
        description="Neurons with synaptic terminals here"
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/FBbt_00005106%3E%20that%20%3Chttp://purl.obolibrary.org/obo/RO_0002130%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB"
        countQuery="">
      <matchingCriteria
          type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>
    </queries>
    <queries
        xsi:type="gep_2:SimpleQuery"
        name="Neurons Presynaptic"
        description="Neurons with presynaptic terminals here"
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/FBbt_00005106%3E%20that%20%3Chttp://purl.obolibrary.org/obo/RO_0002113%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB"
        countQuery="">
      <matchingCriteria
          type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>
    </queries>
    <queries
        xsi:type="gep_2:SimpleQuery"
        name="Neurons Postsynaptic"
        description="Neurons with postsynaptic terminals here"
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/FBbt_00005106%3E%20that%20%3Chttp://purl.obolibrary.org/obo/RO_0002110%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB"
        countQuery="">
      <matchingCriteria
          type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>
    </queries>
    <queries
        xsi:type="gep_2:ProcessQuery"
        id="owlPassIdListOnly"
        name="Pass id list only"
        description="Keep nothing slimply pass ids"
        queryProcessorId="vfbAberOWLidOnlyQueryProcessor"/>
    <queries
        xsi:type="gep_2:SimpleQuery"
        id="AberNeuronClassesFasciculatingHere"
        name="Neuron classes fasciculating here"
        description="Neuron classes fasciculating here"
        returnType="//@libraries.3/@types.1"
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/FBbt_00005106%3E%20that%20%3Chttp://purl.obolibrary.org/obo/RO_0002101%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB"
        countQuery="">
      <matchingCriteria
          type="//@libraries.3/@types.3 //@libraries.3/@types.1"/>
    </queries>
    <queries
        xsi:type="gep_2:SimpleQuery"
        id="subclasses"
        name="Subclasses of"
        description="Subclasses of $NAME"
        returnType="//@libraries.3/@types.1"
        query="type=subeq&amp;query=%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB"
        countQuery="">
      <matchingCriteria
          type="//@libraries.3/@types.1 //@libraries.3/@types.2"/>
    </queries>
    <queries
        xsi:type="gep_2:SimpleQuery"
        id="ImagesOfNeuronsWithSomePartHereClustered"
        name="Images of neurons with some part here (clustered)"
        description="Images of neurons with some part here (clustered)"
        returnType="//@libraries.3/@types.2"
        query="type=realize&amp;query=%3Chttp://purl.obolibrary.org/obo/C888C3DB-AEFA-447F-BD4C-858DFE33DBE7%3E%20some%20(%3Chttp://purl.obolibrary.org/obo/FBbt_00005106%3E%20that%20%3Chttp://purl.obolibrary.org/obo/RO_0002131%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E)&amp;ontology=VFB"
        countQuery="">
      <matchingCriteria
          type="//@libraries.3/@types.5 //@libraries.3/@types.1"/>
    </queries>
    <queries
        xsi:type="gep_2:SimpleQuery"
        id="ImagesOfNeuronsWithSomePartHere"
        name="Images of neurons with some part here"
        description="Images of neurons with some part here"
        returnType="//@libraries.3/@types.2"
        query="type=realize&amp;query=%3Chttp://purl.obolibrary.org/obo/FBbt_00005106%3E%20that%20%3Chttp://purl.obolibrary.org/obo/RO_0002131%3E%20some%20%3Chttp://purl.obolibrary.org/obo/$ID%3E&amp;ontology=VFB"
        countQuery="">
      <matchingCriteria
          type="//@libraries.3/@types.5 //@libraries.3/@types.1"/>
    </queries>
  </dataSources>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="FindFellowClustMembers"
      name="Fellow Cluster Members"
      description="Similar neurons to $NAME"
      returnType="//@libraries.3/@types.2"
      queryChain="//@dataSources.0/@queries.2">
    <matchingCriteria
        type="//@libraries.3/@types.0 //@libraries.3/@types.2"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="ListAllExamples"
      name="List all example images for class with examples"
      description="List all example images of $NAME"
      returnType="//@libraries.3/@types.0"
      queryChain="//@dataSources.0/@queries.5">
    <matchingCriteria
        type="//@libraries.3/@types.21 //@libraries.3/@types.1"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="FellowClones"
      name="Fellow Clones"
      description="Clones realated to $NAME"
      returnType="//@libraries.3/@types.2"
      queryChain="//@dataSources.0/@queries.6 //@queries.5">
    <matchingCriteria
        type="//@libraries.3/@types.0 //@libraries.3/@types.4"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="ClonesFromClass"
      name="Clones developing from"
      description="Clones developing from $NAME"
      returnType="//@libraries.3/@types.4"
      queryChain="//@dataSources.0/@queries.7">
    <matchingCriteria
        type="//@libraries.3/@types.1 //@libraries.3/@types.4"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="CompSubclasses"
      name="Subclasses of"
      description="Subclasses of the $NAME"
      returnType="//@libraries.3/@types.1"
      queryChain="//@dataSources.1/@queries.9 //@dataSources.1/@queries.0 //@dataSources.0/@queries.0">
    <matchingCriteria
        type="//@libraries.3/@types.1 //@libraries.3/@types.2"/>
    <matchingCriteria
        type="//@libraries.3/@types.1 //@libraries.3/@types.4"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="partsof"
      name="Parts of"
      description="Subparts of the $NAME"
      queryChain="//@dataSources.1/@queries.1 //@dataSources.1/@queries.0 //@dataSources.0/@queries.0">
    <matchingCriteria
        type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="CompNeuronClassesFasciculatingHere"
      name="Neuron classes fasciculating here"
      description="Neuron classes fasciculating here"
      returnType="//@libraries.3/@types.1"
      queryChain="//@dataSources.1/@queries.8 //@dataSources.1/@queries.0 //@dataSources.0/@queries.0">
    <matchingCriteria
        type="//@libraries.3/@types.1 //@libraries.3/@types.3"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="ImagesNeurons"
      name="Images of neurons with some part here"
      description="Images of neurons with some part in the $NAME"
      returnType="//@libraries.3/@types.2"
      queryChain="//@dataSources.1/@queries.11 //@dataSources.1/@queries.7 //@dataSources.0/@queries.1">
    <matchingCriteria
        type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="ImagesNeuronsInd"
      name="Images of neurons with some part here (from Individual)"
      description="Images of neurons with some part in the $NAME"
      returnType="//@libraries.3/@types.2"
      queryChain="//@dataSources.0/@queries.6 //@dataSources.1/@queries.11 //@dataSources.1/@queries.7 //@dataSources.0/@queries.1">
    <matchingCriteria
        type="//@libraries.3/@types.5 //@libraries.3/@types.0"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="ImagesNeuronsClustered"
      name="Images of neurons with some part here (clustered)"
      description="Images of neurons with some part in the $NAME (clustered)"
      returnType="//@libraries.3/@types.2"
      queryChain="//@dataSources.1/@queries.10 //@dataSources.1/@queries.7 //@dataSources.0/@queries.3">
    <matchingCriteria
        type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="neuronsparthere"
      name="Neurons with any part here"
      description="Neurons in/overlapping the $NAME"
      queryChain="//@dataSources.1/@queries.3 //@dataSources.1/@queries.0 //@dataSources.0/@queries.0">
    <matchingCriteria
        type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="neuronssynaptic"
      name="Neurons Synaptic"
      description="Neurons with synaptic terminals in $NAME"
      queryChain="//@dataSources.1/@queries.4 //@dataSources.1/@queries.0 //@dataSources.0/@queries.0">
    <matchingCriteria
        type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="neuronspresynaptic"
      name="Neurons Presynaptic"
      description="Neurons with presynaptic terminals in $NAME"
      queryChain="//@dataSources.1/@queries.5 //@dataSources.1/@queries.0 //@dataSources.0/@queries.0">
    <matchingCriteria
        type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>
  </queries>
  <queries xsi:type="gep_2:CompoundRefQuery"
      id="neuronspostsynaptic"
      name="Neurons Postsynaptic"
      description="Neurons with postsynaptic terminals in $NAME"
      queryChain="//@dataSources.1/@queries.6 //@dataSources.1/@queries.0 //@dataSources.0/@queries.0">
    <matchingCriteria
        type="//@libraries.3/@types.1 //@libraries.3/@types.5"/>
  </queries>
</gep:GeppettoModel>
