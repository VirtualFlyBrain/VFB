# Draft spec for 3D browser for VFB

## Background

A major component of the current Wellcome Trust grant is a Web GL-based 3D browser to complement the existing 2D stack browsing functionality.  This page is intended as the specs doc for development of this browser.

## Outline:

* combine image data from multiple surces
* surface rendering
* volume rendering
* Dual 2D and 3D browsing - with clear indication of slice position
* User should be able to grab any point and freely rotate.
* Content selection model:
	* Choose content for stack
	* Select content on stack by
	       - direct point and (double?) click on 3D stack  (but how to make this work in Z dimension?)
	       - indirectly via pointing and clicking on a slice
