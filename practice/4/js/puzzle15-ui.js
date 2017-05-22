

function Puzzle15Controller(selector) {
    let table = document.querySelector(selector);
    if (!table) throw "Cannot get table element";

    let cells = [];
    table.querySelectorAll('tr').forEach((row, rowId) => {
        let rowCells = row.querySelectorAll('td');
        cells.push(rowCells);
        rowCells.forEach((cell, colId) => {
            cell.onclick = () => puzzle15.makeTurn(rowId, colId);
        });
    });

    let puzzle15 = new Puzzle15({
        on_turn: function (_, {r: fromR, c: fromC}, {r: toR, c: toC}) {
            displayCell(fromR, fromC, puzzle15.getCell(fromR, fromC));
            displayCell(toR, toC, 0);
        },
        on_set_state: function () {
            cells.forEach((row, rowId) => {
                row.forEach((cell, colId) => {
                    displayCell(rowId, colId, puzzle15.getCell(rowId, colId));
                });
            });
        }
    });

    function displayCell(row, col, value) {
        let cell = cells[row][col];
        if (value == 0) {
            cell.innerHTML = "";
        } else {
            cell.innerHTML = '<a class="tile" href="#">' + value + '</a>';
        }
    }

    this.cells = cells;
    this.game = puzzle15;
}
