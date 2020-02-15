let square;
let flag;
let bomb;
let one;
let two;
let three;
let four;
let five;
let six;
let seven;
let eight;
let cool;

function preload() {
    square = loadImage('assets/square.png');
    flag = loadImage('assets/flag.png');
    cool = loadImage('assets/cool.png');
    bomb = loadImage('assets/bomb.jpg');
    one = loadImage('assets/numbers/1.png');
    two = loadImage('assets/numbers/2.png');
    three = loadImage('assets/numbers/3.png');
    four = loadImage('assets/numbers/4.png');
    five = loadImage('assets/numbers/5.png');
    six = loadImage('assets/numbers/6.png');
    seven = loadImage('assets/numbers/7.png');
    eight = loadImage('assets/numbers/8.png');
    cool = loadImage('assets/cool.png');
}

class Cell {
    constructor(i, j, board) {
        this.i = i;
        this.j = j;
        this.x = this.i * board.scl + board.x;
        this.y = (this.j * board.scl) + 100 + board.y;
        this.revealed = false;
        this.marked = false;
        this.total = 0;
        this.markedMines = 0;
        this.mine = false;
        this.board = board;
    }

    show() {
        if (!this.revealed) {
            imageMode(CORNER);
            fill(255);
            stroke(50);
            strokeWeight(2);
            image(square, this.x, this.y, this.board.scl, this.board.scl);
        } else if (this.revealed) {
            fill(185);
            stroke(117);
            strokeWeight(2);
            rectMode(CORNER);
            rect(this.x, this.y, this.board.scl, this.board.scl);
        }

        if (this.marked) {
            imageMode(CORNER);
            fill(0);
            image(flag, this.x, this.y, this.board.scl, this.board.scl);
        }

        if (this.mine && this.revealed) {
            imageMode(CORNER);
            fill(0);
            noStroke();
            image(bomb, this.x, this.y, this.board.scl, this.board.scl);
            this.board.gameOver();
        } else if (this.revealed) {
            fill(0);
            noStroke();
            if (this.total > 0 && this.revealed && !this.marked) {
                imageMode(CENTER);
                switch (this.total) {
                    case 1:
                        image(one, this.x + this.board.scl * 0.5, this.y + this.board.scl * 0.5, this.board.scl * 0.64, this.board.scl * 0.64);
                        break;
                    case 2:
                        image(two, this.x + this.board.scl * 0.5, this.y + this.board.scl * 0.5, this.board.scl * 0.64, this.board.scl * 0.64);
                        break;
                    case 3:
                        image(three, this.x + this.board.scl * 0.5, this.y + this.board.scl * 0.5, this.board.scl * 0.64, this.board.scl * 0.64);
                        break;
                    case 4:
                        image(four, this.x + this.board.scl * 0.5, this.y + this.board.scl * 0.5, this.board.scl * 0.64, this.board.scl * 0.64);
                        break;
                    case 5:
                        image(five, this.x + this.board.scl * 0.5, this.y + this.board.scl * 0.5, this.board.scl * 0.64, this.board.scl * 0.64);
                        break;
                    case 6:
                        image(six, this.x + this.board.scl * 0.5, this.y + this.board.scl * 0.5, this.board.scl * 0.64, this.board.scl * 0.64);
                        break;
                    case 7:
                        image(seven, this.x + this.board.scl * 0.5, this.y + this.board.scl * 0.5, this.board.scl * 0.64, this.board.scl * 0.64);
                        break;
                    case 8:
                        image(eight, this.x + this.board.scl * 0.5, this.y + this.board.scl * 0.5, this.board.scl * 0.64, this.board.scl * 0.64);
                        break;
                }
            }
        }
        this.checkNeighbor();
        this.checkMarked();
    }




    Mark() {
        if (!this.revealed) {
            this.marked = true;
            this.board.markedBombs++;
        }
    }
    UnMark() {
        if (!this.revealed) {
            this.marked = false;
            this.board.markedBombs--;
        }
    }


    checkNeighbor() {
        let total = 0;
        if (this.mine) {
            this.total = -1;
            return;
        }
        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                const i_ = this.i + xoff;
                const j_ = this.j + yoff;
                if (i_ > -1 && i_ < this.board.cols && j_ > -1 && j_ < this.board.rows) {
                    let neighbor = this.board.grid[i_][j_];
                    if (neighbor.mine) {
                        total++;
                    }
                }
            }
        }
        this.total = total;
        return total;
    }


    contain(x, y) {
        if (x > this.x && x < this.x + this.board.scl && y > this.y && y < this.y + this.board.scl) {
            return true;
        }
    }

    reveal() {
        this.revealed = true;
        this.floodFill();
    }



    floodFill() {
        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                const i_ = this.i + xoff;
                const j_ = this.j + yoff;
                if (i_ > -1 && i_ < this.board.cols && j_ > -1 && j_ < this.board.rows) {
                    const neighbor = this.board.grid[i_][j_];
                    if (!neighbor.mine && !neighbor.revealed && this.total == 0) {
                        neighbor.reveal();
                        neighbor.UnMark();
                    } else if (!neighbor.revealed && !neighbor.marked && this.markedMines == this.total) {
                        neighbor.reveal();
                        neighbor.UnMark();
                    }
                }
            }
        }
    }


    checkMarked() {
        let Mtotal = 0;
        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                const i_ = this.i + xoff;
                const j_ = this.j + yoff;
                if (i_ > -1 && i_ < this.board.cols && j_ > -1 && j_ < this.board.rows) {
                    const neighbor = this.board.grid[i_][j_];
                    if (neighbor.marked) {
                        Mtotal++;
                    }
                }
            }
        }
        this.markedMines = Mtotal;
    }
}
