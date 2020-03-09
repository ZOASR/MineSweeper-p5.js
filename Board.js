class Board {
    constructor(x, y, cols, rows, scl) {
        this.x = x;
        this.y = y;
        this.cols = cols;
        this.rows = rows;
        this.grid = make2DArray(cols, rows);
        this.scl = scl;
        this.width = this.cols * this.scl;
        this.height = this.rows * this.scl;
        this.bombs = 0;
        this.markedBombs = 0;
        this.actualBombs = 0;
        this.revealedBombs = 0;
        this.bombMode = true;
        this.firstPlay = true;
        this.easy = createButton('Easy: 50 Mines');
        this.medium = createButton('Medium: 150 Mines');
        this.hard = createButton('Hard: 250 Mines');
        this.message = createP("(To Change Difficulty: REFRESH)");
        this.difficulty = createP();
        this.message1 = createP('(Change Mode: Changes Whether to use flag Or Bomb)');
        this.button = createButton('Change Mode');
        this.n = 0;

        this.message.hide();
        this.button.mousePressed(() => {
            this.bombMode = !this.bombMode;
        });


        this.button.position(this.width + 50 + this.x, 100 + this.y);
        this.easy.position(this.width + 50 + this.x, 125 + this.y);
        this.medium.position(this.width + 50 + this.x, 145 + this.y);
        this.hard.position(this.width + 50 + this.x, 165 + this.y);
        this.message.position(this.width + 50 + this.x, 175 + this.y);
        this.message1.position(this.width + 50 + this.x, 45 + this.y);

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
        this.easy.hide();
        this.medium.hide();
        this.hard.hide();

        this.message.position(this.width + 50 + this.x, 140 + this.y);
        this.message.show();

        while (this.n < this.bombs) {
            let x = floor(random(this.cols));
            let y = floor(random(this.rows));
            if (!this.grid[x][y].mine) {
                this.grid[x][y].mine = true;
                this.n++;
            }
        }
    }


    gameOver() {
        fill(255, 0, 0);
        stroke(125);
        for (let k = 0; k < 2; k++) {
            for (let i = 0; i < this.cols; i++) {
                for (let j = 0; j < this.rows; j++) {
                    this.grid[i][j].reveal();
                    this.grid[i][j].UnMark();
                }
            }
        }
        console.warn('Game Over');
        setTimeout(() => window.location.reload(), 3000);
    }


    WIN() {
        imageMode(CENTER);
        image(cool, (this.width / 2 + this.x), (this.height / 2 + this.y + 100), this.height, this.height);
        setTimeout(() => window.location.reload(), 3000);
    }

    show() {
        fill(255);
        noStroke();
        textAlign(LEFT);

        this.easy.mousePressed(() => {
            this.bombs = 50;
            this.difficulty = createP("Difficulty: Easy");
            this.difficulty.position(this.width + 50 + this.x, this.message.y + this.y);
            this.populateBoard();
        });
        this.medium.mousePressed(() => {
            this.bombs = 150;
            this.difficulty = createP('Difficulty: Medium');
            this.difficulty.position(this.width + 50 + this.x, this.message.y + this.y);
            this.populateBoard();
        });
        this.hard.mousePressed(() => {
            this.bombs = 250;
            this.difficulty = createP('Difficulty: Hard');
            this.difficulty.position(this.width + 50 + this.x, this.message.y + this.y);
            this.populateBoard();
        });


        imageMode(CENTER);
        if (this.bombMode) {
            fill(0);
            textSize(20);
            text("Bomb Mode", this.width + 160 + this.x, 120 + this.y);

        } else if (!this.bombMode) {
            fill(0);
            textSize(20);
            text("Flag Mode ", this.width + 160 + this.x, 120 + this.y);
        }


        if (this.bombs >= 50) {
            for (let i = 0; i < this.cols; i++) {
                for (let j = 0; j < this.rows; j++) {
                    this.grid[i][j].show();
                }
            }
        } else if (this.bombs == 0) {
            textSize(50);
            textAlign(CENTER);
            text('Please Choose Difficulty', this.width / 2 + this.x, 200 + this.y);
        }




        if ((this.actualBombs >= this.bombs || this.actualBombs >= this.n) && this.bombs > 0 && this.actualBombs > 0) {
            this.WIN();
        }


        fill(0);
        stroke(255);
        strokeWeight(5);
        rectMode(CENTER);
        rect(this.width / 2 + 10 + this.x, 48 + this.y, 200, 80);

        textSize(90);
        textAlign(CENTER);
        fill(255, 0, 0);
        noStroke();
        text(this.bombs - this.markedBombs, (this.width / 2) + this.x, 80 + this.y);
    }

    check() {
        loop();
        if (this.bombs >= 50) {
            for (let i = 0; i < this.cols; i++) {
                for (let j = 0; j < this.rows; j++) {
                    if (!this.bombMode) {
                        if (this.grid[i][j].contain(mouseX, mouseY) && !this.grid[i][j].marked) {
                            this.grid[i][j].Mark();
                        } else if ((this.grid[i][j].contain(mouseX, mouseY) && this.grid[i][j].marked)) {
                            this.grid[i][j].UnMark();
                        }
                        if (!this.grid[i][j].marked && this.grid[i][j].contain(mouseX, mouseY) && this.grid[i][j].revealed) {
                            this.grid[i][j].floodFill();
                        }
                    } else if (this.bombMode) {
                        if (!this.grid[i][j].marked && this.grid[i][j].contain(mouseX, mouseY)) {
                            if (this.firstPlay && this.grid[i][j].mine) {
                                this.grid[i][j].mine = false;
                                this.grid[i][j].reveal();
                                this.grid[i][j].show();
                                this.grid[i][j].floodFill();
                                mousePressed();
                                this.grid[floor(random(this.cols))][floor(random(this.rows))].mine = true;
                                this.firstPlay = false;
                            } else if ((!this.firstPlay || this.firstPlay) && (!this.grid[i][j].mine)) {
                                this.grid[i][j].reveal();
                                this.firstPlay = false;
                            } else if (!this.firstPlay && this.grid[i][j].mine) {
                                this.grid[i][j].reveal();
                            }
                        }
                    }
                    if (this.grid[i][j].mine && this.grid[i][j].revealed)
                        this.gameOver();
                }
            }
        }
        noLoop();
    }
}