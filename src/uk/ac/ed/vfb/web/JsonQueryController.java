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
    String rJsonStr = "{ [";
 		OntBean obSingle = null;
    Set<OntBean> obSet = new HashSet<OntBean>();
 		String id = "";
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
      try{
        LOG.debug("encoded json: " + url);
        JSONObject qJson = new JSONObject(URLDecoder.decode(url, "UTF-8").replace("“","\"").replace("\"{","{").replace("}\"","}").replace("???",""));
        String qType = qJson.getString("query_type");
        String qValue = qJson.getString("query");
        String qAction = "parts"; // parts_of
        String id = "FBbt:00003624"; // adult brain by default
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
        obSet = this.obm.getBeanListForQuery(actionStr);
      } catch(Exception ex){
        LOG.error("url encoded json: " + url);
        ex.printStackTrace();
      }
    }

    for (OntBean ob:obSet){
      rJsonStr = rJsonStr + " {";
      id = ob.correctIdFormat();
   		//LOG.debug("For Id: " + ob.getId());
      rJsonStr = rJsonStr + "\"ID\": \"" + id + "\", ";
      rJsonStr = rJsonStr + "\"name\": \"" + ob.getName() + "\", ";
   		List<PubBean> pbList = pbm.getBeanListByRefIds(ob.getRefs());
   		//LOG.debug("Found publications:" + pbList.size());
   		List<String> synonyms = ob.getSynonyms();
   		if (synonyms != null && synonyms.size() > 0){
        rJsonStr = rJsonStr + "\"synonyms\": [ ";
   			for (String syn:synonyms){
          rJsonStr = rJsonStr + "\"" + syn + "\", ";
   			}
        rJsonStr = rJsonStr + " ] ";
   		}

      rJsonStr = rJsonStr + "},";
      rJsonStr = rJsonStr.replace(", ]"," ]").replace(", }"," }");
    }
    rJsonStr = rJsonStr + "]}";
    rJsonStr = rJsonStr.replace(",]"," ]").replace(",}"," }");
    modelAndView.addObject("json", rJsonStr);
 		return modelAndView;
 	}

 	public void setObm(OntBeanManager manager) {
 		this.obm = manager;
 	}

 	public void setPbm(PubBeanManager pbm) {
 		this.pbm = pbm;
 	}

 	public String resolveRefs(String def, OntBean ob, List<PubBean> pbList){
 		if (def != null && (def.contains("(") || def.contains("doi:")) && !def.contains("<")){
 			//LOG.debug("Starting with definition: " + def);
 			while (def.contains("[FLP]")){
 				def = def.replace("[FLP]","<sup>FLP</sup>");
 				//LOG.debug("Resolving [FLP] definition: " + def);
 			}
 			while (def.contains("at al.")){
 				def = def.replace("at al.","et al.");
 				LOG.error("Correcting (a)t al. typo in " + ob.getId() + " in the text definition");
 				//LOG.debug("Resolving (at al) definition: " + def);
 			}
 			while (def.contains("et al,")){
 				def = def.replace("et al,","et al.,");
 				LOG.error("Correcting et al(.) typo in " + ob.getId() + " in the text definition");
 				//LOG.debug("Resolving (et al[.]) definition: " + def);
 			}
 			while (def.contains(",20")){
 				def = def.replace(",20",", 20");
 				LOG.error("Correcting spacing between author and year (20XX) typo in " + ob.getId() + " in the text definition");
 				//LOG.debug("Resolving (year spacing 20xx) definition: " + def);
 			}
 			while (def.contains(",19")){
 				def = def.replace(",19",", 19");
 				LOG.error("Correcting spacing between author and year (19XX) typo in " + ob.getId() + " in the text definition");
 				//LOG.debug("Resolving (year spacing 19xx) definition: " + def);
 			}
 			if (def.contains("GO:")){
 				for (String del:dels){
 					//Could always resolve via PubBean
 					while (def.contains(del+"GO:")){
 						String goRef = def.substring(def.indexOf(del+"GO:"), def.indexOf(del+"GO:")+11).replace(del,"");
 						def = def.replace(goRef, "<a href=\"http://gowiki.tamu.edu/wiki/index.php/Category:" + goRef + "\" title=\"Gene Ontology Term [" + goRef + "]\" target=\"_new\" >" + goRef + "</a>");
 						//LOG.debug("Resolving GO in definition: " + def);
 					}
 				}
 			}
 			if (def.contains("FB")){
 				Integer f = 0;
 				Integer l = 11;
 				for (String del:dels){
 					//flybase reference links handled differently to others.
 					while (def.contains(del+"FBrf")){
 						def = def.replace(del+"FBrf",del+"FlyBase:FBrf").replace("FlyBase:FlyBase:","FlyBase:");
 						//LOG.debug("Resolving (FlyBase:FBrf) definition: " + def);
 					}
 					while (def.contains(del+"FB") && (f < def.length())){
 						f = def.indexOf(del+"FB", f);
 						if (f == -1){
 							f = def.length();
 						}else{
 							l = 11;
 							while (def.substring(f+8,f+l+1).matches("[0-9]+")){
 								l = l + 1;
 								//LOG.debug("Length of ref resolved to: " + l.toString());
 							}
 							String fbRef = def.substring(f, f+l).replace(del,"");
 							//LOG.debug("Found ref: " + fbRef);
 							PubBean bean = new PubBean(fbRef);
 							String linkedRef = "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"" + bean.getTarget() + "\" >" + fbRef + "</a>";
 							def = def.replace(fbRef, linkedRef);
 							//LOG.debug("Resolving (" + fbRef + ") definition: " + def);
 							f = f + linkedRef.length();
 						}
 					}
 				}
 			}
 			for (PubBean bean:pbList){
 				if (def.contains(bean.getShortref())){
 					def = def.replace(bean.getShortref(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"" + bean.getTarget() + "\" >" + bean.getShortref() + "</a>");
 					//LOG.debug("Resolving (short ref: " + bean.getShortref() + " ) definition: " + def);
 				}

 				if (def.contains(bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")")){
 					def = def.replace(bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")", "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"" + bean.getTarget() + "\" >" + bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")" + "</a>");
 					//LOG.debug("Resolving (short ref: " + bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")" + " ) definition: " + def);
 				}
 				if (def.contains("FlyBase:" + bean.getId())){
 					LOG.error("Raw FlyBase ref (" + bean.getId() +  ") found in definition for: " + ob.getId());
 					def = def.replace("FlyBase:" + bean.getId(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"" + bean.getTarget() + "\" >" + bean.getShortref() + "</a>");
 					//LOG.debug("Resolving (FlyBase ref: " + bean.getId() + " ) definition: " + def);
 				}
 			}
 			if (def.contains("PMID:")){
 				String del = "(";
 				//Catches if PubMed ID is in description but not references
 				while (def.contains(del+"PMID:")){
 					String pmRef = def.substring(def.indexOf(del+"PMID:"), def.indexOf(del+"PMID:")+14).replace(del,"");
 					LOG.error("Resolving PMID in definition but not in refernces: " + ob.getId() + "-" + pmRef + " in text: " + def);
 					def = def.replace(pmRef, "<a href=\"http://www.ncbi.nlm.nih.gov/pubmed/" + pmRef + "\" title=\"PubMed reference [" + pmRef + "]\" target=\"_new\" >" + pmRef + "</a>");
 				}
 			}
 			//LOG.debug("Final definition: " + def);
 		}
 		return def;
 	}

 }
