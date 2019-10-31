package uk.ac.ed.vfb.annotation.service;

import java.io.File;
import java.util.Enumeration;
import java.util.*;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.ac.ed.vfb.annotation.dao.StackManagerDAO;
import uk.ac.ed.vfb.annotation.model.StackBean;
import uk.ac.ed.vfb.annotation.web.Utils;
import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.APageable;

public class StackBeanManager extends APageable{
	private StackManagerDAO dao;
	private StackBean stackBean = null;
	public final static String OK = "OK";
	public final static String NEW_STACK = "NEW";
	public final static String EXISTS_STACK = "EXISTS";
	private static final Log LOG = LogFactory.getLog(StackBeanManager.class);

	/**
	 * Rweturns current stackBean instance. If that has never been created (==null) create new one!
	 * @return userBean - obtained or created stackBean
	 */
	public StackBean getStackBean(){
		if (stackBean == null) {
			stackBean = new StackBean();
		}
		return stackBean;
	}
	
	/**
	 * Obtains a StackBean by querying the db based on the stackId.
	 * Failing that creates a new one.
	 * @return userBean - obtained or created stackBean
	 */
	public StackBean getStackBean(String stackId) {
		try{
			stackBean = dao.getStack(stackId);
			LOG.debug("Stack found: " + stackBean);
		}
		catch(IndexOutOfBoundsException ex){
			//The stack does not exist - create a brand-new one
			//LOG.info("Stack not found, creating new one: " + ex.getMessage());
			stackBean = new StackBean();	
		}
		return stackBean;
	}

	/**
	 * Obtains a list of all StackBeans from the db.
	 * @return userBean - obtained or created stackBean
	 */
	public Set<StackBean> getStackBeansAll(){
		resultSet = new TreeSet<StackBean>();
		List<StackBean> result = dao.getStacksAll();
		for (StackBean stackBean:result){
			resultSet.add(stackBean);
		}
		return resultSet;
	}

	public String saveStack(StackBean stackBean) {
		String result = dao.saveStack(stackBean);
		return result;
	}
	
	public String deleteStack(String stackId) {
		String result = dao.deleteStack(stackId);
		return result;
	}
	
	/**
	 * Checks if the woolz file for lsm has been generated and saved to disk
	 * @param req
	 * @param regName - required registration type (lsm, cmtk, or be)
	 * @return
	 */
	public static boolean isWoolzReady(String regName, HttpServletRequest req){
		boolean result = false;
		StackBeanManager sbm = (StackBeanManager)req.getSession().getAttribute("stackBeanManager");
		StackBean stackBean = sbm.getStackBean();
		return isWoolzReady(regName, stackBean);
	}
	
	/**
	 * Checks if the woolz file for lsm has been generated and saved to disk
	 * @param req
	 * @param regName - required registration type (lsm, cmtk, or be)
	 * @return
	 */
	public static boolean isWoolzReady(String regName, StackBean stackBean){
		boolean result = false;
		StackBean sb = stackBean;
		String woolzFilename = Utils.getStackPath(regName, sb);
		File file = new File(woolzFilename);
		LOG.debug("Filename: " + woolzFilename + " File exists: " + file.exists());
		result = file.exists();
		return result;
	}
	/**
	 * Returns current stack from the session. 
	 * @param req
	 * @return
	 */
	public static StackBean getCurrentStack(HttpServletRequest req){
		boolean result = false;
		StackBeanManager sbm = (StackBeanManager)req.getSession().getAttribute("stackBeanManager");
		StackBean stackBean = sbm.getStackBean();
		return stackBean;
	}

	public StackManagerDAO getDao() {
		return dao;
	}

	public void setDao(StackManagerDAO dao) {
		this.dao = dao;
	}

}
