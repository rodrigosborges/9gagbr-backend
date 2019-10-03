const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const { makeReaction } = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))

router.post('/', (req, res, next) => {   
    makeReaction(req.body, res)
})



module.exports = router
