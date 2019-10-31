package uk.ac.ed.vfb.web.csvviewer;

import java.util.Iterator;

import uk.ac.ed.vfb.model.OntBean;
import uk.ac.ed.vfb.service.*;

/**
 * View that returns a current list of OntBeans from the session-bound OntQueryManager as a CSV file
 * Thus, it sends the result of the most recent ontology-based query (eg find neuron..)
 * Used in conjunction with the CsvController
 * @author nmilyaev 
 */

public class CsvQueryView  extends CsvViewer {
	
	public CsvQueryView(APageable manager) {
		super(manager);
	}

	protected void renderOutput(){
		String line = "";  
		LOG.debug("Mamager: " + manager);
		@SuppressWarnings("unchecked")
		String link = "";
		Iterator<OntBean> it = manager.getResultSet().iterator();
		line = "\"Name\",\"Definition\",\"Id\",\"Link\"\n";
		writer.write(line);
		while (it.hasNext()) {
			OntBean curr = it.next();
			if (curr.correctIdFormat().contains("VFB")){
				link = "=HYPERLINK(\"http://www.virtualflybrain.org/" + curr.correctIdFormat() + "\")";
			}else{
				link = "=HYPERLINK(\"http://www.virtualflybrain.org/site/stacks/index.htm?id=" + curr.correctIdFormat() + "\")";
			}
			line = "\"" + curr.getName() + "\",\"" + curr.getDef() + "\",\"" + curr.correctIdFormat() + "\"," + link + "\n";
			writer.write(line);
		}
	}

}
