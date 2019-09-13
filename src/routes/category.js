const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const { insertCategory, updateCategory, deleteCategory, listCategory } = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))
const fs = require('fs')
const { Validator } = require('node-input-validator')
const isImage = require('is-image');
const multer = require('multer')

router.get('/', (req, res, next) => {
    listCategory(res)
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

router.post('/', upload.single('path'),(req, res, next) => {    
    var data = req.body
    data['path'] = data.name+'-'+Date.now()+'.'+req.file.originalname.split('.')[1]
  
    const v = new Validator(req.body, {
        name: 'required',
        path: 'required'
      })  
      v.check().then((matched) => {
        if (!matched || !isImage(req.file.originalname)) 
            res.send('Dados incorretos');
      })

    fs.renameSync(req.file.path, req.file.destination + data['path']);
    insertCategory(data, res)
})

router.put('/:id', upload.single('path'),(req, res, next) => {
    if(req.body._method != "PUT")
        return next()

    var data = req.body
    data['path'] = data.name+'-'+Date.now()+'.'+req.file.originalname.split('.')[1]
     const v = new Validator(req.body, {
        name: 'required',
        path: 'required'
      })  
      v.check().then((matched) => {
        if (!matched || !isImage(req.file.originalname)) 
            res.send('Dados incorretos');
      })
    fs.renameSync(req.file.path, req.file.destination + data['path']);
    updateCategory(req.params.id, data, res)

})

router.delete('/:id', (req, res) => {
    deleteCategory(req.params.id,res)
})


module.exports = router