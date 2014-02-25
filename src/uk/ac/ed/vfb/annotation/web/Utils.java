package uk.ac.ed.vfb.annotation.web;

import java.io.*;
import java.nio.channels.FileChannel;
import java.util.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import uk.ac.ed.vfb.annotation.model.StackBean;

/**
 * @author nmilyaev
 * Class providing wrapper for resource locations, such as stack/thumbnail URLs, to simplify and unify access to those resources
 *
 */
public class Utils {
	/** Where all the user stacks and scripts go - base dir */
	public static final String USER_STACKS_BASE_DIR = getProp("IMAGES_BASE_DIR") + getProp("USER_STACKS_DIR");
	/** Folder for uploaded stacks */
	public static final String USER_STACKS_UPLOAD_DIR = USER_STACKS_BASE_DIR + getProp("USER_STACKS_UPLOAD_DIR");
	/** The root for the downloaded lsm stacks */
	public static final String TMP_DIR = USER_STACKS_BASE_DIR + getProp("USER_STACKS_TMP_STACKS_DIR");
	/** Where all the processing scripts are stored */
	public static final String SCRIPT_DIR = USER_STACKS_BASE_DIR + getProp("USER_STACKS_SCRIPTS_DIR");
	/** Where the root for all the stacks */
	public static final String STACKS_DIR = USER_STACKS_BASE_DIR + getProp("USER_STACKS_STACKS_DIR");
	/**	Used by StackBeanManager do not delete! */
	public static final String LSM_WOOLZ_SUB_PATH = "/lsm/wlz/";
	/** Where all the stacks are stored */
	public static final String CMTK_WOOLZ_SUB_PATH = "/cmtk/wlz/";
	/** Where all the stacks are stored */
	public static final String BA_WOOLZ_SUB_PATH = "/ba/wlz/";
	/** Registration types and default paths */
	public static final Hashtable<String, String> registrations = getRegTypes();
	/** Permitted types of stacks: USER_STACK, THIRD_PARTY_STACK, VFB_STACKS, COMPOSITE */ 
	public static Hashtable<String, String> TYPES;
	public static final String THUMB_NAME = "thumb.gif";
	private static final Log LOG = LogFactory.getLog(Utils.class);

	static {
		Utils.TYPES = new Hashtable<String, String>();
		TYPES.put("USER_STACK", getProp("IMAGES_BASE_DIR") + getProp("USER_STACKS_DIR"));
		TYPES.put("THIRD_PARTY_STACK", getProp("IMAGES_BASE_DIR") + getProp("THIRD_PARTY_STACKS_DIR"));
		TYPES.put("VFB_STACK", getProp("IMAGES_BASE_DIR") + getProp("VFB_STACKS_DIR"));
		TYPES.put("COMPOSITE", getProp("IMAGES_BASE_DIR") + getProp("COMPOSITE_STACKS_DIR"));
	}

	private static Hashtable<String, String> getRegTypes(){
		Hashtable<String, String> regs = new Hashtable<String, String>();
		regs.put("lsm", LSM_WOOLZ_SUB_PATH);
		regs.put("cmtk", CMTK_WOOLZ_SUB_PATH);
		regs.put("ba", BA_WOOLZ_SUB_PATH);
		return regs;
	}

	/** Get the stack base dir from properties file */
	public static String getProp(String propName){
		ResourceBundle bundle = ResourceBundle.getBundle("resources");
		return bundle.getString(propName);
	}

	/** Get the path to a woolz file for a specified stackBean and registration (lsm, cmtk, ba) */
	public static String getStackPath(String regName, StackBean stackBean){
		String result = Utils.STACKS_DIR + stackBean.getStackURL() + registrations.get(regName) + stackBean.getStackName() + ".wlz";
		//		LOG.debug("stackbean: " + stackBean);
		return result;
	}

	/** Get the path to a thumbnail for a specified stackBean and registration (lsm, cmtk, ba) */
	public static String getThumbPath(String regName, StackBean stackBean){
		String result = Utils.getProp("VFB_STACKS_DIR") + stackBean.getStackURL() + "/" + regName + "/" + Utils.THUMB_NAME;
		//		LOG.debug("stackbean: " + stackBean);
		return result;
	}

