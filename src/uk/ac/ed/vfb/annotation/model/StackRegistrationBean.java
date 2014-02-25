package uk.ac.ed.vfb.annotation.model;

/**
 * Object that runs registration for a given stack and sends an email notifying of registratin finished.
 * If the registration does not complete within 24 hours, the object sends a failure email and self-destructs. 
 */

import java.text.DecimalFormat;
import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.ac.ed.vfb.annotation.service.StackBeanManager;
import uk.ac.ed.vfb.annotation.web.ProcessRunner;
import uk.ac.ed.vfb.annotation.web.SimpleMailSender;
import uk.ac.ed.vfb.annotation.web.Utils;
import uk.ac.ed.vfb.model.security.UserBean;

public class StackRegistrationBean extends Thread{
	private StackBean stackBean;
	private UserBean userBean;
	StackBeanManager sbm; 
	private Date startDate; 
	private ProcessRunner pr;
	private String regType;
	private String currCommand; //current registration command being executed
	private int cyclesPast = 0; //How many 15-min check cycles passed during the lifetime of the thread 
	private double medianJobCount= 0;// median number of jobs running during thread life time
	public static int JOBS_RUNNING = 0;
	private static long CHECK_EVERY = 15*60*1000;// How often check if the woolz is created - every 15min
	/** At the beginning each thread is allocated certain amount of "processing credits" - rough analog of CPU time. 
	 * It is considered that amout should be enough to complete longest registration */
	private static final int TOTAL_PROCESSING_CYCLES = 48; // Corresponds to 12 hrs unshared processing
	private float processingCycles = 0;
	private static long THREAD_LIFE_TIME = 12*60*60*1000; //after which period of time to kill the running registration bash process - 12 hrs
	private static final String BODY_SUCCESS = "The registration of your stack XXSTACKXX uploaded to the Virtual Fly Brain is finished. You can now view your stack here: ";
	private static final String SUBJECT_SUCCESS = "Your Virtual Fly Brain registered stack is ready";
	private static final String BODY_FAIL = "Unfortunately the registration of your stack XXSTACKXX uploaded to the Virtual Fly Brain has failed. Please review the results below and try again";
	private static final String SUBJECT_FAIL = "We are sorry, Your Virtual Fly Brain stack registration has failed";
	/** Where to view warped stack */
	private static final String VIEW_STACK_URL = "/site/tools/upload_stack/warpedStack.htm?woolz=XXX/cmtk/wlz_meta/tiledImageModelData.jso";
	private static final Log LOG = LogFactory.getLog(StackRegistrationBean.class); 

	public StackRegistrationBean(StackBeanManager sbm, UserBean userBean) {
		super();
		startDate = new Date();
		this.sbm = sbm;
		this.stackBean = sbm.getStackBean();
		this.userBean = userBean;
	}

	public StackRegistrationBean(StackBean stackBean) {
		super();
		startDate = new Date();
		this.stackBean = stackBean;
	}

	/**
	 * Run specified registration on the stackBean
	 * @param regType
	 * @return
	 */
	public boolean runRegistraiton(String regType, String x, String y, String z, boolean reverse){
		this.regType = regType;
		boolean result = false;
		currCommand = "lsm/processLsm.bsh " + stackBean.getStackName();
		if (regType.equals("cmtk")){
			currCommand = "cmtk/processCmtk.bsh " + stackBean.getStackName() +
					" " + x + " " + y + " " + z + " " + reverse;
		}
		else if (regType.equals("ba")){
			currCommand = "ba/processBa.bsh " + stackBean.getStackName();
		}
		else if (regType.equals("lsm")){
			// do nothing, already set
		}
		//Running script so it finishes about 10s before the thread killed so we can log the massacre 
		//Old way to run it, kill it
		//currCommand = Utils.SCRIPT_DIR + "runTimedProcess.bsh_" + currCommand + "_" + (KILL_PROCESS_AFTER/1000-10);
		currCommand = Utils.SCRIPT_DIR + currCommand;
		LOG.debug("Command: " + currCommand);
		pr = new ProcessRunner(currCommand);
		pr.start();
		this.start();
		return result;
	}

	public void run() {
		StackRegistrationBean.JOBS_RUNNING ++;
		DecimalFormat df = new DecimalFormat("##.###");
		int cycles = 0;
		while (true && !Thread.currentThread().isInterrupted()) {
			try {
				Thread.sleep(CHECK_EVERY); 
				LOG.debug("===== Checking registration process for : " + this.stackBean.getStackName());
				boolean isProcessFinished = StackBeanManager.isWoolzReady(regType, this.stackBean);
				LOG.debug("Is wlz stack ready? " + isProcessFinished);
				if (isProcessFinished) {
					String stackName = this.stackBean.getStackName();
					String stackUrl = "http://" + Utils.getProp("server_name") + VIEW_STACK_URL.replace("XXX", stackName);
					sendEmail(StackRegistrationBean.SUBJECT_SUCCESS, StackRegistrationBean.BODY_SUCCESS + stackUrl);
					stopProcessing();
				}
				else {
					//We consider that over each iteration the process uses up 1/JOBS_RUNNING credits; 
					processingCycles = processingCycles + (float)1/JOBS_RUNNING;
					// We consider the computation time is up when processingCredits=StackRegistrationBean.TOTAL_PROCESSING_CREDITS
					boolean isTimeUp = processingCycles >= StackRegistrationBean.TOTAL_PROCESSING_CYCLES;
					LOG.debug("Run through " + (++cycles) + " iterations. Used up " + df.format(processingCycles) + " processing cycles so far. Is game over? " + isTimeUp);
					if ( isTimeUp ){
						sendEmail(StackRegistrationBean.SUBJECT_FAIL, StackRegistrationBean.BODY_FAIL);
						stopProcessing();
					}
				}
			} catch (InterruptedException ex) {
				Thread.currentThread().interrupt(); // very important
				this.finalize();
				LOG.debug("Shutting down thread");
				break;
			}
		}
	}

	private void sendEmail(String subj, String body){
		//Sending notification email
		String toEmail = userBean.getEmail();  
		LOG.debug("User email: " + toEmail);
		body = body.replace("XXSTACKXX", stackBean.getStackName());
		SimpleMailSender.send(toEmail, subj, body);
	}

	private void stopProcessing(){
		LOG.debug("Killing ProcessRunner");
		//prosess has run wild - kill it!
		pr.interrupt();
		pr = null;
		LOG.debug("PR is dead!!!... Now... Seppuku!!!");
		StackRegistrationBean.JOBS_RUNNING --;
		this.interrupt();
		LOG.debug("PR:  " + pr);
	}
	
	@Override
	public void interrupt() {
		super.interrupt();
	}

	@Override
	protected void finalize() {
		LOG.debug("Time is up, self-destructing");
		try {
			//Thread.currentThread().stop();
			super.finalize();
//			this.destroy();
		} catch (Throwable e) {
			e.printStackTrace();
		}
	}

	public StackBeanManager getSbm() {
		return sbm;
	}


}
