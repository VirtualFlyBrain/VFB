package uk.ac.ed.vfb.annotation.web;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ProcessRunner extends Thread {
	private String PID = "-1"; //The process PID, bogus value to start
	private String command = "";
	private static final String KILL_COMMAND = "kill -9 ";
	private static final String PID_MARKER = "PID:"; 
	private static final Log LOG = LogFactory.getLog(ProcessRunner.class);

	public ProcessRunner(String command){
		super();
		this.command = command;
	}

	@Override
	/**
	 * Runs a command in a separate thread
	 */
	public void run() {
		LOG.debug("Running command " + command);
		try{
			ProcessBuilder builder = new ProcessBuilder(command.split(" "));
			builder.redirectErrorStream(true);
			Process process = builder.start();
			String line, result= "";		
			BufferedReader bri = new BufferedReader(new InputStreamReader(process.getInputStream()));
			while ((line = bri.readLine()) != null) {
				if(line.startsWith(PID_MARKER)){
					this.PID = line.replace("PID:", "");
					LOG.debug("PID:" + this.PID);
				}
				result = result + "\n" + line;
				LOG.debug(line);
				Thread.sleep(10);
			}
			bri.close();
		}
		catch (IOException ex) {
			ex.printStackTrace();
		} catch (InterruptedException e) {
			LOG.debug("ProcessRunner got interruped signal");
			e.printStackTrace();
			Thread.currentThread().interrupt(); // very important
			this.destroy();
			LOG.debug("Shutting down ProcessRunner");
		}
	}

	@SuppressWarnings("deprecation")
	@Override
	public void destroy() {
		LOG.debug("Killing current process and closing the thread down");
		Utils.runCommand(ProcessRunner.KILL_COMMAND + this.PID);
		super.interrupt();
		try {
			super.finalize();
		} catch (Throwable e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		super.destroy();
	}

}
