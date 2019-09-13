const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const { insertPost, updatePost, deletePost, listPost } = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))
const fs = require('fs')
const { Validator } = require('node-input-validator')
const isImage = require('is-image');
const multer = require('multer')

router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir,'src','views','post','form.html'))
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../storage/post/'))
    },
    filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage:storage })

router.post('/', upload.single('path'),(req, res, next) => {   
    var data = req.body
    data['path'] = data.title+'-'+Date.now()+'.'+req.file.originalname.split('.')[1]
    const v = new Validator(req.body, {
        title: 'required',
        path: 'required',
        category_id: 'required'
      })  
      v.check().then((matched) => {
        if (!matched || !isImage(req.file.originalname)) 
            res.send('Dados incorretos');
      })
    
    fs.renameSync(req.file.path, req.file.destination + data['path']);
    insertPost(data, res)
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
            res.send('Dados incorretos');
      })
    
    fs.renameSync(req.file.path, req.file.destination + data['path']);
    updatePost(req.params.id, data, res)
})

router.get('/list', (req, res) => {
    listPost(res);
})

router.delete('/:id', (req, res) => {
    deletePost(req.params.id,res)
})


module.exports = router