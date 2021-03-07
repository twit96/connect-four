// ---------------------------------------------------------------------- Audio
var drop_sound = document.getElementById("drop_sound");
var win_sound = document.getElementById("win_sound");


// ---------------------------------------------------------------------- Timer
var time;
function setTimer() {
  time = 0;
  document.getElementById('timer').innerHTML = 0;
  timer_interval = setInterval(function(){
    time++;
    document.getElementById('timer').innerHTML = time;
  }, 1000);
}
setTimer();


// --------------------------------------------------------------- Table Config
// generate columns
for (var i=0; i<7; i++) {
  var column = document.createElement('span');
  column.classList.add('column');
  // assign id
  var c_id = 'c-' + i.toString();
  column.setAttribute('id', c_id);
  column.setAttribute('onclick', 'makeMove(this, this.id)')

  // generate boxes (row elements)
  for (var j=0; j<6; j++) {
    var box = document.createElement('span');
    box.classList.add('box');
    // assign id
    var b_id = 'b-' + i.toString() + '-' + j.toString();
    box.setAttribute('id', b_id);
    // add boxes to column
    column.insertAdjacentElement('beforeend', box);
  }

  // add columns to board
  var board = document.getElementById('board').querySelector('.wrapper');
  board.insertAdjacentElement('beforeend', column);
}


// ---------------------------------------------------------------- Game Config
var moves = [];
function config_moves() {
  for (var i=0; i<7; i++) {
    moves[i] = [];
    for (var j=0; j<6; j++) {
      moves[i][j] = 0;
    }
  }
}
config_moves();


// ------------------------------------------------------------------ Check Win
function checkLine(a, b, c, d) {
  return ((a != 0) && (a == b) && (a == c) && (a == d));
}

function checkWin() {
  // check columns
  for (c = 0; c < 7; c++) {
    for (r = 0; r < 3; r++) {
      if (checkLine(moves[c][r], moves[c][r+1], moves[c][r+2], moves[c][r+3])) {
        var arr = [[c,r], [c, r+1], [c, r+2], [c, r+3]];
        var winner = moves[c][r];
        handleWin(arr, winner);
        return moves[c][r];
      }
    }
  }
  // check rows
  for (c = 0; c < 4; c++) {
    for (r = 0; r < 6; r++) {
      if (checkLine(moves[c][r], moves[c+1][r], moves[c+2][r], moves[c+3][r])) {
        var arr = [[c,r], [c+1, r], [c+2, r], [c+3, r]];
        var winner = moves[c][r];
        handleWin(arr, winner);
        return moves[c][r];
      }
    }
  }
  // check diagonal
  for (c = 0; c < 4; c++) {
    for (r = 0; r < 3; r++) {
      if (checkLine(moves[c][r], moves[c+1][r+1], moves[c+2][r+2], moves[c+3][r+3])) {
        var arr = [[c,r], [c+1, r+1], [c+2, r+2], [c+3, r+3]];
        var winner = moves[c][r];
        handleWin(arr, winner);
        return moves[c][r];
      }
    }
  }
  // check diagonal
  for (c = 3; c < 7; c++) {
    for (r = 0; r < 3; r++) {
      if (checkLine(moves[c][r], moves[c-1][r+1], moves[c-2][r+2], moves[c-3][r+3])) {
        var arr = [[c,r], [c-1, r+1], [c-2, r+2], [c-3, r+3]];
        var winner = moves[c][r];
        handleWin(arr, winner);
        return moves[c][r];
      }
    }
  }
  // no win
  return 0;
}

function handleWin(arr, winner) {
  win_sound.play();
  
  // stop timer
  clearInterval(timer_interval);
  // color pieces
  for (i=0; i<arr.length; i++) {
    var sub_arr = arr[i];
    var win_piece = document.getElementById('b-' + sub_arr[0] + '-' + sub_arr[1]);
    win_piece.querySelector('span').style.backgroundColor = 'var(--green)';
    win_piece.querySelector('span').style.borderColor = 'var(--green-shadow)';
  }
  // color player text
  p1_ind = document.getElementById('player1');
  p2_ind = document.getElementById('player2');
  if (winner == 'p1') {
    p1_ind.style.backgroundColor = 'var(--green)';
    p1_ind.style.borderColor = 'var(--green-shadow)';
    p2_ind.style.borderColor = 'var(--blue)';
  } else {
    p2_ind.style.backgroundColor = 'var(--green)';
    p2_ind.style.borderColor = 'var(--green-shadow)';
    p1_ind.style.borderColor = 'var(--blue)';
  }
  // remove onclick listeners
  for (var i=0; i<7; i++) {
    document.getElementById('c-' + i).removeAttribute('onclick');
  }
}


// --------------------------------------------------------------- Player Turns
var curr_player = "p1";

function updatePlayer() {
  if (curr_player == "p1") { curr_player = "p2"; }
  else { curr_player = "p1"; }

  // update indicator borders
  var pid = "player" + curr_player[1];
  var p1_ind = document.getElementById('player1');
  var p2_ind = document.getElementById('player2');
  if (pid == 'player1') {
    p1_ind.style.borderColor = 'var(--red)';
    p2_ind.style.borderColor = 'var(--blue)';
  } else {
    p1_ind.style.borderColor = 'var(--blue)';
    p2_ind.style.borderColor = 'var(--yellow)';
  }
}


function makeMove(clicked_elem, clicked_id) {
  // Parse Element ID for Coordinates
  const coords = clicked_id.split('-');
  const x = coords[1];  // col coord

  // Update Game
  for (var i = moves[x].length -1; i >= 0; i--) {
    if (moves[x][i] == 0) {  // find lowest unplayed box element in column
      // update moves array
      moves[x][i] = curr_player;
      // create turn element
      var move = document.createElement('span');
      move.classList.add(curr_player);
      // add turn element to board
      var played_elem = document.getElementById("b-" + x + "-" + i.toString());
      played_elem.insertAdjacentElement('beforeend', move);

      updatePlayer();  // Update Current Player
      checkWin();  // Check For Win
      drop_sound.play();
      break;  // terminate loop
    }
  }
}


// --------------------------------------------------------------- Restart Game
function restart() {
  // reset timer
  clearInterval(timer_interval);
  setTimer();

  // reset visual elements
  p1_ind = document.getElementById('player1');
  p2_ind = document.getElementById('player2');
  p1_ind.style.backgroundColor = 'var(--blue)';
  p1_ind.style.borderColor = 'var(--red)';
  p2_ind.style.backgroundColor = 'var(--blue)';
  p2_ind.style.borderColor = 'var(--blue)';

  // reset moves
  moves = [];
  config_moves();

  // reset board
  for (var i=0; i<moves.length; i++) {
    for (var j=0; j<moves.length -1; j++) {
      var curr_elem = document.getElementById('b-' + i + '-' + j);
      while (curr_elem.firstChild) {
        curr_elem.removeChild(curr_elem.lastChild);
      }
    }
  }

  // add onclick listeners back (removed on win)
  for (var i=0; i<7; i++) {
    document.getElementById('c-' + i).setAttribute('onclick', 'makeMove(this, this.id)')
  }

  // reset current player
  curr_player = 'p1';
}
