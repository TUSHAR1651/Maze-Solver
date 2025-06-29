import React from "react";
import "./Controls.css";

const Controls = ({
	mazeSize,
	algorithm,
	speed,
	generationAlgorithm,
	onMazeSizeChange,
	onAlgorithmChange,
	onSpeedChange,
	onGenerationAlgorithmChange,
}) => {
	const actualSize = mazeSize % 2 === 0 ? mazeSize + 1 : mazeSize;

	return (
		<div className="controls-container">
			<div className="control-group">
				<label htmlFor="maze-size">Maze Size:</label>
				<select
					id="maze-size"
					value={mazeSize}
					onChange={(e) => onMazeSizeChange(Number(e.target.value))}
				>
					<option value={10}>10x10 (11x11)</option>
					<option value={15}>15x15</option>
					<option value={20}>20x20 (21x21)</option>
					<option value={25}>25x25</option>
					<option value={35}>35x35</option>
				</select>
				{mazeSize !== actualSize && (
					<small style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
						Will generate {actualSize}x{actualSize} maze
					</small>
				)}
			</div>

			<div className="control-group">
				<label htmlFor="gen-algo">Generation Algorithm:</label>
				<select
					id="gen-algo"
					value={generationAlgorithm}
					onChange={(e) => onGenerationAlgorithmChange(e.target.value)}
				>
					<option value="recursiveBacktracking">Recursive Backtracking</option>
					<option value="prims">Prim's Algorithm</option>
				</select>
			</div>

			<div className="control-group">
				<label htmlFor="solve-algo">Solving Algorithm:</label>
				<select
					id="solve-algo"
					value={algorithm}
					onChange={(e) => onAlgorithmChange(e.target.value)}
				>
					<option value="bfs">Breadth-First Search (BFS)</option>
					<option value="dfs">Depth-First Search (DFS)</option>
					<option value="astar">A* Algorithm</option>
				</select>
			</div>

			<div className="control-group">
				<label htmlFor="speed">Animation Speed:</label>
				<select
					id="speed"
					value={speed}
					onChange={(e) => onSpeedChange(e.target.value)}
				>
					<option value="fast">Fast</option>
					<option value="medium">Medium</option>
					<option value="slow">Slow</option>
				</select>
			</div>
		</div>
	);
};

export default Controls;
