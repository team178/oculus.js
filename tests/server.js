/**
 * Test server without OpenCV or camera
 */

var net = require('net');

var server = net.createServer(function(socket) {
	console.log('tcp: connected');

	socket.on('end', function() {
		console.log('tcp: disconneced');
		clearInterval(interval);
	});

	socket.on('error', function() {
		console.log('tcp: Socket error occured');
		this.emit('end');
	});

	var counter = 1;

	var interval = setInterval(function() {
		socket.write(String(counter + "\n"));
		counter++;
	}, 500);

});

var port = "1780";

server.listen(port, function() {
	console.log('tcp: bound to port ' + port);
});