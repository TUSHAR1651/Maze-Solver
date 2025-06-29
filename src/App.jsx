import React, { useState, useEffect, useCallback } from "react";
import { Maze } from "./utils/maze.js";
import { solveMaze } from "./utils/algorithms.js";
import Controls from "./components/Controls.jsx";
import MazeGrid from "./components/MazeGrid.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Legend from "./components/Legend.jsx";
import "./App.css";

function App() {
	const [mazeSize, setMazeSize] = useState(15);
	const [algorithm, setAlgorithm] = useState("bfs");
	const [generationAlgorithm, setGenerationAlgorithm] = useState(
		"recursiveBacktracking"
	);
	const [speed, setSpeed] = useState("medium");
	const [mode, setMode] = useState("generate");
	const [maze, setMaze] = useState(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isSolving, setIsSolving] = useState(false);
	const [solveStatus, setSolveStatus] = useState("idle");
	const [stats, setStats] = useState({
		solutionLength: 0,
		solveTime: 0,
	});
	const [isShiftDown, setIsShiftDown] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Shift") {
				setIsShiftDown(true);
			}
		};
		const handleKeyUp = (e) => {
			if (e.key === "Shift") {
				setIsShiftDown(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	useEffect(() => {
		const newMaze = new Maze(mazeSize, mazeSize);
		setSolveStatus("idle");
		setStats({ solutionLength: 0, solveTime: 0 });

		if (mode === "create") {
			for (let y = 0; y < newMaze.height; y++) {
				for (let x = 0; x < newMaze.width; x++) {
					newMaze.grid[y][x] = 0;
				}
			}
		}
		setMaze(newMaze);
	}, [mazeSize, mode]);

	const getCellSize = () => {
		const maxSize = 600;
		const actualSize = mazeSize % 2 === 0 ? mazeSize + 1 : mazeSize;
		return Math.min(maxSize / actualSize, 40);
	};

	const handleGenerate = useCallback(async () => {
		if (!maze || isGenerating || isSolving) return;

		setIsGenerating(true);
		setSolveStatus("idle");
		const newMaze = new Maze(mazeSize, mazeSize);

		newMaze.start = maze.start;
		newMaze.end = maze.end;

		if (generationAlgorithm === "prims") {
			await newMaze.generateMazeWithPrims((currentMaze) => {
				setMaze({ ...currentMaze });
			});
		} else {
			await newMaze.generateMaze((currentMaze) => {
				setMaze({ ...currentMaze });
			});
		}

		setMaze(newMaze);
		setIsGenerating(false);
		setStats({
			solutionLength: 0,
			solveTime: 0,
		});
	}, [maze, mazeSize, generationAlgorithm, isGenerating, isSolving]);

	const handleSolve = useCallback(async () => {
		if (!maze || isGenerating || isSolving) return;

		setIsSolving(true);
		setSolveStatus("solving");

		const mazeCopy = Maze.from(maze);

		const result = await solveMaze(
			mazeCopy,
			algorithm,
			(currentMaze) => {
				setMaze({ ...currentMaze });
			},
			speed
		);

		if (result.path) {
			setSolveStatus("solved");
			setStats({
				solutionLength: result.pathLength,
				solveTime: result.solveTime,
			});
		} else {
			setSolveStatus("unsolvable");
			setStats({
				solutionLength: 0,
				solveTime: 0,
			});
		}

		setIsSolving(false);
	}, [maze, algorithm, speed, isGenerating, isSolving]);

	const handleClear = useCallback(() => {
		if (!maze || isGenerating || isSolving) return;

		const newMaze = Maze.from(maze);
		newMaze.clearSolution();
		setSolveStatus("idle");

		setMaze(newMaze);
		setStats({
			solutionLength: 0,
			solveTime: 0,
		});
	}, [maze, isGenerating, isSolving]);

	const handleClearGrid = useCallback(() => {
		if (!maze || mode !== "create" || isGenerating || isSolving) return;

		const newMaze = Maze.from(maze);
		newMaze.clearSolution();
		setSolveStatus("idle");

		for (let y = 0; y < newMaze.height; y++) {
			for (let x = 0; x < newMaze.width; x++) {
				newMaze.grid[y][x] = 0;
			}
		}

		setMaze(newMaze);
		setStats({
			solutionLength: 0,
			solveTime: 0,
		});
	}, [maze, mode, isGenerating, isSolving]);

	const handleReset = useCallback(() => {
		if (isGenerating || isSolving) return;

		const newMaze = new Maze(mazeSize, mazeSize);
		setSolveStatus("idle");
		if (mode === "create") {
			for (let y = 0; y < newMaze.height; y++) {
				for (let x = 0; x < newMaze.width; x++) {
					newMaze.grid[y][x] = 0;
				}
			}
		}

		setMaze(newMaze);
		setStats({
			solutionLength: 0,
			solveTime: 0,
		});
	}, [mazeSize, mode, isGenerating, isSolving]);

	const handleCellClick = useCallback(
		(x, y) => {
			if (!maze || mode !== "create" || isGenerating || isSolving) return;

			const isStart = x === maze.start.x && y === maze.start.y;
			const isEnd = x === maze.end.x && y === maze.end.y;

			if (isStart || isEnd) return;

			const newMaze = Maze.from(maze);

			const newValue = newMaze.grid[y][x] === 1 ? 0 : 1;
			newMaze.setCell(x, y, newValue);
			setMaze(newMaze);
		},
		[maze, mode, isGenerating, isSolving]
	);

	const handleCellRightClick = useCallback(
		(x, y, e) => {
			if (!maze || isGenerating || isSolving) return;

			const newMaze = Maze.from(maze);

			if (isShiftDown) {
				newMaze.setEnd(x, y, mode);
			} else {
				newMaze.setStart(x, y, mode);
			}

			setMaze(newMaze);
		},
		[maze, isGenerating, isSolving, mode, isShiftDown]
	);

	if (!maze) {
		return <div className="loading">Loading...</div>;
	}

	return (
		<div className="container">
			<header className="header">
				<h1>🧩 Maze Solver</h1>
				<p>Interactive maze generation and pathfinding</p>
				<p className="instructions">
					Right-click to set start point | Shift + Right-click to set end point
				</p>
			</header>

			<Controls
				mazeSize={mazeSize}
				algorithm={algorithm}
				speed={speed}
				generationAlgorithm={generationAlgorithm}
				onMazeSizeChange={setMazeSize}
				onAlgorithmChange={setAlgorithm}
				onSpeedChange={setSpeed}
				onGenerationAlgorithmChange={setGenerationAlgorithm}
			/>

			<div className="main-content">
				<div className="maze-container">
					<MazeGrid
						maze={maze}
						onCellClick={handleCellClick}
						onCellRightClick={handleCellRightClick}
						mode={mode}
						cellSize={getCellSize()}
					/>
					<Legend />
				</div>

				<Sidebar
					mode={mode}
					onModeChange={setMode}
					onGenerate={handleGenerate}
					onSolve={handleSolve}
					onClear={handleClear}
					onReset={handleReset}
					onClearGrid={handleClearGrid}
					stats={stats}
					solveStatus={solveStatus}
					isGenerating={isGenerating}
					isSolving={isSolving}
				/>
			</div>
		</div>
	);
}

export default App;
