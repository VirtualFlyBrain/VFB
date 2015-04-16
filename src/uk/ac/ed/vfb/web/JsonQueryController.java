package uk.ac.ed.vfb.web;

import java.util.*;

import java.net.URLDecoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.model.PubBean;
import uk.ac.ed.vfb.model.OntBeanIndividual;
import uk.ac.ed.vfb.service.OntBeanManager;
import uk.ac.ed.vfb.service.PubBeanManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Controller providing the front-end for the /do/json_query.html view.
 * @author rcourt
 */

 public class JsonQueryController implements Controller {
 	private OntBeanManager obm;
 	private PubBeanManager pbm;
 	private static final Log LOG = LogFactory.getLog(JsonQueryController.class);
 	List<String> dels = Arrays.asList("(", "[", " ");

 	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
 		ModelAndView modelAndView = new ModelAndView("do/jsonQuery");
    String rJsonStr = "{ \"results\":[";
 		OntBean obSingle = null;
    Set<OntBean> obSet = new HashSet<OntBean>();
 		String id = "";
    List<String> synonyms;
    if (req.getParameter("json") == null) {
     if (req.getParameter("fbId") == null) {
 			if (req.getParameter("id") == null) {
        LOG.error("No id of any type given!");
 				return null;
 			}else{
 			     id = OntBean.idAsOWL(req.getParameter("id"));
 			}
 		 }else{
 		     id = OntBean.idAsOBO(req.getParameter("fbId"));
 		 }
     if (id.contains("VFB")){
  			obSingle = (OntBeanIndividual)this.obm.getBeanForId(id);
  	 }else{
  			obSingle = this.obm.getBeanForId(id);
  	 }
     obSet.add(obSingle);
    }else{
      String url = req.getParameter("json");
      LOG.debug("encoded json: " + url);
      url = URLDecoder.decode(url, "UTF-8").replace("“","\"").replace("\"{","{").replace("}\"","}").replace("???","");
      LOG.debug("decoded json: " + url);
      try{
        LOG.info("Running json query: " + url);
        JSONObject qJson = new JSONObject(url);
        String qType = qJson.getString("query_type");
        String qValue = qJson.getString("query");
        String qAction = "parts"; // parts_of
        id = "FBbt:00003624"; // adult brain by default
        if (qType.contains("descendant_class")){
          qAction = "parts";
          id = OntBean.idAsOBO(qValue);
        }
        if (qType.contains("individuals")){
          qAction = "ind_neuron_overlap";
          id = OntBean.idAsOWL(qValue);
        }
        LOG.info(qAction + " query on: " + id);
        String actionStr = WebQueryUtils.getDefString(qAction, id);
        LOG.debug("calling action: " + actionStr);
        obSet = this.obm.getBeanListForQuery(actionStr);
        LOG.debug("returned " + Integer.toString(obSet.size()) + " results");
      } catch(Exception ex){
        LOG.error("url encoded json: " + url);
        ex.printStackTrace();
      }
    }

    if ( obSet != null && obSet.size() > 0 ){
      for (OntBean ob:obSet){
        rJsonStr = rJsonStr + "{";
        id = ob.correctIdFormat();
     		//LOG.debug("Returning id: " + id);
        rJsonStr = rJsonStr + "\"ID\": \"" + id + "\", ";
        rJsonStr = rJsonStr + "\"name\": \"" + ob.getName() + "\", ";
     		synonyms = ob.getSynonyms();
     		if (synonyms != null && synonyms.size() > 0){
          rJsonStr = rJsonStr + "\"synonyms\": [ ";
     			for (String syn:synonyms){
            rJsonStr = rJsonStr + "\"" + removeRefs(syn) + "\", ";
     			}
          rJsonStr = rJsonStr + " ] ";
     		}

        rJsonStr = rJsonStr + "}, ";
      }
    }
    rJsonStr = rJsonStr + "]}";
    rJsonStr = rJsonStr.replaceAll(", ]"," ]").replaceAll(", }"," }");
    rJsonStr = rJsonStr.replaceAll(",]"," ]").replaceAll(",}"," }").replaceAll(",  ]"," ]").replaceAll(",  }"," }");
    //if (rJsonStr.contains(",")) { rJsonStr = rJsonStr.substring(0, rJsonStr.lastIndexOf(",")); }
    modelAndView.addObject("json", rJsonStr);
 		return modelAndView;
 	}

  public String removeRefs(String txt){
      if (txt.contains("(") || txt.contains("[")) {
        int sqbr = txt.length();
        int clbr = sqbr;
        if (txt.contains("[")) { sqbr = txt.indexOf("["); }
        if (txt.contains("(")) { clbr = txt.indexOf("("); }
        if (clbr < sqbr) { sqbr = clbr; }
        txt = txt.substring(0, sqbr);
        txt = txt.trim();
      }
      return txt;
  }

 	public void setObm(OntBeanManager manager) {
 		this.obm = manager;
 	}

 	public void setPbm(PubBeanManager pbm) {
 		this.pbm = pbm;
 	}

 }
