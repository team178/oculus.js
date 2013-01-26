var http = require('http');
var net  = require('net');
var fs = require('fs');
var cv = require('opencv');
var vapix = require('vapix');

require('js-yaml');

// Import settings file
var settings = require('./config/server.yaml');

var detection = require('./config/detection.yaml');

/*var server = net.createServer(function(c) { //'connection' listener
	console.log('server connected');
	c.on('end', function() {
		console.log('server disconnected');
	});
	c.write('hello\r\n');
	c.pipe(c);
});

server.listen(settings.port, function() { //'listening' listener
	console.log('server bound');
});*/

var image = fs.readFileSync('4.jpg');

cv.readImage(image, function(err, im) {

	var big = new cv.Matrix(im.height(), im.width()); 

	im.convertGrayscale();
	im.save('./grayscale.jpg');
	im_canny = im.copy();

	im_canny.canny(detection.lowThresh, detection.highThresh);
	im_canny.dilate(detection.nIters);

	contours = im_canny.findContours();

	for(i = 0; i < contours.size(); i++) {
		if(contours.area(i) > detection.maxArea) {
			big.drawContour(contours, i, detection.GREEN);
		}
	}

	big.save('./output.png');
});