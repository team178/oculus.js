var vapix = require('vapix');
var net  = require('net');
var fs = require('fs');
var cv = require('opencv');

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

var image = fs.readFileSync('images/simple.jpg');

cv.readImage(image, function(err, im) {

	var big = new cv.Matrix(im.height(), im.width()); 
	im.inRangeS(detection.withMod.lowerb.reverse(), detection.withMod.upperb.reverse());
	im.save('inRangeS.jpg');

	//im.convertGrayscale();
	im_canny = im.copy();

	im_canny.canny(detection.lowThresh, detection.highThresh);
	im_canny.dilate(detection.nIters);

	contours = im_canny.findContours();

	for(i = 0; i < contours.size(); i++) {
		if (contours.area(i) > detection.maxArea) {
			console.log(contours.boundingRect(i));
			big.drawContour(contours, i, detection.RED);

			var firstCorner =  [contours.boundingRect(i).x, contours.boundingRect(i).y];
			var secondCorner = [contours.boundingRect(i).x + contours.boundingRect(i).width, contours.boundingRect(i).y];
			var thirdCorner =  [contours.boundingRect(i).x, contours.boundingRect(i).y + contours.boundingRect(i).height];
			var fourthCorner = [contours.boundingRect(i).x + contours.boundingRect(i).width, contours.boundingRect(i).y + contours.boundingRect(i).height]

			big.line(firstCorner, secondCorner, detection.GREEN);
			big.line(secondCorner, fourthCorner, detection.GREEN);
			big.line(fourthCorner, thirdCorner, detection.GREEN);
			big.line(thirdCorner, firstCorner, detection.GREEN);

		}
	}

	big.save('./output.jpg');
});