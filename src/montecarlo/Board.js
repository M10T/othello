class Board {
	constructor() {
		const board = Array.from(Array(8),_=>Array(8).fill(0))
		board[3][3] = -1;
		board[3][4] = 1;
		board[4][3] = 1;
		board[4][4] = -1;
		this.board = board;
		this.lastMove = undefined;
	}
	
	copy() {
		const b = new Board()
		b.board = this.board.map(arr=>arr.slice());
		b.lastMove = this.lastMove;
		return b;
	}
	
	canMove(x,y,color) {
		if (this.board[x][y] !== 0) return false;
		const adjacentPieces = [[x-1,y-1],[x-1,y],[x-1,y+1],[x,y-1],[x,y+1],[x+1,y-1],[x+1,y],[x+1,y+1]]
		return adjacentPieces.filter(([a,b])=>a>=0 && b >= 0 && a < 8 && b < 8 && this.board[a][b] === -color)
					  .some(([ix,iy])=>{
			var nx=ix+ix-x;
			var ny=iy+iy-y;
			while(nx>=0&&nx<=7&&ny>=0&&ny<=7) {
				if (this.board[nx][ny] === -color) {
					nx+=ix-x;
					ny+=iy-y;
				}
				else if (this.board[nx][ny] === color) return true;
				else return false;
			}
			return false;
		})
	}
	
	allMoves(color) {
		return Array.from(Array(8),_=>Array(8).fill(0)).map((arr,i)=>arr.map((_,j)=>this.canMove(i,j,color)))
	}
	
	move(x,y,color) {
		if (!this.canMove(x,y,color)) {
			return;
		}
		this.lastMove = [x,y]
		const adjacentPieces = [[x-1,y-1],[x,y-1],[x+1,y-1],[x+1,y],[x+1,y+1],[x,y+1],[x-1,y+1],[x-1,y]]
		this.board[x][y] = color;
		adjacentPieces
			.filter(([ix,iy])=>ix>=0&&ix<=7&&iy>=0&&iy<=7&&this.board[ix][iy]===-color)
			.forEach(([ix,iy])=>{
				var nx=ix+ix-x;
				var ny=iy+iy-y;
				while(nx>=0&&nx<=7&&ny>=0&&ny<=7) {
					if (this.board[nx][ny] === -color) {
						nx+=ix-x;
						ny+=iy-y;
					}
					else if (this.board[nx][ny] === color) {
						nx+=x-ix;
						ny+=y-iy;
						while (nx!==x||ny!==y){
							this.board[nx][ny]=color;
							nx+=x-ix;
							ny+=y-iy;
						}
						break;
					} else break;
				}
			})
	}
	
	skipPlayer(color) {
		return this.allMoves(color).flat().every(x=>!x)
	}
	
	gameEnded() {
		return this.skipPlayer(-1) && this.skipPlayer(1)
	}
	
	winner() {
		const blackSquares = this.board.flat().filter(x=>x===-1).length;
		const whiteSquares = this.board.flat().filter(x=>x===1).length;
		if (blackSquares===whiteSquares) return 0
		else if (blackSquares > whiteSquares) return -1;
		else return 1;
	}
	
	display() {
		this.board.forEach(arr=>console.log(arr.reduce((acc,v)=>acc+ " " + v)))
	}
}

module.exports = Board;