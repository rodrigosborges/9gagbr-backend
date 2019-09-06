const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const { insertCategory, updateCategory, deleteCategory } = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))
const fs = require('fs');

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir,'src','views','category','form.html'))
})

router.post('/store', (req, res, next) => {   
    fs.readFile(req.body.path, function (err, data) {
        var imageName = req.body.name
        if(!imageName){
            console.log("There was an error")
            res.redirect("/");
            res.end();
        } else {
            var newPath = path.join(__dirname, '../storage/category/'+imageName)
            fs.writeFile(newPath, data, function (err) {
            var formdata = `{"name": "${req.body.name}", "path": "${req.body.path}"}` 
            insertCategory(JSON.parse(formdata),res)
            console.log('deu certo')
          });
        }
    });
})

router.get('/update', (req, res, next) => {
    updateCategory(7, res)
})

router.get('/delete', (req, res, next) => {
    deleteCategory(6, res)
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