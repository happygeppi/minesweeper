const width = 20;

const grid = document.querySelector(".grid");
const flagsLeft = document.querySelector("#flags-left");
const result = document.querySelector("#result");
document.documentElement.style.setProperty("--totalw", width);

let bombAmount = width * 2.5;
let flags = 0;
let squares = [];
let isGameOver = false;

//create Board
function createBoard() {
  flagsLeft.innerHTML = bombAmount;

  //get shuffled game array with random bombs
  const bombsArray = Array(bombAmount).fill("bomb");
  const emptyArray = Array(width * width - bombAmount).fill("valid");
  const gameArray = emptyArray.concat(bombsArray);
  const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.setAttribute("id", i);
    square.classList.add(shuffledArray[i]);
    grid.appendChild(square);
    squares.push(square);

    //normal click
    square.addEventListener("click", function (e) {
      click(square);
    });

    //cntrl and left click
    square.oncontextmenu = function (e) {
      e.preventDefault();
      addFlag(square);
    };
  }

  //add numbers
  for (let i = 0; i < squares.length; i++) {
    let total = 0;
    const isLeftEdge = i % width === 0;
    const isRightEdge = i % width === width - 1;

    if (squares[i].classList.contains("valid")) {
      if (squares[i].classList.contains("valid")) {
        //left check:
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
          total++;

        //top left check:
        if (
          i > width + 1 &&
          !isLeftEdge &&
          squares[i - width - 1].classList.contains("bomb")
        )
          total++;

        //top check:
        if (i > width && squares[i - width].classList.contains("bomb")) total++;

        //top right check:
        if (
          i > width - 1 &&
          !isRightEdge &&
          squares[i - width + 1].classList.contains("bomb")
        )
          total++;

        //right check:
        if (
          i < width * width - 2 &&
          !isRightEdge &&
          squares[i + 1].classList.contains("bomb")
        )
          total++;

        //bottom right check:
        if (
          i < width * width - width - 2 &&
          !isRightEdge &&
          squares[i + width + 1].classList.contains("bomb")
        )
          total++;

        //bottom check:
        if (
          i < width * width - width - 1 &&
          squares[i + width].classList.contains("bomb")
        )
          total++;

        //bottom left check:
        if (
          i < width * width - width + 1 &&
          !isLeftEdge &&
          squares[i + width - 1].classList.contains("bomb")
        )
          total++;

        squares[i].setAttribute("data", total);
      }
    }
  }
}
createBoard();

//add Flag with right click
function addFlag(square) {
  if (isGameOver) return;
  if (!square.classList.contains("checked")) {
    if (!square.classList.contains("flag") && flags < bombAmount) {
      square.classList.add("flag");
      square.innerHTML = " 🚩";
      flags++;
      flagsLeft.innerHTML = bombAmount - flags;
      checkForWin();
    } else {
      square.classList.remove("flag");
      square.innerHTML = "";
      flags--;
      flagsLeft.innerHTML = bombAmount - flags;
    }
  }
}

//click on square actions
function click(square) {
  let currentId = square.id;
  if (isGameOver) return;
  if (square.classList.contains("checked") || square.classList.contains("flag"))
    return;
  if (square.classList.contains("bomb")) {
    gameOver(square);
  } else {
    let total = square.getAttribute("data");
    if (total != 0) {
      square.classList.add("checked");
      if (total == 1) square.classList.add("one");
      if (total == 2) square.classList.add("two");
      if (total == 3) square.classList.add("three");
      if (total == 4) square.classList.add("four");
      if (total > 4) square.classList.add("hotaf");
      square.innerHTML = total;
      return;
    }
    checkSquare(square, currentId);
  }
  square.classList.add("checked");
}

//check neighboring squares once square is clicked
function checkSquare(square, currentId) {
  const isLeftEdge = currentId % width === 0;
  const isRightEdge = currentId % width === width - 1;

  setTimeout(() => {
    //left:
    if (currentId > 0 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    //top left:
    if (currentId > width + 1 && !isLeftEdge) {
      const newId = squares[parseInt(currentId) - width - 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    //top:
    if (currentId > width) {
      const newId = squares[parseInt(currentId) - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    //top right:
    if (currentId > width - 1 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1 - width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    //right:
    if (currentId < width * width - 2 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    //bottom right:
    if (currentId < width * width - width - 2 && !isRightEdge) {
      const newId = squares[parseInt(currentId) + width + 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    //bottom:
    if (currentId < width * width - width - 1) {
      const newId = squares[parseInt(currentId) + width].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }

    //bottom left:
    if (currentId < width * width - width && !isLeftEdge) {
      const newId = squares[parseInt(currentId) + width - 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
  }, 10);
}

//game over
function gameOver(square) {
  result.innerHTML = "Game Over!";
  isGameOver = true;

  //show ALL the bombs
  squares.forEach((square) => {
    if (square.classList.contains("bomb")) {
      square.innerHTML = "💣";
      square.classList.remove("bomb");
      square.classList.add("checked");
    }
  });
}

//check for win
function checkForWin() {
  ///simplified win argument
  let matches = 0;

  for (let i = 0; i < squares.length; i++) {
    if (
      squares[i].classList.contains("flag") &&
      squares[i].classList.contains("bomb")
    ) {
      matches++;
    }
    if (matches === bombAmount) {
      result.innerHTML = "YOU WIN!";
      isGameOver = true;
    }
  }
}
