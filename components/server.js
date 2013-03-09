var vapix = require('vapix');
var net = require('net');
var cv = require('opencv');
var http = require('http');
var fs = require('fs');

function start(options) {
	tcp = createTCPServer(options);
	tcp.start();
}

function createTCPServer(options) {
	return new TCPServer(options);
}

function TCPServer(options) {
	this.settings = options.settings;
	this.camera = options.camera;
	this.detection = options.detection;
	this.analysis = options.analysis;
}

TCPServer.prototype.start = function() {
	var server = net.createServer(function(socket) {
		console.log('tcp: connected');
		socket.on('end', function() {
			console.log('tcp: disconneced');
		});

		//sendValue(sendValue());

	});

	var port = this.settings.port;

	server.listen(port, function() {
		console.log('tcp: bound to port ' + port);
	});
}

function sendValue(callback) {
	/*camera.requestImage(function(data) {*/
	fs.readFile('./images/4.jpg', function call(err, data) {
		cv.readImage(data, function(err, im) {
			var targets = detection.processImage(im, settings);

			if (targets != undefined) {
				var target = this.analysis.chooseTarget(targets);
				var target_normalized = this.analysis.normalizeValues(target, settings.camera.resolution);

				socket.write( target_normalized[0].toFixed(3) + ', ' + target_normalized[1].toFixed(3) );
				callback();
			} else {
				socket.write('0');
			}
		});
	});
}

function sleep(milliSeconds) {
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
}

exports.start = start;