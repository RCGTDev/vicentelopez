const express = require('express')

const app = module.exports = express()

app.use(require('../static-pages'))
app.use(require('../crear-anteproyecto'))
