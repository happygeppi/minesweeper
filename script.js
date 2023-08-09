const w = 24;
const h = 24;
const numMines = 72;

const mines = [];
const data = [];
let ended = false;

const size = 24;
const html = {
  board: undefined,
  rows: [],
  cells: [],
  reveal: (i, j) => {
    if (data[j][i].mine) html.cells[j][i].classList.add("mine");
    else {
      html.cells[j][i].classList.add("revealed");
      if (data[j][i].neighbors > 0)
        html.cells[j][i].innerHTML = data[j][i].neighbors;
      html.cells[j][i].classList.add(`n${data[j][i].neighbors}`);
    }
    html.cells[j][i].classList.remove("flag");
  },
};

const showResult = false;

const $ = (id) => document.getElementById(id);
const $$ = (q) => document.querySelector(q);
const $$$ = (q) => document.querySelectorAll(q);

function Init() {
  CreateBoard();
  GenerateMines();
  GenerateBoardData();
}

function CreateBoard() {
  const board = document.createElement("div");
  board.id = "board";
  document.body.append(board);
  html.board = board;

  for (let j = 0; j < h; j++) {
    const Row = document.createElement("div");
    Row.classList.add("row");
    $("board").append(Row);
    html.rows.push(Row);
    html.cells.push([]);

    for (let i = 0; i < w; i++) {
      const Cell = document.createElement("div");
      Cell.classList.add("cell");
      html.rows[j].append(Cell);
      html.cells[j].push(Cell);

      Cell.style.width = `${size}px`;
      Cell.style.height = `${size}px`;
      Cell.style.fontSize = `${Math.floor(size * 0.8)}px`;
      Cell.style.lineHeight = `${size}px`;

      Cell.addEventListener("click", () => Reveal(i, j));
      Cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        Flag(i, j);
      });
    }
  }
}

function GenerateMines() {
  let i = 0;

  while (i < numMines) {
    const x = Math.floor(Math.random() * w);
    const y = Math.floor(Math.random() * h);
    let valid = false;
    if (i > 0)
      for (let j = 0; j < mines.length; j++)
        if (mines[j].x != x && mines[j].y != y) valid = true;

    if (valid || i == 0) {
      mines.push({ x, y });
      i++;
    }
  }
}

function GenerateBoardData() {
  for (let j = 0; j < h; j++) {
    data.push([]);
    for (let i = 0; i < w; i++)
      data[j].push({
        mine: false,
        flag: false,
        neighbors: undefined,
        revealed: false,
      });
  }

  for (const mine of mines) data[mine.y][mine.x].mine = true;

  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (!data[j][i].mine) {
        let n = 0;

        for (let dj = -1; dj <= 1; dj++)
          for (let di = -1; di <= 1; di++)
            if (
              (dj != 0 || di != 0) &&
              j + dj >= 00 &&
              i + di >= 0 &&
              j + dj < w &&
              i + di < h
            )
              if (data[j + dj][i + di].mine) n++;

        data[j][i].neighbors = n;
      }
    }
  }

  // just for debugging:
  if (showResult)
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) html.reveal(i, j);
}

function Reveal(i, j) {
  if (ended) return;
  if (data[j][i].revealed) return;
  if (data[j][i].flag) return;

  if (data[j][i].mine) {
    html.reveal(i, j);
    return GameOver();
  }

  html.reveal(i, j);
  data[j][i].revealed = true;
  data[j][i].flag = false;

  if (data[j][i].neighbors == 0)
    for (let dj = -1; dj <= 1; dj++)
      for (let di = -1; di <= 1; di++)
        if (
          j + dj >= 00 &&
          i + di >= 0 &&
          j + dj < w &&
          i + di < h &&
          !data[j + dj][i + di].revealed
        )
          Reveal(i + di, j + dj);

  CheckWin();
}

function Flag(i, j) {
  if (data[j][i].revealed) return;

  data[j][i].flag = !data[j][i].flag;

  if (data[j][i].flag) {
    html.cells[j][i].classList.add("flag");
    html.cells[j][i].innerHTML = "🚩";
  } else {
    html.cells[j][i].classList.remove("flag");
    html.cells[j][i].innerHTML = "";
  }

  CheckWin();
}

function CheckWin() {
  let won = true;
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const c = data[j][i];
      if (!c.revealed && (!c.mine || !c.flag)) won = false;
    }
  }
  if (won) Win();
}

function GameOver() {
  ended = true;
  console.log("You lost! 😵🚩");
  document.body.classList.add("lost");
}

function Win() {
  ended = true;
  console.log("Congrats, you won! 🥳");
  document.body.classList.add("won");
}

Init();