	/** Get the path to a stack based on stack base URL and type (USER_STACK, VFB_STACK, THIRD_PATRTY_STACK,. etc) 
	 * @param url - path to the stack relative to the type's base directory as specified in TYPES 
	 * @param type  - type of the stack, as specified in TYPES
	 */
	public static String getStackPathForType(String url, String type){
		String result = null;
		result = TYPES.get(type) + url;
		//		LOG.debug("Path to the stack is : " + result);
		return result;
	}

	/** Copies a folder with all the content to new location
	 * borrowed from: http://www.crazysquirrel.com/computing/java/basics/java-file-and-directory-copying.jspx
	 * @param source
	 * @param destination
	 * @throws IOException
	 */
	public static final void copyDirectory( File source, File destination ) throws IOException {
		if( !source.isDirectory() ) {
			throw new IllegalArgumentException( "Source (" + source.getPath() + ") must be a directory." );
		}
		if( !source.exists() ) {
			throw new IllegalArgumentException( "Source directory (" + source.getPath() + ") doesn't exist." );
		}
		if( destination.exists() ) {
			throw new IllegalArgumentException( "Destination (" + destination.getPath() + ") exists." );
		}
		destination.mkdirs();
		File[] files = source.listFiles();
		for( File file : files ) {
			if( file.isDirectory() ) {
				copyDirectory( file, new File( destination, file.getName() ) );
			} else {
				copyFile( file, new File( destination, file.getName() ) );
			}
		}
	}

	/** Copies single file to new location
	 * borrowed from: http://www.crazysquirrel.com/computing/java/basics/java-file-and-directory-copying.jspx
	 * @param source
	 * @param destination
	 * @throws IOException
	 */
	public static final void copyFile( File source, File destination ) throws IOException {
		FileChannel sourceChannel = new FileInputStream( source ).getChannel();
		FileChannel targetChannel = new FileOutputStream( destination ).getChannel();
		sourceChannel.transferTo(0, sourceChannel.size(), targetChannel);
		sourceChannel.close();
		targetChannel.close();
	}

	/**
	 * A new, fancy way of running external command.
	 * Allows outputting stdout and stderr interlaced, like in real command line 
	 * Does not allow to run a command in background ;-(
	 * @param command
	 * @return
	 */
	public static String runCommand(String[] command){
		LOG.debug("Running: " + Arrays.toString(command));
		String result = "";
		try{
			ProcessBuilder builder = new ProcessBuilder(command);
			builder.redirectErrorStream(true);
			Process process = builder.start();
			String line;
			BufferedReader bri = new BufferedReader(new InputStreamReader(process.getInputStream()));
			while ((line = bri.readLine()) != null) {
				result = result + "\n" + line;
				LOG.debug(line);
			}
			bri.close();
		}
		catch (IOException ex) {
			ex.printStackTrace();
		}
		return result;
	}

	/**
	 * An old-fashioned way of running external command.
	 * Allows to run a command in background
	 * Does not return any feedback
	 * @param command
	 * @return
	 */
	public static void runCommand(final String command){
		LOG.debug("Running command " + command);				
		Thread t = new Thread(new Runnable() {
			public void run() {
				try {
					Thread.sleep(10);
					Process process = Runtime.getRuntime().exec(command);
					BufferedReader bri = new BufferedReader(new InputStreamReader(process.getInputStream()));
					BufferedReader bre = new BufferedReader(new InputStreamReader(process.getErrorStream()));
					String lineI, lineE = null;
					while ((lineI = bri.readLine()) != null || (lineE = bri.readLine()) != null) {
						//result = result + line;
						if (lineI!= null){
							LOG.debug(lineI);
						}
						if (lineE!= null){
							LOG.debug(lineE);
						}

					}
					bri.close();
					bre.close();			

				}
				catch(Exception e)
				{                   
					e.printStackTrace();
				}
			}
		});
		t.start();	
	}

}
