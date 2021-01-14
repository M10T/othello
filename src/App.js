import React from 'react';
import './App.css';
import './Home.css';

import Board from './Board.js'
import ComputerForm from './ComputerForm.js'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function BasicExample() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/options">
          <Options />
        </Route>
        <Route path="/othello">
          <Board computer={false}/>
        </Route>
        <Route path="/computer">
		      <ComputerForm/>
		    </Route>
        <Route path="/about">
          <About />
        </Route>
      </Switch>
    </Router>
  );
}

function App() {
  return (
	<div>
		<BasicExample/>
	</div>
  );
}
function About() {
  return (
    <div>
      <div className = "header"><h1 className = "title">Othello</h1></div>
      <div className = "body">
        <div className = "buttonHolder">
          <Link to="/" className = "button">Home</Link>
        </div>
		<p>Othello is a game with very specific rules. The position of the game is always the same at the start, but when opposing pieces are between an already existing piece and a newly placed piece, those pieces switch colors.</p>
		<p>The creators are Milan Tenn and Andrew Szabo. We are creating this site as a project for our ADSB class.</p>
      </div>
    </div>);
}

function Options() {
  return (
    <div>
      <div className = "header"><h1 className = "title">Othello</h1></div>
      <div className = "body">
        <div className = "buttonHolder">
          <Link to="/othello" className = "button">Multiplayer</Link>
        </div>
        <div className = "buttonHolder">
          <Link to="/computer" className = "button">Play against an AI</Link>
        </div>
      </div>
    </div>);
}

function Home() {
  return (
      <div>
      <div className = "header"><h1 className = "title">Othello</h1></div>
      <div className = "body">
        <div className = "buttonHolder">
        <Link to="/options" className = "button">Play</Link>
        </div>
        <div className = "buttonHolder">
        <Link to="/about" className = "button">About</Link>
        </div>
      </div>
      </div>);
}


export default App;
