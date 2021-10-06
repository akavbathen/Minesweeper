const EMPTY = '';
const MINE = '*';
const FLAG = 'p'

var gFirstClick;
var gBoard;
var gSeconds;
var gWinMines;
var gWinNums;
var gTimerID = undefined;
var gInGame;
var gROWS;
var gCOLS;
var gLives;

function initGame(row, col) {
    gROWS = row;
    gCOLS = col;
    gInGame = true;
    gSeconds = 1;
    gFirstClick = true;
    gLives = 3;

    gBoard = createMat(row, col);
    renderBoard();
}

function createMat(ROWS, COLS) {
    var mat = []
    gWinNums = ROWS * COLS;
    for (var i = 0; i < ROWS + 2; i++) {
        var row = []
        for (var j = 0; j < COLS + 2; j++) {
            var cell = {
                type: EMPTY,
                isShown: false,
                minesAroundCount: 0,
                isMine: false,
                isMarked: false,
            };
            row.push(cell);
        }
        mat.push(row);
    }

    return mat;
}

function getMinesCountOfCell(mat, k, l) {
    if (mat[k][l].type === MINE) {
        return -1;
    }

    var count = 0;
    var ns = [
        [k - 1, l],
        [k - 1, l + 1],
        [k, l + 1],
        [k + 1, l + 1],
        [k + 1, l],
        [k + 1, l - 1],
        [k, l - 1],
    ]

    for (var i = 0; i < ns.length; i++) {
        if (mat[ns[i][0]][ns[i][1]].type !== MINE) {
            continue;
        }

        count++;
    }

    return count;
}

function showNeighbours(k, l) {
    var ns = [
        [k - 1, l],
        [k - 1, l + 1],
        [k, l + 1],
        [k + 1, l + 1],
        [k + 1, l],
        [k + 1, l - 1],
        [k, l - 1],
    ]

    for (var i = 0; i < ns.length; i++) {
        if (gBoard[ns[i][0]][ns[i][1]].type === MINE) {
            continue;
        }

        try {
            var elCell = document.querySelector(`.cell-${ns[i][0]}-${ns[i][1]}`);
            elCell.innerHTML = `${gBoard[ns[i][0]][ns[i][1]].minesAroundCount}`;
        }
        catch (e) {
            continue;
        }

        if (gBoard[ns[i][0]][ns[i][1]].isShown === true){
            continue;
        }

        gBoard[ns[i][0]][ns[i][1]].isShown = true;
        gWinNums--;
        if (gWinNums === 0 && gWinMines === 0) {
            gameOverWin();
            return;
        }
    }
}

function renderBoard() {
    var strHtml = '';

    for (var i = 1; i < gBoard.length - 1; i++) {
        strHtml += '<tr>'
        for (var j = 1; j < gBoard[0].length - 1; j++) {
            var cell = gBoard[i][j];
            if (cell.isShown === true) {
                if (cell.type === MINE) {
                    strHtml += `<td onMouseDown="cellClicked(this,${i},${j})" class=cell-${i}-${j}>${cell.type}</td>`;
                } else {
                    strHtml += `<td onMouseDown="cellClicked(this,${i},${j})" class=cell-${i}-${j}>${cell.minesAroundCount}</td>`;
                }
            }
            else {
                strHtml += `<td onMouseDown="cellClicked(this,${i},${j})" class=cell-${i}-${j}>X</td>`;
            }


        }
        strHtml += '</tr>'

    }

    var elBoard = document.querySelector('.board-container');
    elBoard.innerHTML = strHtml;
}

function setMinesNegsCount(mat) {
    for (var i = 1; i < mat.length - 2; i++) {
        var arr = mat[i];
        for (var j = 1; j < arr.length - 2; j++) {
            var cell = mat[i][j];
            cell.minesAroundCount = getMinesCountOfCell(mat, i, j);
        }
    }
}

