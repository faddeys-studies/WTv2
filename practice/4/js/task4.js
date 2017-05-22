

function Puzzle15(options) {
    options = options || {};

    this._on_turn = options.on_turn || null;
    this._on_set_state = options.on_set_state || null;

    this._field = [];
    for(let i = 0; i < 16; i++) {
        this._field.push(i);
    }

    Object.defineProperty(this, 'emptyCell', {
        get: () => {
            let i = this._field.indexOf(0);
            return [Math.floor(i / 4), i % 4];
        }
    });
}
Puzzle15.prototype.setState = function (stateField) {
    for(let r = 0; r < stateField.length; r++) {
        let row = stateField[r];
        for(let c = 0; c < row.length; c++) {
            let i = 4*r + c;
            if (i >= 16) throw "State field has incorrect size";
            this._field[i] = row[c];
        }
    }
    if (!!this._on_set_state) {
        this._on_set_state(this);
    }
};
Puzzle15.prototype.isSolved = function () {
    for (let i = 0; i < 16; i++) {
        if (this._field[i] != (i+1)%16) return false;
    }
    return true;
};
Puzzle15.prototype.resetState = function () {
    this.setState([[1,  2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]])
};
Puzzle15.prototype._analyzeTurn = function (r, c) {
    let x = {};
    x.valid = (0 <= r || r < 4 || 0 <= c || c < 4);
    x.empty = {i: this._field.indexOf(0)};
    x.empty.r = Math.floor(x.empty.i / 4);
    x.empty.c = x.empty.i % 4;
    x.turn = {r, c, i: 4*r+c};
    x.possible = ((x.empty.c == c+1 || x.empty.c == c-1) && (x.empty.r == r))
              || ((x.empty.c == c) && (x.empty.r == r+1 || x.empty.r == r-1));
    return x;
};
Puzzle15.prototype.canMakeTurn = function (r, c) {
    let turn = this._analyzeTurn(r, c);
    return turn.valid && turn.possible;
};
Puzzle15.prototype.makeTurn = function (r, c) {
    let turn = this._analyzeTurn(r, c);
    if (!turn.valid || !turn.possible) return false;
    this._field[turn.empty.i] = this._field[turn.turn.i];
    this._field[turn.turn.i] = 0;
    if (!!this._on_turn) {
        this._on_turn(this, turn.empty, turn.turn);
    }
    return true;
};
Puzzle15.prototype.getCell = function (row, col) {
    return this._field[4*row + col];
};
Puzzle15.prototype.shuffleState = function () {
    let array = this._field;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    if (!!this._on_set_state) {
        this._on_set_state(this);
    }
};
