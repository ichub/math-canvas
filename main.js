window.onload = function() {
	"use strict";

	var canvas = document.getElementById('myCanvas');
	var ctx = canvas.getContext('2d');

	var redFunctionText = "100;";
	var greenFunctionText = "100;";
	var blueFunctionText = "100;";

	var redFunction = new Function();
	var greenFunction = new Function();
	var blueFunction = new Function();

	var redFunction = function(x, y, i ,j, t) {

	};

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

	var colors = [];

	var onResize = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		displayDimensions.x = window.innerWidth / (pointDimensions.x);
		displayDimensions.y = window.innerHeight / (pointDimensions.y);
	};

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

				var r = Math.floor(Math.abs(redFunction(x, y, i, j, t))) % 256;
				var g = Math.floor(Math.abs(greenFunction(x, y, i, j, t))) % 256;
				var b = Math.floor(Math.abs(blueFunction(x, y, i, j, t))) % 256;

				colors[i + j * displayDimensions.y] = RGB(r, g, b);
			}
		}
	};

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

	var updateFunctions = function() {
		redFunctionText = document.getElementById('redFunc').value;
		greenFunctionText = document.getElementById('greenFunc').value;
		blueFunctionText = document.getElementById('blueFunc').value;

		redFunction = createFunction(redFunctionText);
		greenFunction = createFunction(greenFunctionText)
		blueFunction = createFunction(blueFunctionText)

	};

	var createFunction = function(functionText) {
		return new Function("x", "y", "i", "j", "t", "return " + functionText + ";")
	};

	window.onresize = onResize;

	onResize();

	updateFunctions();
	drawIntevalId = setInterval(draw, 1);
};