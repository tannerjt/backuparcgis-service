const fs = require('fs')


function exists(path) {
    return new Promise(function (resolve, reject) {
        try {
            fs.exists(path, (exists) => {
                resolve(exists)
            })
        } catch (err) {
            reject(err)
        }
    })
}

function readdir(path) {
    return new Promise(function (resolve, reject) {
        fs.readdir(path, (err, files) => {
            if(err) {
                reject(err)
            }
            resolve([...files])
        })
    })
}

// exists, readdir, mkdir, rename, unlink, rename

module.exports = {
    exists, readdir
}
