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
    ModelAndView modelAndView = new ModelAndView("do/geppettoJs");
    String xmli = "";
    String[] domains = new String[] {"00002","00003","00004","00005","00006","00007","00008","00009","00010","00011","00012","00013","00014","00015","00016","00017","00018","00019","00020","00022","00023","00024","00025","00026","00027","00028","00029","00030","00031","00032","00033","00034","00035","00036","00037","00038","00039","00040","00049","00050","00051","00052","00053","00054","00055","00056","00057","00058","00059","00060","00061","00062","00063","00064","00065","00066","00067","00069","00070","00071","00072","00073","00074","00075","00076","00077","00078","00079","00080","00081","00082","00083","00084","00085","00086"};
    String[] abrev = new String[] {"AME_R","LO_R","NO","BU_R","PB","LH_R","LAL_R","SAD","CAN_R","AMMC_R","ICL_R","VES_R","IB_R","ATL_R","CRE_R","MB_PED_R","MB_VL_R","MB_ML_R","FLA_R","LOP_R","EB","AL_R","ME_R","FB","SLP_R","SIP_R","SMP_R","AVLP_R","PVLP_R","IVLP_R","PLP_R","AOTU_R","GOR_R","MB_CA_R","SPS_R","IPS_R","SCL_R","EPA_R","GNG","PRW","GA_R","AME_L","LO_L","BU_L","LH_L","LAL_L","CAN_L","AMMC_L","ICL_L","VES_L","IB_L","ATL_L","CRE_L","MB_PED_L","MB_VL_L","MB_ML_L","FLA_L","LOP_L","AL_L","ME_L","SLP_L","SIP_L","SMP_L","AVLP_L","PVLP_L","IVLP_L","PLP_L","AOTU_L","GOR_L","MB_CA_L","SPS_L","IPS_L","SCL_L","EPA_L","GA_L"};
    String domHead = "";
    String domDir = "";
    String[] diffName;
    String[] diffColour;
    String[] individuals;
    try{
      String temp = req.getParameter("t");
      String ind = req.getParameter("i");
      String diffs = req.getParameter("d");
      if (ind == null){
        ind = "";
      }
      if (diffs == null){
        diffs = "";
      }
      if (temp == null){
        temp = "VFBt_001";
      }
      if (ind.indexOf(",")>-1){
        individuals = ind.split(",");
      }else{
        individuals = new String[] {ind};
      }
      String[] diff;
      if (diffs.indexOf(",")>-1){
        diff = diffs.split(",");
      }else{
        diff = new String[] {diffs};
      }
      int i;
      diffName = diff;
      diffColour = diff;
      for (i=0; i<diff.length; i++){
        if (diff[i].indexOf("-")>-1){
           diffName[i] = diff[i].split("-")[0];
           diffColour[i] = diff[i].split("-")[1];
        }
      }
      LOG.info("Loading script for geppetto...");
      if (temp.indexOf("VFBt_001") > -1){
        abrev = new String[] {"AME_R","LO_R","NO","BU_R","PB","LH_R","LAL_R","SAD","CAN_R","AMMC_R","ICL_R","VES_R","IB_R","ATL_R","CRE_R","MB_PED_R","MB_VL_R","MB_ML_R","FLA_R","LOP_R","EB","AL_R","ME_R","FB","SLP_R","SIP_R","SMP_R","AVLP_R","PVLP_R","IVLP_R","PLP_R","AOTU_R","GOR_R","MB_CA_R","SPS_R","IPS_R","SCL_R","EPA_R","GNG","PRW","GA_R","AME_L","LO_L","BU_L","LH_L","LAL_L","CAN_L","AMMC_L","ICL_L","VES_L","IB_L","ATL_L","CRE_L","MB_PED_L","MB_VL_L","MB_ML_L","FLA_L","LOP_L","AL_L","ME_L","SLP_L","SIP_L","SMP_L","AVLP_L","PVLP_L","IVLP_L","PLP_L","AOTU_L","GOR_L","MB_CA_L","SPS_L","IPS_L","SCL_L","EPA_L","GA_L"};
        domains = new String[] {"00002","00003","00004","00005","00006","00007","00008","00009","00010","00011","00012","00013","00014","00015","00016","00017","00018","00019","00020","00022","00023","00024","00025","00026","00027","00028","00029","00030","00031","00032","00033","00034","00035","00036","00037","00038","00039","00040","00049","00050","00051","00052","00053","00054","00055","00056","00057","00058","00059","00060","00061","00062","00063","00064","00065","00066","00067","00069","00070","00071","00072","00073","00074","00075","00076","00077","00078","00079","00080","00081","00082","00083","00084","00085","00086"};
      }
      domHead = temp.replace("VFBt_","VFBd_");
      domDir = temp.replace("VFBt_","VFB/t/");
      Integer l = 0;
      LOG.info("Using template: " + temp + ". Individual(s) requested: " + ind);

    }catch(Exception ex){
      LOG.error("Error creating xml for geppetto:");
      ex.printStackTrace();
    }
    modelAndView.addObject("domDir", domDir);
    modelAndView.addObject("diffName", diffName);
    modelAndView.addObject("diffColour", diffColour);
    modelAndView.addObject("domHead", domHead);
    modelAndView.addObject("abrev", abrev);
    modelAndView.addObject("domains", domains);
    modelAndView.addObject("individuals", individuals);
    LOG.info("returning xml: " + xmli);
    return modelAndView;
  }
}
