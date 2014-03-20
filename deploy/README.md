# Deployment scripts

Note: All scripts run in base directory (../ from here).

##For local editing of files compressed in GITHUB repository

**Compressed file types are: *.wlz**

De/Re-compresses wlz files as files tend to be over Github max file size limit

Run deploy/decompress.sh in base directory (../ from here) to make local copies available for you to update.

Note: Ensure you do this before editing and after a pull from GITHUB to ensure you don't edit an old copy.

Once your edit is complete then:

Run deploy/compress.sh in base directory (../ from here) to overwrite the compressed copies with your local copies.

Note: this will affect all compressed files (see list above) not just edited so ensure the decompress was done first.

The local copies will be kept but git ignores them so they won't be pushed.

##Server deployment 

These scripts add filters, decompress files, and force settings for that deployment before building.

They are only for use on the relivant servers.

#GitHub Edit / Deployment Flow
![Flowchart](https://raw.github.com/VirtualFlyBrain/VFB/master/deploy/VFB%20GITHUB.png)
**Key:** 
..*Yellow boxes are actions recomended to be carried out on the GitHub website rather than through git / local git SW.

#Sandbox Server Allocations

Current allocations:

| Server | User | For | Notes |
| ------ | ---- | --- | ----- |
| Sandbox | dosumis | General OWL/DB Query improvements | Server not yet deployed |
| Sandbox1 | Robbie1977 | Thoracico-abdominal Ganglion addition and testing | Being accessed by selcted outside users |
| Sandbox2 | Free |  | Server not yet deployed |
| Sandbox3 | Free |  | Server not yet deployed |

