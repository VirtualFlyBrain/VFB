package uk.ac.ed.vfb.web;

import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import java.util.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

import java.nio.charset.StandardCharsets;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class xmlController implements Controller {
  private static final Log LOG = LogFactory.getLog(xmlController.class);

  public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
    ModelAndView modelAndView = new ModelAndView("do/geppettoXml");
    String xmli = "";
    String[] domains;
    String domHead = "";
    String domDir = "";
    try{
      String temp = req.getParameter("t");
      String ind = req.getParameter("i");
      String[] individuals;
      if (ind == null){
        ind = "";
      }
      if (temp == null){
        temp = "VFBt_001";
      }
      if (ind.indexOf(",")>-1){
        individuals = ind.split(",");
      }else{
        individuals = new String[] {ind};
      }
      LOG.info("Loading xml for geppetto...");
      if (temp.indexOf("VFBt_001") > -1){
        domains = new String[] {"00002","00003","00004","00005","00006","00007","00008","00009","00010","00011","00012","00013","00014","00015","00016","00017","00018","00019","00020","00022","00023","00024","00025","00026","00027","00028","00029","00030","00031","00032","00033","00034","00035","00036","00037","00038","00039","00040","00049","00050","00051","00052","00053","00054","00055","00056","00057","00058","00059","00060","00061","00062","00063","00064","00065","00066","00067","00069","00070","00071","00072","00073","00074","00075","00076","00077","00078","00079","00080","00081","00082","00083","00084","00085","00086"};
      }
      domHead = temp.replace("VFBt_","VFBd_");
      domDir = temp.replace("VFBt_","VFB/t/");
      Integer l = 0;
      LOG.info("Using template: " + temp + ". Individual(s) requested: " + ind);
      for (Integer i=0; i<individuals.length; i++){
        l = individuals[i].length();
        if (individuals[i].indexOf("VFB_")>-1){
          xmli += "            <tns:entity>\n                        <tns:id>" + individuals[i] + "</tns:id>\n                        <tns:aspect>\n                            <tns:id>morphology</tns:id>\n                            <tns:model>\n                                <tns:modelInterpreterId>swcModelInterpreter</tns:modelInterpreterId>\n                                <tns:modelURL>SERVER_ROOT/appdata/vfb/VFB/i/" + individuals[i].substring(l-8,l-4) + "/" + individuals[i].substring(l-4,l) + "/volume.swc</tns:modelURL>\n                            </tns:model>\n                        </tns:aspect>\n                    </tns:entity>";
        }
      }
    }catch(Exception ex){
      LOG.error("Error creating xml for geppetto:");
      ex.printStackTrace();
    }
    modelAndView.addObject("domDir", domDir);
    modelAndView.addObject("domHead", domHead);
    modelAndView.addObject("domains", domains);
    modelAndView.addObject("indxml", xmli);
    LOG.info("returning xml: " + xmli);
    return modelAndView;
  }
}
