jQuery(function($) {

	// gets the canvas and its context
	var canvas = $('#myCanvas')[0];
	var ctx = canvas.getContext('2d');

	// the amount of space between each drawn pixel.
	// does not affect the color calculations
	var spacing = 0;

	// if true, then the x and y parameters of the color
	// calculation functions will be the actual position of 
	// the square. otherwise, the number of the point
	// will be passed - its number horizontaly and vertically
	var useActualCoordinates = true;

	// size of each point in pixels
	var pointDimensions = {
		X: 20,
		Y: 20,
	};

	// dimensions are in amount of pixels
	var displayDimensions = {
		X: 100,
		Y: 50,
	}

	// shows the options div
	hideDiv = function() {
		$('#options').hide(100);
		$('#blinds')[0].style.display = 'none';
	};

	// hides the options div
	showDiv = function() {
		$('#options').show(100);
		$('#blinds')[0].style.display = 'inline';
	};

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
		return x + y;
	};

	// calculates the green value of the pixel located at (x, y)
	var calcG = function (x, y) {
		return x - y;
	};

	// calculates the blue value of the pixel located at (x, y)
	var calcB = function (x, y) {
		return x - y
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

	$(window).resize(onResize);
	onResize();
});
