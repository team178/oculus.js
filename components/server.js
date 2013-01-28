var vapix = require('vapix');
var net = require('net');
var http = require('http');
var cv = require('opencv');

function start(settings, detection, thresholds) {

	var server = http.createServer(function(req, res) {
		console.log('Server: client connected');

		cv.readImage('.' + req.url, function(err, im) {
			res.end( detection.processImage(im, thresholds) );
		});

	});
	
	server.listen(settings.port, function() { //'listening' listener
		console.log('Server: bound to port ' + settings.port);
	});

}

exports.start = start;