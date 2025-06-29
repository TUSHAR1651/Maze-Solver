# Maze Solver

An interactive web application that allows users to generate, create, and solve mazes using various algorithms. This project was built to explore graph traversal and maze generation algorithms in a visual, hands-on way.

**Live**: [maze-solver-nu.vercel.app](https://maze-solver-nu.vercel.app/)
**Demo Video**: [loom video](https://www.loom.com/share/8cca851844e14868ac59ef19d45ece2e?sid=8c39e138-da1f-41ba-8a30-ec1f1049771f)

## Features

- **Dual Modes**:
  - **Generate Mode**: Automatically create a random, solvable maze using one of two different algorithms.
  - **Create Mode**: Gives you a blank canvas to draw your own custom maze from scratch.
- **Multiple Generation Algorithms**:
  - **Recursive Backtracking**: Generates mazes with long, winding paths and fewer dead ends.
  - **Prim's Algorithm**: Creates more complex, richly-branched mazes with many short dead ends.
  - **Enhanced Randomness**: Mazes start from a random point and can have randomly opened borders for more variety and replayability.
- **Powerful Pathfinding Solvers**:
  - **Depth-First Search (DFS)**: A classic recursive solver.
  - **Breadth-First Search (BFS)**: Guarantees the shortest path in terms of number of cells.
  - **A\* Algorithm**: A highly efficient, heuristic-based algorithm that also finds the shortest path.
- **Interactive Visualization**:
  - Watch the solvers explore the maze in real-time.
  - Control the animation speed (Fast, Medium, Slow).
  - The final solution path is clearly displayed.
- **Full Customization**:
  - Select from multiple maze sizes, which are automatically adjusted to be valid for the generation algorithms.
  - In "Create" mode, click to place walls and right-click (or Shift+right-click) to set custom start and end points anywhere on the grid, including the borders.
- **User-Friendly Interface**:
  - Clean, modern UI built with React.
  - A comprehensive sidebar with all controls, real-time statistics (path length, solve time), and status messages (e.g., "No path found!").
  - Clear visual legend for all maze elements.

## How to Use

1.  **Select a Mode**:
    - Choose **Generate Maze** to have the app create a maze for you.
    - Choose **Create Maze** to build your own.
2.  **Customize Your Maze**:
    - **In Generate Mode**: Select a generation algorithm and a maze size from the dropdowns. Click "New Maze" to generate.
    - **In Create Mode**: Click on any cell to toggle it between a wall and a path. Right-click to set the start point (green), and Shift+right-click to set the end point (red).
3.  **Solve**:
    - Select a solving algorithm (DFS, BFS, or A\*).
    - Choose an animation speed.
    - Click "Solve Maze" and watch it go!
4.  **Controls**:
    - **Clear Solution**: Removes the solution path from a solved maze.
    - **Clear Grid** (Create Mode only): Removes all walls but keeps your custom start/end points.
    - **Reset Maze**: Resets the entire grid to its default state for the current mode.

## Technologies Used

- **Frontend**: React, Vite
- **Languages**: JavaScript (ES6+), HTML5, CSS3
- **Core Concepts**: Data Structures (Graphs, Stacks, Queues, Maps), Maze Generation Algorithms, Pathfinding Algorithms.

## How to Run Locally

1.  Clone the repository.
2.  Navigate to the project directory:
    ```bash
    cd MazeSolver
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open your browser and go to the local address provided (usually `http://localhost:5173`).

---

Made with ❤️ by Manan Agrawal
