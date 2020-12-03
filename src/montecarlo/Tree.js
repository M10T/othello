class Tree {
	constructor(value, color, root) {
		this.value = value;
		this.color = color;
		this.successes = 0;
		this.attempts = 0;
		this.children = []
		this.root = root
	}
	
	static moveBoards(board,color) {
		var ret = []
		var allMoves = board.allMoves(-color)
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 8; j++) {
				if (allMoves[i][j]) {
					var copy = board.copy()
					copy.move(i,j,-color)
					ret.push(copy)
				}
			}
		}
		return ret
	}
	
	isLeaf() {
		if (this.value.gameEnded()) return false;
		else if (this.value.skipPlayer(-this.color)) return 1;
		else return this.children.length < Tree.moveBoards(this.value,this.color).length;	
	}
	
	createChildren() {
		if (this.value.skipPlayer(-this.color)) {
			const newB = this.value.copy()
			newB.lastMove = undefined
			this.children.push(new Tree(newB,-this.color,this))
		}
		else this.children.push(new Tree(Tree.moveBoards(this.value,this.color)[this.children.length],-this.color,this))
	}

	isEnd() {
		return this.value.gameEnded()
	}
	
	winner() {
		return this.value.winner()
	}
	
	getNodeValue() {
		if (this.children.length === 0) return Number.MAX_VALUE;
		else return this.successes/this.attempts
	}
	
	selectOptimal() {
		if (this.isLeaf()) return this;
		var optimals = []
		for (var i = 0; i < this.children.length; i++) {
			const child = this.children[i].selectOptimal()
			if (child === undefined) continue;
			if (optimals.length === 0 || optimals[0].getNodeValue() < child.getNodeValue()) optimals = [child]
			else if (optimals[0].getNodeValue() === child.getNodeValue()) optimals.push(child)
		}
		return optimals[Math.floor(Math.random()*optimals.length)]
	}
	
	expand() {
		const optimal = this.selectOptimal()
		if (optimal === undefined) return
		optimal.createChildren()
		const chosenChild = optimal.children[Math.floor(Math.random()*optimal.children.length)]
		if (chosenChild.simulate()) {
			var x = chosenChild
			while (x.root !== undefined) {
				x.root.attempts++;
				if (x.root.color === chosenChild.color) x.root.successes++;
				x=x.root
			}
		} else {
			var x = chosenChild
			while (x.root !== undefined) {
				x.root.attempts++;
				if (x.root.color !== chosenChild.color) x.root.successes++;
				x=x.root
			}
		}
	}
	
	simulate() {
		var board = this.value
		var color = this.color
		while (!board.gameEnded()) {
			var options = Tree.moveBoards(board,color)
			color = -color
			if(options.length !== 0) board = options[Math.floor(Math.random()*options.length)]
		}
		this.attempts++;
		if (board.winner() === this.color) {
			this.successes++;
			return true
		} else return false
	}
}

module.exports = Tree;