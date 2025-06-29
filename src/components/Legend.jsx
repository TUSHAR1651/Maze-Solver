import React from "react";
import "./Legend.css";

const Legend = () => {
	return (
		<div className="legend">
			<div className="legend-item">
				<div className="legend-color color-wall"></div>
				<span className="legend-label">Wall</span>
			</div>
			<div className="legend-item">
				<div className="legend-color color-path"></div>
				<span className="legend-label">Path</span>
			</div>
			<div className="legend-item">
				<div className="legend-color color-start"></div>
				<span className="legend-label">Start</span>
			</div>
			<div className="legend-item">
				<div className="legend-color color-end"></div>
				<span className="legend-label">End</span>
			</div>
			<div className="legend-item">
				<div className="legend-color color-current"></div>
				<span className="legend-label">Current</span>
			</div>
			<div className="legend-item">
				<div className="legend-color color-solution"></div>
				<span className="legend-label">Solution</span>
			</div>
		</div>
	);
};

export default Legend;
