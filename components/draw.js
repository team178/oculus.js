/**
 * Draw a rectangle around the detected contour
 *
 * @param Matrix im Matrix image to draw lines on
 * @param array contours Array of contours returned from canny.findContours
 * @param int index Index in array to draw
 * @param array Array of B,G,R int values of a color to draw with
 */
exports.drawBoundingRect = function(im, contours, index, color) {
	var firstCorner =  [contours.boundingRect(index).x, contours.boundingRect(index).y];
	var secondCorner = [contours.boundingRect(index).x + contours.boundingRect(index).width, contours.boundingRect(index).y];
	var thirdCorner =  [contours.boundingRect(index).x, contours.boundingRect(index).y + contours.boundingRect(index).height];
	var fourthCorner = [contours.boundingRect(index).x + contours.boundingRect(index).width, contours.boundingRect(index).y + contours.boundingRect(index).height]

	im.line(firstCorner, secondCorner, color);
	im.line(secondCorner, fourthCorner, color);
	im.line(fourthCorner, thirdCorner, color);
	im.line(thirdCorner, firstCorner, color);
}

/**
 * Draw a ellipse on the center of a contour
 *
 * @param Matrix im Matrix image to draw lines on
 * @param array contours Array of contours returned from canny.findContours
 * @param int index Index in array to draw
 * @param array Array of B,G,R int values of a color to draw with
 */
exports.drawCenter = function(im, contours, index, color, getCenter) {
	var center = getCenter(
		contours.boundingRect(index).x,
		contours.boundingRect(index).y,
		contours.boundingRect(index).width,
		contours.boundingRect(index).height
	);

	im.ellipse(center[0], center[1], 3, 3, color);
}