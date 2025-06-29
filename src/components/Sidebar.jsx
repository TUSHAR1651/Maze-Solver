import React from "react";
import "./Sidebar.css";

const Sidebar = ({
	mode,
	onModeChange,
	onGenerate,
	onSolve,
	onClear,
	onReset,
	onClearGrid,
	stats,
	solveStatus,
	isGenerating,
	isSolving,
}) => {
	const isActionDisabled = isGenerating || isSolving;
	const isSolveDisabled =
		isActionDisabled || solveStatus === "solved" || solveStatus === "solving";
	const isClearDisabled =
		isActionDisabled ||
		(solveStatus !== "solved" && solveStatus !== "unsolvable");

	return (
		<aside className="sidebar">
			<div className="sidebar-card mode-card">
				<h3>Mode</h3>
				<div className="mode-selector">
					<button
						className={`mode-btn ${mode === "generate" ? "active" : ""}`}
						onClick={() => onModeChange("generate")}
						disabled={isActionDisabled}
					>
						Generate Maze
					</button>
					<button
						className={`mode-btn ${mode === "create" ? "active" : ""}`}
						onClick={() => onModeChange("create")}
						disabled={isActionDisabled}
					>
						Create Maze
					</button>
				</div>
			</div>

			<div className="sidebar-card">
				<h3>Actions</h3>
				<div className="action-buttons">
					{mode === "generate" && (
						<button
							className="btn btn-primary"
							onClick={onGenerate}
							disabled={isActionDisabled}
						>
							{isGenerating ? "Generating..." : "New Maze"}
						</button>
					)}
					{mode === "create" && (
						<button
							className="btn btn-warning"
							onClick={onClearGrid}
							disabled={isActionDisabled}
						>
							Clear Grid
						</button>
					)}
					<button
						className="btn btn-success"
						onClick={onSolve}
						disabled={isSolveDisabled}
					>
						{isSolving ? "Solving..." : "Solve Maze"}
					</button>
					<button
						className="btn btn-secondary"
						onClick={onClear}
						disabled={isClearDisabled}
					>
						Clear Solution
					</button>
					<button
						className="btn btn-warning"
						onClick={onReset}
						disabled={isActionDisabled}
					>
						Reset Maze
					</button>
				</div>
			</div>

			<div className="sidebar-card">
				<h3>Stats</h3>
				<div className="stats">
					<div className="stat-item">
						<span className="stat-label">Path Length:</span>
						<span className="stat-value">{stats.solutionLength}</span>
					</div>
					<div className="stat-item">
						<span className="stat-label">Solve Time:</span>
						<span className="stat-value">{stats.solveTime} ms</span>
					</div>
					<div className="stat-item">
						<span className="stat-label">Status:</span>
						<span className="stat-value status-text">
							{solveStatus.charAt(0).toUpperCase() + solveStatus.slice(1)}
						</span>
					</div>
				</div>
			</div>

			{solveStatus === "unsolvable" && (
				<div className="status-message error">No path found!</div>
			)}
		</aside>
	);
};

export default Sidebar;
