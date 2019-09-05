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

router.post('/store', (req, res, next) => {    
    insertUser(req.body, res)  
})

router.get('/update', (req, res, next) => {
    updateUser(20, res)
})

router.get('/delete', (req, res, next) => {
    deleteUser(2, res)
})

router.put('/:id', (req, res, next) => {
    if(req.body._method != "PUT")
        return next()
        
    res.send(req.body)
})

router.delete('/:id', (req, res, next) => {
    if(req.body._method != "DELETE")
        return next()
    
    res.send(req.body)
})

module.exports = router