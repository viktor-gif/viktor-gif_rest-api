const WebSocket = require('ws')
const http = require('http')
const app = require('./app');
const chat = require('./models/chat');
const port = process.env.PORT || 3500

// const server = app.listen(port, () => {
//     console.log(`App listen on port ${port}`);
// })

const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

io.on('connection', (socket) => {
    io.emit('data', {someData: `DATA______`})
    socket.on('my event', (data) => {
        io.emit('data', data)
        // console.log(data)
    })
    console.log('a user connected_______-------_____');
});

server.listen(port, () => {
    console.log(`App listen on port ${port}`);
})

// const Chat = require('./models/chat')

// const wsServer = new WebSocket.Server({port: 4000})

// wsServer.on('connection', ws => {
//     ws.on('message', message => {
//         if (message === 'exit') {
//             ws.close()
//         } else {
//             wsServer.clients.forEach(async client => {
//                 if (client.readyState === WebSocket.OPEN) {
//                     const newMessage = new Chat({
//                         authorId: 'gsfdd' + Math.random(),
//                         messageText: message.toString()
//                     })
//                     await newMessage.save()
//                     client.send(message.toString())
//             }
//         })
//         }
//     })
// })