package uk.ac.ed.vfb.service;

import org.springframework.security.GrantedAuthority;
import org.springframework.security.context.SecurityContextHolder;
import org.springframework.security.userdetails.User;
import uk.ac.ed.vfb.dao.security.UserManagerDAO;
import uk.ac.ed.vfb.model.security.UserBean;

/**
 * Manages UserBeans based on a vfb.user DB
 * @author nmilyaev
 *
 */

public class UserManager {
	private UserManagerDAO dao;

	public UserBean createUser(){
		return new UserBean();
	}

	/**
	 * Obtains a current user based on currently logged in system user.
	 * Failing that creates a new one.
	 * @return userBean - obtained or created userBean
	 */
	public UserBean getCurrentUserBean(){
		UserBean userBean;
		try{
			User user;
			user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			userBean = dao.getUser(user.getUsername());
			if (user.getAuthorities() != null || user.getAuthorities().length == 0){
				String[] authorities = new String[user.getAuthorities().length];
				int i = 0;
				for (GrantedAuthority auth : user.getAuthorities()){
					authorities[i] = auth.toString();
				}
				userBean.setAutorities(authorities);
			}
		}
		catch(NullPointerException ex){
			//The user not logged in
			userBean = new UserBean();	
		}
		return userBean;
	}

	public String saveUser(UserBean userBean, String action) {
		String result = dao.saveUser(userBean, action);
		return result;
	}
	
	public static String getCurrentUserName(){
		String userName = "unknown";
		try{
			User user;
			user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			userName = user.getUsername();
		}
		catch(NullPointerException ex){
			//The user not logged in - do nothing for now
		}
		return userName;
	}

	public UserManagerDAO getDao() {
		return dao;
	}

	public void setDao(UserManagerDAO dao) {
		this.dao = dao;
	}

}
