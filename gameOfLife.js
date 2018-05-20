function Board(cellSize, x, y) {
  this.width = x;
  this.height = y;
  //draw a table
  var brd = document.createElement("div");
  brd.style.width = x*cellSize + "px";
  brd.style.height = y*cellSize + "px";
  brd.className = "board";
  brd.style.top = "0px";
  brd.style.left = "0px";
  document.body.appendChild(brd);

  //create representation of the board
  var matrix = [];
  for (let i=0; i<y; i++){
    matrix.push([]);
    for(let j=0; j<x; j++){
      var btn = Cell(cellSize, i, j);
      matrix[i].push(btn);
      brd.appendChild(btn);
    }
  }
  this.matrix = matrix;

  this.liveNeigbours = function(testX, testY) {
    //check all cells around coordinates, return number of live cells
    var stat = 0;
    var startX = testX-1;
    var startY = testY-1;
    for(let i=0; i<3; i++){
      for(let j=0; j<3; j++){
        if(this.height-1 >= (startX+i) && 0 <= (startX+i) && this.width-1 >= (startY+j) && 0 <= (startY+j)) {
          //console.log("try", startX+i, startY+j);
          //console.log(this.height-1, this.width-1);
          if(this.matrix[startX+i][startY+j].style.backgroundColor != emptyCellColor()) {
            stat += 1;
            //console.log("live");
          }
          else {
            //console.log(emptyCellColor());
          }
        }
        else {
          //console.log("border", testX+i-1, testY+j-1);
          //outside of borders. in case i will want infinite board in the future
        }
    }
  }
    if(this.matrix[testX][testY].style.backgroundColor != emptyCellColor()) {//minus the middle cell status
      stat -= 1;
    }
    return stat;
    };
}

///Cell///

function Cell(cellSize, x, y) {
  ///draw a cell
  var btn = document.createElement("div");
  var margin = 1;
  btn.className = "cell";
  btn.id = x.toString() + y.toString();
  btn.style.backgroundColor = emptyCellColor();
  btn.style.margin = margin + "px";
  btn.style.width = cellSize-(margin*2) + "px";
  btn.style.height = cellSize-(margin*2) + "px";

  btn.onclick = function(){
    //console.log(btn.style.backgroundColor);
    //console.log(emptyCellColor());
    if(btn.style.backgroundColor == emptyCellColor()) {
      btn.style.backgroundColor = randomColor();
    }
    else {
      btn.style.backgroundColor = emptyCellColor();
    }
  };
  return btn;
}

function randomColor() {
  var r = Math.floor(Math.random() * 156), //50
      g = Math.floor(Math.random() * 200), //200
      b = Math.floor(Math.random() * 226), //256 for blue hues
      color = "rgb("+r+","+g+","+b+")";
  if (color === emptyCellColor()) {
    randomColor();
  }
  else {
    return color;
  }
}

function emptyCellColor() {
  return "rgb(148, 184, 184)"; //"lightblue";
}

function setBoardSize(cellSize, x, y) {
  //if board size is undefined, set board size as full screen
  if (typeof x === "undefined" || typeof y === "undefined") {
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName('body')[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;
    y = y; //substract some pixels for top buttons row
    x = (x - x % cellSize)/cellSize;
    y = (y - y % cellSize)/cellSize;
  }
  return [x, y];
}

function run(board) {
  var colorMatrix = [];
   for (let i=0; i<board.height; i++){
     colorMatrix.push([]);
    for (let j=0; j<board.width; j++){
      let currNb = board.liveNeigbours(i,j);
      let currColor = board.matrix[i][j].style.backgroundColor;
      colorMatrix[i].push(currColor);
      //console.log(currColor);
      if (currColor != emptyCellColor()) {
        if(currNb < 2 || currNb > 3) {
          colorMatrix[i][j] = emptyCellColor(); //cell dies
        }
      }
      else {
        if(currNb == 3) {
          colorMatrix[i][j] = randomColor(); //new cell is born
        }
      }
    }
  }
  updateBoard(board, colorMatrix);
}

function updateBoard(board, matrix) { //sets colors on the board by given matrix
  for (let i=0; i<board.height; i++){
    for (let j=0; j<board.width; j++){
       board.matrix[i][j].style.backgroundColor = matrix[i][j];
    }
  }
}

///Main///

var cellSize = 20;
var set = setBoardSize(cellSize), //(cellSize, x, y) x and y board size in # of cells.
    x = set[0],
    y = set[1];

//var board1 = new Board(cellSize, x, y);

function loadPattern() {
  var patMatrix = [];
   for (let i=0; i<board1.height; i++){
    patMatrix.push([]);
    for (let j=0; j<board1.width; j++){
      patMatrix[i].push(emptyCellColor());
    }
   }
  //line
  patMatrix[7][1] = randomColor();
  patMatrix[7][2] = randomColor();
  patMatrix[7][3] = randomColor();
  //glider
  patMatrix[4][4] = randomColor();
  patMatrix[4][5] = randomColor();
  patMatrix[4][6] = randomColor();
  patMatrix[3][6] = randomColor();
  patMatrix[2][5] = randomColor();
  //someshit
  patMatrix[3][13] = randomColor();
  patMatrix[3][14] = randomColor();
  patMatrix[3][15] = randomColor();
  patMatrix[2][14] = randomColor();
  patMatrix[4][14] = randomColor();
  updateBoard(board1, patMatrix);
}

var counter;
function play(){
  counter = setTimeout(function(){run(board1); play()}, 1000);
}
function pause(){
  clearTimeout(counter);
}

function loadRandomPattern(board1){
  var patMatrix = [];
  for (let i=0; i<board1.height; i++){
   patMatrix.push([]);
   for (let j=0; j<board1.width; j++){
     if (Math.random()>0.5) {
       patMatrix[i].push(emptyCellColor());
     }
     else {
       patMatrix[i].push(randomColor());
     }
   }
  }
  updateBoard(board1, patMatrix);
}

function test() {
  var a = board1.liveNeigbours(4, 5);
  console.log(a);
}

function runLife() {
  var board1 = new Board(cellSize, x, y);
  loadRandomPattern(board1);
  play();
}
