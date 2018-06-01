const axios = require('axios')

async function send(_tx) {
    return await axios.post('http://localhost:5000/send', _tx)
}

module.exports = { send }

