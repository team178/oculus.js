var cv = require('opencv');
var draw = require('./draw');

exports.processImage = function processImage(im, thresholds) {

	var big = new cv.Matrix(im.height(), im.width());

	im.inRange(thresholds.withMod.lowerb.reverse(), thresholds.withMod.upperb.reverse());

	im_canny = im.copy();

	im_canny.canny(thresholds.lowThresh, thresholds.highThresh);
	im_canny.dilate(thresholds.nIters);

	contours = im_canny.findContours();

	for(i = 0; i < contours.size(); i++) {
		if (contours.area(i) > thresholds.maxArea) {
			console.log(contours.boundingRect(i));

			big.drawContour(contours, i, thresholds.RED);
			draw.drawBoundingRect(big, contours, i, thresholds.GREEN);

			draw.drawCenter(big, contours, i, thresholds.BLUE, exports.getCenter);

			return exports.getCenter(
				contours.boundingRect(i).x,
				contours.boundingRect(i).y,
				contours.boundingRect(i).width,
				contours.boundingRect(i).height
			);
		}
	}

}

/**
 * Get the center given x,y, width, and height of a particle
 *
 * @param int x Top left x axiscoordinate of particle
 * @param int y Top left y axis coordinate of particle
 * @param int width Width of particle
 * @param int height Height of particle
 * @return array Array (x, y) of coordinate
 */
exports.getCenter = function getCenter(x, y, width, height) {
	var center_x = x + width/2;
	var center_y = y + height/2;
	return [center_x, center_y];
}