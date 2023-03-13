let canvas = document.getElementById("board");
let ctx = canvas.getContext("2d");
let snake = [{ x: 150, y: 150 }, { x: 140, y: 150 }, { x: 130, y: 150 }];
let foodPosition = {
  x: Math.floor(Math.random() * 29) * 10,
  y: Math.floor(Math.random() * 29) * 10
};
let direction = "Right";
let gameSpeed = 50;
let score = 0;

function updateScore() {
  score++;
  document.getElementById("score").innerHTML = score;
}

function gameOver() {
  document.getElementById("end").innerHTML = "GAME OVER";
  document.removeEventListener("keydown", moveSnake);
  document.removeEventListener("keydown", quit);
  clearInterval(interval);
}

function newFoodPosition() {
  foodPosition.x = Math.floor(Math.random() * 29) * 10;
  foodPosition.y = Math.floor(Math.random() * 29) * 10;
}
function drawFood() {
  let { x, y } = foodPosition;
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = "#18a";
  ctx.fillRect(x, y, 10, 10);
  ctx.strokeRect(x, y, 10, 10);
}

function clearCanvas() {
  ctx.fillStyle = "#18a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function setDirection(newDirection) {
  if (
    !(
      (direction === "Left" && newDirection === "Right") ||
      (direction === "Right" && newDirection === "Left") ||
      (direction === "Up" && newDirection === "Down") ||
      (direction === "Down" && newDirection === "Up")
    )
  ) {
    direction = newDirection;
  }
}

function didSnakeEatFood() {
  let { x: headx, y: heady } = getHeadPosition();
  return foodPosition.x === headx && foodPosition.y === heady;
}

function didSnakeEatItself(newHead) {
  let snakeBody = snake.slice(1);
  return snakeBody.some(part => part.x === newHead.x && part.y === newHead.y);
}

function getHeadPosition() {
  return snake[0];
}

function growSnake() {
  let tail = snake[snake.length - 1];
  if (direction === "Up") {
    snake.push({ x: tail.x, y: tail.y + 10 });
  }
  if (direction === "Down") {
    snake.push({ x: tail.x, y: tail.y - 10 });
  }
  if (direction === "Left") {
    snake.push({ x: tail.x + 10, y: tail.y });
  }
  if (direction === "Right") {
    snake.push({ x: tail.x - 10, y: tail.y });
  }
  updateScore();
}

function isHeadOnTheEdge(currentHead, newDirection) {
  if (newDirection === "Up" && currentHead.y === 0) {
    return true;
  }
  if (newDirection === "Down" && currentHead.y === 290) {
    return true;
  }
  if (newDirection === "Right" && currentHead.x === 290) {
    return true;
  }
  if (newDirection === "Left" && currentHead.x === 0) {
    return true;
  }
  return false;
}

function calculateNewHead(newDirection) {
  let { x, y } = getHeadPosition();
  let onEdge;
  if (newDirection === "Left" && direction !== "Right") {
    onEdge = isHeadOnTheEdge({ x, y }, newDirection);
    return { x: onEdge ? 290 : x - 10, y };
  }
  if (newDirection === "Right" && direction !== "Left") {
    onEdge = isHeadOnTheEdge({ x, y }, newDirection);
    return { x: onEdge ? 0 : x + 10, y };
  }
  if (newDirection === "Up" && direction !== "Down") {
    onEdge = isHeadOnTheEdge({ x, y }, newDirection);
    return { x, y: onEdge ? 290 : y - 10 };
  }
  if (newDirection === "Down" && direction !== "Up") {
    onEdge = isHeadOnTheEdge({ x, y }, newDirection);
    return { x, y: onEdge ? 0 : y + 10 };
  }

  return { x, y };
}

function drawSnake() {
  clearCanvas();
  drawFood();
  ctx.fillStyle = "#1f0";
  ctx.strokeStyle = "#18a";
  snake.forEach(cell => {
    ctx.fillRect(cell.x, cell.y, 10, 10);
    ctx.strokeRect(cell.x, cell.y, 10, 10);
  });
}

function moveSnake(ev) {
  let keyCodes = [37, 38, 39, 40];
  let changeDirection = false;
  if (!!ev) {
    ev.preventDefault();
    changeDirection = keyCodes.some(code => code === ev.keyCode);
  }

  let newDirection = !!ev && changeDirection ? ev.key.substring(5) : direction;

  let newHead = calculateNewHead(newDirection);
  if (didSnakeEatItself(newHead)) {
    gameOver();
  }
  snake.unshift(newHead);
  snake.pop();
  drawSnake();

  if (didSnakeEatFood()) {
    growSnake();
    newFoodPosition();
  }
  setDirection(newDirection);
}

let interval = setInterval(moveSnake, gameSpeed);

function quit(ev) {
  if (ev.code === "KeyQ") {
    gameOver();
  }
}
document.addEventListener("keydown", quit);
document.addEventListener("keydown", moveSnake);

clearCanvas();
drawSnake();
