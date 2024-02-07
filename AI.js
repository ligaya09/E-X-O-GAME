const backgroundMusic = document.getElementById('background-music');
document.addEventListener('click', function () {
    backgroundMusic.play();
    });
    const humanTurnSound = document.getElementById('humanTurnSound');
    const aiTurnSound = document.getElementById('aiTurnSound');



var origBoard;
var playerScore = 0;
var aiScore = 0;
const huPlayer = 'X';
const aiPlayer = 'O';
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
  [1, 7, 12, 19, 25],
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
let difficulty = "easy"; // Default difficulty
let gameIsOver = false; // Flag to track if the game is over

function startGame() {
    backgroundMusic.play();
  toggleButton();
  document.querySelector(".endgame").style.display = "none";
  document.getElementById("butbut").innerText = 'Clear Board';

  origBoard = Array.from(Array(30).keys()); // Adjusted for the larger board
  gameIsOver = false; // Reset the game over flag

  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].removeEventListener('click', turnClickEasy, false);
    cells[i].removeEventListener('click', turnClickMedium, false);
    cells[i].removeEventListener('click', turnClick, false);
  }


  // Get selected difficulty
  difficulty = document.getElementById("difficulty").value;

  if (difficulty === "easy") {
    cells.forEach(cell => cell.addEventListener('click', turnClickEasy, false));

  } else if (difficulty === "medium") {
    cells.forEach(cell => cell.addEventListener('click', turnClickMedium, false));
  } else {
    cells.forEach(cell => cell.addEventListener('click', turnClick, false));
  }
  if (playerScore === 5) {
    resetScores();
  } else if (aiScore === 5) {
    resetScores();
  }
}
function toggleButton() {
  var difficultySelect = document.getElementById("difficulty");
  var button = document.getElementById("butbut");

  // Toggle visibility based on the selected difficulty
  button.style.visibility = (difficultySelect.value !== "Choose one") ? "visible" : "hidden";
}
function turnClick(square) {
  if (!gameIsOver && typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpotMedium(), aiPlayer);
  }
}

function turnClickEasy(square) {
    humanTurnSound.play();    
    aiTurnSound.play();
  if (!gameIsOver && typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpotEasy(), aiPlayer);
  }
}

function turnClickMedium(square) {
    humanTurnSound.play();    
    aiTurnSound.play();
  if (!gameIsOver && typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, huPlayer);
    if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpotMedium(), aiPlayer);
  }
}

function turn(squareId, player) {
    humanTurnSound.play();    
    aiTurnSound.play();


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
function checkWin(board, player) {
  let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  gameIsOver = true; // Set the game over flag
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  updateScore(gameWon.player);
  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";

  // Check if playerScore or aiScore has reached 5
  if (playerScore === 5) {
    document.querySelector(".endgame .text").innerText = "You are the ULTIMATE CHAMPION!";
    document.getElementById("butbut").innerText = "Play Again";

  } else if (aiScore === 5) {
    document.querySelector(".endgame .text").innerText = "You are the ULTIMATE LOSER!";
    document.getElementById("butbut").innerText = "Play Again";

  } else {
    document.querySelector(".endgame .text").innerText = who;
  }
}
function updateScores() {
  document.getElementById("playerScore").innerText = playerScore;
  document.getElementById("aiScore").innerText = aiScore;
}
function resetScores() {
  // Reset playerScore and aiScore to 0
  playerScore = 0;
  aiScore = 0;

  // Call the function to update the displayed scores
  updateScores();
}
function updateScore(player) {
  if (player == huPlayer) {
    playerScore++;
    document.getElementById("playerScore").innerText = playerScore;
  } else if (player == aiPlayer) {
    aiScore++;
    document.getElementById("aiScore").innerText = aiScore;
  }
}

function emptySquares() {
  return origBoard.filter(s => typeof s == 'number');
}

function bestSpotEasy() {
  var emptySpots = emptySquares();
  var randomIndex = Math.floor(Math.random() * emptySpots.length);
  return emptySpots[randomIndex];
}

function bestSpotMedium() {
  var emptySpots = emptySquares();
  for (var i = 0; i < emptySpots.length; i++) {
    var copyBoard = [...origBoard];
    copyBoard[emptySpots[i]] = aiPlayer;
    if (checkWin(copyBoard, aiPlayer)) {
      return emptySpots[i];
    }
  }
  for (var i = 0; i < emptySpots.length; i++) {
    var copyBoard = [...origBoard];
    copyBoard[emptySpots[i]] = huPlayer;
    if (checkWin(copyBoard, huPlayer)) {
      return emptySpots[i];
    }
  }
  var randomIndex = Math.floor(Math.random() * emptySpots.length);
  return emptySpots[randomIndex];
}

   function checkTie() {
  if (emptySquares().length == 0 && !gameIsOver) {
    gameIsOver = true; // Set the game over flag
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener('click', turnClick, false);
    }

    // Declare a tie game
    declareWinner("Tie Game!");

    // Update tie count
    updateTieCount();

    return true;
  }
  return false;
}

function updateTieCount() {
  // Increment the tie count
  document.getElementById("tieScore").innerText++;
}

    

