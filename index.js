const scl = 25;
const rows = 30;
const cols = 40;
const font = "Share Tech Mono";

let board;


function make2DArray(col, row) {
	let arr = new Array(col);
	for (let i = 0; i < col; i++) {
		arr[i] = new Array(row);
	}
	return arr;
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	textFont(font);
	const boardWidth = cols * scl;
	board = new Board(width / 2 - boardWidth / 2 - 100, 20, cols, rows, scl);
	noLoop();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
	board.check();
}

function draw() {
	background(187);
	board.show();
}