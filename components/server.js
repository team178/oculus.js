var vapix = require('vapix');
var net = require('net');
var http = require('http');
var cv = require('opencv');

var options = {
	address: '10.1.78.11',
	port: '80',
	username: 'FRC',
	password: 'FRC'
};

var camera = new vapix.Camera(options);

function start(settings, detection, thresholds) {

	var server = http.createServer(function(req, res) {
		console.log('Server: client connected');

		camera.requestImage(function(data) {
			cv.readImage(data, function(err, im) {
				var center = detection.processImage(im, thresholds);
				res.end('center is at: ' + center[0] + ', ' + center[1]);
			});
		});

	});

	server.listen(settings.port, function() { //'listening' listener
		console.log('Server: bound to port ' + settings.port);
	});

}

exports.start = start;