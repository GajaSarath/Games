import React, { useState, useEffect, useRef } from "react";
import "./SnakeGame.css"; // Import the CSS file

const CANVAS_SIZE = 400;
const SCALE = 20;
const SPEED = 150;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function generateFood(snake) {
  while (true) {
    const newFood = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / SCALE)),
      y: Math.floor(Math.random() * (CANVAS_SIZE / SCALE)),
    };
    if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      return newFood;
    }
  }
}

function SnakeGame() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(() => generateFood(INITIAL_SNAKE));
  const [nextDirection, setNextDirection] = useState(DIRECTIONS.right);
  const [gameOver, setGameOver] = useState(false);

  const changeDirection = (newDir) => {
    setNextDirection((prev) => {
      if (prev.x + DIRECTIONS[newDir].x === 0 && prev.y + DIRECTIONS[newDir].y === 0) {
        return prev;
      }
      return DIRECTIONS[newDir];
    });
  };

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = {
          x: newSnake[0].x + nextDirection.x,
          y: newSnake[0].y + nextDirection.y,
        };

        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= CANVAS_SIZE / SCALE ||
          head.y >= CANVAS_SIZE / SCALE ||
          newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, SPEED);

    return () => clearInterval(interval);
  }, [nextDirection, food, gameOver]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x * SCALE, food.y * SCALE, SCALE, SCALE);

    ctx.fillStyle = "lime";
    snake.forEach(({ x, y }) => ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE));
  });

  return (
    <div className="game-container">
      <h1>🐍 Snake Game</h1>
      {gameOver && <h2>Game Over! Refresh to restart.</h2>}
      <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE}></canvas>
      
      {/* Control Buttons */}
      <div className="controls">
        <button onClick={() => changeDirection("up")}>⬆️</button>
        <div className="row">
          <button onClick={() => changeDirection("left")}>⬅️</button>
          <button onClick={() => changeDirection("down")}>⬇️</button>
          <button onClick={() => changeDirection("right")}>➡️</button>
        </div>
      </div>
    </div>
  );
}

export default SnakeGame;
