const https = require('https')
const fs = require('fs')
const crypto = require('crypto')

function httpsPromise(url, path) {
    const outfile = fs.createWriteStream(path)
    return new Promise(function(resolve, reject) {
        const hash = crypto.createHash('sha256')
        var req = https.get(url, function (res) {
            res.pipe(outfile)

            res.on('data', function (d) {
                hash.update(d)
            })

            res.on('end', function () {
                resolve(hash.digest('hex'))
            })
        })

        req.on('error', function (err) {
            reject(err)
        })

        req.end()
    })
}

module.exports = httpsPromise