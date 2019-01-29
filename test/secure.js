const BackupArcGISService = require('../index.js')
const axios = require('axios')
require('dotenv').config()

if(require.main == module) {
    axios({
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: 'https://www.arcgis.com/sharing/rest/generateToken',
        params: {
            'username': `${process.env.ARCGIS_USERNAME}`,
            'password': `${process.env.ARCGIS_PASSWORD}`,
            'referer': 'localhost',
            'f': 'json'
        },
        responseType: 'json',
    }).then(function (response) {
        if(!response.data.token) {
            console.log('No Token Returned.  Check Credentials')
        } else {
            console.log(response.data.token)
            const outDir = './secure'
            const Backup = new BackupArcGISService('https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/1548710379770/FeatureServer/0', outDir, response.data.token)
            Backup.run().then((resp) => {
                if(!resp.duplicate) {
                    console.log(`${resp.serviceDetails.name} completed: ${resp.filename}`)
                } else {
                    console.log(`No updates to ${resp.serviceDetails.name}.`)
                }
            })
        }
    })
    
}