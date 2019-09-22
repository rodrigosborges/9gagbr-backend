const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const { insertPost, updatePost, deletePost, listPost, search } = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))
const fs = require('fs')
const { Validator } = require('node-input-validator')
const isImage = require('is-image');
const multer = require('multer')

router.get('/:data?', (req, res, next) => {
    listPost(req.params,res);
})

router.post('/search', (req, res, next) => {
    search(req.body, res);
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../..', 'public', 'storage', 'post'))
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage:storage })

router.post('/', upload.single('path'),(req, res, next) => {   
    var data = req.body
    data['path'] = data.title+'-'+Date.now()+'.'+req.file.originalname.split('.')[1]
    console.log(req.file)
    const v = new Validator(req.body, {
        title: 'required',
        path: 'required',
        category_id: 'required'
      })  
      v.check().then((matched) => {
        if (!matched) 
            res.send('Dados incorretos')
        else
        insertPost(data, res)
        fs.renameSync(req.file.path, path.join(req.file.destination, data['path']));
      })
  
})

router.put('/:id', upload.single('path'),(req, res, next) => {
    if(req.body._method != "PUT")
        return next()

    var data = req.body
    data['path'] = data.title+'-'+Date.now()+'.'+req.file.originalname.split('.')[1]
    const v = new Validator(req.body, {
        title: 'required',
        path: 'required',
        category_id: 'required'
      })  
      v.check().then((matched) => {
        if (!matched || !isImage(req.file.originalname)) 
            res.send('Dados incorretos')
        else
        updatePost(req.params.id, data, res)
        fs.renameSync(req.file.path, req.file.destination + data['path']);
      })
})

router.delete('/:id', (req, res) => {
    deletePost(req.params.id,res)
})


module.exports = router