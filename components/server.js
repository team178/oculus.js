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
	var self = this;

	this.settings = options.settings;
	this.camera = options.camera;
	this.detection = options.detection;
	this.analysis = options.analysis;

	// Grab camera resolution
	this.camera.getImageResolution(function(err, data) {
		self.resolution = data;
	});

	this.mjpg = this.camera.createVideoStream({
		resolution: self.settings.camera.resolution,
		compression: self.settings.camera.compression,
		fps: self.settings.camera.fps
	});
}

TCPServer.prototype.start = function() {
	var self = this;

	var server = net.createServer(function(socket) {
		console.log('tcp: connected');

		self.mjpg.on('data', function(data) {
			self.sendValue(data, socket);
		});

		socket.on('end', function() {
			console.log('tcp: disconneced');
		});

		socket.on('error', function() {
			console.log('tcp: Socket error occured');
		});
	});

	var port = this.settings.port;

	server.listen(port, function() {
		console.log('tcp: bound to port ' + port);
	});
}

TCPServer.prototype.sendValue = function(data, socket) {
	var self = this;

	cv.readImage(data, function(err, im) {

		// Read all targets
		var targets = self.detection.processImage(im, self.settings);

		// Grab the one we like
		var target = self.analysis.chooseTarget(targets);
		
		//Find distance from target
		var distance = self.analysis.findDistance(target, self.settings);

		// If a valid target is found, normalize and send coordinates
		if (target != undefined) {
			var target_normalized = self.analysis.normalizeValues(target, self.resolution);

			socket.write( target_normalized[0].toFixed(3) + ', ' + target_normalized[1].toFixed(3) + ', ' + distance);
		} else {
			socket.write('not found');
		}
	});
}

function sleep(milliSeconds) {
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
}

exports.start = start;