var cv = require('opencv');
var draw = require('./draw');

exports.processImage = function processImage(im, thresholds) {

	var big = new cv.Matrix(im.height(), im.width());

	im.inRange(thresholds.withMod.lowerb.reverse(), thresholds.withMod.upperb.reverse());

	im_canny = im.copy();

	im_canny.canny(thresholds.lowThresh, thresholds.highThresh);
	im_canny.dilate(thresholds.nIters);

	contours = im_canny.findContours();

	var targets = [];

	for(i = 0; i < contours.size(); i++) {
		if (contours.area(i) > thresholds.maxArea) {

			var previous = contours.boundingRect(i);

			// Rename variable for ease of access
			current = contours.boundingRect(i);

			console.log(current);

			// Remove double targets
			if (exports.isInside( contours.boundingRect(i), previous) ) {
				break;
			}

			// Determine which target we're looking at
			placement = exports.getRectangleScore(current.width, current.height);

			targets[placement] = exports.getCenter(
				current.x,
				current.y,
				current.width,
				current.height
			);

			/* Enable for debugging
			big.drawContour(contours, i, thresholds.RED);
			draw.drawBoundingRect(big, contours, i, thresholds.GREEN);

			draw.drawCenter(big, contours, i, thresholds.BLUE, exports.getCenter);
			*/

			
		}
	}

	return targets;

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

/**
 * Calculate rectangle score of targets
 *
 *
 */
exports.getRectangleScore = function getRectangleScore(width, height) {
	var ratio = width / height;

	var top_size = (54 + 8) / (12 + 8);
	var mid_size = (54 + 8) / (21 + 8);
	var bot_size = (29 + 8) / (24 + 8);

	var expand = 1.5;

	var top_low = top_size / expand;
	var top_high = top_size * expand;
	var mid_low = mid_size / expand;
	var mid_high = mid_size * expand;
	var bot_low = bot_size / expand;
	var bot_high = bot_size * expand;

	if (ratio >= top_low && ratio <= top_high) {
		return 'top';
	} else if (ratio >= mid_low && ratio <= mid_high) {
		return 'middle';
	} else if ( ratio >= bot_low && ratio <= bot_high ) {
		return 'bottom';
	}
}

/**
 *
 *
 */
exports.isInside = function isInside(bigger, smaller) {
	var smaller_topRight = smaller.x + smaller.width;
	var bigger_topRight = bigger.x + bigger.width;

	if (bigger.x < smaller.x && Bigger_topRight > smaller_topRight) {
		return true;
	}

	return false;
}