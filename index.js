const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const userRouter = require('./src/routes/user')
const categoryRouter = require('./src/routes/category')
const postRouter = require('./src/routes/post')
const reactionRouter = require('./src/routes/reaction')
const commentRouter = require('./src/routes/comment')
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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.set('view engine', 'ejs')
app.set('views', 'src/views')

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/user', userRouter)
app.use('/category', categoryRouter)
app.use('/post', postRouter)
app.use('/reaction', reactionRouter)
app.use('/comment', commentRouter)

//404 
app.use((req, res, next) => {
    res.status(404).send('<h3>Página não encontrada<h3>')
})

const server = http.createServer(app)

server.listen(3001)