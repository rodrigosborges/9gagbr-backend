const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const { insertCategory } = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))
const fs = require('fs');

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir,'src','views','category','form.html'))
})

router.post('/store', (req, res, next) => {    
    fs.readFile(req.body.path, function (err, data) {

        var imageName = req.body.path
        
        /// If there's an error
        if(!imageName){

            console.log("There was an error")
            res.redirect("/");
            res.end();

        } else {

          var newPath = __dirname + "/storage/category/" + imageName;

          /// write file to uploads/fullsize folder
          fs.writeFile(newPath, data, function (err) {

            /// let's see it
            res.redirect("/storage/category/" + imageName);

          });
        }
    });
    //insertCategory(req.body, res)
})

router.get('/update', (req, res, next) => {
    
})

router.get('/delete', (req, res, next) => {
    
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