export class Maze {
	constructor(width, height) {
		this.width = width % 2 === 0 ? width + 1 : width;
		this.height = height % 2 === 0 ? height + 1 : height;
		this.grid = [];
		this.start = { x: 1, y: 1 };
		this.end = { x: this.width - 2, y: this.height - 2 };
		this.solution = [];
		this.current = null;
		this.isGenerating = false;
		this.isSolving = false;

		this.initializeGrid();
	}

	initializeGrid() {
		for (let y = 0; y < this.height; y++) {
			this.grid[y] = [];
			for (let x = 0; x < this.width; x++) {
				this.grid[y][x] = 1;
			}
		}

		this.grid[this.start.y][this.start.x] = 0;
		this.grid[this.end.y][this.end.x] = 0;
	}

	_fillWithWalls() {
		for (let y = 0; y < this.height; y++) {
			this.grid[y] = [];
			for (let x = 0; x < this.width; x++) {
				this.grid[y][x] = 1;
			}
		}
	}

	async generateMaze(onProgress) {
		this.isGenerating = true;
		this._fillWithWalls();

		const startX = 2 * Math.floor(Math.random() * (this.width / 2)) + 1;
		const startY = 2 * Math.floor(Math.random() * (this.height / 2)) + 1;

		const stack = [{ x: startX, y: startY }];
		this.grid[startY][startX] = 0;

		const visited = new Set([`${startX},${startY}`]);

		const directions = [
			{ dx: 0, dy: -2 },
			{ dx: 2, dy: 0 },
			{ dx: 0, dy: 2 },
			{ dx: -2, dy: 0 },
		];

		while (stack.length > 0) {
			const current = stack[stack.length - 1];

			const neighbors = [];
			for (const dir of directions) {
				const newX = current.x + dir.dx;
				const newY = current.y + dir.dy;

				if (this.isValidCell(newX, newY) && !visited.has(`${newX},${newY}`)) {
					neighbors.push({ x: newX, y: newY, dir });
				}
			}

			if (neighbors.length > 0) {
				const neighbor =
					neighbors[Math.floor(Math.random() * neighbors.length)];

				const wallX = current.x + neighbor.dir.dx / 2;
				const wallY = current.y + neighbor.dir.dy / 2;

				this.grid[wallY][wallX] = 0;
				this.grid[neighbor.y][neighbor.x] = 0;

				visited.add(`${neighbor.x},${neighbor.y}`);
				stack.push(neighbor);

				if (onProgress) {
					onProgress(Maze.from(this));
					await new Promise((resolve) => setTimeout(resolve, 10));
				}
			} else {
				stack.pop();
			}
		}

		this.grid[this.start.y][this.start.x] = 0;
		this.grid[this.end.y][this.end.x] = 0;

		this.isGenerating = false;

		this.openBordersRandomly();

		return this;
	}

	async generateMazeWithPrims(onProgress) {
		this.isGenerating = true;
		this._fillWithWalls();

		const startX = 2 * Math.floor(Math.random() * (this.width / 2)) + 1;
		const startY = 2 * Math.floor(Math.random() * (this.height / 2)) + 1;
		this.grid[startY][startX] = 0;

		const frontier = [];
		const directions = [
			{ dx: 0, dy: -2 },
			{ dx: 2, dy: 0 },
			{ dx: 0, dy: 2 },
			{ dx: -2, dy: 0 },
		];
		for (const dir of directions) {
			const x = startX + dir.dx;
			const y = startY + dir.dy;
			if (x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1) {
				frontier.push({ x, y, fromX: startX, fromY: startY });
			}
		}

		while (frontier.length > 0) {
			const randIndex = Math.floor(Math.random() * frontier.length);
			const { x, y, fromX, fromY } = frontier.splice(randIndex, 1)[0];

			if (this.grid[y][x] === 1) {
				const wallX = (x + fromX) / 2;
				const wallY = (y + fromY) / 2;
				this.grid[wallY][wallX] = 0;
				this.grid[y][x] = 0;

				for (const dir of directions) {
					const newX = x + dir.dx;
					const newY = y + dir.dy;
					if (
						newX > 0 &&
						newX < this.width - 1 &&
						newY > 0 &&
						newY < this.height - 1 &&
						this.grid[newY][newX] === 1
					) {
						frontier.push({ x: newX, y: newY, fromX: x, fromY: y });
					}
				}

				if (onProgress) {
					onProgress(Maze.from(this));
					await new Promise((resolve) => setTimeout(resolve, 10));
				}
			}
		}

		this.grid[this.start.y][this.start.x] = 0;
		this.grid[this.end.y][this.end.x] = 0;

		this.isGenerating = false;

		this.openBordersRandomly();

		return this;
	}

