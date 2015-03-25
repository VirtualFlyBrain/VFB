package uk.ac.ed.vfb.web.logs;

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

import uk.ac.ed.vfb.annotation.web.Utils;

public class ontServerController implements Controller {
  private static final Log LOG = LogFactory.getLog(ontServerController.class);
  
  public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
    ModelAndView modelAndView = new ModelAndView("logs/ontServer");
    DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    Date date = new Date();
    //String logfile = "/disk/data/tomcat/fly/logs/catalina." + dateFormat.format(date) + ".log";
    String logfile = "/usr/local/tomcat-6/webapps/WEBAPP_NAME/logs/ontServer_cliped.log";
    List<String> lines = new ArrayList<String>();
    try{
      LOG.info("Loading ontServer log: " + logfile);
      lines = Files.readAllLines(Paths.get(logfile), StandardCharsets.UTF_8);
      if (lines.size() > 500){
        List<String> data = new ArrayList<String>();
        for (Integer i=lines.size()-500; i<lines.size(); i++){
          data.add(lines.get(i));
        }
      lines = data;  
      }
    }catch(Exception ex){
    LOG.error("Error loading log from file: " + logfile);
    ex.printStackTrace();
    }
    modelAndView.addObject("today", dateFormat.format(date));
    modelAndView.addObject("log", lines);
    return modelAndView;
  }
  
}
