/**
 * Test how many images per second can be acquired from the camera in a minute.
 */

var vapix = require('../node_modules/vapix');

var options = {
	address: '10.1.78.11',
	port: '80',
	username: 'FRC',
	password: 'FRC'
};

var camera = new vapix.Camera(options);

var counter = 0;

console.log("Counting, please wait 60 seconds...");
loop();

function loop() {
	camera.requestImage(function(data) {
		counter++;
		loop();
	});
}

setTimeout(end, 1000 * 60);

function end() {
	console.log("Requested images per second: " + counter / 60);
	process.exit(0);
}