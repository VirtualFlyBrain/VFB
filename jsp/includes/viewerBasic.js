
function doOnload(woolz) {
	//alert("doOnload" + woolz);
	jso = {"modelDataUrl":"/data/flybrain/"+woolz};
	emouseatlas.emap.tiledImageModel.initialise(jso);
}    
