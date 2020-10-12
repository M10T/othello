import React from 'react';
import './App.css'

class PieceSpace extends React.Component {
    render() {
		const [ind,i] = this.props.loc;
		const type=this.props.canChange?this.props.playerColor+' markerOpacity':this.props.type;
		return (
			<button className="rectangle" onClick={()=>{if(this.props.canChange)this.props.setPiece(ind,i)}}>
				<div className={type}/>
			</button>
		)
	}
}

class Board extends React.Component{
	
	constructor(props) {
		super(props)
		const pieceValues = Array.from(Array(8),_=>Array(8).fill(''))
		pieceValues[3][3]='blackCircle'
		pieceValues[4][4]='blackCircle'
		pieceValues[3][4]='whiteCircle'
		pieceValues[4][3]='whiteCircle'
		this.state = {
			pieceValues: pieceValues,
			color:'whiteCircle',
			playerColor: undefined,
			otherPlayer: false,
			chat: [],
			socket: undefined,
			chatend: undefined
		}
	}
	
	componentDidMount() {
		const io = require('socket.io-client')
		const socket = io.connect('ws://192.168.1.242:3001')
		socket.on('setColor',x=>{this.setState({playerColor:x.color})})
		socket.on('disconnected',()=>this.setState({otherPlayer:false}))
		socket.on('otherplayer', ()=>this.setState({otherPlayer:true}))
		socket.on('move', o=>this.setPiece(o.x,o.y))
		socket.on('message', x=>this.setState({chat: this.state.chat.concat({sender: 'Other', contents:x}),chatend:undefined}))
		this.setState({socket:socket})
	}
	
	getPiece = (x,y) => {
		return this.state.pieceValues[x][y]
	}
	
	setPiece = (x,y) => {
		const pieceValues = this.state.pieceValues.slice();
		const oppositeColor = this.state.color==='whiteCircle'?'blackCircle':'whiteCircle';
		pieceValues[x][y]=this.state.color;
		const adjacentPieces = [[x-1,y-1],[x,y-1],[x+1,y-1],[x+1,y],[x+1,y+1],[x,y+1],[x-1,y+1],[x-1,y]]
		adjacentPieces.filter(([ix,iy])=>{
			return ix>=0&&iy>=0&&ix<=7&&iy<=7&&pieceValues[ix][iy]===oppositeColor
		}).forEach(([ix,iy])=>{
			var nx=ix+ix-x;
			var ny=iy+iy-y;
			while(nx>=0&&nx<=7&&ny>=0&&ny<=7) {
				if (pieceValues[nx][ny].startsWith(oppositeColor)) {
					nx+=ix-x;
					ny+=iy-y;
				}
				else if (pieceValues[nx][ny].startsWith(this.state.color)) {
					nx+=x-ix;
					ny+=y-iy;
					while (nx!==x||ny!==y){
						pieceValues[nx][ny]=this.state.color;
						nx+=x-ix;
						ny+=y-iy;
					}
					break;
				} else break;
			}
		})
		if (this.state.playerColor===this.state.color)this.state.socket.emit('move',{x:x,y:y})
		this.setState({pieceValues:pieceValues,color:oppositeColor})
	}
	
	pieceCanChange = (x,y) => {
		if (this.state.color!==this.state.playerColor || !this.state.otherPlayer) return false;
		const pieceValues = this.state.pieceValues.slice();
		const oppositeColor = this.state.color==='whiteCircle'?'blackCircle':'whiteCircle';
		if (pieceValues[x][y].startsWith(oppositeColor)||pieceValues[x][y].startsWith(this.state.color))return false;
		const adjacentPieces = [[x-1,y-1],[x,y-1],[x+1,y-1],[x+1,y],[x+1,y+1],[x,y+1],[x-1,y+1],[x-1,y]]
		return adjacentPieces.filter(([ix,iy])=>{
			return ix>=0&&iy>=0&&ix<=7&&iy<=7&&pieceValues[ix][iy]===oppositeColor
		}).map(([ix,iy])=>{
			var nx=ix+ix-x;
			var ny=iy+iy-y;
			while(nx>=0&&nx<=7&&ny>=0&&ny<=7) {
				if (pieceValues[nx][ny].startsWith(oppositeColor)) {
					nx+=ix-x;
					ny+=iy-y;
				}
				else if (pieceValues[nx][ny].startsWith(this.state.color)) return true;
				else return false;
			}
			return false;
		}).filter(a=>a).length>0;
	}
	
	sendChat = (e) => {
		if(e.keyCode===13 && this.state.otherPlayer && e.target.value!=="") {
			e.target.value = e.target.value.trim()
			if (e.target.value !== "") {
				this.setState({chat:this.state.chat.concat({sender:"You",contents:e.target.value}),chatend:undefined})
				this.state.socket.send(e.target.value)
			}
			e.target.value = ""
		}
	}
	
	render() {
		const chatend = document.getElementById('chatend')
		if (chatend!==null && chatend !== this.state.chatend) {
			chatend.scrollIntoView()
			this.setState({chatend:chatend})
		}
		return (
			<div className="outer">
				<div className="game">
					{
						this.state.pieceValues.map((arr,ind)=>(<div className="row" key={ind}>{arr.map((v,i)=>(<PieceSpace key={i} loc={[ind,i]} setPiece={this.setPiece} canChange={this.pieceCanChange(ind,i)} type={v} playerColor={this.state.color}/>))}</div>))
					}
				</div>
				<div className="chat">
					<p style={{marginBottom:0}}><strong>Chat:</strong></p>
					<div className="messages">
						{
							this.state.chat.map((x,ind)=>(<p key={ind} id={ind===this.state.chat.length-1?'chatend':''}>{x.sender}: {x.contents}</p>))
						}
					</div>
					<div className="newmessage">
						<input type="text" className="messageinput" onKeyUp={this.sendChat}/>
					</div>
				</div>
			</div>
		)
	}
}

function App() {
  return (
	<div>
		<Board/>
	</div>
  );
}

export default App;
