const get = (element) => document.querySelector(element);
const getAll = (element) => document.querySelectorAll(element);

const grid = get("#grid");
const startButton = get("#start-btn");
const scoreDisplay = get("#score");
const resizeButton = get("#resize-btn");
const leaderboard = getAll("#leaderboard-score");

let squares = [];
let currentSnake = [];
let direction = 1;
let width = 20;
let appleIndex = 0;
let score = 0;
let intervalTime = 0;
let speed = 0.9;
let timerId = 0;

scoreDisplay.textContent = score;
//Creates the displayed and the logical game grid which is an array of squares, rappresented in a grid
function createGrid() {
  grid.innerHTML = "";
  squares = [];

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    grid.appendChild(square);
    squares.push(square);
  }
}

//Resizes the game grid and recreates it
function resizeGame() {
  if (width === 20) {
    resizeButton.textContent = "Large";
    width = 30;

    grid.style.width = "600px";
    grid.style.height = "600px";
  } else {
    resizeButton.textContent = "Medium";
    width = 20;

    grid.style.width = "400px";
    grid.style.height = "400px";
  }
  createGrid();
}

resizeButton.addEventListener("click", resizeGame);
createGrid();

function startGame() {
  resizeButton.disabled = true;
  //remove the previous snake from the grid
  currentSnake.forEach((index) => squares[index].classList.remove("snake"));
  //remove the apple from the grid
  squares[appleIndex].classList.remove("apple");

  //generate default snake
  currentSnake = [2, 1, 0];
  //add the new snake to the grid
  currentSnake.forEach((index) => squares[index].classList.add("snake"));
  //generating new apple
  generateApples();
  //reset direction
  direction = 1;
  //reset score and display score
  score = 0;
  width == 20 ? (intervalTime = 350) : (intervalTime = 250);
  scoreDisplay.textContent = score;
  clearInterval(timerId);
  timerId = setInterval(move, intervalTime);
}

//checks if the current score is higher than one of the previous ones, if it finds a lower score
//the function is recalled with the lower score found in order to update the leaderboard
function updateTopScore(score) {
  for (let scores of leaderboard) {
    if (parseInt(scores.textContent) < score) {
      parseInt(scores.textContent) != 0 &&
        updateTopScore(parseInt(scores.textContent));
      scores.textContent = score;
      return;
    }
  }
}

function move() {
  if (
    //avoid snake to go outside the grid
    (currentSnake[0] + width >= width * width && direction === width) ||
    (currentSnake[0] % width === width - 1 && direction === 1) ||
    (currentSnake[0] % width === 0 && direction === -1) ||
    (currentSnake[0] - width < 0 && direction === -width) ||
    squares[currentSnake[0] + direction].classList.contains("snake")
  ) {
    resizeButton.disabled = false;
    //updating top scores
    updateTopScore(score);
    return clearInterval(timerId);
  }
  //remove last elements from our currentSnake array
  const tail = currentSnake.pop();
  //remove styling to the last element
  squares[tail].classList.remove("snake");
  //add square in the direction we are heading
  currentSnake.unshift(currentSnake[0] + direction);
  //snake head gets to the apple
  if (squares[currentSnake[0]].classList.contains("apple")) {
    //remove the apple class
    squares[currentSnake[0]].classList.remove("apple");
    //grow our sname by adding class of snake to it
    squares[tail].classList.add("snake");
    currentSnake.push(tail);
    //generate new apple
    generateApples();
    //add one to the score
    score++;
    //display score
    scoreDisplay.textContent = score;
    clearInterval(timerId);
    intervalTime = intervalTime * speed;
    timerId = setInterval(move, intervalTime);
  }
  //add styling to the new square
  squares[currentSnake[0]].classList.add("snake");
}

//generates a random number between zero and the squares max length until the number generated doesn't
//belong to squares that rapresent the snake, and it displays an apple in that square
function generateApples() {
  do {
    appleIndex = Math.floor(Math.random() * squares.length);
  } while (squares[appleIndex].classList.contains("snake"));
  squares[appleIndex].classList.add("apple");
}

function control(e) {
  e.preventDefault();
  if (e.key === "s" || (e.key === "ArrowDown" && direction != -width)) {
    direction = +width;
  } else if (e.key === "w" || (e.key === "ArrowUp" && direction != +width)) {
    direction = -width;
  } else if (e.key === "a" || (e.key === "ArrowLeft" && direction != +1)) {
    direction = -1;
  } else if (e.key === "d" || (e.key === "ArrowRight" && direction != -1)) {
    direction = 1;
  }
}

document.addEventListener("keydown", control);
startButton.addEventListener("click", startGame);
