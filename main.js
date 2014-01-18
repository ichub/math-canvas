window.onload = function() {
	"use strict";
	
	(function() {
	    var link = document.createElement('link');
	    link.type = 'image/x-icon';
	    link.rel = 'shortcut icon';
	    link.href = 'favicon.ico';
	    document.getElementsByTagName('head')[0].appendChild(link);
	}());

	var canvas = document.getElementById('myCanvas');

	var ctx = canvas.getContext('2d');

	var redFunctionInput = document.getElementById("redFunc");
	var greenFunctionInput = document.getElementById("greenFunc");
	var blueFunctionInput = document.getElementById("blueFunc");
	var input = document.getElementById("popout");

	var redFunctionText;
	var greenFunctionText;
	var blueFunctionText;

	var redFunction;
	var greenFunction;
	var blueFunction;

	var spacing = 0;

	var amountOfTimesDrawn = 0

	var drawIntevalId = 0;

	var pointDimensions = {
		x: 20,
		y: 20,
	};

	var displayDimensions = {
		x: window.innerWidth,
		y: window.innerHeight,
	};

	var colorType = {
		red: 1,
		green: 2,
		blue: 3,
	}

	var colors = [];

	var onResize = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		displayDimensions.x = window.innerWidth / (pointDimensions.x);
		displayDimensions.y = window.innerHeight / (pointDimensions.y);
	};

	var defString = "sin = Math.sin;var cos = Math.cos;var tan = Math.tan;var abs = Math.abs;var pow = Math.pow;var pi = Math.PI;var e = Math.E;"	

	// converts an rgb value to a string '#RRGGBB'
	var RGB = function (R, G, B) {
		if (R == undefined || G == undefined || B == undefined) {
			return '#FFFFFF';
		}

		var rStr = (R < 0x10 ? "0" : "") + R.toString(16);
		var gStr = (G < 0x10 ? "0" : "") + G.toString(16);
		var bStr = (B < 0x10 ? "0" : "") + B.toString(16);

		return "#" + rStr + gStr + bStr;
	};	

	var getPixelPosition = function(i, j) {
		return {
			x: i * (pointDimensions.x + spacing) + spacing,
			y: j * (pointDimensions.y + spacing) + spacing
		};
	};

	var proccessTime = function(times) {
		return times;
	};

	var calculateColors = function() {
		var t = proccessTime(amountOfTimesDrawn++);

		for (var i = 0; i < displayDimensions.x; i++) {
			for (var j = 0; j < displayDimensions.y; j++) {
				var position = getPixelPosition(i, j);
				var x = position.x;
				var y = position.y;

				var r = 100;
				var g = 100;
				var b = 100;

				try {
					r = Math.floor(Math.abs(redFunction(x, y, i, j, t))) % 256;
				}
				catch(e) {
				}
				try {
					g = Math.floor(Math.abs(greenFunction(x, y, i, j, t))) % 256;
				}
				catch(e) {
				}
				try {
					b = Math.floor(Math.abs(blueFunction(x, y, i, j, t))) % 256;
				}
				catch(e) {
				}

				colors[i + j * displayDimensions.y] = RGB(r, g, b);
			}
		}
	};

	var draw = function () {
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

	var updateFunctions = function() {
		redFunctionText = redFunctionInput.value;
		greenFunctionText = greenFunctionInput.value;
		blueFunctionText = blueFunctionInput.value;

		redFunction = createFunction(redFunctionText);
		greenFunction = createFunction(greenFunctionText)
		blueFunction = createFunction(blueFunctionText)

	};

	var createFunction = function(functionText) {
		return new Function("x", "y", "i", "j", "t", defString + "return " + functionText + ";")
	};

	document.onkeydown = function(e) {
		if (e.keyCode == 27) {
			input.style.display = input.style.display == "none" ? "inherit" : "none";
		}
	};

	window.onresize = onResize;

	onResize();

	updateFunctions();

	drawIntevalId = setInterval(function() {
		calculateColors();
		updateFunctions();
		draw();
	}, 1);
};