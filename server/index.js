const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

const router =  require('./router')
const {addUser, removeUser, getUser, getUsersInRoom} = require( './users')

const PORT = process.env.PORT || 5001

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(router)
app.use(cors())

//在socket.io连接的时候，里面socket接收(on)一些自定义事件或者预定义好的事件时，所做的操作
io.on('connect',(socket) => {
  socket.on('join',({name,room},callback) => {
    const {error,user} = addUser({id:socket.id,name,room})
    if(error){
      return callback(error)
    }
    //加入某个room
    socket.join(user.room)
    //把相关信息emit出去，方便client端接收
    socket.emit('message', {user: 'admin',text: `${user.name},welcome to room ${user.room}`})
    //把信息除了自己其他的所有人都接收
    socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has joined`})

    io.to(user.room).emit('roomData', {room:user.room,users:getUsersInRoom(user.room)})

    callback()
  })

  socket.on('sendMessage', (message,callback) => {
    const user = getUser(socket.id)

    io.to(user.room).emit('message',{user:user.name,text:message})

    callback()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if(user){
      io.to(user.room).emit('message',{user: 'Admin',text:`${user.name} has left`})
      //有人离开之后，房间里的个人信息也变化了
      io.to(user.room).emit('roomData',{room:user.room,user:getUsersInRoom(user.room)})
    }
  })
})

server.listen(PORT,() => {
  console.log(`Server has started on port ${PORT}`)
})