	openBordersRandomly(chance = 0.25) {
		for (let x = 1; x < this.width - 1; x++) {
			if (Math.random() < chance && this.grid[1][x] === 0) {
				this.grid[0][x] = 0;
			}
			if (Math.random() < chance && this.grid[this.height - 2][x] === 0) {
				this.grid[this.height - 1][x] = 0;
			}
		}
		for (let y = 1; y < this.height - 1; y++) {
			if (Math.random() < chance && this.grid[y][1] === 0) {
				this.grid[y][0] = 0;
			}
			if (Math.random() < chance && this.grid[y][this.width - 2] === 0) {
				this.grid[y][this.width - 1] = 0;
			}
		}
	}

	isValidCell(x, y) {
		return x > 0 && x < this.width - 1 && y > 0 && y < this.height - 1;
	}

	getNeighbors(x, y) {
		const neighbors = [];
		const directions = [
			{ dx: 0, dy: -1 },
			{ dx: 1, dy: 0 },
			{ dx: 0, dy: 1 },
			{ dx: -1, dy: 0 },
		];

		for (const dir of directions) {
			const newX = x + dir.dx;
			const newY = y + dir.dy;

			if (
				newX >= 0 &&
				newX < this.width &&
				newY >= 0 &&
				newY < this.height &&
				this.grid[newY][newX] === 0
			) {
				neighbors.push({ x: newX, y: newY });
			}
		}

		return neighbors;
	}

	setCell(x, y, value) {
		this.grid[y][x] = value;
	}

	setStart(x, y, mode) {
		const previousPointValue = mode === "create" ? 0 : 1;
		const oldStart = this.start;

		if (oldStart.x !== this.end.x || oldStart.y !== this.end.y) {
			this.grid[oldStart.y][oldStart.x] = previousPointValue;
		}

		this.start = { x, y };
		this.grid[y][x] = 0;
	}

	setEnd(x, y, mode) {
		const previousPointValue = mode === "create" ? 0 : 1;
		const oldEnd = this.end;

		if (oldEnd.x !== this.start.x || oldEnd.y !== this.start.y) {
			this.grid[oldEnd.y][oldEnd.x] = previousPointValue;
		}

		this.end = { x, y };
		this.grid[y][x] = 0;
	}

	clearSolution() {
		this.solution = [];
		this.current = null;
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (this.grid[y][x] === 2) {
					this.grid[y][x] = 0;
				}
			}
		}
	}

	reset() {
		this.clearSolution();
		this.start = { x: 1, y: 1 };
		this.end = { x: this.width - 2, y: this.height - 2 };
		this.initializeGrid();
	}

	isSolvable() {
		const visited = new Set();
		const stack = [this.start];
		visited.add(`${this.start.x},${this.start.y}`);

		while (stack.length > 0) {
			const current = stack.pop();

			if (current.x === this.end.x && current.y === this.end.y) {
				return true;
			}

			for (const neighbor of this.getNeighbors(current.x, current.y)) {
				const key = `${neighbor.x},${neighbor.y}`;
				if (!visited.has(key)) {
					visited.add(key);
					stack.push(neighbor);
				}
			}
		}

		return false;
	}

	getStats() {
		const totalCells = this.width * this.height;
		const wallCells = this.grid.flat().filter((cell) => cell === 1).length;
		const pathCells = totalCells - wallCells;

		return {
			totalCells,
			wallCells,
			pathCells,
			solutionLength: this.solution.length,
		};
	}

	static from(otherMaze) {
		const newMaze = Object.create(Maze.prototype);
		newMaze.width = otherMaze.width;
		newMaze.height = otherMaze.height;
		newMaze.grid = otherMaze.grid.map((row) => [...row]);
		newMaze.start = { ...otherMaze.start };
		newMaze.end = { ...otherMaze.end };
		newMaze.solution = [...otherMaze.solution];
		newMaze.current = otherMaze.current ? { ...otherMaze.current } : null;
		return newMaze;
	}

	createGrid() {
		const grid = [];
		for (let y = 0; y < this.height; y++) {
			const row = [];
			for (let x = 0; x < this.width; x++) {
				row.push(0);
			}
			grid.push(row);
		}
		return grid;
	}
}
