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
				var targets = detection.processImage(im, thresholds);
				if (targets != undefined) {
					exports.respond(res, targets);
				} else {
					res.end('No center');
				}
			});
		});

	});

	server.listen(settings.port, function() { //'listening' listener
		console.log('Server: bound to port ' + settings.port);
	});

}

exports.respond = function respond(res, targets) {
	var response = '<style>body { background: #0B2799; color: yellow; } </style>' +
	
	'<p>Brandon and Travis son tostados de pan</p>';

	if (targets['top'] != undefined)
		response = response + 'top: ' + targets['top'][0] + ', ' + targets['top'][1] + '<br />';

	if (targets['middle'] != undefined)
		response = response + 'middle: ' + targets['middle'][0] + ', ' + targets['middle'][1] + '<br />';

	if (targets['bottom'] != undefined)
		response = response + 'bottom: ' + targets['bottom'][0] + ', ' + targets['bottom'][1] + '<br />';

	res.end(response);
}

exports.start = start;