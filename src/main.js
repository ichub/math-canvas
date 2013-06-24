jQuery(function($) {

	// gets the canvas and its context
	var canvas = $('#myCanvas')[0];
	var ctx = canvas.getContext('2d');

	// whether or not the options are currently being shown
	var areOptionsEnabled = false;

	// whether or not the state of the options is changing
	var isSlidingOptions = false;

	// the amount of miliseconds it takes to completely slide the options
	// up and down
	var slideSpeed = 100;

	// the amount of space between each drawn pixel.
	// does not affect the color calculations
	var spacing = 0;

	// functions that are inputed by the user, and are used
	// to calculate the color of each pixel
	var redFunction = "100;";
	var greenFunction = "100;";
	var blueFunction = "100;";

	// the amount of times the screen has been refreshed
	var amountOfTimesDrawn = 0

	// the id of the interval which draws on the screen
	var drawIntevalId = null;

	// size of each point in pixels
	var pointDimensions = {
		x: 20,
		y: 20,
	};

	// dimensions are in amount of pixels
	var displayDimensions = {
		x: 0,
		y: 0,
	};

	// precomputed color values
	var colors = [];

	// shows the options div
	var hideDiv = function() {
		isSlidingOptions = true;
		$('#container').slideUp(slideSpeed, function() {
			drawIntevalId = setInterval(draw, 1);
			isSlidingOptions = false;
		});
	};

	// hides the options div
	var showDiv = function() {
		isSlidingOptions = true;
		$('#container').slideDown(slideSpeed, function() {
			isSlidingOptions = false;
		});
	};

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
		if (R == undefined || G == undefined || B == undefined)
			return '#FFFFFF';

		rStr = (R < 0x10 ? "0" : "") + R.toString(16);
		gStr = (G < 0x10 ? "0" : "") + G.toString(16);
		bStr = (B < 0x10 ? "0" : "") + B.toString(16);

		return "#" + rStr + gStr + bStr;
	};	

	// gets the pixel position given its index
	var getPixelPosition = function(i, j) {
		return {
			x: i * (pointDimensions.x + spacing),
			y: j * (pointDimensions.y + spacing),
		};
	};

	var proccessTime = function(times) {
		return times;
	};

	var calculateColors = function() {
		redFunc = $('#redFunc').val();
		greenFunc = $('#greenFunc').val();
		blueFunc = $('#blueFunc').val();

		var t = proccessTime(amountOfTimesDrawn++);

		for (var i = 0; i < displayDimensions.x; i++) {
			for (var j = 0; j < displayDimensions.y; j++) {
				var position = getPixelPosition(i, j);
				var x = position.x;
				var y = position.y;

				var r = Math.floor(Math.abs(eval("(function() { return " + redFunc + ";}())"))) % 256;
				var g = Math.floor(Math.abs(eval("(function() { return " + greenFunc + ";}())"))) % 256;
				var b = Math.floor(Math.abs(eval("(function() { return " + blueFunc + ";}())"))) % 256;

				colors[i + j * displayDimensions.y] = RGB(r, g, b);
			}
		}
	};

	// draws all the pixels
	var draw = function () {
		calculateColors();

		for (var i = 0; i < displayDimensions.x; i++) {
			for (var j = 0; j < displayDimensions.y; j++) {

				var position = getPixelPosition(i, j);
				ctx.fillStyle = colors[i + j * displayDimensions.y];

				ctx.fillRect(
						position.x,
						position.y, 
						pointDimensions.x,
					   	pointDimensions.y);
			}
		}
	};

	$(window).keydown(function(e) {
		// if the escape key is pressed and the state of the
		// options menu is currently not changing
		if (e.which == 27) {
			if (!isSlidingOptions) {
				areOptionsEnabled = !areOptionsEnabled;

				console.log(areOptionsEnabled);
				clearInterval(drawIntevalId);

				areOptionsEnabled ? showDiv() : hideDiv();
			}
		}
	});
	
	$(window).resize(onResize);
	$('#container').slideUp(1);
	onResize();
	drawIntevalId = setInterval(draw, 1);
});