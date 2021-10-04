const EMPTY = '_';
const MINE = '*';

var gBoard;


function init() {
    gBoard = createMat(4, 4);
    gBoard[2][2].type = MINE;
    gBoard[3][1].type = MINE;
    setMinesNegsCount();

    renderBoard();
}

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS + 2; i++) {
        var row = []
        for (var j = 0; j < COLS + 2; j++) {
            var cell = {
                type: EMPTY,
                isShown: true,
                minesAroundCount: 0,
                isMine: false,
                isMarked: true,
            };
            row.push(cell);
        }
        mat.push(row);
    }
    return mat;
}

function getMinesCountOfCell(k, l) {
    if (gBoard[k][l].type === MINE) {
        return -1;
    }

    var count = 0;
    if (gBoard[k - 1][l - 1].type === MINE) {
        count++;
    }
    if (gBoard[k - 1][l].type === MINE) {
        count++;
    }
    if (gBoard[k - 1][l + 1].type === MINE) {
        count++;
    }
    if (gBoard[k][l + 1].type === MINE) {
        count++;
    }
    if (gBoard[k + 1][l + 1].type === MINE) {
        count++;
    }
    if (gBoard[k + 1][l].type === MINE) {
        count++;
    }
    if (gBoard[k + 1][l - 1].type === MINE) {
        count++;
    }
    if (gBoard[k][l - 1].type === MINE) {
        count++;
    }

    return count;
}

function renderBoard() {
    var strHtml = '';

    for (var i = 1; i < gBoard.length - 2; i++) {
        strHtml += '<tr>'
        for (var j = 1; j < gBoard[0].length - 2; j++) {
            var cell = gBoard[i][j];
            
            if (cell.type === MINE) {
                strHtml += `<td class=cell-${i}-${j}>${cell.type}</td>`;
            }else{
                strHtml += `<td class=cell-${i}-${j}>${cell.minesAroundCount}</td>`;
            }
            
        }
        strHtml += '</tr>'

    }

    var elBoard = document.querySelector('.board-container');
    elBoard.innerHTML = strHtml;
}

function setMinesNegsCount() {
    for (var i = 1; i < gBoard.length - 2; i++) {
        var arr = gBoard[i];
        for (var j = 1; j < arr.length - 2; j++) {
            var cell = gBoard[i][j];
            cell.minesAroundCount = getMinesCountOfCell(i, j);
        }
    }
}
