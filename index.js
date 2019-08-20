const http = require('http')
const express = require('express')
const fs = require('fs')
const app = express()
const bodyParser = require('body-parser')
const rootDir = require('./src/util/rootDir')
const userRouter = require('./src/routes/user')
const path = require('path')
/*
CRUD de posts
CRUD de users
Login
Like
Comentário
*/

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/user', userRouter)

//404 
app.use((req, res, next) => {
    res.status(404).send('<h3>Página não encontrada<h3>')
})

const server = http.createServer(app)

server.listen(3000)