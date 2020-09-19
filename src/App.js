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
			color:'whiteCircle'
		}
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
		this.setState({pieceValues:pieceValues,color:oppositeColor})
	}
	
	pieceCanChange = (x,y) => {
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
	
	render() {
		return (
			<div className="outer">
				{
					this.state.pieceValues.map((arr,ind)=>(<div className="row" key={ind}>{arr.map((v,i)=>(<PieceSpace key={i} loc={[ind,i]} setPiece={this.setPiece} canChange={this.pieceCanChange(ind,i)} type={v} playerColor={this.state.color}/>))}</div>))
				}
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
