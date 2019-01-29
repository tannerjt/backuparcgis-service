#!/usr/bin/env node

const axios = require('axios')
const httpsPromise = require('./lib/https-promise')
const querystring = require('querystring')
const fs = require('fs')
const fsPromises = require('./lib/fs-promise')
const crypto = require('crypto')

class BackupArcGISService {

    constructor(url, dir, token) {

        if(!url || !dir) {
            throw new Error('2 Parameters Required (Service URL, Working Directory Path)')
        }

        this.serviceUrl = url
        this.workingDir = dir.slice(-1) == '/' ? dir.slice(0,-1) : dir
        this.serviceDetails = undefined
        this.duplicate = false
        this.token = token ? token : ''
        
    }

    // get itemId for file naming
    async getItemId() {

        try {
            const response = await axios.get(this.serviceUrl + '?f=json' + `&token=${this.token}`)
            this.serviceDetails = await response.data
            return this.serviceDetails.serviceItemId
        } catch (err) {
            console.log(err)
            process.exitCode = 1
        }

    }

    // stream service geojson to tmp directory
    async downloadFromService(itemId) {

        const params = {
            where: '1=1',
            outSR: '4326',
            returnGeometry: 'true',
            f: 'geojson',
            outFields: '*',
            token: this.token
        }

        try {
            const url = this.serviceUrl + "/query?" + querystring.stringify(params)
            const path = `${this.workingDir}/archive/tmp/${itemId}.geojson`
            const tmpHash = await httpsPromise(url, path)
            return {
                tmpPath: path,
                tmpHash: tmpHash
            }
        } catch (err) {
            console.log(err)
            process.exitCode = 1
        }

    }

    async compareLatest(itemId, tmpHash) {

        // get latest file in directory
        const files = await fsPromises.readdir(`${this.workingDir}/archive/${itemId}`)
        const latest = files[files.length - 1]
        const latestHash = await hashFile(`${this.workingDir}/archive/${itemId}/${latest}`, handleErr)
        if(tmpHash === latestHash) {
            return true
        }
        return false

    }

    async run(url, dir) {

        // check for archive and tmp directory
        const archiveExists = await fsPromises.exists(`${this.workingDir}/archive`)
        if(!archiveExists) {
            await fs.mkdir(`${this.workingDir}/archive`, (err) => {
                if(!(err && err.code === 'EEXIST')){
                    handleErr(err)
                } 
            })
        }
   
        const tmpExists = await fsPromises.exists(`${this.workingDir}/archive/tmp`)
        if(!tmpExists) {
            await fs.mkdir(`${this.workingDir}/archive/tmp`, (err) => {
                if(!(err && err.code === 'EEXIST')){
                    handleErr(err)
                } 
            })
        }
    
        const itemId = await this.getItemId()
        const {tmpPath, tmpHash} = await this.downloadFromService(itemId)
        const pathExists = await fsPromises.exists(`${this.workingDir}/archive/${itemId}`)
        const outFileName = `${this.workingDir}/archive/${itemId}/${Date.now()}.geojson`

        if(pathExists) {
            // path already exists, check file hashes
            const exists = await this.compareLatest(itemId, tmpHash)
            if(!exists) {
                await fs.rename(tmpPath, outFileName, handleErr)
            } else {
                // no updates to file, duplicate
                this.duplicate = true
                await fs.unlink(tmpPath, handleErr)
            }
        } else {
            // async version is causing issues
            fs.mkdirSync(`${this.workingDir}/archive/${itemId}`, handleErr)
            await fs.rename(tmpPath, outFileName, handleErr)
        }

        return {
            filename: this.duplicate ? false : outFileName,
            serviceDetails: this.serviceDetails,
            duplicate: this.duplicate
        }
    }
}

function handleErr(err) {

    if(err) throw err

}

function hashFile(path) {

    return new Promise(function (resolve, reject) {
        const hash = crypto.createHash('sha256')
        const input = fs.createReadStream(path)
        input.on('readable', () => {
            const data = input.read()
            if(data) {
                hash.update(data)
            } else {
                resolve(hash.digest('hex'))
            }
        })
        input.on('error', (err) => {
            reject(err)
        })
    })
    
}

if(require.main == module) {
    // if run as node process
    if ( process.argv.length < 4 ) {
        console.log('ArcGIS (Hosted) Feature Service URL and working directory path required')
        console.log('example: backuparcgis-service https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/state_parks/FeatureServer/0 ./')
        process.exitCode = 1
        return
    }

    const backup = new BackupArcGISService(process.argv[2], process.argv[3])
    backup.run().then((resp) => {
        if(!resp.duplicate) {
            console.log(`${resp.serviceDetails.name} completed: ${resp.filename}`)
        } else {
            console.log(`No updates to ${resp.serviceDetails.name}.`)
        }
    })
} else {
    // if run by require()
    module.exports = BackupArcGISService
}