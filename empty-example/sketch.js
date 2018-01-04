var guessItem = null;
// controls the frequency that a new random number is generated.
var interval = 60; // changing this to make the game feel faster.
// an array to store solution values
var results = [];
var solution = null;
// stores if the game is over or not.
var gameOver = false;

function setup() {
	createCanvas(800, 300);
}

function draw() {
	// if there are 3 losses or 10 attempts stop the game.
	var gameScore = getGameScore(results);
	if (gameScore.loss === 3 || gameScore.total === 10) {
		gameOver = true;
		displayGameOver(gameScore);
		return;
	}
	background(0); // black background
	if (frameCount === 1 || frameCount % interval === 0) {
		solution = null;
		guessItem = new GuessItem(width/2, height/2, 1);
	}

	if (guessItem) {
		guessItem.render();
	}

	if (solution == true || solution === false) {
		// displaying a text on screen instead of flat color.
		solutionMessage(gameScore.total, solution);
	}
	
}

function solutionMessage(seed, solution) {
	// display a random message based on a true of false solution.
	var trueMessages = [
		'GOOD JOB!',
		'DOING GREAT!',
		'OMG!',
		'SUCH WIN!',
		'I APPRECIATE YOU',
		'IMPRESSIVE'
	];

	var falseMessages = [
		'OH NO!',
		'BETTER LUCK NEXT TIME!',
		'PFTTTT',
		':('
	];

	var messages;

	push();
	textAlign(CENTER, CENTER);
	fill(237, 34, 93);
	textSize(36);
	randomSeed(seed * 10000);

	if (solution === true) {
		background(255);
		messages = trueMessages;
	} else if (solution === false) {
		background(0);
		messages = falseMessages;
	}
	
	text(messages[parseInt(random(messages.length), 10)], width / 2, height / 2);
	pop();
}

function displayGameOver(score) {
	// create the Game Over screen
	push();
	background(255);
	textSize(24);
	textAlign(CENTER, CENTER);
	translate(width / 2, height / 2);
	fill(237, 34, 93);
	text('GAME OVER!', 0, 0);
	translate(0, 36);
	fill(0);
	// have spaces inside the string for the text to look proper.
	text('You have ' + score.win + ' correct guesses', 0, 0);
	translate(0, 100);
	textSize(16);
	var alternatingValue = map(sin(frameCount / 10), -1, 1, 0, 255);
	fill(237, 34, 93, alternatingValue);
	text('PRESS ENTER', 0, 0);
	pop();
}

function getGameScore(score) {
	// given a score array, calculate the number of wins and losses.
	var wins = 0;
	var losses = 0;
	var total = score.length;

	for (var i = 0; i < total; i++) {
		var item = score[i];
		if (item === true) {
			wins = wins + 1;
		} else {
			losses = losses + 1;
		}
	}

	return {
		win: wins,
		loss: losses,
		total: total
	};
}

function restartTheGame() {
	// sets the game state to start.
	results = [];
	solution = null;
	gameOver = false;
}

function keyPressed() {
	// if game is over, then restart the game on ENTER key press.
	if (gameOver === true) {
		if (keyCode === ENTER) {
			console.log('restart the game');
			restartTheGame();
			return;
		}
	}

	if (guessItem !== null) {
		// check to see if the pressed key matches to the displayed number.
		// if so set the solution global variable to a corresponding value.
		console.log('you pressed: ', key);
		solution = guessItem.solve(key);
		console.log(solution);
		if (solution) {
			results.push(true);
		} else {
			results.push(false);
		}
		guessItem = null;
	} else {
		console.log('nothing to be solved');
	}
}

function GuessItem(x, y, scl) {
	this.x = x;
	this.y = y;
	this.scale = scl;
	this.scaleIncrement = 0.25;
	this.clr = 255;
	this.content = getContent();
	this.alpha = 255;
	this.alphaDecrement = 6;
	this.solved = null;
	this.contentMap = {
		'1': 'one',
		'2': 'two',
		'3': 'three',
		'4': 'four',
		'5': 'five',
		'6': 'six',
		'7': 'seven',
		'8': 'eight',
		'9': 'nine',
		'0': 'zero'
	};
	this.colors = [
		[63, 184, 175],
		[127, 199, 175],
		[218, 216, 167],
		[255, 158, 157],
		[255, 61, 127],
		[55, 191, 211],
		[159, 223, 82],
		[234, 209, 43],
		[250, 69, 8],
		[194, 13, 0]
	];

	function getContent() {
		// generate a random integer in between 0 and 9
		return String(parseInt(random(10), 10));
	}

	this.solve = function(input) {
		// check to see if the given input is equivalent to the content.
		// set solved to the corresponding value.
		var solved;
		if (input === this.content) {
			solved = true;
		} else {
			solved = false;
		}
		this.solved = solved;
		return solved;
	}

	this.drawEllipse = function(size, strkWeight, speedMultiplier, seed) {
		// draw an animated ellipse with a random color to the screen.
		push();
		randomSeed(seed);
		translate(this.x, this.y);
		var ellipseSize = this.scale * speedMultiplier;
		scale(ellipseSize);
		var clr = this.colors[parseInt(random(this.colors.length), 10)]
		stroke(clr);
		noFill();
		strokeWeight(strkWeight);
		ellipse(0, 0, size, size);
		pop();
	}

	this.render = function() {
		push();
		this.drawEllipse(100, 15, 2, 1 * this.content * 1000);
		this.drawEllipse(60, 7, 2, 1 * this.content * 2000);
		this.drawEllipse(35, 3, 1.2, 1 * this.content * 3000);
		pop();

		push();
		fill(this.clr, this.alpha);
		textAlign(CENTER, CENTER);
		translate(this.x, this.y);
		scale(this.scale);
		// display the word for the corresponding number
		text(this.contentMap[this.content], 0, 0);
		// increase the scale value by the increment value with each render
		this.scale = this.scale + this.scaleIncrement;
		// decrease the alpha value by the decrement value with each render
		this.alpha = this.alpha - this.alphaDecrement;
		pop();
	}
}