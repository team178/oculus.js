var vapix = require('vapix');
var net = require('net');
var cv = require('opencv');
var http = require('http');
var fs = require('fs');

var options = {
	address: '10.1.78.11',
	port: '80',
	username: 'FRC',
	password: 'FRC'
};

var camera = new vapix.Camera(options);

function start(settings, detection) {
	if (settings.debug) {
		createHTTPServer(settings, detection);
	}

	createTCPServer(settings, detection);
}

function createTCPServer(settings, detection) {
	var server = net.createServer(function(socket) {
		console.log('tcp: connected');
		socket.on('end', function() {
			console.log('tcp: disconneced');
		});

		loop();

		function loop() {
			/*camera.requestImage(function(data) {*/
			fs.readFile('./images/4.jpg', function call(err, data) {
				cv.readImage(data, function(err, im) {
					var targets = detection.processImage(im, settings);

					if (targets != undefined) {
						var target = chooseTarget(targets);
						var target_normalized = normalizeValues(target, settings.camera.resolution);

						socket.write( target_normalized[0].toFixed(3) + ', ' + target_normalized[1].toFixed(3) );
						loop();
					} else {
						res.end('No center');
					}
				});
			});

		}
	});

	server.listen(settings.port, function() {
		console.log('tcp: bound to port ' + settings.port);
	});
}

function createHTTPServer(settings, detection) {

	var server = http.createServer(function(req, res) {
		console.log('http: client connected');

		//camera.requestImage(function(data) {
		//fs.readFile('./images/4.jpg', function(err, data) {
			cv.readImage('./' + req.url, function(err, im) {
				var targets = detection.processImage(im, settings);

				if (targets != undefined) {
					respond(res, targets);
				} else {
					res.end('No center');
				}
			});
		//});

	});

	server.listen(settings.port, function() { //'listening' listener
		console.log('http: bound to port ' + settings.port);
	});
}

function chooseTarget(targets) {
	if (targets['top'] != undefined)
		return targets['top'];

	if (targets['middle'] != undefined)
		return targets['top'];

	if (targets['middle_right'] != undefined)
		return targets['middle_right'];

	return undefined;
}

function respond(res, targets) {
	var response = '<style>body { background: #0B2799; color: yellow; } </style>' +
	
	'<p>Brandon is awesome</p>';

	if (targets['top'] != undefined)
		response = response + 'top: ' + targets['top'][0] + ', ' + targets['top'][1] + '<br />';

	if (targets['middle'] != undefined)
		response = response + 'middle: ' + targets['middle'][0] + ', ' + targets['middle'][1] + '<br />';

	if (targets['middle_right'] != undefined)
		response = response + 'middle: ' + targets['middle_right'][0] + ', ' + targets['middle_right'][1] + '<br />';

	if (targets['bottom'] != undefined)
		response = response + 'bottom: ' + targets['bottom'][0] + ', ' + targets['bottom'][1] + '<br />';

	res.end(response);
}

function normalizeValues(target, resolution) {
	// Change values to ranges of -1 to 1
	var normalized_x = target[0] / resolution[0];
	normalized_x = (normalized_x * 2) - 1;

	var normalized_y = target[1] / resolution[1];
	normalized_y = (normalized_y * 2) - 1;

	return [normalized_x, normalized_y];
}

function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
}

exports.start = start;