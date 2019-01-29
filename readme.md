## BackupArcGIS

Async module to backup content from ArcGIS Online hosted feature services.

## About

Hosted Feature Services in ArcGIS Online are a great way to host and serve geospatial data into your online maps.  The infrastructure of ArcGIS Online has proven to be performant and highly available.  There is, however, always a chance your mission critical services will run into issues.  ArcGIS Online outages, accidental deletion, or service corruption can all happen.  It's best to be prepared and at least have a backup of your data on hand.

This library, *BackupArcGIS*, is a performant asynchronous streaming nodejs library that can be imported as a nodejs module or run directly from command line.

## Features

### Asynchronous 

BackupArcGIS is asynchronous and returns a promise when complete.

### Versioned

BackupArcGIS only stores a backup of the data if changes has been made.  It uses sha256 hashing algorithm to compare new and existing backups.  Only services with new data are backed up, saving space.

### Streaming

BackupArcGIS streams feature service content directly to a file and does not store it in memory.  This allows the script to run faster and avoid memory issues with larger datasets.

## Use require()

```bash
$ npm install backuparcgis
```

```javascript
const BackupArcGIS = require('backuparcgis')

// new BackupArcGIS(serviceURL, archiveDirectory)
const Backup = new BackupArcGIS('https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/state_parks/FeatureServer/0', outDir)

Backup.run().then((resp) => {
    if(!resp.duplicate) {
        console.log(`${resp.serviceDetails.name} completed: ${resp.filename}`)
    } else {
        console.log(`No updates to ${resp.serviceDetails.name}.`)
    }
})
```

## Run from command line

```bash
$ npm install backuparcgis
```

**Format:**

*backuparcgis serviceUrl archiveDirectory*

```bash
#!/bin/bash

backuparcgis https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/state_parks/FeatureServer/0 ./terminal
backuparcgis https://services.arcgis.com/uUvqNMGPm7axC2dD/ArcGIS/rest/services/Brookings_Sites/FeatureServer/0 ./terminal
```

## Response

The library will respond with a promise with the following object:

```json
{
    "duplicate": "boolean",
    "serviceDetails": "object",
    "filename": "string"
}
```