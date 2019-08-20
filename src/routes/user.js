const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')

router.use(bodyParser.urlencoded({extended:false}))

router.get('/new', (req, res, next) => {
    res.sendFile(path.join(rootDir,'src','views','user','form.html'))
})

router.post('/new', (req, res, next) => {
    res.send(req.body)
    // res.redirect('back')
})

module.exports = router