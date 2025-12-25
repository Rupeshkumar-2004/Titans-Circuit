# Titan's Circuit ⚡

**Titan's Circuit** is a turn-based strategy game built with vanilla JavaScript, HTML, and CSS. Two players (Red vs. Blue) compete to dominate a hexagonal grid by placing and moving "Titans" to control connecting edges and score points.

![Project Status](https://img.shields.io/badge/Status-Completed-success)
![Tech Stack](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-blue)

## 🎮 Game Overview

The game takes place on a graph-based board consisting of 3 concentric hexagonal rings. Players take turns placing their Titans on nodes and then moving them to adjacent spots.

### Objectives
* **Control Edges:** Occupy both ends of a connecting line (edge) to add its weight to your score.
* **Eliminate Opponents:** Surround an enemy Titan with your own to remove them from the board.
* **Win:** Have the highest score when the timer runs out or eliminate the opposing team.

## ✨ Features

* **Hexagonal Grid System:** Dynamically rendered using SVG and trigonometry.
* **Two Phases:**
    1.  **Placement Phase:** Unlock rings progressively (Outer → Middle → Inner) as they fill up.
    2.  **Movement Phase:** Move Titans tactically to capture edges or surround enemies.
* **Scoring System:** Real-time score calculation based on edge weights.
* **Combat Logic:** Automatic detection of "surrounded" Titans for elimination.
* **Timer System:**
    * Global Game Timer (6 minutes).
    * Turn Timer (15 seconds per move) to force quick decisions.
* **Game Controls:** Start, Pause, Resume, and Reset functionality.

## 🛠️ Installation & Setup

Since this is a static web project, no installation is required!

1.  **Clone or Download** the repository.
2.  **Open** the `index.html` file in any modern web browser (Chrome, Firefox, Edge).
3.  **Play!**

## 🕹️ How to Play

1.  **Start Game:** Click the "Start Game" button to begin the timer.
2.  **Placement Phase:**
    * Players take turns placing their 4 Titans on the board.
    * You can only place on "unlocked" circuits (starts with the outer ring).
3.  **Movement Phase:**
    * Once all Titans are placed, clicking a Titan selects it (highlighted in gold).
    * Valid move destinations will flash green.
    * Click a green node to move.
4.  **Game Over:**
    * The game ends when the time runs out, a player is eliminated, or the inner ring is full (optional rule).
    * The player with the highest score wins.

## 📂 Project Structure

```text
Titans-Circuit/
├── index.html      # Main game interface and DOM structure
├── styles.css      # Styling, animations, and layout
├── game.js         # Core game logic, state management, and interaction
└── board.js        # SVG board generation and rendering logic
