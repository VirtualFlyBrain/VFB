package uk.ac.ed.vfb.dao.client_server;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import uk.ac.ed.vfb.dao.client_server.server_includes.DLQueryServer;
import uk.ac.ed.vfb.dao.client_server.server_includes.OntQueryQueue;
import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.web.exception.SessionExpiredException;

/** Wrapper for uk.ac.ed.vfb.dao.client_server.server_includes.DLQueryServer
 *  Starts up the reasoning server with parameters specified in the resources.properties file.
 *  The server then waits for connection from OWLClient on designated port (default 5555)
 *  Started up from an external script in a daemon-like fashion
 *  @author nmilyaev
 */

public class Server {
	private static DLQueryServer dlQueryServer = null;
	protected static String host;
	protected static int port;
	public static String BIND_NAME = "OntServer";
	private ServerSocket serverSocket = null;
	private static final Log LOG = LogFactory.getLog(Server.class);

	static {
		ResourceBundle bundle = ResourceBundle.getBundle("resources");
		Server.port = Integer.valueOf(bundle.getString("ont_port"));
		Server.host = bundle.getString("ont_host");
	}

	/**
	 * Default constructor
	 */
	public Server() {
		//LOG.debug("Creating a server: " + this);
		this.init();
	}

	/**
	 * In this method we try to serve connections from client
	 */
	public void serveClients(){
		LOG.info("ServeClients: " + this);
		try {
			serverSocket = new ServerSocket(Server.port, 0, InetAddress.getByName(Server.host));
			LOG.info("Wainting for a connection on : " + serverSocket.getLocalSocketAddress());
			while(true){
				ClientHandler thread = new ClientHandler(serverSocket);
				thread.start();
//				try {
//					Thread.sleep(100);
//				} catch (InterruptedException e) {
//					e.printStackTrace();
//				}
				//LOG.debug("Got a connection");
			}
		}
		catch (IOException ex) {
			// Access from wrong location or otherwise problem with connection
			ex.printStackTrace();
		}
	}
	/**
	 * Creates all the required servers based on Spring context
	 */
	private void init() {
		// To run it from Eclipse
		//Resource res = new FileSystemResource("build/classes/beans.xml");
		// To run it from command-line
		Resource res = new FileSystemResource("beans.xml");
		dlQueryServer = new DLQueryServer();
		//serverSocket = new ServerSocket(SocketClient.serverPort, 0);
		this.serveClients();
	}

	public OntBean getBeanForId(String fbbtId){
		return dlQueryServer.getBeanForId(fbbtId);
	}

	public static void main (String[] argv) {
		LOG.info("Starting ontology server...");
		Server server = new Server();
	}

	/**
	 * The class that serves user requests
	 * @author nmilyaev
	 *
	 */
	public  class ClientHandler extends Thread {
		Socket clientSocket = null;
		private ObjectOutputStream out = null;
		private ObjectInputStream in = null;
		private String query;
		Set<OntBean> results;
		/**
		 * constructor
		 * @throws IOException
		 */
		public ClientHandler(ServerSocket serverSocket) throws IOException {
			this.clientSocket = serverSocket.accept();
			//LOG.debug("Client socket : " + clientSocket.getInetAddress() + " host: " + clientSocket.getInetAddress().getCanonicalHostName());
			if (!clientSocket.getInetAddress().getCanonicalHostName().equals(Server.host)){
				clientSocket.close();
			}
		}

		/**
		 * here we send object to client
		 * @param oUserinfo
		 */
		public void sendObjectToClient(Set<OntBean> results){
			try {
				out.writeObject(results);
			} catch (IOException ex) {
				LOG.error("IOException writing OntServer result(s): " + results);
				ex.printStackTrace();
			}
		}

		/**
		 * Running thread
		 */
		public void run() {
			try {
				in = new ObjectInputStream(clientSocket.getInputStream());
				out = new ObjectOutputStream(clientSocket.getOutputStream());
				this.query = (String) in.readObject();
				LOG.info("Query: " + query);
				//We assume that query should either start with one of OntQueryQueue.QUERY_TYPES or
				// the query type will be missing - for the getBeanForId(id) queries
				OntQueryQueue oqq = new OntQueryQueue(query);
				if (oqq.getQueryType() == null || oqq.getQueryType().equals("")){
					//it's a single  id query
					this.results =  new TreeSet<OntBean>();
					String fbbtId = oqq.getQueries().get(0);
					OntBean ob = dlQueryServer.getBeanForId(fbbtId);
					LOG.info("Returning single OntBean: " + ob);
					this.results.add(ob);
				}
				else {
					// it's a list query
					this.results =  dlQueryServer.askQuery(this.query);
				}
				sendObjectToClient(this.results);
			} catch (IOException ex) {
				LOG.error("Ontology server IOException:");
				ex.printStackTrace();
				sendObjectToClient(this.results);
			} catch (ClassNotFoundException ex) {
				LOG.error("Ontology server ClassNotFoundException:");
				ex.printStackTrace();
				sendObjectToClient(this.results);
			} catch (NullPointerException ex) {
				LOG.error("Ontology server NullPointerException:");
        ex.printStackTrace();
				sendObjectToClient(this.results);
      } finally {
				try {
					out.close();
					//LOG.debug("Output stream closed.");
				} catch (IOException ex) {
					LOG.error("IOException closing OntServer request: " + results);
					ex.printStackTrace();
				}

			}
		}
	}


}
