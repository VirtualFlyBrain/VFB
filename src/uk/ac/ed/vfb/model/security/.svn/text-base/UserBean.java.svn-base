package uk.ac.ed.vfb.model.security;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * POJO class for a registered site user. 
 */

public class UserBean {
	private String username;
	private String password;
	private String confirmPassword;
	private String firstname;
	private String surname;
	private String institution;
	private String position;
	private String email;
	private String phone;
	private String notes;
	private String[] autorities;
	private boolean isEnabled = true;
	private boolean email4Newsletter = false;
	/** How many chars trim a string (eg name) to */
	private static final Log LOG = LogFactory.getLog(UserBean.class);

	public UserBean() {
		this.isEnabled = isEnabled;
		this.autorities = new String[]{"ROLE_USER"};
	}
	
	public UserBean copyUser(UserBean ub){
		return new UserBean(ub.getUsername(), ub.getPassword(), ub.getFirstname(), ub.getSurname(),
							ub.getInstitution(), ub.getPosition(), ub.getEmail(), ub.getPhone(), 
							ub.getNotes(), ub.getIsEnabled());
	}

	public UserBean(String username, String password, String firstname,
			String surname, String institution, String position, String email,
			String phone, String notes, boolean isEnabled /*, String[] authorities*/) {
		super();
		this.username = username;
		this.password = password;
		this.firstname = firstname;
		this.surname = surname;
		this.institution = institution;
		this.position = position;
		this.email = email;
		this.phone = phone;
		this.notes = notes;
		this.isEnabled = isEnabled;
		this.autorities = new String[]{"ROLE_USER"};
		//		if (this.autorities == null || this.autorities.length == 0){
		//			//Create default authority
		//			this.autorities = new String[]{"ROLE_USER"};
		//		}
		//		else {
		//			this.autorities = authorities;
		//		}
	}

	public String getFirstname() {
		return firstname;
	}
	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getSurname() {
		return surname;
	}
	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getInstitution() {
		return institution;
	}
	public void setInstitution(String institution) {
		this.institution = institution;
	}

	public String getPosition() {
		return position;
	}
	public void setPosition(String position) {
		this.position = position;
	}

	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}

	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	public String getConfirmPassword() {
		return confirmPassword;
	}

	public void setConfirmPassword(String confirmPassword) {
		this.confirmPassword = confirmPassword;
	}

	public void setEnabled(boolean isEnabled) {
		this.isEnabled = isEnabled;
	}

	public String[] getAutorities() {
		return autorities;
	}
	public void setAutorities(String[] autorities) {
		this.autorities = autorities;
	}

	public boolean getIsEnabled() {
		return isEnabled;
	}
	public void setIsEnabled(boolean isEnabled) {
		this.isEnabled = isEnabled;
	}
	

	public boolean isEmail4Newsletter() {
		return email4Newsletter;
	}

	public void setEmail4Newsletter(boolean email4Newsletter) {
		this.email4Newsletter = email4Newsletter;
	}

	public String toString(){
		return "|User name: " + this.username + " |password: " + this.password + " |name: " + this.firstname + " |surname: " + this.surname + " |institution: " + this.institution + 
				" |position: " + this.position + " |email: " + this.email + " |phone: " + this.phone + " |notes: " + this.notes;  
	}
}
