var net = require('net');

var client = net.connect({port: 1780}, function() { //'connect' listener
	console.log('client connected');
});

client.on('data', function(data) {
	console.log(data.toString());
});

client.on('end', function() {
	console.log('client disconnected');
});