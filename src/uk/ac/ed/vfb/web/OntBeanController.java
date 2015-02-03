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
		String def = ob.getDef();
		if (def != null && def.contains("(") && !def.contains("<")){
			if (def.contains("at al.")){
				def = def.replace("at al.","et al.");
				LOG.error("Correcting (a)t al. typo in " + ob.getId() + " in the text definition");
			}
			if (def.contains("et al,")){
				def = def.replace("et al,","et al.,");
				LOG.error("Correcting et al(.) typo in " + ob.getId() + " in the text definition");
			}
			if (def.contains(",20")){
				def = def.replace(",20",", 20");
				LOG.error("Correcting spacing between author and year (20XX) typo in " + ob.getId() + " in the text definition");
			}
			if (def.contains(",19")){
				def = def.replace(",19",", 19");
				LOG.error("Correcting spacing between author and year (19XX) typo in " + ob.getId() + " in the text definition");
			}
			if (def.contains("FlyBase:FBrf")){
				def = def.replace("FlyBase:FBrf","FBrf");
			}
			for (PubBean bean:pbList){
				if (def.contains(bean.getShortref())){
					def = def.replace(bean.getShortref(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"_new\" >" + bean.getShortref() + "</a>");	
				}
				if (def.contains(bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")")){
					def = def.replace(bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")", "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"_new\" >" + bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")" + "</a>");	
				}
				if (def.contains("(GO:")){
					String goRef = def.substring(def.indexOf("(GO:"), def.indexOf(")", def.indexOf("(GO:"))).replace("(","").replace(")","");
					def = def.replace(goRef, "<a href=\"http://gowiki.tamu.edu/wiki/index.php/Category:" + goRef + "\" title=\"Gene Ontology Term\" target=\"_new\" >" + goRef + "</a>");
				}
				if (def.contains(bean.getId())){
					LOG.error("Raw FlyBase ref (" + bean.getId() +  ") found in definition for: " + ob.getId());
					def = def.replace(bean.getId(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"_new\" >" + bean.getShortref() + "</a>");	
				}
			}
			ob.setDef(def);
		}
		// resolve any refs in comment text
		String com = ob.getComment();
		if (com != null && com.contains("(") && !com.contains("<")){
			if (com.contains("at al.")){
				com = com.replace("at al.","et al.");
				LOG.error("Correcting (a)t al. typo in " + ob.getId() + " in the text comment");
			}
			if (com.contains("et al,")){
				com = com.replace("et al,","et al.,");
				LOG.error("Correcting et al(.) typo in " + ob.getId() + " in the text comment");
			}
			if (com.contains(",20")){
				com = com.replace(",20",", 20");
				LOG.error("Correcting spacing between author and year (20XX) typo in " + ob.getId() + " in the text comment");
			}
			if (com.contains(",19")){
				com = com.replace(",19",", 19");
				LOG.error("Correcting spacing between author and year (19XX) typo in " + ob.getId() + " in the text comment");
			}
			if (com.contains("FlyBase:FBrf")){
				com = com.replace("FlyBase:FBrf","FBrf");
			}
			for (PubBean bean:pbList){
				if (com.contains(bean.getShortref())){
					com = com.replace(bean.getShortref(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"_new\" >" + bean.getShortref() + "</a>");	
				}
				if (com.contains(bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")")){
					com = com.replace(bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")", "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"_new\" >" + bean.getAuthors().trim() + " (" + bean.getYear().trim() + ")" + "</a>");	
				}
				if (com.contains("(GO:")){
					String goRef = com.substring(com.indexOf("(GO:"), com.indexOf(")", com.indexOf("(GO:"))).replace("(","").replace(")","");
					com = com.replace(goRef, "<a href=\"http://gowiki.tamu.edu/wiki/index.php/Category:" + goRef + "\" title=\"Gene Ontology Term\" target=\"_new\" >" + goRef + "</a>");
				}
				if (com.contains(bean.getId())){
					LOG.error("Raw FlyBase ref (" + bean.getId() +  ") found in comments for: " + ob.getId());
					com = com.replace(bean.getId(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"_new\" >" + bean.getShortref() + "</a>");	
				}
			}
			ob.setComment(com);
		}
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
	
}
