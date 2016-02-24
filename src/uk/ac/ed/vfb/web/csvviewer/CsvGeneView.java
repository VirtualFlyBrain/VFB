package uk.ac.ed.vfb.web.csvviewer;

import java.util.*;

import uk.ac.ed.vfb.dao.db.pojo.GeneQueryResult;
import uk.ac.ed.vfb.service.*;

/**
 * View that returns a current list of GeneBeans from the session-bound GeneBeanManager as a CSV file
 * Thus, it sends the result of the most recent gene-like query (transgene, gene expression)
 * Used in conjunction with the CsvController
 * @author nmilyaev 
 */

public class CsvGeneView  extends CsvViewer {

	public CsvGeneView(APageable manager) {
		super(manager);
	}
	
	@Override
	protected void renderOutput(){
		String line = "";  
		String query = "";
		if (this.fileName.split(" ").length > 0 ){
			query = this.fileName.split("_")[0];
			query = query.substring(0, query.length()-1);
		}
		@SuppressWarnings("unchecked")
		Iterator<GeneQueryResult> it = manager.getResultSet().iterator();
		line = "\"Driver\",\"Location\",\"Reference\",\"Note\"\n";
		writer.write(line);
		while (it.hasNext()) {
			GeneQueryResult curr = it.next();
			line = "\"" + curr.getDriver() + "\",\"" + curr.getLocation() + "\",\"" + curr.getReferenceRef() + "\",\"" + (curr.getFlag()?"Note: " + query + " expression in this cell may be localised to regions of the cell that do not overlap the queried structure.":"") + "\"\n";
			writer.write(line);
		}
	}

}
