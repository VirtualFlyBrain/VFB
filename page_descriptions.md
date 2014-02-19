# VFB page descriptions

## Anatomy search page / TermInfo

__Example page__

__Objectives of page__

__[Technical description](TermInfo)__

### Query menus

__All pages/default__

__Neuropil specific__

__Tract specific__

__Clone specific__

## Stack browser

__Example page__

__Objectives of page__

__[Technical description](Stack_browser_tech_spech)__

## Query builder

__Example page__

__Objectives of page__

__[Technical description](QB_tech_spech)__

## Query results pages

### anatomy_list

__Example page__

__Objectives of page__

__Header__

__csv download__

__Columns__

__[Technical description](anatomy_list)__

### gene_list

__Example page__

__Objectives of page__

__Header__

__csv download__

__Columns__

__[Technical description](gene_list)__

### individual_list

__Example page__

__Objectives of page__

__Header__

__csv download__

__Columns__

__[Technical description](individual_list)__

### cluster_list

__[Example page](http://www.virtualflybrain.org/do/cluster_list.html?action=cluster_found&id=FBbt:00007401)__

__[Technical description](Generating_cluster_lists)__

__Objectives of page__

To allow users to view the results of a query for clusters whose exemplar (most typical member) overlaps some specified structure\*. The aim is to provide thumbnails showing cluster and exemplar and to provide links to:
(a) A page displaying a rotatable 3D cluster in WebGL
(b) The source of the exemplar
(c) A list of members of the cluster

\* This means that the results miss neurons that overlap the structure but which are in clusters whose exemplar does not.

__Header__

Query: Neurons with some part in X, clustered by shape

__csv download__

__Columns__

_Column 1_: Cluster

Thumbnail image of cluster, hyperlinked to lmb page displaying WebGL image and neuron blast scores.

_Column 2_: Exemplar neuron name

Name of exemplar neuron and the hyperlinked name of the source \(link goes to exemplar neuron page on source if specific page is available\).

_Column 3_: Exemplar neuron

Image of exemplar neuron, hyperlink to source \(link goes to exemplar neuron page on source if specific page is available\).

_Column 4_: Members of cluster

Static text "Show individual neurons \>\>" links to an [individual list page](page_descriptions#individual_list) displaying members of the stack.

### 
