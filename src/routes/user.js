const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const {insertUser, deleteUser, updateUser} = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir,'src','views','user','form.html'))
})

router.post('/', (req, res, next) => {    
    insertUser(req.body, res)  
})

router.put('/:id', (req, res, next) => {
    if(req.body._method != "PUT")
        return next()
        
    updateUser(req.params.id,req.body,res)
})

router.delete('/:id', (req, res) => {    
    deleteUser(req.params.id, res)
})


module.exports = router