const io = require('socket.io')(3001)

var currentRoom = 0;
var alreadyOne = false;
function nextRoom() {
	alreadyOne = !alreadyOne
	currentRoom++;
}

io.set('origins', '*:*')

io.on('connect', socket=>{
	const sendRoom = currentRoom-currentRoom%2+1-currentRoom%2;
	const room = currentRoom;
	if (alreadyOne) {
		io.to(sendRoom).emit('otherplayer');
		socket.emit('otherplayer')
	}
	socket.join(currentRoom)
	socket.on('message',data=>io.to(sendRoom).send(data))
	socket.emit('setColor', {color:alreadyOne?'blackCircle':'whiteCircle'});
	socket.on('disconnect', ()=>{
		io.to(sendRoom).emit('disconnected')
		if (room == currentRoom-1) {
			alreadyOne=false;
			currentRoom+=currentRoom%2;
		}
	})
	socket.on('move', x=>io.to(sendRoom).emit('move',x))
	nextRoom()
})