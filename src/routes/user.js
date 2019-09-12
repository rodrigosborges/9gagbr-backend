const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const { Validator } = require('node-input-validator')
const {insertUser, deleteUser, updateUser, listUser} = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir,'src','views','user','form.html'))
})

router.post('/', (req, res, next) => { 
    const v = new Validator(req.body, {
        name: 'required',
        email: 'required|email',
        password: 'required'
      });   
      v.check().then((matched) => {
        if (!matched) {
            res.send('Dados incorretos');
        }
      });

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