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
	var self = this;

	var server = net.createServer(function(socket) {
		console.log('tcp: connected');
		socket.on('end', function() {
			console.log('tcp: disconneced');
		});

		self.sendValue(socket);

	});

	var port = this.settings.port;

	server.listen(port, function() {
		console.log('tcp: bound to port ' + port);
	});
}

TCPServer.prototype.sendValue = function(socket) {
	var self = this;

	/*camera.requestImage(function(data) {*/
	fs.readFile('./images/4.jpg', function call(err, data) {
		cv.readImage(data, function(err, im) {
			var targets = self.detection.processImage(im, self.settings);

			if (targets != undefined) {
				var target = self.analysis.chooseTarget(targets);
				var target_normalized = self.analysis.normalizeValues(target, self.settings.camera.resolution);
				console.log(target_normalized);

				socket.write( target_normalized[0].toFixed(3) + ', ' + target_normalized[1].toFixed(3) );
				self.sendValue(socket);
			} else {
				console.log('0');
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