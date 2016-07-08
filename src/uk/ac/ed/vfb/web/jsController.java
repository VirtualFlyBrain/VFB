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

import java.util.HashMap;
import java.util.Map;
import java.util.Iterator;
import java.util.Set;

public class jsController implements Controller {
  private static final Log LOG = LogFactory.getLog(jsController.class);

  public ModelAndView handleRequest(HttpServletRequest req, HttpServletResponse res) throws Exception {
    ModelAndView modelAndView = new ModelAndView("do/geppettoJs");
    String xmli = "";
    String[] domains = new String[] {"00002","00003","00004","00005","00006","00007","00008","00009","00010","00011","00012","00013","00014","00015","00016","00017","00018","00019","00020","00022","00023","00024","00025","00026","00027","00028","00029","00030","00031","00032","00033","00034","00035","00036","00037","00038","00039","00040","00049","00050","00051","00052","00053","00054","00055","00056","00057","00058","00059","00060","00061","00062","00063","00064","00065","00066","00067","00069","00070","00071","00072","00073","00074","00075","00076","00077","00078","00079","00080","00081","00082","00083","00084","00085","00086"};
    String[] abrev = new String[] {"AME_R","LO_R","NO","BU_R","PB","LH_R","LAL_R","SAD","CAN_R","AMMC_R","ICL_R","VES_R","IB_R","ATL_R","CRE_R","MB_PED_R","MB_VL_R","MB_ML_R","FLA_R","LOP_R","EB","AL_R","ME_R","FB","SLP_R","SIP_R","SMP_R","AVLP_R","PVLP_R","IVLP_R","PLP_R","AOTU_R","GOR_R","MB_CA_R","SPS_R","IPS_R","SCL_R","EPA_R","GNG","PRW","GA_R","AME_L","LO_L","BU_L","LH_L","LAL_L","CAN_L","AMMC_L","ICL_L","VES_L","IB_L","ATL_L","CRE_L","MB_PED_L","MB_VL_L","MB_ML_L","FLA_L","LOP_L","AL_L","ME_L","SLP_L","SIP_L","SMP_L","AVLP_L","PVLP_L","IVLP_L","PLP_L","AOTU_L","GOR_L","MB_CA_L","SPS_L","IPS_L","SCL_L","EPA_L","GA_L"};
    String domHead = "";
    String domDir = "";
    String camPos = "G.setCameraPosition(149.545,121.667,343.286);";
    String camRot = "G.setCameraRotation(-0.262,0.028,0.065,237.260);";
    String[] diffName;
    String[] diffColour;
    String[] individuals;
    boolean change = false;
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
      
      if (temp.indexOf("VFBt_001") > -1){
        // VFB id for adult brain template:
        ind = "VFB_00017894" + "," + ind;
      }
      
      // Convert domain ids to VFB individual ids:
      HashMap<String,String> domain2id = new HashMap<>();
      domain2id.put("VFBd_00100002", "VFB_00030621"); domain2id.put("VFBd_00100003", "VFB_00030622"); domain2id.put("VFBd_00100004", "VFB_00030609"); domain2id.put("VFBd_00100005", "VFB_00030625"); domain2id.put("VFBd_00100006", "VFB_00030619"); domain2id.put("VFBd_00100007", "FBbt_00007053"); domain2id.put("VFBd_00100008", "VFB_00030605"); domain2id.put("VFBd_00100009", "VFB_00030600"); domain2id.put("VFBd_00100010", "VFB_00030602"); domain2id.put("VFBd_00100011", "VFB_00030613"); domain2id.put("VFBd_00100012", "VFB_00030617"); domain2id.put("VFBd_00100013", "VFB_00030616"); domain2id.put("VFBd_00100014", "VFB_00030631"); domain2id.put("VFBd_00100015", "VFB_00030615"); domain2id.put("VFBd_00100016", "VFB_00030606"); domain2id.put("VFBd_00100017", "FBbt_00007453"); domain2id.put("VFBd_00100018", "FBbt_00015407"); domain2id.put("VFBd_00100019", "FBbt_00007677"); domain2id.put("VFBd_00100020", "VFB_00030620"); domain2id.put("VFBd_00100022", "VFB_00030612"); domain2id.put("VFBd_00100023", "VFB_00030611"); domain2id.put("VFBd_00100024", "VFB_00030629"); domain2id.put("VFBd_00100025", "VFB_00030624"); domain2id.put("VFBd_00100026", "VFB_00030633"); domain2id.put("VFBd_00100027", "VFB_00030623"); domain2id.put("VFBd_00100028", "VFB_00030628"); domain2id.put("VFBd_00100029", "VFB_00030614"); domain2id.put("VFBd_00100030", "VFB_00030608"); domain2id.put("VFBd_00100031", "VFB_00030632"); domain2id.put("VFBd_00100032", "VFB_00030626"); domain2id.put("VFBd_00100033", "VFB_00030630"); domain2id.put("VFBd_00100034", "VFB_00030627"); domain2id.put("VFBd_00100035", "VFB_00030610"); domain2id.put("VFBd_00100036", "FBbt_00007385"); domain2id.put("VFBd_00100037", "VFB_00030601"); domain2id.put("VFBd_00100038", "VFB_00030603"); domain2id.put("VFBd_00100039", "VFB_00030618"); domain2id.put("VFBd_00100040", "VFB_00030599"); domain2id.put("VFBd_00100049", "FBbt_00014013"); domain2id.put("VFBd_00100050", "VFB_00030604"); domain2id.put("VFBd_00100051", "VFB_00030607"); domain2id.put("VFBd_00100101", "FBbt_00110636"); domain2id.put("VFBd_00100102", "FBbt_00110639"); domain2id.put("VFBd_00100103", "FBbt_00003632"); domain2id.put("VFBd_00100104", "FBbt_00003684"); domain2id.put("VFBd_00100105", "FBbt_00040037"); domain2id.put("VFBd_00100106", "FBbt_00040001"); domain2id.put("VFBd_00100107", "FBbt_00003701"); domain2id.put("VFBd_00100108", "FBbt_00045030"); domain2id.put("VFBd_00100109", "FBbt_00045021"); domain2id.put("VFBd_00100110", "FBbt_00040002"); domain2id.put("VFBd_00100111", "FBbt_00045020"); domain2id.put("VFBd_00100112", "FBbt_00013688"); domain2id.put("VFBd_00100113", "FBbt_00040047"); domain2id.put("VFBd_00100114", "FBbt_00045004"); domain2id.put("VFBd_00100115", "FBbt_00007058"); domain2id.put("VFBd_00100116", "FBbt_00040072"); domain2id.put("VFBd_00100117", "FBbt_00040071");
      Set set = domain2id.entrySet();
      Iterator iterator = set.iterator();
      while(iterator.hasNext()) {
         Map.Entry mentry = (Map.Entry)iterator.next();
         ind = ind.replace(String.valueOf(mentry.getKey()),String.valueOf(mentry.getValue()));
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
      diffName = new String[diff.length];
      diffColour = new String[diff.length];
      for (i=0; i<diff.length; i++){
        if (diff[i].indexOf("-")>-1){
           diffName[i] = diff[i].split("-")[0];
           diffColour[i] = diff[i].split("-")[1];
           change = true;
        }
      }
      LOG.info("Loading script for geppetto...");
      if (temp.indexOf("VFBt_001") > -1){
        abrev = new String[]{"Adult Brain"};
        domains = new String[]{"00000"};
        //abrev = new String[] {"AME_R","LO_R","NO","BU_R","PB","LH_R","LAL_R","SAD","CAN_R","AMMC_R","ICL_R","VES_R","IB_R","ATL_R","CRE_R","MB_PED_R","MB_VL_R","MB_ML_R","FLA_R","LOP_R","EB","AL_R","ME_R","FB","SLP_R","SIP_R","SMP_R","AVLP_R","PVLP_R","IVLP_R","PLP_R","AOTU_R","GOR_R","MB_CA_R","SPS_R","IPS_R","SCL_R","EPA_R","GNG","PRW","GA_R","AME_L","LO_L","BU_L","LH_L","LAL_L","CAN_L","AMMC_L","ICL_L","VES_L","IB_L","ATL_L","CRE_L","MB_PED_L","MB_VL_L","MB_ML_L","FLA_L","LOP_L","AL_L","ME_L","SLP_L","SIP_L","SMP_L","AVLP_L","PVLP_L","IVLP_L","PLP_L","AOTU_L","GOR_L","MB_CA_L","SPS_L","IPS_L","SCL_L","EPA_L","GA_L"};
        //domains = new String[] {"00002","00003","00004","00005","00006","00007","00008","00009","00010","00011","00012","00013","00014","00015","00016","00017","00018","00019","00020","00022","00023","00024","00025","00026","00027","00028","00029","00030","00031","00032","00033","00034","00035","00036","00037","00038","00039","00040","00049","00050","00051","00052","00053","00054","00055","00056","00057","00058","00059","00060","00061","00062","00063","00064","00065","00066","00067","00069","00070","00071","00072","00073","00074","00075","00076","00077","00078","00079","00080","00081","00082","00083","00084","00085","00086"};
      }else if (temp.indexOf("VFBt_002") > -1){
        abrev = new String[] {"VFBd_00200001","VFBd_00200002","VFBd_00200003","VFBd_00200004","VFBd_00200005","VFBd_00200006","VFBd_00200007","VFBd_00200008","VFBd_00200009","VFBd_00200010","VFBd_00200011","VFBd_00200012","VFBd_00200013","VFBd_00200014","VFBd_00200015","VFBd_00200016","VFBd_00200017","VFBd_00200018","VFBd_00200019","VFBd_00200020","VFBd_00200021","VFBd_00200022","VFBd_00200023","VFBd_00200024","VFBd_00200025","VFBd_00200026","VFBd_00200027","VFBd_00200028","VFBd_00200029","VFBd_00200030","VFBd_00200031","VFBd_00200032","VFBd_00200033","VFBd_00200034","VFBd_00200035","VFBd_00200036","VFBd_00200037","VFBd_00200038","VFBd_00200039","VFBd_00200040","VFBd_00200041","VFBd_00200042","VFBd_00200043","VFBd_00200044","VFBd_00200045","VFBd_00200046","VFBd_00200047","VFBd_00200048","VFBd_00200049","VFBd_00200301","VFBd_00200302","VFBd_00200303","VFBd_00200304","VFBd_00200305","VFBd_00200306","VFBd_00200307","VFBd_00200308","VFBd_00200309","VFBd_00200310","VFBd_00200311","VFBd_00200312","VFBd_00200313","VFBd_00200314","VFBd_00200315","VFBd_00200316","VFBd_00200317","VFBd_00200318","VFBd_00200319","VFBd_00200320","VFBd_00200321","VFBd_00200322","VFBd_00200323","VFBd_00200324","VFBd_00200325","VFBd_00200326","VFBd_00200327","VFBd_00200328","VFBd_00200329","VFBd_00200330","VFBd_00200331","VFBd_00200332","VFBd_00200333","VFBd_00200334","VFBd_00200335","VFBd_00200336","VFBd_00200337","VFBd_00200338","VFBd_00200339","VFBd_00200340","VFBd_00200341","VFBd_00200342","VFBd_00200343","VFBd_00200344","VFBd_00200345","VFBd_00200346","VFBd_00200347","VFBd_00200348","VFBd_00200349","VFBd_00200350","VFBd_00200351","VFBd_00200352","VFBd_00200353","VFBd_00200354"};
        domains = new String[] {"00001","00002","00003","00004","00005","00006","00007","00008","00009","00010","00011","00012","00013","00014","00015","00016","00017","00018","00019","00020","00021","00022","00023","00024","00025","00026","00027","00028","00029","00030","00031","00032","00033","00034","00035","00036","00037","00038","00039","00040","00041","00042","00043","00044","00045","00046","00047","00048","00049","00301","00302","00303","00304","00305","00306","00307","00308","00309","00310","00311","00312","00313","00314","00315","00316","00317","00318","00319","00320","00321","00322","00323","00324","00325","00326","00327","00328","00329","00330","00331","00332","00333","00334","00335","00336","00337","00338","00339","00340","00341","00342","00343","00344","00345","00346","00347","00348","00349","00350","00351","00352","00353","00354"};
        camPos="G.setCameraPosition(77.952,-45.379,-756.940);";
        camRot="G.setCameraRotation(2.904,-0.158,-0.012,878.060);";
      } else if (temp.indexOf("VFBt_003") > -1) {
        abrev = new String[]{"VFBd_00300001", "VFBd_00300002", "VFBd_00300003", "VFBd_00300004", "VFBd_00300005", "VFBd_00300006", "VFBd_00300007", "VFBd_00300008", "VFBd_00300009", "VFBd_00300010", "VFBd_00300011", "VFBd_00300012", "VFBd_00300013", "VFBd_00300014", "VFBd_00300015", "VFBd_00300016", "VFBd_00300017", "VFBd_00300018", "VFBd_00300019", "VFBd_00300020", "VFBd_00300021", "VFBd_00300022", "VFBd_00300023"};
        domains = new String[]{"00001", "00002", "00003", "00004", "00005", "00006", "00007", "00008", "00009", "00010", "00011", "00012", "00013", "00014", "00015", "00016", "00017", "00018", "00019", "00020", "00021", "00022", "00023"};
        camPos="G.setCameraPosition(164.253,76.925,720.362);";
        camRot="G.setCameraRotation(0.235,0.068,1.608,686.397);";
      }else if (temp.indexOf("VFBt_004") > -1){
        abrev = new String[] {"VFBd_00400001","VFBd_00400002","VFBd_00400003","VFBd_00400004","VFBd_00400005","VFBd_00400006","VFBd_00400007","VFBd_00400008","VFBd_00400009","VFBd_00400010","VFBd_00400011","VFBd_00400012","VFBd_00400013","VFBd_00400014","VFBd_00400015","VFBd_00400016","VFBd_00400017","VFBd_00400018","VFBd_00400019","VFBd_00400020","VFBd_00400024","VFBd_00400025","VFBd_00400026","VFBd_00400027","VFBd_00400028","VFBd_00400029","VFBd_00400030","VFBd_00400040","VFBd_00400041","VFBd_00400042","VFBd_00400043","VFBd_00400044","VFBd_00400045","VFBd_00400046","VFBd_00400047","VFBd_00400048","VFBd_00400049","VFBd_00400050","VFBd_00400051","VFBd_00400053","VFBd_00400054","VFBd_00400055","VFBd_00400056","VFBd_00400099","VFBd_00400241","VFBd_00400242","VFBd_00400243","VFBd_00400244"};
        domains = new String[] {"00001","00002","00003","00004","00005","00006","00007","00008","00009","00010","00011","00012","00013","00014","00015","00016","00017","00018","00019","00020","00024","00025","00026","00027","00028","00029","00030","00040","00041","00042","00043","00044","00045","00046","00047","00048","00049","00050","00051","00053","00054","00055","00056","00099","00241","00242","00243","00244"};
        camPos="G.setCameraPosition(164.253,76.925,720.362);";
        camRot="G.setCameraRotation(0.235,0.068,1.608,686.397);VFBd_00300011.zoomTo();";
      }
      domHead = temp.replace("VFBt_","VFBd_");
      domDir = temp.replace("VFBt_","VFB/t/");
      Integer l = 0;
      LOG.info("Using template: " + temp + ". Individual(s) requested: " + ind);
      if (change){
        modelAndView.addObject("diffName", diffName);
        modelAndView.addObject("diffColour", diffColour);
      }
      modelAndView.addObject("domDir", domDir);
      modelAndView.addObject("domHead", domHead);
      modelAndView.addObject("abrev", abrev);
      modelAndView.addObject("domains", domains);
      modelAndView.addObject("individuals", individuals);
      modelAndView.addObject("campos", camPos);
      modelAndView.addObject("camrot", camRot);
    }catch(Exception ex){
      LOG.error("Error creating script for geppetto:");
      ex.printStackTrace();
    }
    LOG.info("returning xml: " + xmli);
    return modelAndView;
  }
}
