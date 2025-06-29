import React from "react";
import "./MazeGrid.css";

const MazeGrid = ({
	maze,
	onCellClick,
	onCellRightClick,
	mode = "generate",
	cellSize = 30,
}) => {
	const handleCellClick = (x, y, e) => {
		e.preventDefault();
		if (mode === "create") {
			onCellClick(x, y);
		}
	};

	const handleCellRightClick = (x, y, e) => {
		e.preventDefault();
		onCellRightClick(x, y, e);
	};

	const getCellClass = (x, y) => {
		const cellValue = maze.grid[y][x];
		const isWall = cellValue === 1;
		const isSolution = cellValue === 2;
		const isStart = x === maze.start.x && y === maze.start.y;
		const isEnd = x === maze.end.x && y === maze.end.y;
		const isCurrent =
			maze.current && x === maze.current.x && y === maze.current.y;

		if (isStart) return "cell start";
		if (isEnd) return "cell end";
		if (isSolution) return "cell solution";
		if (isCurrent) return "cell current";
		if (isWall) return "cell wall";
		return "cell path";
	};

	const totalWidth = maze.width * cellSize + (maze.width - 1);
	const totalHeight = maze.height * cellSize + (maze.height - 1);

	return (
		<div
			className="maze-grid"
			style={{
				gridTemplateColumns: `repeat(${maze.width}, ${cellSize}px)`,
				gridTemplateRows: `repeat(${maze.height}, ${cellSize}px)`,
				width: `${totalWidth}px`,
				height: `${totalHeight}px`,
			}}
		>
			{maze.grid.map((row, y) =>
				row.map((cell, x) => (
					<div
						key={`${x}-${y}`}
						className={getCellClass(x, y)}
						onClick={(e) => handleCellClick(x, y, e)}
						onContextMenu={(e) => handleCellRightClick(x, y, e)}
						style={{
							width: cellSize,
							height: cellSize,
						}}
						title={`Cell (${x}, ${y})`}
					/>
				))
			)}
		</div>
	);
};

export default MazeGrid;
