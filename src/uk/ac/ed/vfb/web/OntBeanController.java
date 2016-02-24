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
import uk.ac.ed.vfb.model.OntBeanIndividual;
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
	List<String> dels = Arrays.asList("(", "[", " ");

	public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
		ModelAndView modelAndView = new ModelAndView("do/ontBean");
		OntBean ob = null;
		String id = "";
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
			id = OntBean.idAsOWL(id);
			ob = (OntBeanIndividual)this.obm.getBeanForId(id);
			if (ob == null){
				this.obm.getBeanForId("VFB_00000001");
			}
			modelAndView.addObject("beanType", "ind");
		}else{
			id = OntBean.idAsOBO(id);
			LOG.debug("Calling for: " + id);
			try{
				ob = this.obm.getBeanForId(id);
			} catch (Exception e) {
				LOG.error(e);
			}
			LOG.debug("Returned: " + ob);
			if (ob == null){
				this.obm.getBeanForId("FBbt:00007060");
			}
			modelAndView.addObject("beanType", "ont");
		}
		//LOG.debug(ob);
		//LOG.debug("For Id: " + ob.getId());
		List<PubBean> pbList = pbm.getBeanListByRefIds(ob.getRefs());
		//LOG.debug("Found publications:" + pbList.size());
		List<String> synonyms = ob.getSynonyms();
		List<String> cleanedSyn = new ArrayList<String>();
		if (synonyms != null && synonyms.size() > 0){
			for (String syn:synonyms){
				if (syn.contains("(") && !syn.contains("(<")){
					for (PubBean bean:pbList){
						if (syn.contains(bean.getId())){
							if (syn.contains("FlyBase:FBrf")){
								syn = syn.replace("FlyBase:"+ bean.getId(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"" + bean.getTarget() + "\" >" + bean.getShortref() + "</a>");
							}else{
								syn = syn.replace(bean.getId(), "<a href=\"" + bean.getWebLink() + "\" title=\"" + bean.getMiniref() + "\" target=\"" + bean.getTarget() + "\" >" + bean.getShortref() + "</a>");
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
		Integer c = 0;
		if (def != null && (def.contains("(") || def.contains("doi:")) && !def.contains("<")){
			//LOG.debug("Starting with definition: " + def);
			c=0;
			while (def.contains("[FLP]") && c < 10){
				c++;
				def = def.replace("[FLP]","<sup>FLP</sup>");
				//LOG.debug("Resolving [FLP] definition: " + def);
			}
			c=0;
			while (def.contains("at al.") && c < 10){
				c++;
				def = def.replace("at al.","et al.");
				LOG.error("Correcting (a)t al. typo in " + ob.getId() + " in the text definition");
				//LOG.debug("Resolving (at al) definition: " + def);
			}
			c=0;
			while (def.contains("et al,") && c < 10){
				c++;
				def = def.replace("et al,","et al.,");
				LOG.error("Correcting et al(.) typo in " + ob.getId() + " in the text definition");
				//LOG.debug("Resolving (et al[.]) definition: " + def);
			}
			c=0;
			while (def.contains(",20") && c < 10){
				c++;
				def = def.replace(",20",", 20");
				LOG.error("Correcting spacing between author and year (20XX) typo in " + ob.getId() + " in the text definition");
				//LOG.debug("Resolving (year spacing 20xx) definition: " + def);
			}
			c=0;
			while (def.contains(",19") && c < 10){
				c++;
				def = def.replace(",19",", 19");
				LOG.error("Correcting spacing between author and year (19XX) typo in " + ob.getId() + " in the text definition");
				//LOG.debug("Resolving (year spacing 19xx) definition: " + def);
			}
			if (def.contains("GO:")){
				for (String del:dels){
					//Could always resolve via PubBean
					c=0;
					while (def.contains(del+"GO:") && c < 10){
						c++;
						String goRef = def.substring(def.indexOf(del+"GO:"), def.indexOf(del+"GO:")+11).replace(del,"");
						//LOG.debug("Resolving " + goRef + " in definition: " + def);
						def = def.replace(del+goRef, del+"<a href=\"http://gowiki.tamu.edu/wiki/index.php/Category:" + goRef + "\" title=\"Gene Ontology Term -" + goRef + "\" target=\"_new\" >" + goRef + "</a>");
					}
				}
			}
			if (def.contains("FB")){
				Integer f = 0;
				Integer l = 11;
				for (String del:dels){
					//flybase reference links handled differently to others.
					c=0;
					while (def.contains(del+"FBrf") && c < 10){
						def = def.replace(del+"FBrf",del+"FlyBase:FBrf").replace("FlyBase:FlyBase:","FlyBase:");
						//LOG.debug("Resolving (FlyBase:FBrf) definition: " + def);
						c++;
					}
					c=0;
					while (def.contains(del+"FB") && (f < def.length()) && c < 50){
						c++;
						f = def.indexOf(del+"FB", f);
						if (f == -1){
							f = def.length();
						}else{
							l = 11;
							while (def.substring(f+8,f+l+1).matches("[0-9]+") && c < 50){
								c++;
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
				c=0;
				while (def.contains(del+"PMID:") && c < 10){
					c++;
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
