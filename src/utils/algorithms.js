// Pathfinding algorithms

// Depth-First Search
export async function dfs(maze, onProgress, speed = "medium") {
	const visited = new Set();
	const stack = [maze.start];
	const parent = new Map();
	const delay = speed === "fast" ? 10 : speed === "slow" ? 100 : 50;

	visited.add(`${maze.start.x},${maze.start.y}`);

	while (stack.length > 0) {
		const current = stack.pop();

		maze.current = current;

		if (current.x === maze.end.x && current.y === maze.end.y) {
			const path = [];
			let node = current;
			while (node) {
				path.unshift(node);
				node = parent.get(`${node.x},${node.y}`);
			}
			maze.solution = path;
			maze.current = null;

			for (const cell of path) {
				if (cell.x !== maze.start.x || cell.y !== maze.start.y) {
					if (cell.x !== maze.end.x || cell.y !== maze.end.y) {
						maze.grid[cell.y][cell.x] = 2;
					}
				}
			}

			if (onProgress) {
				onProgress(maze);
			}

			return path;
		}

		const neighbors = maze.getNeighbors(current.x, current.y);
		for (const neighbor of neighbors) {
			const key = `${neighbor.x},${neighbor.y}`;
			if (!visited.has(key)) {
				visited.add(key);
				parent.set(key, current);
				stack.push(neighbor);
			}
		}

		if (onProgress) {
			onProgress(maze);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	maze.current = null;
	if (onProgress) {
		onProgress(maze);
	}
	return null;
}

// Breadth-First Search
export async function bfs(maze, onProgress, speed = "medium") {
	const visited = new Set();
	const queue = [maze.start];
	const parent = new Map();
	const delay = speed === "fast" ? 10 : speed === "slow" ? 100 : 50;

	visited.add(`${maze.start.x},${maze.start.y}`);

	while (queue.length > 0) {
		const current = queue.shift();

		maze.current = current;

		if (current.x === maze.end.x && current.y === maze.end.y) {
			const path = [];
			let node = current;
			while (node) {
				path.unshift(node);
				node = parent.get(`${node.x},${node.y}`);
			}
			maze.solution = path;
			maze.current = null;

			for (const cell of path) {
				if (cell.x !== maze.start.x || cell.y !== maze.start.y) {
					if (cell.x !== maze.end.x || cell.y !== maze.end.y) {
						maze.grid[cell.y][cell.x] = 2;
					}
				}
			}

			if (onProgress) {
				onProgress(maze);
			}

			return path;
		}

		const neighbors = maze.getNeighbors(current.x, current.y);
		for (const neighbor of neighbors) {
			const key = `${neighbor.x},${neighbor.y}`;
			if (!visited.has(key)) {
				visited.add(key);
				parent.set(key, current);
				queue.push(neighbor);
			}
		}

		if (onProgress) {
			onProgress(maze);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	maze.current = null;
	if (onProgress) {
		onProgress(maze);
	}
	return null;
}

// A* Algorithm
export async function astar(maze, onProgress, speed = "medium") {
	const openSet = new Set([`${maze.start.x},${maze.start.y}`]);
	const closedSet = new Set();
	const cameFrom = new Map();
	const gScore = new Map();
	const fScore = new Map();
	const delay = speed === "fast" ? 10 : speed === "slow" ? 100 : 50;

	const startKey = `${maze.start.x},${maze.start.y}`;
	gScore.set(startKey, 0);
	fScore.set(startKey, heuristic(maze.start, maze.end));

	while (openSet.size > 0) {
		let current = null;
		let lowestFScore = Infinity;

		for (const key of openSet) {
			const [x, y] = key.split(",").map(Number);
			const f = fScore.get(key) || Infinity;
			if (f < lowestFScore) {
				lowestFScore = f;
				current = { x, y };
			}
		}

		if (!current) {
			break;
		}

		const currentKey = `${current.x},${current.y}`;

		if (current.x === maze.end.x && current.y === maze.end.y) {
			const path = [];
			let node = current;
			while (node) {
				path.unshift(node);
				const nodeKey = `${node.x},${node.y}`;
				node = cameFrom.get(nodeKey);
			}
			maze.solution = path;
			maze.current = null;

			for (const cell of path) {
				if (cell.x !== maze.start.x || cell.y !== maze.start.y) {
					if (cell.x !== maze.end.x || cell.y !== maze.end.y) {
						maze.grid[cell.y][cell.x] = 2;
					}
				}
			}

			if (onProgress) {
				onProgress(maze);
			}

			return path;
		}

		openSet.delete(currentKey);
		closedSet.add(currentKey);

		maze.current = current;

		const neighbors = maze.getNeighbors(current.x, current.y);

		for (const neighbor of neighbors) {
			const neighborKey = `${neighbor.x},${neighbor.y}`;

			if (closedSet.has(neighborKey)) {
				continue;
			}

			const currentGScore = gScore.get(currentKey) || 0;
			const tentativeGScore = currentGScore + 1;
			const neighborGScore = gScore.get(neighborKey) || Infinity;

			if (!openSet.has(neighborKey)) {
				openSet.add(neighborKey);
			} else if (tentativeGScore >= neighborGScore) {
				continue;
			}

			cameFrom.set(neighborKey, current);
			gScore.set(neighborKey, tentativeGScore);
			fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, maze.end));
		}

		if (onProgress) {
			onProgress(maze);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	maze.current = null;
	if (onProgress) {
		onProgress(maze);
	}
	return null;
}

// Heuristic function for A* (Manhattan distance)
function heuristic(a, b) {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Solve maze with specified algorithm
export async function solveMaze(maze, algorithm, onProgress, speed = "medium") {
	for (let y = 0; y < maze.height; y++) {
		for (let x = 0; x < maze.width; x++) {
			if (maze.grid[y][x] === 2) {
				maze.grid[y][x] = 0;
			}
		}
	}
	maze.solution = [];
	maze.current = null;

	const startTime = performance.now();

	let result;
	switch (algorithm) {
		case "dfs":
			result = await dfs(maze, onProgress, speed);
			break;
		case "bfs":
			result = await bfs(maze, onProgress, speed);
			break;
		case "astar":
			result = await astar(maze, onProgress, speed);
			break;
		default:
			result = await bfs(maze, onProgress, speed);
	}

	const endTime = performance.now();
	const solveTime = Math.round(endTime - startTime);

	return {
		path: result,
		solveTime,
		visitedCount: 0,
		pathLength: result ? result.length : 0,
	};
}
