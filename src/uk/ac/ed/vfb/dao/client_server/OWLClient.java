package uk.ac.ed.vfb.dao.client_server;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;
import java.util.Iterator;
import java.util.Set;
import java.util.TreeSet;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.model.ThirdPartyBean;
import uk.ac.ed.vfb.service.ThirdPartyBeanManager;

/**
 * Client for Ontology Server.
 * Receives a query from application component (eg., OntBeanManager) and passes it on to the ont server.
 * Uses sockets, supports multi-threading
 * Returns a set of OntBeans
 *
 */

public class OWLClient {
	//private String query = null;
	private ThirdPartyBeanManager tpbm;
	private static final Log LOG = LogFactory.getLog(OWLClient.class);

	public OWLClient() {
		super();
		//LOG.debug("Creating a client: " + this);
	}


	public static void main (String[] argv) {
		OWLClient client = new OWLClient();
		if (argv != null && argv.length > 0) {
			try {
				Set<OntBean> results = client.askQuery(argv[0]);
				//LOG.info("Asking query: " + argv[0] + " \nResults found: " + results.size());
			} catch (Exception e) {
				e.printStackTrace();
				LOG.error("HelloClient exception: " + e.getMessage());
			}
		}
		else{
			try {
				//IOntRMIQuery hello = (IOntRMIQuery) Naming.lookup ("//localhost/OntServer");
				System.out.println (client.askQuery("subclass&FBbt_00040069"));
				System.out.println (client.askQuery("subclass&FBbt_00040069"));
				System.out.println (client.getBeanForId("FBbt_00040069"));
				//System.out.println (client.askQuery("individual&'neuron' that 'overlaps' some 'medulla'"));
				//System.out.println (client.getBeanForId("FBbt:00003744"));
			} catch (Exception e) {
				LOG.error("HelloClient exception: " + e.getMessage());
			}
		}
	}

	/**
	 * For a given query string, obtains a set of OntBeans
	 * @param query
	 * @return Set<OntBean>
	 */
	public Set<OntBean> askQuery(String query){
		//LOG.debug("Asking query: " + query);
		try {
			Set<OntBean> results = this.askServer(query);
			//LOG.debug("Query results: " + results);
			return results;
		}catch (Exception e){
			LOG.error("Ask ontology server exception: " + e.getMessage());
			return null;
		}
	}

	/**
	 * Given an fbbtId, returns single OntBean with corresponding id.
	 * Works for classes only?
	 * @param fbbtId
	 * @return
	 */
	public OntBean getBeanForId(String fbbtId){
		OntBean result = null;
		//LOG.debug("getBeanForId: " + fbbtId);
		fbbtId = OntBean.correctIdFormat(fbbtId);
		Set<OntBean> results =  this.askQuery(fbbtId);
		//LOG.debug("askQuery results: " + results);
		if (results!=null) {
			Iterator<OntBean> it = results.iterator();
			if (it.hasNext()){
				result =  it.next();
			}
			//LOG.debug("result: " + result);
		}else{
			LOG.error("null result for OWLClient.getBeanForId(" + fbbtId + ")");
		}
		return result;
	}

	/**
	 * Main method for communicating with ontology Server.
	 * Starts a thread per request
	 * @param query
	 * @return
	 */
	private Set<OntBean> askServer(String query){
		Set<OntBean> results = new TreeSet<OntBean>();
		ObjectReading readerThread = new ObjectReading(query);
		readerThread.start();
		while (readerThread.isAlive()) {
			try {
				Thread.sleep(10);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		results = readerThread.getResults();
		return results;
	}

	public void setTpbm(ThirdPartyBeanManager tpbm) {
		this.tpbm = tpbm;
	}


	/**
	 * Worker Thread - the classthat does all the job in the tread
	 * @author nmilyaev
	 *
	 */
	class ObjectReading extends Thread {
		private Socket socket = null;
		private ObjectInputStream in = null;
		private ObjectOutputStream out = null;
		private String query = null;
		private Set<OntBean> results;

		public ObjectReading(String query){
			this.query = query;
		}

		public Set<OntBean> getResults(){
			return this.results;
		}

		public void run() {
			try {
				//LOG.debug("Connectiong on : " + Server.host + " / " + Server.port);
				socket = new Socket(Server.host, Server.port);
				//LOG.debug("created socket:  " + socket.getInetAddress());
				//sending Objects to server(connection)
				out = new ObjectOutputStream(socket.getOutputStream());
				//Reading Object from socket
				in = new ObjectInputStream(socket.getInputStream());
				//Starting Thread
				out.writeObject(this.query);
				//LOG.debug("sent query:  " + this.query);
				out.flush();
				this.results = (Set<OntBean>) in.readObject();
			} catch (IOException ex) {
				LOG.error("IOException for query:  " + this.query);
				ex.printStackTrace();
			} catch (ClassNotFoundException ex) {
				LOG.error("ClassNotFoundException for query:  " + this.query);
				ex.printStackTrace();
			}
		}
	}

}
