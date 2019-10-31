package uk.ac.ed.vfb.composite.model;

import java.io.*;
import java.util.*;
import java.sql.Timestamp;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.ac.ed.vfb.annotation.web.Utils;
import uk.ac.ed.vfb.model.ThirdPartyBean;

/**
 * POJO class for composite view.
 */

public class CompositeViewBean implements Serializable {
	/** Stores all the stacks (as thirdPartBeans) that make up the composite */
	private Set <ThirdPartyBean> stacks;
	/** Timestamp of when the bean was created */
	private String uuid;
	private static String COMPOSITE = "COMPOSITE";
	private static String MAKE_FOLDER = "mkdir XXX";
	private static String COPY_META_FOLDER = "cp -rfv " + Utils.getProp("IMAGES_BASE_DIR") + Utils.getProp("COMPOSITE_STACKS_DIR") + "wlz_meta XXX/";
	public static String[] COLOURS = {"{\"red\":255, \"green\":0, \"blue\":0}", "{\"red\":0, \"green\":255, \"blue\":0}", "{\"red\":0, \"green\":0, \"blue\":255}",
		"{\"red\":255, \"green\":255, \"blue\":0}", "{\"red\":255, \"green\":0, \"blue\":255}", "{\"red\":0, \"green\":255, \"blue\":255}"};
	public static String[] COLOUR_NAMES = {"red", "green", "blue", "yellow", "magenta", "cyan"};
	public static String IMMUTABLE_ERROR_MSG = "You can not modify a composite once the permalink to it has been generated";
	public static String STACK_EXISTS_ERROR_MSG = "This stack has already been added. You can not add a stack to a composite more than once";
	/** Read template File into resource bundle */
	private static ResourceBundle bundle = ResourceBundle.getBundle("meta_template");
	private static String JSON_BODY=readProperty("json_body");
	private static String LAYER_BODY=readProperty("layer_body");
	/** Whether the value/composition was changed since last write */
	private boolean modified = false;
	private boolean isImmutable = false;

	private static final Log LOG = LogFactory.getLog(CompositeViewBean.class);

	private static String readProperty(String propName){
		return bundle.getString(propName);
	}

	public CompositeViewBean() {
		uuid = UUID.randomUUID().toString();
		Date date= new java.util.Date();
		uuid = new Timestamp(date.getTime()).toString().replace(" ", "_").replace(":", ".");
		this.stacks = new TreeSet<ThirdPartyBean>();
	}

	public CompositeViewBean(CompositeViewBean cvb){
		super();
		this.uuid = cvb.uuid;
		this.stacks = new TreeSet<ThirdPartyBean>(cvb.stacks);
		this.isImmutable = false;
	}

	public String addStack(ThirdPartyBean stack) {
		// only works for mutable composites
		String result = null;
		if (isImmutable) result = IMMUTABLE_ERROR_MSG;
		else {
			if (this.stacks.contains(stack)){
				result = STACK_EXISTS_ERROR_MSG;
			}
			else {
				this.stacks.add(stack);
				LOG.debug("Added" + stack + " count: " + stacks.size());
				modified = true;
			}
		}
		return result;
	}

	public String removeStack(ThirdPartyBean stack) {
		// only works for mutable composites
		LOG.debug("Deleting stack : " + stack + " immutable? " + isImmutable + " stacks: " + this.stacks);
		if (isImmutable) return IMMUTABLE_ERROR_MSG;
		else {
			this.stacks.remove(stack);
			modified = true;
			return null;
		}
	}

	public int getStackCont(){
		return this.stacks.size();
	}

