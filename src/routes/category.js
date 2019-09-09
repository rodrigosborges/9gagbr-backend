const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const { insertCategory, updateCategory, deleteCategory } = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))
const fs = require('fs')
const multer = require('multer')
//const upload = multer({ dest: '../storage/category/' });

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir,'src','views','category','form.html'))
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../storage/category/'))
    },
    filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage:storage })

router.post('/store', upload.single('path'),(req, res, next) => {   
    var formdata = `{"name": "${req.body.name}", "path": "${req.file.originalname.split('.')[0]}"}` 
    if (req.file) {
        fs.renameSync(req.file.path, req.file.destination + req.body.name+'-'+Date.now()+'.'+req.file.originalname.split('.')[1]);
    }
    insertCategory(JSON.parse(formdata),res)
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