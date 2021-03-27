const express = require('express')
const bodyParser = require('body-parser')

const api = require('./api')

const app = express()

const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', api)

app.listen(PORT)