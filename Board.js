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
		this.hidden = true;
		this.easy = createButton('Easy: 50 Mines');
		this.easy.addClass("_button");
		this.medium = createButton('Medium: 150 Mines');
		this.medium.addClass("_button");
		this.hard = createButton('Hard: 250 Mines');
		this.hard.addClass("_button");
		this.resetButton = createButton('Reset Game!');
		this.resetButton.addClass("reset_button");
		this.message = createP("(To Change Difficulty: REFRESH)");
		this.difficulty = createP();
		this.button = createButton("");
		this.button.hide();
		this.button.addClass("flag_bomb");
		this.flag = createImg("assets/flag.png", "not found!");
		this.flag.hide();
		this.flag.parent(this.button);
		this.bomb = createImg("assets/bomb.jpg", "not found!");
		this.bomb.parent(this.button);
		this.n = 0;
		this.counter = 0;

		this.message.hide();
		this.resetButton.hide();
		this.button.mousePressed(() => {
			this.bombMode = !this.bombMode;
			if (this.bombMode) {
				this.flag.hide();
				this.bomb.show();
			} else {
				this.bomb.hide();
				this.flag.show();
			}
		});
		this.resetButton.mousePressed(() => {
			this.resetBoard();
		});

		const buffer = 10;
		const buttonPos = this.width / 2 + this.x;
		this.button.position((this.width / 2) + this.x + 150, this.y);
		this.flag.size(80, 80);
		this.bomb.size(80, 80);
		this.easy.position(buttonPos - this.easy.width / 2, this.button.y + this.button.height + buffer + this.y + 250);
		this.medium.position(buttonPos - this.medium.width / 2, this.easy.y + this.easy.height + buffer + this.y);
		this.hard.position(buttonPos - this.hard.width / 2, this.medium.y + this.medium.height + buffer + this.y);
		this.resetButton.position(this.width + 50 + this.x, this.height + this.y - 50);
		this.message.position(this.width + 50 + this.x, 175 + this.y);
	}


	populateBoard() {
		this.easy.hide();
		this.medium.hide();
		this.hard.hide();

		this.message.position(this.width + 50 + this.x, 140 + this.y);
		this.message.show();

		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j] = new Cell(i, j, this);
			}
		}
		while (this.n < this.bombs) {
			let x = floor(random(this.cols));
			let y = floor(random(this.rows));
			if (!this.grid[x][y].mine) {
				this.grid[x][y].mine = true;
				this.n++;
			}
		}
	}

	resetBoard() {
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j].revealed = false;
				this.grid[i][j].mine = false;
				this.grid[i][j].UnMark();
			}
		}
		this.bombs = 0;
		this.markedBombs = 0;
		this.actualBombs = 0;
		this.revealedBombs = 0;
		this.n = 0;
		this.counter = -1;
		this.bombMode = true;
		this.firstPlay = true;
		this.hidden = true;
		this.easy.show();
		this.medium.show();
		this.hard.show();
		this.message.hide();
		this.difficulty.hide();
		this.resetButton.hide();
	}


	gameOver() {
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				this.grid[i][j].revealed = true;
			}
		}
		console.warn('Game Over');
		this.resetButton.show();
	}


	WIN() {
		imageMode(CENTER);
		image(cool, (this.width / 2 + this.x), (this.height / 2 + this.y + 100), this.height, this.height);
		this.resetButton.show();
	}

	show() {
		fill(255);
		noStroke();
		textAlign(LEFT);

		this.easy.mousePressed(() => {
			this.bombs = 50;
			this.button.show();
			this.difficulty = createP("Difficulty: Easy");
			this.difficulty.position(this.width + 50 + this.x, this.message.y + this.y);
			this.populateBoard();
		});
		this.medium.mousePressed(() => {
			this.bombs = 150;
			this.button.show();
			this.difficulty = createP('Difficulty: Medium');
			this.difficulty.position(this.width + 50 + this.x, this.message.y + this.y);
			this.populateBoard();
		});
		this.hard.mousePressed(() => {
			this.bombs = 250;
			this.button.show();
			this.difficulty = createP('Difficulty: Hard');
			this.difficulty.position(this.width + 50 + this.x, this.message.y + this.y);
			this.populateBoard();
		});

		imageMode(CENTER);
		fill(0);
		textSize(20);

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
		this.counter++;
		if (this.counter > 1)
			this.hidden = false;
		if (this.bombs >= 50) {
			for (let i = 0; i < this.cols; i++) {
				for (let j = 0; j < this.rows; j++) {
					const cell = this.grid[i][j];
					if (!this.bombMode && !this.hidden) {
						if (cell.contain(mouseX, mouseY) && !cell.marked) {
							cell.Mark();
						} else if ((this.grid[i][j].contain(mouseX, mouseY) && this.grid[i][j].marked)) {
							cell.UnMark();
						}
						if (!cell.marked && cell.contain(mouseX, mouseY) && cell.revealed) {
							cell.floodFill();
						}
					} else if (this.bombMode && !this.hidden) {
						if (!cell.marked && cell.contain(mouseX, mouseY)) {
							if (this.firstPlay && cell.mine) {
								let b = true;
								cell.mine = false;
								cell.reveal();
								cell.show();
								cell.floodFill();
								this.check();
								while (b) {
									let x = floor(random(this.cols));
									let y = floor(random(this.rows));
									if (!this.grid[x][y].mine) {
										this.grid[x][y].mine = true;
										b = false;
									}
								}
								this.firstPlay = false;
							} else if (!cell.mine) {
								cell.reveal();
								this.firstPlay = false;
							} else if (!this.firstPlay && cell.mine) {
								cell.reveal();
							}
						}
					}
				}
			}
		}
		noLoop();
	}
}