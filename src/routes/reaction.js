const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const { insertReaction,countReaction } = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))

router.post('/', (req, res, next) => {   
    insertReaction(req.body, res)
})



module.exports = router
