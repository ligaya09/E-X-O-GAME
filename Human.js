const backgroundMusic = document.getElementById('background-music');
document.addEventListener('click', function () {
    backgroundMusic.play();
    });
    const humanTurnSound = document.getElementById('humanTurnSound');
var origBoard;
var currentPlayer;
var player1Score = 0;
var player2Score = 0;
const player1 = 'O';
const player2 = 'X';
const winCombos = [
  [1, 6],
  [4, 11],
  [23, 28],
  [18, 25],
  [2, 7, 12],
  [3, 10, 17],
  [17, 22, 27],
  [12, 19, 26],
  [3, 8, 13, 18],
  [2, 9, 16, 23],
  [11, 16, 21, 26],
  [6, 13, 20, 27],
  [0, 6, 12, 18, 24],
  [1, 7, 13, 19, 25],
  [2, 8, 14, 20, 26],
  [3, 9, 15, 21, 27],
  [4, 10, 16, 22, 28],
  [5, 11, 17, 23, 29],
  [0, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 29],
  [1, 8, 15, 22, 29], [4, 9, 14, 19, 24], [0, 7, 14, 21, 28], [5, 10, 15, 20, 25]
]

const cells = document.querySelectorAll('.cell');
let gameIsOver = false; // Flag to track if the game is over

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  document.getElementById("butbut").innerText = 'Clear Board';

  
humanTurnSound.play(); 

  origBoard = Array.from(Array(30).keys()); // Adjusted for the larger board
  gameIsOver = false; // Reset the game over flag
  currentPlayer = player1; // Set the initial player

  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
  if (player1Score === 5) {
    declareWinner("Player 1 is the ULTIMATE CHAMPION!");
    resetScores()
    document.querySelector(".endgame").style.display = "none";


  } else if (player2Score === 5) {
    declareWinner("Player 2 is the ULTIMATE CHAMPION!");
    resetScores()
    document.querySelector(".endgame").style.display = "none";



  }
}

function turnClick(square) {
  if (!gameIsOver && typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, currentPlayer);
    if (!checkWin(origBoard, currentPlayer) && !checkTie()) {
      // Switch turns
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      document.getElementById("butbut").innerText = `Clear Board (Player ${currentPlayer})`;
    }
  }
}


function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if (gameWon) {
    gameOver(gameWon);
  } else {
    // Check for a tie after each turn
    checkTie();
  }
}
function checkWin(board, currentPlayer) {
  let plays = board.reduce((a, e, i) =>
    (e === currentPlayer) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, currentPlayer: currentPlayer };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  gameIsOver = true; // Set the game over flag
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.currentPlayer === player1 ? "blue" : "red";
  }

  updateScore(gameWon.currentPlayer);

  if (player1Score === 5) {
    declareWinner("Player 1 is the ULTIMATE CHAMPION!");
    document.getElementById("butbut").innerText = 'Play Again';

  } else if (player2Score === 5) {
    declareWinner("Player 2 is the ULTIMATE CHAMPION!");
    document.getElementById("butbut").innerText = 'Play Again';


  } else {
    declareWinner(`Player ${gameWon.currentPlayer} wins!`);
  }
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function updateScores() {
  document.getElementById("player1Score").innerText = player1Score;
  document.getElementById("player2Score").innerText = player2Score;
}

function resetScores() {
  // Reset player1Score and player2Score to 0
  player1Score = 0;
  player2Score = 0;

  // Call the function to update the displayed scores
  updateScores();
}

function updateScore(currentPlayer) {
  if (currentPlayer === player1) {
    player1Score++;
  } else if (currentPlayer === player2) {
    player2Score++;
  }
  updateScores();
}

function emptySquares() {
  return origBoard.filter(s => typeof s == 'number');
}

function checkTie() {
  if (emptySquares().length == 0 && !gameIsOver) {
    gameIsOver = true; // Set the game over flag
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie Game!")
    return true;
  }
  return false;
}