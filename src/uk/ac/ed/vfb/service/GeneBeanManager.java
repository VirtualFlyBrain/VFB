package uk.ac.ed.vfb.service;

import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.ac.ed.vfb.dao.db.GeneQueryDAO;
import uk.ac.ed.vfb.dao.db.pojo.GeneQueryResult;
import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.web.WebQueryUtils;

/** Retrieves, creates and manages a GeneBean entity - either single one or a list
 * The entity is created and its fields are populated based SQL query
 * NB: the way of creating annotation fields may be changed to anything as required, eg OWL API.
 * @author nmilyaev
 */
@SuppressWarnings("unused")
public class GeneBeanManager extends APageable{
	/** Default DAO */
	protected GeneQueryDAO queryDAO;
	private OntBeanManager obm;
	private ThirdPartyBeanManager tpbm;
	private ResourceBundle bundle = ResourceBundle.getBundle("queries");
	/** Basic query to find all children prior to blasting the search on esach of them */
	private static final Log LOG = LogFactory.getLog(GeneBeanManager.class);

	/** Sequentially queries chado DB to get the list of transgenes for each ontBean	 */


	@SuppressWarnings("unchecked")
	public void getTransgeneList(String action, String id) {
		resultSet = new TreeSet<GeneQueryResult>();
		resultSet.addAll(queryTransgeneTable(action, id));
	}

	/** Sequentially queries chado DB to get the list of transgenes for each ontBean	 */
	@SuppressWarnings("unchecked")
	public void getExpressionList(String action, String id) {
		resultSet = new TreeSet<GeneQueryResult>();
		resultSet.addAll(queryTransgeneTable(action, id));
	}

	/** Sequentially queries chado DB to get the list of transgenes for each ontBean	 */
	@SuppressWarnings("unchecked")
	public void getPhenotypeList(String action, String id) {
		resultSet = new TreeSet<GeneQueryResult>();
		resultSet.addAll(queryTransgeneTable(action, id));
	}

	private synchronized List<GeneQueryResult> queryTransgeneTable(String action, String id) {
		LOG.debug("queryTransgeneTable:  " + action + " " + id);
		long startTime = System.currentTimeMillis();
		List<GeneQueryResult> resultList;

		// Q1  XXX
		// Q2  part_of some XXX  (with IDs: BFO_0000050 some XXX)
		// Q3  cell that overlaps some XXX (with IDs: FBbt_00007002 that RO_0002131 some XXX)
		// Post-processing: Find terms that are in Q3 results but not it Q2 results => list of terms that need a warning (Q4).
		// Combine results of queries of Q1, Q2, Q3 + the search term ($X) to => list for single SQL query.

		// List 2: part_of some XXX
		String dl1 = WebQueryUtils.getDefString(action, OntBean.idAsOWL(id), 0);
		LOG.debug("DL1: ");
		Set<OntBean> beanList1 = new TreeSet<OntBean>();
		beanList1.addAll(obm.getBeanListForQuery(dl1));
		LOG.debug("LIST1: " + beanList1.size());

		// List 3: cell that overlaps some XXX
		String dl2 = WebQueryUtils.getDefString(action, OntBean.idAsOWL(id), 1);
		LOG.debug("DL2: ");
		Set<OntBean> beanList2 = new TreeSet<OntBean>();
		beanList2.addAll(obm.getBeanListForQuery(dl2));
		LOG.debug("BeanList 2: " + beanList2.size());


		String dl3 = WebQueryUtils.getDefString(action, OntBean.idAsOWL(id), 2);
		LOG.debug("DL3: ");
		Set<OntBean> beanList3 = new TreeSet<OntBean>();
		beanList3.addAll(obm.getBeanListForQuery(dl3));
		LOG.debug("BeanList 3: " + beanList3.size());

		// Subtract list2 from list3 -> list 4:  Hits to these terms need warnings
		Set<OntBean> beanList4 = new TreeSet<OntBean>();
		beanList4.addAll(beanList3);
		beanList4.removeAll(beanList2);
		LOG.debug("BeanList 4: " + beanList4.size());

		// Add list 1, 2, 3 -> list 5
		Set<OntBean> beanList5 = new TreeSet<OntBean>();
		beanList5.addAll(beanList2);
		beanList5.addAll(beanList1);
		beanList5.addAll(beanList3);
		LOG.debug("BeanList 5: " + beanList5.size());

		// Use list 4 for SQL query
		Set<String> sqlList = new TreeSet<String>();
		for (OntBean ob: beanList5) {
			sqlList.add("'" + ob.getId() + "'");
		}
		//Add id to the list
		sqlList.add("'" + new OntBean(id).getId() + "'");
		String args = Arrays.toString(sqlList.toArray()).replace("[", "").replace("]", "");
		// Run SQL query
		resultList = queryDAO.getListForAction(action, args);
		// Whoever comes after me, I AM SORRY!
		// This is not my shit, but this piece of spaghetti is needed to provide correct ID mapping for expression queries.
		LOG.debug("Results:" + resultList.size() + " : " + Arrays.toString(resultList.toArray()));
		// Hits including terms on list 3 get a warning flag
		int flagged = 0;
		for (GeneQueryResult gr: resultList) {
			gr.setThirdPartyBean(tpbm.getBeanForFbId(gr.getDriverRef()));
			for (OntBean ob: beanList4) {
				LOG.debug("Comparing: >" + gr.getLocationRef() + "< ? >" + ob.getId() + "< : " + gr.getLocationRef().equals(ob.getId()));
				if (gr.getLocationRef().equals(ob.getId())) {
					// dodgy item
					// LOG.debug("Flagging item! " + gr.getLocation());
					gr.setFlag(true);
					flagged++;
				}
			}
		}
		LOG.debug("Running for: "  + id + " Total records found: " + resultList.size() + " Flagged: " + flagged);
		long endTime = System.currentTimeMillis();
		LOG.debug("Total elapsed time in execution of method callMethod() is :"+ (endTime-startTime));
		return resultList;
	}

	public void setQueryDAO(GeneQueryDAO queryDAO) {
		//LOG.info("Query Dao :" +  queryDAO);
		this.queryDAO = queryDAO;
	}

	public void setObm(OntBeanManager obm) {
		this.obm = obm;
	}

	public void setTpbm(ThirdPartyBeanManager tpbm) {
		this.tpbm = tpbm;
	}



}
