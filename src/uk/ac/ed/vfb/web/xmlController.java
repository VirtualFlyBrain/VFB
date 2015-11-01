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
    try{
      String temp = req.getParameter("t");
      String ind = req.getParameter("i");
      String[] individuals;
      String[] domains;
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
    modelAndView.addObject("indxml", xmli);
    LOG.info("returning xml: " + xmli);
    return modelAndView;
  }
}
