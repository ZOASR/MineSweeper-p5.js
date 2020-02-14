class Board {
    constructor(x, y, cols, rows, scl) {
        this.x = x;
        this.y = y;
        this.cols = cols;
        this.rows = rows;
        this.grid = make2DArray(cols, rows);
        this.scl = scl;
        this.bombs = 0;
        this.markedBombs = 0;
        this.revealedBombs = 0;
        this.bombMode = true;
        this.easy = createButton('Easy: 50 Mines');
        this.medium = createButton('Medium: 150 Mines');
        this.hard = createButton('Hard: 250 Mines');
        this.message = createP('(To Change Difficulty: REFRESH)');
        this.message1 = createP('(Change Mode: Changes Whether to use flag Or Bomb)');
        this.button = createButton('Change Mode');
        this.n = 0;

        this.message.hide();
        this.button.mousePressed(() => {
            this.bombMode = !this.bombMode;
        });


        this.button.position(this.cols * this.scl + 50 + this.x, 100 + this.y);
        this.easy.position(this.cols * this.scl + 50 + this.x, 125 + this.y);
        this.medium.position(this.cols * this.scl + 50 + this.x, 145 + this.y);
        this.hard.position(this.cols * this.scl + 50 + this.x, 165 + this.y);
        this.message.position(this.cols * this.scl + 50 + this.x, 175 + this.y);
        this.message1.position(this.cols * this.scl + 50 + this.x, 45 + this.y);

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j] = new Cell(i, j, this);
            }
        }



        this.button.mousePressed(() => {
            this.bombMode = !this.bombMode;
        });
    }


    populateBoard() {
        for (let i = 0; i <= this.bombs; i++) {
            const x = floor(random(this.cols));
            const y = floor(random(this.rows));
            this.grid[x][y].mine = true;
        }

        this.easy.hide();
        this.medium.hide();
        this.hard.hide();

        this.message.position(this.cols * this.scl + 50 + this.x, 140 + this.y);
        this.message.show();
        for (let i = 0; i <= 10; i++) {
            for (let i = 0; i < this.cols; i++) {
                for (let j = 0; j < this.rows; j++) {
                    if (this.grid[i][j].mine) {
                        this.n++;
                    }
                }
            }

            if (this.n != this.bombs) {
                for (let i = 0; i <= this.bombs - this.n; i++) {
                    let x = floor(random(this.cols));
                    let y = floor(random(this.rows));
                    if (this.grid[x][y].mine == false) {
                        this.grid[x][y].mine = true;
                    } else if (this.grid[x][y].mine) {
                        x = floor(random(this.cols));
                        y = floor(random(this.rows));
                        this.grid[x][y].mine = true;
                    }
                }
            }
        }
    }


    gameOver() {
        fill(255, 0, 0);
        stroke(125);
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j].reveal();
                this.grid[i][j].UnMark();
            }
        }
        setTimeout(noLoop, 50);
        console.warn('Game Over');
        setTimeout(window.location.reload(), 2000);
    }


    WIN() {
        imageMode(CENTER);
        image(cool, this.scl * this.rows / 2 + this.x, this.scl * this.cols / 2 + this.y, this.scl * this.rows, this.scl * this.cols);
        setTimeout(noLoop, 50);
        setTimeout(window.location.reload(), 2000);
    }

    show() {
        fill(255);
        noStroke();
        textFont("Arial");
        textAlign(LEFT);
        frameRate(10);

        this.easy.mousePressed(() => {
            this.bombs = 50;
            this.populateBoard();
        });
        this.medium.mousePressed(() => {
            this.bombs = 150;
            this.populateBoard();
        });
        this.hard.mousePressed(() => {
            this.bombs = 250;
            this.populateBoard();
        });


        imageMode(CENTER);
        if (this.bombMode) {
            fill(0);
            textSize(20);
            text("Bomb Mode", this.cols * this.scl + 160 + this.x, 120 + this.y);

        } else if (!this.bombMode) {
            fill(0);
            textSize(20);
            text("Flag Mode ", this.cols * this.scl + 160 + this.x, 120 + this.y);
        }


        if (this.bombs >= 50) {
            for (let i = 0; i < this.cols; i++) {
                for (let j = 0; j < this.rows; j++) {
                    this.grid[i][j].show();
                    if (this.grid[i][j].revealed && this.grid[i][j].mine) {
                        this.gameOver();
                    }
                }
            }
        } else if (this.bombs == 0) {
            textSize(50);
            text('Please Choose Difficulty', 60 + this.x, 200 + this.y);
        }




        if ((this.markedBombs >= this.bombs || this.markedBombs >= this.n) && this.bombs > 0 && this.markedBombs > 0) {
            this.WIN();
        }


        fill(0);
        stroke(255);
        strokeWeight(5);
        rectMode(CENTER);
        rect(this.cols * this.scl / 2 + 10 + this.x, 48 + this.y, 200, 80);

        textFont(font);
        textSize(90);
        textAlign(CENTER);
        fill(255, 0, 0);
        noStroke();
        text(this.bombs - this.markedBombs, (this.cols * this.scl / 2) + this.x, 80 + this.y);
    }

    check() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.grid[i][j].checkNeighbor();
                this.grid[i][j].checkMarked();

                if (!this.bombMode) {
                    if (this.grid[i][j].contain(mouseX, mouseY) && this.grid[i][j].marked == false) {
                        this.grid[i][j].Mark();
                    } else if ((this.grid[i][j].contain(mouseX, mouseY) && this.grid[i][j].marked == true)) {
                        this.grid[i][j].UnMark();
                    }
                    if (this.grid[i][j].marked == false && this.grid[i][j].contain(mouseX, mouseY) && this.grid[i][j].revealed) {
                        this.grid[i][j].reveal();
                    }
                }
                if (this.bombMode) {
                    if (this.grid[i][j].marked == false && this.grid[i][j].contain(mouseX, mouseY)) {
                        this.grid[i][j].reveal();
                    }
                }
            }
        }
    }




}