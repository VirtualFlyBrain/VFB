package uk.ac.ed.vfb.web;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.model.PubBean;
import uk.ac.ed.vfb.service.OntBeanManager;
import uk.ac.ed.vfb.service.PubBeanManager;

/**
 * Controller providing the front-end for the /do/ont_bean.html view.
 * @author nmilyaev
 */

public class OntBeanController implements Controller {
	private OntBeanManager obm;
	private PubBeanManager pbm;
	private static final Log LOG = LogFactory.getLog(OntBeanController.class);

	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
		ModelAndView modelAndView = new ModelAndView("do/ontBean");
		String id = OntBean.idAsOBO(req.getParameter("fbId"));
		OntBean ob = this.obm.getBeanForId(id);		
		//LOG.debug("For Id: " + ob.getId().toString());
		//List<PubBean> pbList = pbm.getBeanListById(ob.getId());
		List<PubBean> pbList = pbm.getBeanListByRefIds(ob.getRefs());
		//LOG.debug("Found publications:" + pbList.size());
		List<String> synonyms = ob.getSynonyms();
		List<String> cleanedSyn = new ArrayList<String>();
		if (synonyms != null && synonyms.size() > 0){
			for (String syn:synonyms){
				if (syn.contains("(") && !syn.contains("<")){
					for (PubBean bean:pbList){
						if (syn.contains(bean.getId())){
							if (syn.contains("FlyBase:FBrf")){
								syn = syn.replace("FlyBase:"+ bean.getId(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"_new\" >" + bean.getShortref() + "</a>");
							}else{
								syn = syn.replace(bean.getId(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"_new\" >" + bean.getShortref() + "</a>");	
							}
						}
					}
				}
				cleanedSyn.add(syn);
			}
			ob.setSynonyms(cleanedSyn);
		}
		// resolve any refs in definition text
		ob.setDef(resolveRefs(ob.getDef(), ob, pbList));
		// resolve any refs in comment text
		ob.setComment(resolveRefs(ob.getComment(), ob, pbList));
		modelAndView.addObject("ontBean", ob);
		modelAndView.addObject("refs", pbList);
		return modelAndView;
	}

	public void setObm(OntBeanManager manager) {
		this.obm = manager;
	}

	public void setPbm(PubBeanManager pbm) {
		this.pbm = pbm;
	}
	
	public String resolveRefs(String def, OntBean ob, List<PubBean> pbList){
		if (def != null && def.contains("(") && !def.contains("<")){
			LOG.debug("Starting with definition: " + def);
			while (def.contains("at al.")){
				def = def.replace("at al.","et al.");
				LOG.error("Correcting (a)t al. typo in " + ob.getId() + " in the text definition");
				LOG.debug("Resolving (at al) definition: " + def);
			}
			while (def.contains("et al,")){
				def = def.replace("et al,","et al.,");
				LOG.error("Correcting et al(.) typo in " + ob.getId() + " in the text definition");
				LOG.debug("Resolving (et al[.]) definition: " + def);
			}
			while (def.contains(",20")){
				def = def.replace(",20",", 20");
				LOG.error("Correcting spacing between author and year (20XX) typo in " + ob.getId() + " in the text definition");
				LOG.debug("Resolving (year spacing 20xx) definition: " + def);
			}
			while (def.contains(",19")){
				def = def.replace(",19",", 19");
				LOG.error("Correcting spacing between author and year (19XX) typo in " + ob.getId() + " in the text definition");
				LOG.debug("Resolving (year spacing 19xx) definition: " + def);
			}
			while (def.contains("(FBrf")){
				def = def.replace("(FBrf","(FlyBase:FBrf").replace("FlyBase:FlyBase:","FlyBase:");
				LOG.debug("Resolving (FlyBase:FBrf with bracket) definition: " + def);
			}
			while (def.contains(" FBrf")){
				def = def.replace(" FBrf"," FlyBase:FBrf").replace("FlyBase:FlyBase:","FlyBase:");
				LOG.debug("Resolving (FlyBase:FBrf with space) definition: " + def);
			}
			while (def.contains("(FBrf")){
				def = def.replace("(FBrf","(FlyBase:FBrf").replace("FlyBase:FlyBase:","FlyBase:");
				LOG.debug("Resolving (FlyBase:FBrf) definition: " + def);
			}
			while (def.contains("(GO:")){
				String goRef = def.substring(def.indexOf("(GO:"), def.indexOf(")", def.indexOf("(GO:"))).replace("(","").replace(")","");
				def = def.replace(goRef, "<a href=\"http://gowiki.tamu.edu/wiki/index.php/Category:" + goRef + "\" title=\"Gene Ontology Term\" target=\"_new\" >" + goRef + "</a>");
				LOG.debug("Resolving GO in definition: " + def);
			}
			while (def.contains("(FBbt:")){
				String fbRef =  def.substring(def.indexOf("(FBbt:"), def.indexOf(")", def.indexOf("(FBbt:"))).replace("(","").replace(")","");
				def = def.replace(fbRef, "<a href=\"/site/tools/anatomy_finder/index.htm?id=" + fbRef + "\" title=\"View details and run queries in anatomy finder\" target=\"_new\" >" + fbRef + "</a>");
				LOG.debug("Resolving (FlyBase:FBbt) definition: " + def);
			}
			while (def.contains("(FBal")){
				String fbRef =  def.substring(def.indexOf("(FBal"), def.indexOf(")", def.indexOf("(FBal"))).replace("(","").replace(")","");
				def = def.replace(fbRef, "<a href=\"http://flybase.org/reports/" + fbRef + ".html\" title=\"See Allele details in FlyBase\" target=\"_new\" >" + fbRef + "</a>");
				LOG.debug("Resolving (FlyBase:FBal) definition: " + def);
			}
			for (PubBean bean:pbList){
				if (def.contains(bean.getShortref())){
					def = def.replace(bean.getShortref(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"_new\" >" + bean.getShortref() + "</a>");	
					LOG.debug("Resolving (short ref: " + bean.getShortref() + " ) definition: " + def);
				}
				
				if (def.contains(bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")")){
					def = def.replace(bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")", "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"_new\" >" + bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")" + "</a>");	
					LOG.debug("Resolving (short ref: " + bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")" + " ) definition: " + def);
				}
				if (def.contains("FlyBase:" + bean.getId())){
					LOG.error("Raw FlyBase ref (" + bean.getId() +  ") found in definition for: " + ob.getId());
					def = def.replace("FlyBase:" + bean.getId(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"_new\" >" + bean.getShortref() + "</a>");	
					LOG.debug("Resolving (FlyBase ref: " + bean.getId() + " ) definition: " + def);
				}
			}
			LOG.debug("Final definition: " + def);
			
		}
		return def;
	}
	
}