	public Set<ThirdPartyBean> getStacks() {
		return stacks;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	/**
	 * A composite becomes immutable after retrieving a permalink.
	 * @param isImmutable
	 */
	public void setImmutable(boolean isImmutable) {
		this.isImmutable = isImmutable;
	}

	public boolean isImmutable() {
		return isImmutable;
	}

	/**
	 * Generates json representation of the current composite stack.
	 * Colours assigned to the layers as preset by the COLOURS array
	 * The json could be passed to JsonController to view the stack
	 * @return
	 */
	public String getAsJson(){
		//Composing json for individual layers first
		LOG.debug("Creating composite json...");
		StringBuffer layers = new StringBuffer();
		StringBuffer layerNames = new StringBuffer();
		StringBuffer layer = null;
		int i = 0;
		int ind = 0;
		for (ThirdPartyBean stack:stacks){
			layer = new StringBuffer(LAYER_BODY);
			String stackDir = stack.getImageDir();
			ind = layer.indexOf("IMAGE_DIR");
			layer.replace(ind, ind+9, stackDir);
			ind = layer.indexOf("FILTER");
			layer.replace(ind, ind+6, COLOURS[i++]);
			layers.append(layer);
			layerNames.append("\n\"" + stack.getStackName() + "\",\n");
		}
		StringBuffer json = new StringBuffer(JSON_BODY);
		ind = json.indexOf("LAYER_NAMES");
		json.replace(ind-1,  ind+11, layerNames.substring(0, layerNames.length()-2));
		//this.json = JSON_BODY.replace("LAYER_NAMES", layerNames.substring(0, layerNames.length()-1));
		ind = json.indexOf("LAYER_DATA");
		json.replace(ind, ind + 10, layers.substring(0, layers.length()-3) + "\n");
		//this.json = json.replace("LAYER_DATA", layers.toString());
		layers = null;
		layerNames = null;
		LOG.debug("\n" + json);
		return json.toString();
	}

	/**
	 * Saves the composite stack to be viewed at a later stage.
	 * NB: can start a new composite so the currently saved composite is immutable
	 * @return String url - a string representation of the stack URL
	 */
	public String save(){
		//Url to retrieve/view the composite at a later stage
		LOG.debug("saving composite bean");
		String url = Utils.getStackPathForType(uuid, COMPOSITE);
		String dir = Utils.getProp("IMAGES_BASE_DIR") + Utils.getProp("COMPOSITE_STACKS_DIR") + uuid;
		String command = MAKE_FOLDER.replaceAll("XXX", dir);
		LOG.debug(command);
		Utils.runCommand(command.split(" "));
		LOG.debug("folder created!!");
		command = COPY_META_FOLDER.replaceAll("XXX", dir);
		LOG.debug(command);
		Utils.runCommand(command.split(" "));
		LOG.debug("files copied!!");
		String jsoFile = dir + Utils.getProp("STACK_META_URL");
		LOG.debug("saving to json file: " + jsoFile);
		try {
			FileWriter fw = new FileWriter(new File(jsoFile).getAbsoluteFile());
			BufferedWriter bw = new BufferedWriter(fw);
			bw.write(this.getAsJson());
			bw.close();
		}
		catch (IOException ex) {
			//problem writing file :-P
			LOG.error("Problem saving composite json " + jsoFile);
			ex.printStackTrace();
		}
		return url;
	}

	/**
	 * Saves the composite stack to a disk file to be edited/viewed at a later stage.
	 * @return String url - a string representation of the stack URL
	 */
	public String serialize(){
		//Url to retrieve/view the composite at a later stage
		LOG.debug("saving composite bean as object");
		String url = Utils.getStackPathForType(uuid, COMPOSITE);
		String dir = Utils.getProp("IMAGES_BASE_DIR") + Utils.getProp("COMPOSITE_STACKS_DIR") + uuid;
		String command = MAKE_FOLDER.replaceAll("XXX", dir);
		LOG.debug(command);
		Utils.runCommand(command.split(" "));
		LOG.debug("folder created!!");
		command = COPY_META_FOLDER.replaceAll("XXX", dir);
		LOG.debug(command);
		Utils.runCommand(command.split(" "));
		LOG.debug("files copied!!");
		String jObjFile = dir + "/" + Utils.getProp("COMPOSITE_FILE_URL");
		LOG.debug("serializing as jObj file: " + jObjFile);
		try {
			FileOutputStream fout = new FileOutputStream(jObjFile);
			ObjectOutputStream oos = new ObjectOutputStream(fout);
			oos.writeObject(this);
			oos.close();
		}
		catch (IOException ex) {
			//problem writing file :-P
			LOG.error("Problem saving composite serial " + jObjFile);
			ex.printStackTrace();
		}
		return url;
	}

	/**
	 * Loads existing the composite view based on the uuid.
	 * NB: can start a new composite so the currently saved composite is immutable
	 * @return String url - a string representation of the stack URL
	 */
	public static CompositeViewBean deserialize(String uuid) throws Exception {
		CompositeViewBean newBean = null;
		//Url to retrieve/view the composite at a later stage
		LOG.debug("loading existing composite bean");
		String fileContent = null;
		String url = Utils.getStackPathForType(uuid, COMPOSITE);
		String dir = Utils.getProp("IMAGES_BASE_DIR") + Utils.getProp("COMPOSITE_STACKS_DIR") + uuid;
		String jObjFile = dir + "/" + Utils.getProp("COMPOSITE_FILE_URL");
		LOG.debug("reading jObj file: " + jObjFile);
		try {
			   FileInputStream fin = new FileInputStream(jObjFile);
			   ObjectInputStream ois = new ObjectInputStream(fin);
			   newBean = (CompositeViewBean)ois.readObject();
			   ois.close();
		}
		catch (FileNotFoundException fnf){
			throw new FileNotFoundException("We are sorry. The composite you are looking for no longer exists.\\nYou can continue editing your recent composite");
		}
		catch (IOException ex) {
			//problem reading file :-P
			LOG.error("problem reading file " + jObjFile);
			ex.printStackTrace();
		} catch (ClassNotFoundException e) {
			// Problem serializing class
			LOG.error("Problem serializing class " + jObjFile);
			e.printStackTrace();
		}
		// We presume that the only time we have to deserilaze is when loading via permalink.
		// Therefore, a deserialized bean is considered immutable.
		LOG.debug("Deserialized bean: " + newBean);
		newBean.isImmutable = true;
		return newBean;
	}

	public CompositeViewBean startNewComposite(){
		return new CompositeViewBean();
	}

	public String toString(){
		String result = "";
		for (ThirdPartyBean stack:stacks){
			result = result + stack + ";";
		}
		return result;
	}

}
