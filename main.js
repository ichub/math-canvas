jQuery(function($) {

	// gets the canvas and its context
	var canvas = $('#myCanvas')[0];
	var ctx = canvas.getContext('2d');

	// the amount of space between each drawn pixel.
	// does not affect the color calculations
	var spacing = 0;

	// size of each point in pixels
	var pointDimensions = {
		X: 10,
		Y: 10,
	};

	// dimensions are in amount of pixels
	var displayDimensions = {
		X: 10,
		Y: 10,
	}

	// each individual color of points
	var points = [];

	
	
	// resizes the canvas so it fits the whole screen
	var updateCanvasSize = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};

	// initializes the canvas
	var init = function() {
		updateCanvasSize();

		for (var i = 0; i < displayDimensions.X; i++) {
			points[i] = []
			for (var j = 0; j < displayDimensions.Y; j++) {
				points[i][j] = "#FFFFFF";
			}
		}

		setInterval(function() {
			update();
			draw();
		},
		10);
	};

	// updates each pixel
	var update = function() {
		
	};

	var draw = function() {
		for (var i = 0; i < displayDimensions.X; i++) {
			for (var j = 0; j < displayDimensions.Y; j++) {
				ctx.fillRect(i * (pointDimensions.X + spacing),
						j * (pointDimensions.Y + spacing), 
						pointDimensions.X,
					   	pointDimensions.Y);
			}
		}
	};

	$(window).resize(function() {
		updateCanvasSize();
	});

	init();
});
