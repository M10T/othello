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
		<p className = "fancyAbout">A minute to learn, a lifetime to master</p>
    <p className = "mainAbout">The position of the game is always the same at the start. Players take turns placing a single<br/ >
    tile of their color on the board. You can only place a piece if it causes opponent pieces to flip.<br/ >
    Opponent pieces flip if they lie in a continuous line between one of your pieces<br/ >
    and the pieces you just placed.</p>
		<p className = "credits"><br/ >The creators: Milan Tenn and Andrew Szabo.<br/ >We created this site as a project for our Advanced Data Structres B class.</p>
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
