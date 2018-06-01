const fs = require('fs')

// returns most recent transaction
function getTx() {
    try {
        // get most recent json file
        const channel = fs.readdirSync(`${__dirname}/../tx`).sort().reverse()[0]
        // read json file
        const sentTx = JSON.parse(fs.readFileSync(`${__dirname}/../tx/${channel}`, 'utf8'))
        // get latest tx
        return sentTx[sentTx.length - 1]
    } catch (e) {
        console.log(e)
        return false
    }
}

module.exports = { getTx }