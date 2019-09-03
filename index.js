const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userRouter = require('./src/routes/user')
const path = require('path')
const {insertUser} = require('./src/util/database.js')

/*
CRUD de posts
CRUD de users
Login
Like
Deslike
Comentário
*/

app.set('view engine', 'ejs')
app.set('views', 'src/views')

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/user', userRouter)

//404 
app.use((req, res, next) => {
    res.status(404).send('<h3>Página não encontrada<h3>')
})

const server = http.createServer(app)

server.listen(3000)