// --- Game state ---
const board = document.getElementById('board');
const scoreBox = document.getElementById('scoreBox');
const hiscoreBox = document.getElementById('hiscoreBox');

let inputDir = { x: 0, y: 0 };
let speed = 9;                 // frames per second
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
const GRID_SIZE = 18;

// Hi-score from localStorage
let hiscoreval = 0;
const stored = localStorage.getItem("hiscore");
if (stored === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(stored);
  hiscoreBox.innerText = "HiScore: " + hiscoreval;
}

// Helper: random food position not on snake
function randomFoodPosition() {
  let a = 2, b = GRID_SIZE - 2;
  let newFood;
  while (true) {
    newFood = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random())
    };
    if (!snakeArr.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
      return newFood;
    }
  }
}

// Collision detection
function isCollide(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  if (snake[0].x >= GRID_SIZE || snake[0].x <= 0 || snake[0].y >= GRID_SIZE || snake[0].y <= 0) {
    return true;
  }
  return false;
}

// Main game loop
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
  lastPaintTime = ctime;
  gameEngine();
}

// Update & render
function gameEngine() {
  // Collision
  if (isCollide(snakeArr)) {
    inputDir = { x: 0, y: 0 };
    alert("Game Over. Press any arrow key to play again!");
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    scoreBox.innerText = "Score: " + score;
    food = randomFoodPosition();
  }

  // Eating food
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    score += 1;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerText = "HiScore: " + hiscoreval;
    }
    scoreBox.innerText = "Score: " + score;
    snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
    food = randomFoodPosition();
  }

  // Move snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // Render snake & food
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    const snakeElement = document.createElement('div');
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    snakeElement.classList.add(index === 0 ? 'head' : 'snake');
    board.appendChild(snakeElement);
  });

  const foodElement = document.createElement('div');
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add('food');
  board.appendChild(foodElement);
}

// Controls
window.addEventListener('keydown', e => {
  let newDir = null;
  if (e.key === "ArrowUp") newDir = { x: 0, y: -1 };
  else if (e.key === "ArrowDown") newDir = { x: 0, y: 1 };
  else if (e.key === "ArrowLeft") newDir = { x: -1, y: 0 };
  else if (e.key === "ArrowRight") newDir = { x: 1, y: 0 };
  else return;

  e.preventDefault();

  // Prevent reverse
  if (inputDir.x === -newDir.x && inputDir.y === -newDir.y) return;

  inputDir = newDir;
});

// Start the loop
window.requestAnimationFrame(main);
food = randomFoodPosition();