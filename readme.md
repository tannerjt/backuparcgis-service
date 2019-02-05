## backuparcgis-service
backuparcgis-service to backup content from ArcGIS Online hosted feature services.

## About

Hosted Feature Services in ArcGIS Online are a great way to host and serve geospatial data into your online maps.  The infrastructure of ArcGIS Online has proven to be performant and highly available.  There is, however, always a chance your mission critical services will run into issues.  ArcGIS Online outages, accidental deletion, or service corruption can all happen.  It's best to be prepared and at least have a backup of your data on hand.

This library, *backuparcgis-service*, is a performant asynchronous streaming nodejs library that can be imported as a nodejs module or run directly from command line.

## Limitations

Large datasets can fail and timeout.  The script also does not store attachments.  For large datasets and backup of attachments, use [backuparcgis-item](https://github.com/tannerjt/backuparcgis-item).  backuparcgis-item uses the export functionality of ArcGIS Online to create an archived file geodatabase backup.

## Features

### Asynchronous 

backuparcgis-service is asynchronous and returns a promise when complete.

### Versioned

backuparcgis-service only stores a backup of the data if changes has been made.  It uses sha256 hashing algorithm to compare new and existing backups.  Only services with new data are backed up, saving space.

### Streaming

backuparcgis-service streams feature service content directly to a file and does not store it in memory.  This allows the script to run faster and avoid memory issues with larger datasets.

## Use require()

```bash
$ npm install backuparcgis-service
```

```javascript
const BackupArcGISService = require('backuparcgis-service')

// new BackupArcGIS(serviceURL, archiveDirectory, ?token)
const Backup = new BackupArcGISService('https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/state_parks/FeatureServer/0', outDir)

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
$ npm install backuparcgis-service --global
```

**Format:**

*backuparcgis-service serviceUrl archiveDirectory*

```bash
#!/bin/bash

backuparcgis-service https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/state_parks/FeatureServer/0 ./terminal
backuparcgis-service https://services.arcgis.com/uUvqNMGPm7axC2dD/ArcGIS/rest/services/Brookings_Sites/FeatureServer/0 ./terminal
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

## File Storage Format

A new archive directory will be created in your specified output directory.  Within the archive directory, a new folder will be created for each feature service, which is named the same as the item id in ArcGIS Online.  Data will be versioned by timestamp, only storing new datasets that are different from the previous export (sha256 hash comparisons).

```
archive  
└───arcgis_item_id
    │--timestamp.geojson
    │--timestamp.geojson
```
