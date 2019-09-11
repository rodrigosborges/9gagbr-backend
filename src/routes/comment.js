const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const { insertComment, updateComment, deleteComment } = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))

router.post('/', (req, res, next) => {
	insertComment(req.body, res);
})

router.put('/:id', (req, res, next) => {
    updateComment(req.params.id, req.body, res)

})

router.delete('/:id', (req, res) => {
    deleteComment(req.params.id,res)
})

module.exports = router