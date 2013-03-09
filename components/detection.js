var cv = require('opencv');
var draw = require('./draw');

exports.processImage = function processImage(im, settings) {

	im.inRange(settings.withMod.lowerb.reverse(), settings.withMod.upperb.reverse());

	im_canny = im.copy();

	im_canny.canny(settings.lowThresh, settings.highThresh);
	im_canny.dilate(settings.nIters);

	contours = im_canny.findContours();

	var targets = [];

	for(i = 0; i < contours.size(); i++) {

		if (contours.area(i) < settings.maxArea) {
			continue;
		}

		// Rename variable for ease of access
		current = contours.boundingRect(i);

		// Remove double targets picked up from canny dilation
		if ( isInsideAny(current, contours) ) {
			continue;
		}

		if (settings.debug) {
			console.log(current);
		}

		// Determine which target we're looking at
		placement = exports.getTargetPlacement(current.width, current.height);

		// If we already have a middle, the second middle is the one on the right
		if ( targets[placement] != undefined && placement == 'middle') {
			placement = 'middle_right';
		}

		targets[placement] = exports.getCenter(
			current.x,
			current.y,
			current.width,
			current.height
		);

		/* Enable for debugging
		big.drawContour(contours, i, settings.RED);
		draw.drawBoundingRect(big, contours, i, settings.GREEN);

		draw.drawCenter(big, contours, i, settings.BLUE, exports.getCenter);
		*/

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
 * Find out which target we're looking at
 *
 * @param int width Width of rectangle
 * @param int height Height of rectangle
 * @return string Placement of target
 */
exports.getTargetPlacement = function getTargetPlacement(width, height) {

	// Define the sizes of the targets. Adding 8 in. for 4 in. border tape.
	var top_size = (54 + 8) / (12 + 8);
	var mid_size = (54 + 8) / (21 + 8);
	var bot_size = (29 + 8) / (24 + 8);

	var expand = 1.5;

	// Expand the high threshold (captured image sizes from camera aren't perfect
	var top_high = top_size * expand;
	var mid_high = mid_size * expand;
	var bot_high = bot_size * expand;

	// Shrink the low threshold size
	var top_low = top_size / expand;
	var mid_low = mid_size / expand;
	var bot_low = bot_size / expand;

	var ratio = width / height;

	if (ratio >= top_low && ratio <= top_high) {
		return 'top';
	} else if (ratio >= mid_low && ratio <= mid_high) {
		return 'middle';
	} else if ( ratio >= bot_low && ratio <= bot_high ) {
		return 'bottom';
	}
}

/**
 * Check if one image is inside another
 *
 * @param object bigger contour.boundingRect() object
 * @param object smaller contour.boundingRect() object
 * @return boolean
 */
function isInside(bigger, smaller) {

	var smaller_topRight = smaller.x + smaller.width;
	var bigger_topRight = bigger.x + bigger.width;

	if ( (bigger.x < smaller.x) && (bigger_topRight > smaller_topRight) ) {
		return true;
	}

	return false;
}

/**
 * Check if one image is inside another
 *
 * @param object current contour.boundingRect() object
 * @param object all findContours() object
 * @return boolean
 */
function isInsideAny(current, all) {

	for (var i = 0; i < all.size(); i++) {
		if (isInside(all.boundingRect(i), current)) {
			return true;
		}
	}

	return false;
}