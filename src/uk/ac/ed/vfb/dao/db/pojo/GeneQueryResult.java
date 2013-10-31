package uk.ac.ed.vfb.dao.db.pojo;

import uk.ac.ed.vfb.model.ThirdPartyBean;

/**
 * POJO wrapper class for gene query (eg transgene, phenotype, gene expression).
 * One instance represents a query result row.
 * @author nmilyaev
 *
 */

public class GeneQueryResult implements Comparable{
	private String driver; //Used driver, eg GAL4
	private String driverRef; //Used driver, eg GAL4  in FlyBase
	private String location; //Location where expression detected
	private String locationRef; //Location where expression detected  in FlyBase
	private String reference; //Lib reference
	private String referenceRef; //Lib reference in FlyBase
	private ThirdPartyBean thirdPartyBean; // used for integration with third party sources - use driverRef for linking
	private boolean flag; //Flag stating the entry could be dodgy in the context of the current query
	
	public String getDriver() {
		return driver;
	}
	public void setDriver(String driver) {
		this.driver = driver;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getReference() {
		return reference;
	}
	public void setReference(String reference) {
		this.reference = reference;
	}
	public String getDriverRef() {
		return driverRef;
	}
	public void setDriverRef(String driverRef) {
		this.driverRef = driverRef;
	}
	public String getLocationRef() {
		return locationRef;
	}
	public void setLocationRef(String locationRef) {
		this.locationRef = locationRef;
	}
	public String getReferenceRef() {
		return referenceRef;
	}
	public void setReferenceRef(String referenceRef) {
		this.referenceRef = referenceRef;
	}		
	public boolean getFlag() {
		return flag;
	}
	public void setFlag(boolean flag) {
		this.flag = flag;
	}

	public ThirdPartyBean getThirdPartyBean() {
		return thirdPartyBean;
	}
	public void setThirdPartyBean(ThirdPartyBean thirdPartyBean) {
		this.thirdPartyBean = thirdPartyBean;
	}
	
	@Override
	public String toString() {
		return "GeneQueryResult[driverRef=" + driverRef + ", location=" + location	+ "]";
	}

	@Override
	public int compareTo(Object o) {
		GeneQueryResult typedO = (GeneQueryResult)o;
		// Not only the order of memebers depends on the comparison criteria, 
		// the number of records in the final set depends on it, too!!!
		// @TODO: Ask David if we need only DISTINCT drivers or driver + location!! 
		return (this.driver + this.location + this.driverRef + this.locationRef + this.reference + this.referenceRef).compareToIgnoreCase(typedO.driver + typedO.location + typedO.driverRef + typedO.locationRef + typedO.reference + typedO.referenceRef);
	}

}
