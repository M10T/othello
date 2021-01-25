import React from 'react';
import './App.css';
import './Home.css';
import {
  Link
} from "react-router-dom";

class PieceSpace extends React.Component {
    render() {
		const [ind,i] = this.props.loc;
		const type=this.props.canChange?this.props.playerColor+' markerOpacity':this.props.type;
		const highlight = this.props.loc.every((v,i)=>this.props.lastMove[i]===v)
		return (
			<button className={"rectangle"+(highlight?' highlight':'')} onClick={()=>{if(this.props.canChange)this.props.setPiece(ind,i)}}>
				<div className={type}/>
			</button>
		)
	}
}

export default class Board extends React.Component{

	constructor(props) {
		super(props)
		const pieceValues = Array.from(Array(8),_=>Array(8).fill(''))
		pieceValues[3][3]='blackCircle'
		pieceValues[4][4]='blackCircle'
		pieceValues[3][4]='whiteCircle'
		pieceValues[4][3]='whiteCircle'
		this.state = {
			pieceValues: pieceValues,
			color:'blackCircle',
			playerColor: undefined,
			otherPlayer: false,
			chat: [],
			socket: undefined,
			chatend: undefined,
			lastMove: [],
			moves: [],
			index: 0,
			currentIndex: 0,
			boards: [pieceValues.map(arr=>arr.slice())]
		}
	}

	componentDidMount() {
		const io = require('socket.io-client')
		const socket = io.connect('ws://localhost:3001',{query:{computer:this.props.computer,color:this.props.color,iterations:this.props.iterations}})
		socket.on('setColor',x=>{this.setState({playerColor:x.color})})
		socket.on('disconnected',()=>this.setState({otherPlayer:false}))
		socket.on('otherplayer', ()=>this.setState({otherPlayer:true}))
		socket.on('move', o=>{
			this.setPiece(o.x,o.y);
		})
		socket.on('message', x=>this.setState({chat: this.state.chat.concat({sender: 'Other', contents:x}),chatend:undefined}))
		this.setState({socket:socket})
	}

	getPiece = (x,y) => {
		return this.state.pieceValues[x][y]
	}
	
	back = () => {
		if (this.state.currentIndex===0) return
		this.setState({currentIndex:this.state.currentIndex-1,pieceValues:this.state.boards[this.state.currentIndex-1],lastMove:this.state.currentIndex>1?this.state.moves[this.state.currentIndex-2]:[]})
	}
	
	next = () => {
		if (this.state.currentIndex==this.state.index)return
		this.setState({currentIndex:this.state.currentIndex+1,pieceValues:this.state.boards[this.state.currentIndex+1],lastMove:this.state.moves[this.state.currentIndex]})
	}
	
	setPiece = (x,y) => {
		const pieceValues = this.state.boards[this.state.index].map(arr=>arr.slice());
		this.setState({lastMove:[x,y],moves:this.state.moves.concat([[x,y]]),index:this.state.index+1,currentIndex:this.state.index+1})
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
		this.setState({pieceValues:pieceValues})
		this.setState({boards:this.state.boards.concat([pieceValues.map(arr=>arr.slice())])})
		const oMoves = this.changingPieces(oppositeColor).flat().reduce((acc,v)=>acc||v)
		if (oMoves) {
			this.setState({color:oppositeColor})
		}
	}