function cellClicked(elCell, i, j) {
    console.log(`object: ${elCell}\nid: ${i} ${j}`);

    if (gInGame === false) {
        return;
    }

    if (gFirstClick === true) {
        gWinMines = 0;
        var rCount = 4;
        while (rCount > 0) {
            var r1 = getRandomIntInt(1, gROWS);
            var r2 = getRandomIntInt(1, gCOLS);
            if (r1 === i && r2 === j) {
                continue;
            }

            if (gBoard[r1][r2].isMine === false) {
                gBoard[r1][r2].type = MINE;
                gBoard[r1][r2].isMine = true;
                gWinMines++;
                rCount--;
            }
        }

        gWinNums = gWinNums - gWinMines;

        setMinesNegsCount(gBoard);
        myTimer();
    }

    var e = window.event;

    if (e.which === 1) {
        if (gBoard[i][j].isMarked === false) {
            if (gBoard[i][j].type === MINE) {
                gameOver(i, j);
                return;
            }
            else if (gBoard[i][j].type === EMPTY && gBoard[i][j].minesAroundCount !== 0) {
                if (gBoard[i][j].isShown === false) {   
                    gBoard[i][j].isShown = true;
                    gWinNums--;
                    if (gWinNums === 0 && gWinMines === 0) {
                        gameOverWin();
                        return;
                    }
                    elCell.innerHTML = `${gBoard[i][j].minesAroundCount}`
                }
            }
            else if (gBoard[i][j].type === EMPTY && gBoard[i][j].minesAroundCount === 0) {
                if (gBoard[i][j].isShown === false) {
                    gBoard[i][j].isShown = true;
                    gWinNums--;
                    if (gWinNums === 0 && gWinMines === 0) {
                        gameOverWin();
                        return;
                    }
                    elCell.innerHTML = `${gBoard[i][j].minesAroundCount}`

                    showNeighbours(i, j);
                }
            }
        }
    }
    else if (e.which === 3) {
        if (gBoard[i][j].isShown === false) {
            if (gBoard[i][j].isMarked === false) {
                gBoard[i][j].isMarked = true;
                elCell.innerHTML = `${FLAG}`

                if (gBoard[i][j].isMine === true) {
                    gWinMines--;
                    if (gWinNums === 0 && gWinMines === 0) {
                        gameOverWin();
                        return;
                    }
                }
            }
            else if (gBoard[i][j].isMarked === true) {
                gBoard[i][j].isMarked = false;
                elCell.innerHTML = 'X'

                if (gBoard[i][j].isMine === true) {
                    gWinMines++;
                }
            }
        }
    }
}


function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function myTimer() {
    if (gFirstClick === false) {
        return;
    }

    var elSeconds = document.querySelector('.seconds');
    elSeconds.innerHTML = '0';

    if (gTimerID) {
        clearInterval(gTimerID);
        gTimerID = undefined;
    }

    gTimerID = setInterval(onTime, 1000);
    gFirstClick = false;
}


function onTime() {
    var elSeconds = document.querySelector('.seconds');
    elSeconds.innerHTML = `${gSeconds}`;
    gSeconds++;
}
function gameOver(k, l) {
    var elCell = document.querySelector(`.cell-${k}-${l}`);
    elCell.style.color = 'orange';

    var elSeconds = document.querySelector('.lives');
    gLives--;
    elSeconds.innerHTML = `${gLives}`;

    if (gLives > 0) {
        gWinMines--;
        return;
    }

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cel = gBoard[i][j]
            if (cel.isMine === true) {
                cel.isShown = true;
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                elCell.innerHTML = MINE;
            }
        }
    }

    var elCell = document.querySelector(`.cell-${k}-${l}`);
    elCell.style.color = 'red';

    console.log('Game Over');

    gInGame = false;
    clearInterval(gTimerID);
    gTimerID = undefined;
}

function gameOverWin() {
    console.log('Game Over. You win!');
    gInGame = false;
    clearInterval(gTimerID);
    gTimerID = undefined;
}