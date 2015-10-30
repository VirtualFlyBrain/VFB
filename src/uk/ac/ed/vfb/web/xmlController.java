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
    ModelAndView modelAndView = new ModelAndView("do/geppetto");
    String xmli = "";
    try{
      String temp = req.getParameter("t");
      String ind = req.getParameter("i");
      String dom = req.getParameter("d");
      if (ind.indexOf(",")>-1){
        String[] individuals = ind.split(",");
      }
      if (dom.indexOf(",")>-1){
        String[] domains = dom.split(",");
      }
      LOG.info("Loading xml for geppetto...");
      Integer l = 0;
      for (Integer i=individuals.length; i<individuals.length; i++){
        l = individuals[i].length();
        xmli += "            <tns:entity>\n                        <tns:id>" + individuals[i] + "</tns:id>\n                        <tns:aspect>\n                            <tns:id>morphology</tns:id>\n                            <tns:model>\n                                <tns:modelInterpreterId>swcModelInterpreter</tns:modelInterpreterId>\n                                <tns:modelURL>SERVER_ROOT/appdata/vfb/VFB/i/" + individuals[i].substring(l-8,l-4) + "/" + individuals[i].substring(l-4,l) + "/volume.swc</tns:modelURL>\n                            </tns:model>\n                        </tns:aspect>\n                    </tns:entity>";
      }
    }catch(Exception ex){
      LOG.error("Error creating xml for geppetto:");
      ex.printStackTrace();
    }
    modelAndView.addObject("indxml", xmli);
    return modelAndView;
  }
}
