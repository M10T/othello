import React from 'react';
import './App.css';
import './Home.css';

import Board from './Board.js'

export default class ComputerForm extends React.Component {
	constructor (props) {
		super(props)
		this.state = {color: 'whiteCircle', iterations: '50'}
	}
	
	setColor = event => {
		this.setState({color: event.target.value})
	}
	
	setIterations = event => {
		this.setState({iterations:event.target.value})
	}
	
	render() {
		return (
			<div className="outer">
				<Board computer={true} color={this.state.color} iterations={this.state.iterations}/>
				<form> 
					<select value={this.state.color} onChange={this.setColor}>
						<option value="whiteCircle">White</option>
						<option value="blackCircle">Black</option>
					</select>
					<select value={this.state.iterations} onChange={this.setIterations}>
						<option value="50">Easy</option>
						<option value="150">Medium</option>
						<option value="300">Hard</option>
					</select>
				</form>
			</div>
		)
	}
}