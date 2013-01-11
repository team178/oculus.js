var http = require('http');
var net  = require('net');

require('js-yaml');

// Import settings file
var settings = require('./config/server.yaml');

var server = net.createServer(function(c) { //'connection' listener
	console.log('server connected');
	c.on('end', function() {
		console.log('server disconnected');
	});
	c.write('hello\r\n');
	c.pipe(c);
});

server.listen(settings.port, function() { //'listening' listener
	console.log('server bound');
});