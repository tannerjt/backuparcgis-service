const BackupArcGISService = require('../index.js')

if(require.main == module) {
    const outDir = './require'

    const Backup1 = new BackupArcGISService('https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/state_parks/FeatureServer/0', outDir)
    Backup1.run().then((resp) => {
        if(!resp.duplicate) {
            console.log(`${resp.serviceDetails.name} completed: ${resp.filename}`)
        } else {
            console.log(`No updates to ${resp.serviceDetails.name}.`)
        }
    })
 
    const Backup2 = new BackupArcGISService('https://services.arcgis.com/uUvqNMGPm7axC2dD/ArcGIS/rest/services/Brookings_Sites/FeatureServer/0', outDir)
    Backup2.run().then((resp) => {
        if(!resp.duplicate) {
            console.log(`${resp.serviceDetails.name} completed: ${resp.filename}`)
        } else {
            console.log(`No updates to ${resp.serviceDetails.name}.`)
        }
    })

    const Backup3 = new BackupArcGISService('https://services.arcgis.com/uUvqNMGPm7axC2dD/ArcGIS/rest/services/Business_Oregon_Industrial_Sites/FeatureServer/0', outDir)
    Backup3.run().then((resp) => {
        if(!resp.duplicate) {
            console.log(`${resp.serviceDetails.name} completed: ${resp.filename}`)
        } else {
            console.log(`No updates to ${resp.serviceDetails.name}.`)
        }
    })

    const Backup4 = new BackupArcGISService('https://services.arcgis.com/uUvqNMGPm7axC2dD/ArcGIS/rest/services/OREGON_EDUCATIONAL_BOUNDARIES/FeatureServer/0', outDir)
    Backup4.run().then((resp) => {
        if(!resp.duplicate) {
            console.log(`${resp.serviceDetails.name} completed: ${resp.filename}`)
        } else {
            console.log(`No updates to ${resp.serviceDetails.name}.`)
        }
    })
}