const BLACK = "#000000";
const WHITE = "#ffffff";
const RED = "#fc140f";
const DARK_GREY = "#403f3f";
const YELLOW = "#fff275";
const GREEN = "#04e762";
const ORANGE = "#ff6b35";
const BLUE = "#185ced";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600; 

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;

const GAP = 10;

const BALL_SIZE = 10;
const BALL_SPEED_Y = 7;

const BRICK_W = 100;
const BRICK_H = 50;
const BRICK_COUNT = 8;
const BRICK_GAP = 2;

let canvas, canvasContext;
let framePerSecond = 30;

let ballX = 75;
let ballSpeedX = 5;
let ballY = 75;
let ballSpeedY = BALL_SPEED_Y;

let paddleX = CANVAS_WIDTH / 2;
let paddleY = CANVAS_HEIGHT - PADDLE_THICKNESS - GAP;

let mouseX;
let mouseY;

let brickGrid = new Array;

const updateMousePosition = (e) => {

	// to get the position of the mouse in the canvas,
	// so we can void all the problems related to the page scrolling etc...
	let rect = canvas.getBoundingClientRect();
	let root = document.documentElement;

	mouseX = e.clientX - rect.left - root.scrollLeft;
	mouseY = e.clientY - rect.top - root.scrollTop;

	paddleX = mouseX - (PADDLE_WIDTH / 2);		// PADDLE_WIDTH / 2 is to place the mouse in the center of the paddle
	// paddleY = mouseY;	// for now we don't need to move the paddle on Y axis
}

const brickReset = () => {
	for (let i = 0; i < BRICK_COUNT; i++) {
		if (Math.random() < 0.5) {
			brickGrid[i] = true;
		} else {
			brickGrid[i] = false;
		}
	}
}

// ============================== *** CORE FUNCTION *** ==============================
window.onload = () => {
	canvas = document.getElementById('canvas');
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;
	canvasContext = canvas.getContext('2d');

	setInterval(updateAll, 1000 / framePerSecond);

	canvas.addEventListener('mousemove', updateMousePosition);

	brickReset();
}
// ===================================================================================

const updateAll = () => {
	moveAll();
	drawAll();
}

const moveAll = () => {
	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if (ballX > canvas.width) {		// right edge
		ballSpeedX = -ballSpeedX;
	}

	if (ballX < 0) {	// left edge
		ballSpeedX = -ballSpeedX;
	}

	if (ballY > canvas.height) {	// bottom edge
		resetBall()
	}

	if (ballY < 0) {	// top edge
		ballSpeedY = -ballSpeedY;
	}

	let paddleBottomEdge = CANVAS_HEIGHT - GAP;
	let paddleTopEdge = paddleBottomEdge - PADDLE_THICKNESS;
	let paddleLeftEdge = paddleX;
	let paddleRightEdge = paddleLeftEdge + PADDLE_WIDTH;

	if (ballY > paddleTopEdge &&
		ballY < paddleBottomEdge &&
		ballX + BALL_SIZE > paddleLeftEdge &&
		ballX - BALL_SIZE < paddleRightEdge) {

		let centerOfPaddleX = paddleLeftEdge + (PADDLE_WIDTH / 2);
		let ballDistanceFromPaddleCenterX = ballX - centerOfPaddleX;	// - if before, + if after, 0 if center
		ballSpeedX = ballDistanceFromPaddleCenterX * 0.35;
		let absoluteValueBallDistanceFromPaddleCenterX = Math.round(Math.sqrt(ballDistanceFromPaddleCenterX ** 2));		// return positive value
		if (absoluteValueBallDistanceFromPaddleCenterX < 15) {
			ballSpeedY = -BALL_SPEED_Y;
		} else if (absoluteValueBallDistanceFromPaddleCenterX > 15 && absoluteValueBallDistanceFromPaddleCenterX < 40) {
			ballSpeedY = -(BALL_SPEED_Y * Math.sin(60 * Math.PI / 180));
		} else {
			ballSpeedY = -(BALL_SPEED_Y * Math.sin(45 * Math.PI / 180));
		}
	}
}

const drawAll = () => {
	drawRect(0, 0, canvas.width, canvas.height, BLACK);
	drawBall(ballX, ballY, BALL_SIZE, RED);
	drawRect(paddleX, paddleY, PADDLE_WIDTH, PADDLE_THICKNESS, WHITE);
	colorText(`X:${mouseX} ; Y:${mouseY}`, mouseX, mouseY, YELLOW);
	drawBricks();
}

const drawRect = (topLeftX, topLeftY, rectWidth, rectHeight, color) => {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(topLeftX, topLeftY, rectWidth, rectHeight);
}

const drawBall = (centerX, centerY, radius, color) => {
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

const drawBricks = () => {
	for (let i = 0; i < BRICK_COUNT; i++) {
		if (brickGrid[i]) {
			drawRect(BRICK_W * i, 0, BRICK_W - BRICK_GAP, BRICK_H, BLUE);
		}
	}
}

const resetBall = () => {
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
}

const colorText = (textString, textX, textY, color) => {
	canvasContext.fillStyle = color;
	canvasContext.fillText(textString, textX, textY);
}
