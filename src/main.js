jQuery(function($) {

	// gets the canvas and its context
	var canvas = $('#myCanvas')[0];
	var ctx = canvas.getContext('2d');

	// whether or not the options are currently being shown
	var areOptionsEnabled = false;

	// the amount of miliseconds it takes for the div to change
	// its state when activated
	var divSpeed = 200;

	// the amount of space between each drawn pixel.
	// does not affect the color calculations
	var spacing = 0;

	// functions that are inputed by the user, and are used
	// to calculate the color of each pixel
	var redFunction = "100;";
	var greenFunction = "100;";
	var blueFunction = "100;";

	// the time when the canvas was last drawn on
	var lastDrawTime = new Date();

	// the id of the interval which draws on the screen
	var drawIntevalId = null;

	// size of each point in pixels
	var pointDimensions = {
		x: 20,
		y: 20,
	};

	// dimensions are in amount of pixels
	var displayDimensions = {
		x: 100,
		y: 50,
	}

	// shows the options div
	var hideDiv = function() {
		$('#options').css({'display':'none'});
		$('#blinds').css({'display':'none'});
	};

	// hides the options div
	var showDiv = function() {
		$('#options').css({'display':'inline'});
		$('#blinds').css({'display':'inline'});
	};

	var hideWorking = function() {
		$('#working').css({'display':'none'});
		$('#blinds').css({'display':'none'});
	}

	var showWorking = function() {
		$('#working').css({'display':'inline'});
		$('#blinds').css({'display':'inline'});
	}

	// resizes the canvas so it fits the whole screen
	var onResize = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		displayDimensions.x = window.innerWidth / (pointDimensions.x);
		displayDimensions.y = window.innerHeight / (pointDimensions.y);
	};

	// converts an rgb value to a string that can be used
	// to style each point
	var RGB = function (R, G, B) {
		return "#" + R.toString(16) + G.toString(16) + B.toString(16);
	};	

	// calculates the red value of the pixel located at (x, y)
	var calcR = function (x, y, i, j, t) {
		return eval("(function() { return " + redFunc + ";}())");
	};

	// calculates the green value of the pixel located at (x, y)
	var calcG = function (x, y, i, j, t) {
		return eval("(function() { return " + greenFunc + "}())");
	};

	// calculates the blue value of the pixel located at (x, y)
	var calcB = function (x, y, i, j, t) {
		return eval("(function() { return " + blueFunc + ";}())");
	};

	// calculates the color of the pixel located at (x, y)
	var calcColor = function (x, y, i, j, t) {
		var r = Math.floor(Math.abs(calcR(x, y, i, j, t))) % 256;
		var g = Math.floor(Math.abs(calcG(x, y, i, j, t))) % 256;
		var b = Math.floor(Math.abs(calcB(x, y, i, j, t))) % 256;

		if (r == undefined | g == undefined | b == undefined) {
			return RGB(100, 100, 100);
		}
		else {
			return RGB(r, g, b);
		}
	}

	// gets the pixel position given its index
	var getPixelPosition = function(i, j) {
		return {
			x: i * (pointDimensions.x + spacing),
			y: j * (pointDimensions.y + spacing),
		};
	}

	var proccessTime = function(date) {
		return Math.floor((date.getTime() / 10));
	};

	// draws all the pixels
	var draw = function () {
		redFunc = $('#redFunc').val();
		greenFunc = $('#greenFunc').val();
		blueFunc = $('#blueFunc').val();

		lastDrawTime = new Date();
		var time = proccessTime(lastDrawTime);

		for (var i = 0; i < displayDimensions.x; i++) {
			for (var j = 0; j < displayDimensions.x; j++) {

				var position = getPixelPosition(i, j);
				ctx.fillStyle = calcColor(position.x, position.y, i, j, time);

				ctx.fillRect(
						position.x,
						position.y, 
						pointDimensions.x,
					   	pointDimensions.y);
			}
		}
	};

	// draws all the pixels one by one, without hanging up the app
	var drawAnimation = function() {
		redFunc = $('#redFunc').val();
		greenFunc = $('#greenFunc').val();
		blueFunc = $('#blueFunc').val();

		lastDrawTime = new Date();
		var time = proccessTime(lastDrawTime);

		// the index of the current pixel to be drawn
		var cursor = {
			x: -1,
			y: 0,
		}

		// sets the cursor to the index of the next pixel. if there are no
		// more pixels to be drawn, returns false. otherwise returns true
		var nextPixel = function() {
			cursor.x++;
			if (cursor.x >= displayDimensions.x) {
				console.log(0);
				cursor.x = 0;
				cursor.y++;
				
				if (cursor.y > displayDimensions.x + 1) {
					return false;
				}
			}
			return true;
		}

		// draws the next *amount* pixels to the screen. returns true if it drew 
		// all of the pixels, and false otherwise.
		var drawNext = function(amount) {
			var toReturn = false;

			for (var i = 0; i < amount; i++) {
				if (nextPixel()) {

					var position = getPixelPosition(cursor.x, cursor.y);
					ctx.fillStyle = calcColor(position.x, position.y, cursor.x, cursor.y, time);
					ctx.fillRect(
								position.x,
								position.y, 
								pointDimensions.x,
							   	pointDimensions.y);

					toReturn = true;
					continue;
				}
				toReturn = false;
			}
			return toReturn;
		}

		// function that loops through every pixel, and draws it.
		var drawLoop = function() {
			if (drawNext(12)) {
				setTimeout(drawLoop, 1);
			}
		}

		drawLoop();
	}

	$(window).keydown(function(e) {
		// if the escape key is pressed
		if (e.which == 27) {
			clearInterval(drawIntevalId);
			if (!areOptionsEnabled) {
				showDiv();
			}
			else {
				hideDiv();
				drawIntevalId = setInterval(draw, 1);
			}

			areOptionsEnabled = !areOptionsEnabled;
		}
		else if (e.which == 13 && !areOptionsEnabled) {
			onResize();
		}
	});
	
	$(window).resize(onResize);
	onResize();

	drawIntevalId = setInterval(draw, 1);
});