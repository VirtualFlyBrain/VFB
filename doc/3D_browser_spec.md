# Draft spec for 3D browser for VFB

## Background

A major component of the current Wellcome Trust grant is a Web GL-based 3D browser to complement the existing 2D stack browsing functionality.  This page is intended as the specs doc for development of this browser.

### Text from Grant

"We will develop an interactive viewer for 3D image content. 3D display will make it much easier to compare, say, traced single neurons with lineage clones or transgene expression patterns; we will also provide surface models for neuropil domains (Fig. 5). Clicking on objects will reveal linked information. High resolution 2D sections will allow detailed analysis.

WebGL technology can display rich 3D content e.g. neuron clusters (Fig. 1C) without server- based rendering. We currently favour code from CATMAID [17] (Cardona collaboration form), which is used to view and annotate terabyte-scale 3D confocal and EM data. It is open source, modular and has many of the features we need. Another strong candidate is the WebGL browser from the Trust-funded Open Source Brain project (OSB) [http://www.opensourcebrain.org/] (Silver collaboration form)."

## Outline:

* combine image data from multiple sources
* surface rendering
* volume rendering
* Dual 2D and 3D browsing - with clear indication of slice position
* User should be able to grab any point and freely rotate.
* Content selection model:
	* Choose content for stack while browsing site via shopping basket
	* Select content on stack by
	       - direct point and (double?) click on 3D stack
	       		- how to make this work in Z dimension?
	       		- How to keep distinct from grabbing to rotate ?
	       - indirectly via pointing and clicking on a slice in the 2D browser
