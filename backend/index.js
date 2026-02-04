import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectToDB from './config/db.js'
import http from 'http'



import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import connectionRouter from './routes/connection.route.js'
import { Server } from 'socket.io'
import notificationRouter from './routes/notification.route.js'



const app = express()
const server = http.createServer(app)
export const io = new Server(server,{
    cors:({
        origin:'https://linkedin-frontend-8rer.onrender.com',
        credentials:true
    })
})
const port = process.env.PORT || 8000
app.use(express.json())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send('Server is Live')
})
app.use(cors({
    origin:'https://linkedin-frontend-8rer.onrender.com',
    credentials:true
}))


app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)
app.use('/api/connection',connectionRouter)
app.use('/api/notification',notificationRouter)

export const userSocketMap = new Map()


io.on('connection',(socket)=>{
    console.log('userconectd',socket.id)
    socket.on('register',(userId)=>{
        userSocketMap.set(userId,socket.id)
    })

    socket.on('disconnect',(socket)=>{
        console.log('user disconnect',socket.id)
    })
})

server.listen(port,()=>{
    connectToDB()
    console.log(`Server is running on port ${port}`)
})
