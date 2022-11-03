import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv';
dotenv.config();

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, { cors: { origin: '*' } })

app.use(express.static(path.join(__dirname, "public")))

let buttonState = false;

io.on('connection', socket => {
    console.log('New Connection');

    io.to(socket.id).emit('buttonState', buttonState);

    socket.on('disconnect', () => {
        console.log('Disconnected');
    })

    socket.on('buttonState', value => {
        console.log('buttonState: ', buttonState);
        buttonState = value;
        socket.broadcast.emit('buttonState', value);
    })
})

app.get('/', (req, res) => {
    res.render('index.html')
})

httpServer.listen(process.env.PORT || 4001, () => {
    console.log('Running on PORT: ', httpServer.address());
});