// set up server
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// middleware
app.use(bodyParser.json())

// send
app.use('/send', (req, res) => {
    const _tx = req.body
})


// listen
app.listen(process.env.PORT || 5000)