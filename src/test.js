const io = require('socket.io-client')
const socket = io.connect('ws://localhost:3001',{query:{computer:true}})