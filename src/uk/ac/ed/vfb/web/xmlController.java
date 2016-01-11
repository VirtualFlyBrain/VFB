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
    String[] domains = new String[] {"00002","00003","00004","00005","00006","00007","00008","00009","00010","00011","00012","00013","00014","00015","00016","00017","00018","00019","00020","00022","00023","00024","00025","00026","00027","00028","00029","00030","00031","00032","00033","00034","00035","00036","00037","00038","00039","00040","00049","00050","00051","00052","00053","00054","00055","00056","00057","00058","00059","00060","00061","00062","00063","00064","00065","00066","00067","00069","00070","00071","00072","00073","00074","00075","00076","00077","00078","00079","00080","00081","00082","00083","00084","00085","00086"};
    String[] abrev = new String[] {"AME_R","LO_R","NO","BU_R","PB","LH_R","LAL_R","SAD","CAN_R","AMMC_R","ICL_R","VES_R","IB_R","ATL_R","CRE_R","MB_PED_R","MB_VL_R","MB_ML_R","FLA_R","LOP_R","EB","AL_R","ME_R","FB","SLP_R","SIP_R","SMP_R","AVLP_R","PVLP_R","IVLP_R","PLP_R","AOTU_R","GOR_R","MB_CA_R","SPS_R","IPS_R","SCL_R","EPA_R","GNG","PRW","GA_R","AME_L","LO_L","BU_L","LH_L","LAL_L","CAN_L","AMMC_L","ICL_L","VES_L","IB_L","ATL_L","CRE_L","MB_PED_L","MB_VL_L","MB_ML_L","FLA_L","LOP_L","AL_L","ME_L","SLP_L","SIP_L","SMP_L","AVLP_L","PVLP_L","IVLP_L","PLP_L","AOTU_L","GOR_L","MB_CA_L","SPS_L","IPS_L","SCL_L","EPA_L","GA_L"};
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
        abrev = new String[] {"AME_R","LO_R","NO","BU_R","PB","LH_R","LAL_R","SAD","CAN_R","AMMC_R","ICL_R","VES_R","IB_R","ATL_R","CRE_R","MB_PED_R","MB_VL_R","MB_ML_R","FLA_R","LOP_R","EB","AL_R","ME_R","FB","SLP_R","SIP_R","SMP_R","AVLP_R","PVLP_R","IVLP_R","PLP_R","AOTU_R","GOR_R","MB_CA_R","SPS_R","IPS_R","SCL_R","EPA_R","GNG","PRW","GA_R","AME_L","LO_L","BU_L","LH_L","LAL_L","CAN_L","AMMC_L","ICL_L","VES_L","IB_L","ATL_L","CRE_L","MB_PED_L","MB_VL_L","MB_ML_L","FLA_L","LOP_L","AL_L","ME_L","SLP_L","SIP_L","SMP_L","AVLP_L","PVLP_L","IVLP_L","PLP_L","AOTU_L","GOR_L","MB_CA_L","SPS_L","IPS_L","SCL_L","EPA_L","GA_L"};
        domains = new String[] {"00002","00003","00004","00005","00006","00007","00008","00009","00010","00011","00012","00013","00014","00015","00016","00017","00018","00019","00020","00022","00023","00024","00025","00026","00027","00028","00029","00030","00031","00032","00033","00034","00035","00036","00037","00038","00039","00040","00049","00050","00051","00052","00053","00054","00055","00056","00057","00058","00059","00060","00061","00062","00063","00064","00065","00066","00067","00069","00070","00071","00072","00073","00074","00075","00076","00077","00078","00079","00080","00081","00082","00083","00084","00085","00086"};
      }else if (temp.indexOf("VFBt_002") > -1){
        abrev = new String[] {"VFBd_00200001","VFBd_00200002","VFBd_00200003","VFBd_00200004","VFBd_00200005","VFBd_00200006","VFBd_00200007","VFBd_00200008","VFBd_00200009","VFBd_00200010","VFBd_00200011","VFBd_00200012","VFBd_00200013","VFBd_00200014","VFBd_00200015","VFBd_00200016","VFBd_00200017","VFBd_00200018","VFBd_00200019","VFBd_00200020","VFBd_00200021","VFBd_00200022","VFBd_00200023","VFBd_00200024","VFBd_00200025","VFBd_00200026","VFBd_00200027","VFBd_00200028","VFBd_00200029","VFBd_00200030","VFBd_00200031","VFBd_00200032","VFBd_00200033","VFBd_00200034","VFBd_00200035","VFBd_00200036","VFBd_00200037","VFBd_00200038","VFBd_00200039","VFBd_00200040","VFBd_00200041","VFBd_00200042","VFBd_00200043","VFBd_00200044","VFBd_00200045","VFBd_00200046","VFBd_00200047","VFBd_00200048","VFBd_00200049","VFBd_00200301","VFBd_00200302","VFBd_00200303","VFBd_00200304","VFBd_00200305","VFBd_00200306","VFBd_00200307","VFBd_00200308","VFBd_00200309","VFBd_00200310","VFBd_00200311","VFBd_00200312","VFBd_00200313","VFBd_00200314","VFBd_00200315","VFBd_00200316","VFBd_00200317","VFBd_00200318","VFBd_00200319","VFBd_00200320","VFBd_00200321","VFBd_00200322","VFBd_00200323","VFBd_00200324","VFBd_00200325","VFBd_00200326","VFBd_00200327","VFBd_00200328","VFBd_00200329","VFBd_00200330","VFBd_00200331","VFBd_00200332","VFBd_00200333","VFBd_00200334","VFBd_00200335","VFBd_00200336","VFBd_00200337","VFBd_00200338","VFBd_00200339","VFBd_00200340","VFBd_00200341","VFBd_00200342","VFBd_00200343","VFBd_00200344","VFBd_00200345","VFBd_00200346","VFBd_00200347","VFBd_00200348","VFBd_00200349","VFBd_00200350","VFBd_00200351","VFBd_00200352","VFBd_00200353","VFBd_00200354"};
        domains = new String[] {"0001","0002","0003","0004","0005","0006","0007","0008","0009","0010","0011","0012","0013","0014","0015","0016","0017","0018","0019","0020","0021","0022","0023","0024","0025","0026","0027","0028","0029","0030","0031","0032","0033","0034","0035","0036","0037","0038","0039","0040","0041","0042","0043","0044","0045","0046","0047","0048","0049","0301","0302","0303","0304","0305","0306","0307","0308","0309","0310","0311","0312","0313","0314","0315","0316","0317","0318","0319","0320","0321","0322","0323","0324","0325","0326","0327","0328","0329","0330","0331","0332","0333","0334","0335","0336","0337","0338","0339","0340","0341","0342","0343","0344","0345","0346","0347","0348","0349","0350","0351","0352","0353","0354"};
      }else if (temp.indexOf("VFBt_004") > -1){
        abrev = new String[] {"VFBd_0040001","VFBd_0040002","VFBd_0040003","VFBd_0040004","VFBd_0040005","VFBd_0040006","VFBd_0040007","VFBd_0040008","VFBd_0040009","VFBd_0040010","VFBd_0040011","VFBd_0040012","VFBd_0040013","VFBd_0040014","VFBd_0040015","VFBd_0040016","VFBd_0040017","VFBd_0040018","VFBd_0040019","VFBd_0040020","VFBd_0040024","VFBd_0040025","VFBd_0040026","VFBd_0040027","VFBd_0040028","VFBd_0040029","VFBd_0040030","VFBd_0040040","VFBd_0040041","VFBd_0040042","VFBd_0040043","VFBd_0040044","VFBd_0040045","VFBd_0040046","VFBd_0040047","VFBd_0040048","VFBd_0040049","VFBd_0040050","VFBd_0040051","VFBd_0040053","VFBd_0040054","VFBd_0040055","VFBd_0040056","VFBd_0040099","VFBd_0040100","VFBd_0040101","VFBd_0040102","VFBd_0040104","VFBd_0040105","VFBd_0040106","VFBd_0040107","VFBd_0040108","VFBd_0040109","VFBd_0040110","VFBd_0040111","VFBd_0040112","VFBd_0040114","VFBd_0040115","VFBd_0040116","VFBd_0040117","VFBd_0040118","VFBd_0040122","VFBd_0040123","VFBd_0040124","VFBd_0040125","VFBd_0040126","VFBd_0040129","VFBd_0040130","VFBd_0040132","VFBd_0040133","VFBd_0040135","VFBd_0040137","VFBd_0040140","VFBd_0040141","VFBd_0040142","VFBd_0040143","VFBd_0040144","VFBd_0040146","VFBd_0040147","VFBd_0040150","VFBd_0040151","VFBd_0040153","VFBd_0040154","VFBd_0040155","VFBd_0040156","VFBd_0040157","VFBd_0040158","VFBd_0040159","VFBd_0040161","VFBd_0040162","VFBd_0040164","VFBd_0040166","VFBd_0040167","VFBd_0040168","VFBd_0040169","VFBd_0040170","VFBd_0040171","VFBd_0040172","VFBd_0040174","VFBd_0040175","VFBd_0040176","VFBd_0040178","VFBd_0040179","VFBd_0040180","VFBd_0040181","VFBd_0040182","VFBd_0040184","VFBd_0040185","VFBd_0040200","VFBd_0040201","VFBd_0040202","VFBd_0040203","VFBd_0040204","VFBd_0040205","VFBd_0040206","VFBd_0040207","VFBd_0040208","VFBd_0040209","VFBd_0040210","VFBd_0040211","VFBd_0040212","VFBd_0040213","VFBd_0040214","VFBd_0040215","VFBd_0040216","VFBd_0040217","VFBd_0040218","VFBd_0040219","VFBd_0040220","VFBd_0040221","VFBd_0040241","VFBd_0040242","VFBd_0040243","VFBd_0040244"};
        domains = new String[] {"0001","0002","0003","0004","0005","0006","0007","0008","0009","0010","0011","0012","0013","0014","0015","0016","0017","0018","0019","0020","0024","0025","0026","0027","0028","0029","0030","0040","0041","0042","0043","0044","0045","0046","0047","0048","0049","0050","0051","0053","0054","0055","0056","0099","0100","0101","0102","0104","0105","0106","0107","0108","0109","0110","0111","0112","0114","0115","0116","0117","0118","0122","0123","0124","0125","0126","0129","0130","0132","0133","0135","0137","0140","0141","0142","0143","0144","0146","0147","0150","0151","0153","0154","0155","0156","0157","0158","0159","0161","0162","0164","0166","0167","0168","0169","0170","0171","0172","0174","0175","0176","0178","0179","0180","0181","0182","0184","0185","0200","0201","0202","0203","0204","0205","0206","0207","0208","0209","0210","0211","0212","0213","0214","0215","0216","0217","0218","0219","0220","0221","0241","0242","0243","0244"};
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
    modelAndView.addObject("abrev", abrev);
    modelAndView.addObject("domains", domains);
    modelAndView.addObject("indxml", xmli);
    LOG.info("returning xml: " + xmli);
    return modelAndView;
  }
}
