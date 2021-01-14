const Board = require("./Board.js")
const Tree = require("./Tree.js")

class AI {
	constructor(iterations) {
		this.tree = new Tree(new Board(),-1)
		this.iterations = iterations;
		this.move = 0;
	}
	
	runMove() {
		const tree = this.tree;
		for (var i = 0; i < this.iterations; i++) {
			tree.expand()
		}

		var optimal = tree.children[0]
		for (var i = 1; i < tree.children.length; i++) {
			if (tree.children[i] === undefined) continue;
			if (optimal.getNodeValue() < tree.children[i].getNodeValue()) optimal = tree.children[i]
		}
		this.tree = optimal;
		this.tree.root = undefined;
		return {'x':this.tree.value.lastMove[0],'y':this.tree.value.lastMove[1]}
	}
	
	opposingMove(x,y) {
		var hasChild = false;
		for (var i = 0; i < this.tree.children.length; i++) {
			if (this.tree.children[i].lastMove === [x,y]) {
				this.tree = tree.children[i]
				this.tree.root = undefined;
				hasChild = true;
			}
		}
		if (!hasChild) {
			const newB = this.tree.value.copy()
			const color = -this.tree.color;
			newB.move(x,y,color)
			this.tree=new Tree(newB,color)
		}
	}
}

module.exports = AI
/*
var tree = new Tree(new Board(),-1)

function runMove() {
	for (var i = 0; i < 300; i++) {
		tree.expand()
	}

	var optimal = tree.children[0]
	for (var i = 1; i < tree.children.length; i++) {
		if (optimal.getNodeValue() < tree.children[i].getNodeValue()) optimal = tree.children[i]
	}
	tree = optimal;
	tree.root = undefined;
	console.log(optimal.value.lastMove)
}
while (!tree.value.gameEnded()) {
	runMove()
	if (tree.value.skipPlayer(-tree.color)) continue;
	const move = prompt('What is your move?')
	const x = parseInt(move.split(',')[0])
	const y = parseInt(move.split(',')[1])
	var hasChild = false;
	for (var i = 0; i < tree.children.length; i++) {
		if (tree.children[i].lastMove === [x,y]) {
			tree = tree.children[i]
			tree.root = undefined;
			hasChild = true;
		}
	}
	if (!hasChild) {
		const newB = tree.value.copy()
		const color = -tree.color;
		newB.move(x,y,color)
		tree=new Tree(newB,color)
	}
}*/