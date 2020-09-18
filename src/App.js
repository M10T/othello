import React from 'react';
import './App.css'

class PieceSpace extends React.Component {
    render() {
		const type=(this===this.props.currentPiece)?'whiteCircle':this.props.type;
		return (
			<button className="rectangle" onClick={()=>{if(this.props.canChange)this.props.setCurrentPiece(this)}}>
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
			currentPiece: {},
			pieceValues: pieceValues
		}
	}
	
	setCurrentPiece = (x) => {
		this.setState({currentPiece:x})
	}
	
	getPiece = (x,y) => {
		return this.state.pieceValues[x][y]
	}
	
	render() {
		return (
			<div className="outer">
				{
					this.state.pieceValues.map((arr,ind)=>(<div className="row" key={ind}>{arr.map((v,i)=>(<PieceSpace key={i} currentPiece={this.state.currentPiece} canChange={true} type={v} setCurrentPiece={this.setCurrentPiece}/>))}</div>))
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
