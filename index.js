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

require('dotenv').config();

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))

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

server.listen(process.env.PORT || 3001)