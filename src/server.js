const io = require('socket.io')(3001)
const AI = require('./montecarlo/AI.js')
const Tree = require('./montecarlo/Tree.js')
const Board = require('./montecarlo/Board.js')

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
		socket.emit('setColor', {color:alreadyOne?'whiteCircle':'blackCircle'});
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
		const agent = new AI(parseInt(socket.handshake.query['iterations']))
		socket.emit('setColor',{color:socket.handshake.query['color']})
		socket.emit('otherplayer')
		var agentcolor = socket.handshake.query['color']==='blackCircle'?-1:1;
		if (agentcolor===1) socket.emit('move',agent.runMove())
		socket.on('move',o=>{
			agent.opposingMove(o.x,o.y)
			if(!agent.tree.value.skipPlayer(agentcolor)) {				
				socket.emit('move',agent.runMove())
				while (agent.tree.value.skipPlayer(-agentcolor) && !agent.tree.isEnd()){
					agent.tree = new Tree(agent.tree.value,-agentcolor)
					socket.emit('move',agent.runMove())
				}
			} else {
				agent.tree = new Tree(agent.tree.value,agentcolor)
			}
		})
	}
})