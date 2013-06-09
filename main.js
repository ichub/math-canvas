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

	// if true, then the x and y parameters of the color
	// calculation functions will be the actual position of 
	// the square. otherwise, the number of the point
	// will be passed - its number horizontaly and vertically
	var useActualCoordinates = true;

	// functions that are inputed by the user, and are used
	// to calculate the color of each pixel
	var redFunction = "return 100;";
	var greenFunction = "return 100;";
	var blueFunction = "return 100;";

	// size of each point in pixels
	var pointDimensions = {
		X: 5,
		Y: 5,
	};

	// dimensions are in amount of pixels
	var displayDimensions = {
		X: 100,
		Y: 50,
	}

	// shows the options div
	var hideDiv = function() {
		$('#options').hide(divSpeed);
		$('#blinds')[0].style.display = 'none';
	};

	// hides the options div
	var showDiv = function() {
		$('#options').show(divSpeed);
		$('#blinds')[0].style.display = 'inline';
	};

	var hideWorking = function() {
		$('#working').hide(divSpeed);
		$('#blinds')[0].style.display = 'none';
	}

	var showWorking = function() {
		$('#working').show(divSpeed, draw);
		$('#blinds')[0].style.display = 'inline';
	}

	// resizes the canvas so it fits the whole screen
	var onResize = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		displayDimensions.X = window.innerWidth / (pointDimensions.X - 1);
		displayDimensions.Y = window.innerHeight / (pointDimensions.Y - 1);
		draw();
	};

	// converts an rgb value to a string that can be used
	// to style each point
	var RGB = function (R, G, B) {
		return "#" + R.toString(16) + G.toString(16) + B.toString(16);
	};	

	// calculates the red value of the pixel located at (x, y)
	var calcR = function (x, y) {
		return eval("(function() { return " + redFunc + ";}())");
		return x * x - y * y;
	};

	// calculates the green value of the pixel located at (x, y)
	var calcG = function (x, y) {
		return eval("(function() { return " + greenFunc + "}())");
		return x * x - y * y;
	};

	// calculates the blue value of the pixel located at (x, y)
	var calcB = function (x, y) {
		return eval("(function() { return " + blueFunc + ";}())");
		return x * x - y * y; 
	};

	// calculates the color of the pixel located at (x, y)
	var calcColor = function (x, y) {
		var r = Math.floor(Math.abs(calcR(x, y))) % 256;
		var g = Math.floor(Math.abs(calcG(x, y))) % 256;
		var b = Math.floor(Math.abs(calcB(x, y))) % 256;

		if (r == undefined | g == undefined | b == undefined) {
			return RGB(100, 100, 100);
		}
		else {
			return RGB(r, g, b);
		}
	}

	// draws all the pixels
	var draw = function () {
		redFunc = $('#redFunc').val();
		greenFunc = $('#greenFunc').val();
		blueFunc = $('#blueFunc').val();

		for (var i = 0; i < displayDimensions.X; i++) {
			for (var j = 0; j < displayDimensions.Y; j++) {

				var x = i * (pointDimensions.X + spacing);
				var y = j * (pointDimensions.Y + spacing);
				if (useActualCoordinates) {
					ctx.fillStyle = calcColor(x, y);
				}
				else {
					ctx.fillStyle = calcColor(i, j);
				}

				ctx.fillRect(
						x,
						y, 
						pointDimensions.X,
					   	pointDimensions.Y);
			}
		}
	};

	var drawSplit = function() {
		var nextPixel = function(currentI, currentJ) {
			var newI = currentI;
			var newJ = currentJ;

			newI++;
			if (newI > displayDimensions.X) {
				newJ = 0;
				newJ++;
			}

			return [newI, newJ];
		};

		var drawPixel = function(i, j) {
			if (i == 0 && j == 0)
				return;
		
			var x = i * (pointDimensions.X + spacing);
			var y = j * (pointDimensions.Y + spacing);
		
			if (useActualCoordinates) {
				ctx.fillStyle = calcColor(x, y);
			}
		
			else {
				ctx.fillStyle = calcColor(i, j);
			}
		
			ctx.fillRect(
						x,
						y, 
						pointDimensions.X,
					   	pointDimensions.Y);
			
			var next = nextPixel(i, j);
			setTimeOut(drawPixel(next[0], next[1]), 1);
		}

		drawPixel(0, 1);
	};

	$(window).keydown(function(e) {
		// if the escape key is pressed
		if (e.which == 27) {
			!areOptionsEnabled ? showDiv() : hideDiv();
			areOptionsEnabled = !areOptionsEnabled;
		}
		else if (e.which == 13 && !areOptionsEnabled) {
			showWorking();
			hideWorking();
		}
	});
	
	$(window).resize(onResize);
	onResize();
});
