const express = require('express')
const rootDir = require('../util/rootDir')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const { insertPost, updatePost, deletePost, listPost, search, findPost, findPostUser } = require('../util/database.js')
router.use(bodyParser.urlencoded({extended:false}))
const fs = require('fs')
const { Validator } = require('node-input-validator')
const multer = require('multer')

router.get('/:data?', (req, res, next) => {
    if(req.query.page === undefined || req.query.page == 0)
        page = 1
     else 
        page = +req.query.page; 
    listPost(req.params,page,res);
})

router.post('/search', (req, res, next) => {
    if(req.query.page === undefined || req.query.page == 0)
        page = 1
     else 
        page = +req.query.page; 
    search(req.body, page, res);
})

router.get('/find/:id', (req, res, next) => {
    findPost(req.params, res)
})

router.get('/user/:user_id', (req, res, next) => {
    findPostUser(req.params, res)
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
    var ext = req.file.originalname.split('.').pop()
    data['path'] = data.title+'-'+Date.now()+'.'+ext
    const v = new Validator(req.body, {
        title: 'required|minLength:3|maxLength:50',
        path: 'required',
        category_id: 'required',
        user_id: 'required',
      })  
      v.check().then((matched) => {
        if (!matched || !['jpg', 'jpeg', 'png', 'webm', 'mp4', 'gif'].includes(ext)) 
            res.json({ "message":"'Dados incorretos'" })
        else
            insertPost(data, res)
            fs.renameSync(req.file.path, path.join(req.file.destination, data['path']));
      })
  
})

router.put('/:id', (req, res, next) => {

    const v = new Validator(req.body, {
        title: 'required|minLength:3|maxLength:50',
        category_id: 'required'
    })  

    v.check().then((matched) => {
        if(!matched)
            res.json({ "message":"Dados incorretos" })
        else
        updatePost(req.params.id, req.body, res)
    })   
})


router.delete('/:id', (req, res) => {
    deletePost(req.params.id,res)
})


module.exports = router