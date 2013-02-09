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
	console.log('enforce.js: TCP server not implemented yet');
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

exports.start = start;