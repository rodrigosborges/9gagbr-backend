const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const { insertComment, updateComment, deleteComment } = require('../util/database.js')
const { Validator } = require('node-input-validator')
router.use(bodyParser.urlencoded({extended:false}))


router.post('/', (req, res, next) => {
const v = new Validator(req.body, {
        message: 'required',
        post_id: 'required',
        user_id: 'required'
     })  
      v.check().then((matched) => {
        if (!matched) 
            res.send('Dados incorretos');
      })
    
    insertComment(req.params.id, req.body, res)
})

router.put('/:id', (req, res, next) => {
    if(req.body._method != "PUT")
        return next()
    
     const v = new Validator(req.body, {
        message: 'required',
        post_id: 'required',
        user_id: 'required'
     })  
      v.check().then((matched) => {
        if (!matched) 
            res.send('Dados incorretos');
      })
    
    updateComment(req.params.id, req.body, res)

})

router.delete('/:id', (req, res) => {
    deleteComment(req.params.id,res)
})

module.exports = router