	pieceCanChange = (color,x,y) => {
		const pieceValues = this.state.pieceValues.slice()
		const oppositeColor = color==='whiteCircle'?'blackCircle':'whiteCircle';
		if (pieceValues[x][y] === color || pieceValues[x][y] === oppositeColor) return false;
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
				else if (pieceValues[nx][ny].startsWith(color)) return true;
				else return false;
			}
			return false;
		}).filter(a=>a).length>0;
	}

	changingPieces = (color) => {
		return this.state.pieceValues.map((arr,i)=>arr.map((_,j)=>this.pieceCanChange(color,i,j)))
	}

  winner = () => {
    const score = this.state.pieceValues.map((row) =>{
      return(row.map((color)=>{
        if(color.startsWith("whiteCircle")) return 1;
        else if(color.startsWith("blackCircle")) return -1;
        return 0;
      }))
    })
    var sum = score.reduce((a,v)=>a+v.reduce((a2,v2)=>a2+v2),0);
    if(sum>0) return "The Winner is White";
    else if(sum<0) return "The Winner is Black";
    return "It is a Tie";
  }

  end = () => {
	const color = this.state.color;
	const opposite = this.state.color==="whiteCircle"?"blackCircle":"whiteCircle"
    const cMoves = this.changingPieces(color).flat().reduce((acc,v)=>acc||v)
	const oMoves = this.changingPieces(opposite).flat().reduce((acc,v)=>acc||v)
    return !cMoves && !oMoves
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
		const changingPieces = this.changingPieces(this.state.color)
		return (
			<div className="outer">
        <div>
          <Link to="/" className = "button home">Home</Link>
        </div>
        <div className="header">
          <h1 className = "title">Othello</h1>
        </div>
				<div className="game" id="gamer">
          {
            this.end()?this.winner()=="The Winner is White"?<button id="winner" className = "wwinner">{this.winner()}</button>:<button id="winner" className = "bwinner">{this.winner()}</button>:''
          }
					{
						this.state.pieceValues.map((arr,ind)=>(<div className="row" key={ind}>{arr.map((v,i)=>(<PieceSpace key={i} loc={[ind,i]} lastMove={this.state.lastMove} setPiece={this.setPiece} canChange={changingPieces[ind][i]&&this.state.otherPlayer&&this.state.color===this.state.playerColor&&this.state.currentIndex===this.state.index} type={v} playerColor={this.state.color}/>))}</div>))
					}
				</div>
				{!this.props.computer?(<div className="chat">
					<p style={{marginBottom:0}}><strong>Chat:</strong></p>
					<div className="messages">
						{
							this.state.chat.map((x,ind)=>(<p key={ind} id={ind===this.state.chat.length-1?'chatend':''}>{x.sender}: {x.contents}</p>))
						}
					</div>
					<div className="newmessage">
						<input type="text" className="messageinput" onKeyUp={this.sendChat}/>
					</div>
				</div>):('')}
				<div>
					<button type="button" onClick={()=>this.back()}>Back</button>
					<button type="button" onClick={()=>this.next()}>Next</button>
				</div>
			</div>
		)
	}

	componentDidUpdate(prevProps) {
		if (prevProps.color !== this.props.color || prevProps.iterations !== this.props.iterations) {
			const pieceValues = Array.from(Array(8),_=>Array(8).fill(''))
			pieceValues[3][3]='blackCircle'
			pieceValues[4][4]='blackCircle'
			pieceValues[3][4]='whiteCircle'
			pieceValues[4][3]='whiteCircle'
			this.setState({pieceValues:pieceValues,otherPlayer:false,playerColor:undefined,color:'blackCircle'})
			this.state.socket.disconnect()
			const io = require('socket.io-client')
			const socket = io.connect('ws://localhost:3001',{query:{computer:this.props.computer,color:this.props.color,iterations:this.props.iterations}})
			socket.on('setColor',x=>{this.setState({playerColor:x.color})})
			socket.on('disconnected',()=>this.setState({otherPlayer:false}))
			socket.on('otherplayer', ()=>this.setState({otherPlayer:true}))
			socket.on('move', o=>{
				this.setPiece(o.x,o.y);
			})
			socket.on('message', x=>this.setState({chat: this.state.chat.concat({sender: 'Other', contents:x}),chatend:undefined}))
			this.setState({socket:socket,lastMove:[],moves:[],boards:[pieceValues.map(arr=>arr.slice())],index:0,currentIndex:0})
		}
	}
}
