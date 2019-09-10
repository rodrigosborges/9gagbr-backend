const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userRouter = require('./src/routes/user')
const categoryRouter = require('./src/routes/category')
const postRouter = require('./src/routes/post')
const path = require('path')
var cors = require('cors');

/*
CRUD de posts
CRUD de users
Login
Like
Deslike
Comentário
*/
app.use(cors())
app.set('view engine', 'ejs')
app.set('views', 'src/views')

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/user', userRouter)
app.use('/category', categoryRouter)
app.use('/post', postRouter)

//404 
app.use((req, res, next) => {
    res.status(404).send('<h3>Página não encontrada<h3>')
})

const server = http.createServer(app)

server.listen(3001)