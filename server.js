const cookieParser = require('cookie-parser');
const express = require('express')
const app = express()
const server = require('http').createServer(app)

const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})


const path = require('path')
const cors = require('cors')

require('dotenv').config({ path: path.resolve(__dirname, './server/config/.env') })
const sequelize = require('./server/config/db')

app.use(express.json({ extended: true }))
app.use(express.urlencoded());

app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003'],
    credentials: true //allow credentials (cookies etc)
}))

const router = require('./server/routes/router');
app.use('/api', router)

app.use('/static', express.static('./'))

let chatusers = []

io.on('connection', (socket) => {

    socket.on('connected', (userId) => {

        const socketId = socket.id
        !chatusers.some(user => user.userId === userId) && chatusers.push({ userId, socketId })
        io.emit('connected', chatusers)
    })

    socket.on('disconnect', () => {
        chatusers = chatusers.filter(user => user.socketId !== socket.id)

        io.emit('disconnected', chatusers)
        console.log(`user disconnected`)
    })


    socket.on('DIALOG:NEW_MESSAGE', ({ senderId, recieverId, mesdata }) => {
        const founduser = chatusers.find((user) => user.userId === recieverId)
        console.log(recieverId)
        if(founduser){
            io.to(founduser.socketId).emit('DIALOG:GET_MESSAGE', {
                senderId,
                mesdata
            })
        }
    })

    socket.on('DIALOG:LAST_MESSAGE', (mesdata) => {
        io.emit('DIALOG:LAST_MESSAGE', mesdata)
    })

    socket.on('DIALOG:EDIT_MESSAGE', (mesdata) => {
        io.emit('DIALOG:EDIT_MESSAGE', mesdata)
    })

    socket.on('DIALOG:DELETE_MESSAGE', (mesdata) => {
        io.emit('DIALOG:DELETE_MESSAGE', mesdata)
    })

    socket.on('DIALOG:NEW_DIALOG', (dialog) => {
        io.emit('DIALOG:NEW_DIALOG', dialog)
    })

    socket.on('DIALOG:LEAVE_DIALOG', (dialogId) => {
        io.emit('DIALOG:LEAVE_DIALOG', dialogId)
    })
})

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(process.env.PORT, () => { console.log(`The server is launched with PORT ${process.env.PORT}`) })
    } catch (e) {
        console.log(e)
    }
}

start()
