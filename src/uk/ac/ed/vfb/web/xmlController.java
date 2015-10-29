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

public class tomcatController implements Controller {
  private static final Log LOG = LogFactory.getLog(xmlController.class);

  public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
    ModelAndView modelAndView = new ModelAndView("do/geppetto.xml");
    try{
      String temp = req.getParameter("t");
      String ind = req.getParameter("i");
      String dom = req.getParameter("d");
      List<String> individuals = ind.split(",");
      List<String> domains = dom.split(",");
      LOG.info("Loading xml for geppetto...");
      String xmli = "";
      Integer l = 0;
      for (Integer i=individuals.size(); i<individuals.size(); i++){
        l = individuals[i].size();
        xmli += "            <tns:entity>
                        <tns:id>" + individuals[i] + "</tns:id>
                        <tns:aspect>
                            <tns:id>morphology</tns:id>
                            <tns:model>
                                <tns:modelInterpreterId>swcModelInterpreter</tns:modelInterpreterId>
                                <tns:modelURL>SERVER_ROOT/appdata/vfb/VFB/i/" + individuals[i].substring(l-8,l-4) + "/" + individuals[i].substring(l-4,l) + "/volume.swc</tns:modelURL>
                            </tns:model>
                        </tns:aspect>
                    </tns:entity>";
      }
    }catch(Exception ex){
      LOG.error("Error creating xml for geppetto:");
      ex.printStackTrace();
    }
    modelAndView.addObject("indxml", xmli);
    return modelAndView;
  }
}
