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
    <div className = "outer">
      <div className = "header"></div>
      <div className = "border"></div>
      <div className = "body">
        <h1>Othello</h1>
        <Link to="/">Home</Link>
        <p> stuff... </p>
      </div>
      <div className = "border"></div>
    </div>);
}

function Options() {
  return (
    <div className = "outer">
      <div className = "header"></div>
      <div className = "border"></div>
      <div className = "body">
        <h1>Othello</h1>
        <Link to="/othello">Multiplayer</Link>
        <Link to="/computer">Play against an AI</Link>
      </div>
      <div className = "border"></div>
    </div>);
}

function Home() {
  return (
    <div className = "outer">
      <div className = "header"></div>
      <div className = "border"></div>
      <div className = "body">
        <h1>Othello</h1>
        <Link to="/options">Play</Link>
        <Link to="/about">About</Link>
      </div>
      <div className = "border"></div>
    </div>);
}


export default App;
