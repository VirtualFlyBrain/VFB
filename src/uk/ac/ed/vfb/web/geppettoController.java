package uk.ac.ed.vfb.web;

import java.util.*;
import java.lang.*;

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

public class geppettoController implements Controller {
  private static final Log LOG = LogFactory.getLog(geppettoController.class);

  public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
    ModelAndView modelAndView = new ModelAndView("do/geppettoJson");
    String jsoni = "";
    try{
      String temp = req.getParameter("t");
      String items = req.getParameter("i");
      String diffs = req.getParameter("d");
      String cur = new Long((new Date().getTime())).toString();
      LOG.info("Loading json for geppetto...");
      LOG.info("Using template: " + temp + ". Item(s) requested: " + items + ". Difference(s) requested: " + diffs );
      modelAndView.addObject("itemsjson", items);
      modelAndView.addObject("diffsjson", diffs);
      modelAndView.addObject("tempjson", temp);
      modelAndView.addObject("time", cur);
    }catch(Exception ex){
      LOG.error("Error creating json for geppetto:");
      ex.printStackTrace();
    }

    return modelAndView;
  }
}
