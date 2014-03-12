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

#GitHub Repo Flow
![Flowchart](https://raw.github.com/VirtualFlyBrain/VFB/master/deploy/VFB%20GITHUB.png)
