const io = require('socket.io')(3001)
const AI = require('./montecarlo/AI.js')
const Tree = require('./montecarlo/Tree.js')

var currentRoom = 0;
var alreadyOne = false;
function nextRoom() {
	alreadyOne = !alreadyOne
	currentRoom++;
}

io.set('origins', '*:*')

io.on('connect', socket=>{
	if (!JSON.parse(socket.handshake.query['computer'])) {
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
	} else {
		const agent = new AI(300)
		socket.emit('setColor',{color:'blackCircle'})
		socket.emit('otherplayer')
		socket.emit('move',agent.runMove())
		socket.on('move',o=>{
			agent.opposingMove(o.x,o.y)
			if(!agent.tree.value.skipPlayer(1) && !agent.tree.isEnd()) {
				socket.emit('move',agent.runMove())
				while (agent.tree.value.skipPlayer(-1) && !agent.tree.isEnd()){
					agent.tree = new Tree(agent.tree.value,-1)
					socket.emit('move',agent.runMove())
				}
			}
		})
	}
})