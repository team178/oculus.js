/**
* Draw a rectangle around the detected contour
*
* @param Matrix im Matrix image to draw lines on
* @param array contours Array of contours returned from canny.findContours
* @param int index Index in array to draw
* @param array Array of B,G,R int values of a color to draw with
*/
exports.boundingRect = function(image, bound, color) {
  var firstCorner = [bound.x, bound.y];
  var secondCorner = [bound.x + bound.width, bound.y];
  var thirdCorner = [bound.x, bound.y + bound.height];
  var fourthCorner = [bound.x + bound.width, bound.y + bound.height]

  image.line(firstCorner, secondCorner, color);
  image.line(secondCorner, fourthCorner, color);
  image.line(fourthCorner, thirdCorner, color);
  image.line(thirdCorner, firstCorner, color);
}

/**
* Draw a ellipse on the center of a contour
*
* @param Matrix im Matrix image to draw lines on
* @param array contours Array of contours returned from canny.findContours
* @param int index Index in array to draw
* @param array Array of B,G,R int values of a color to draw with
*/
exports.center = function(image, bound, color) {
  image.ellipse(bound.center.x, bound.center.y, 3, 3, color);
}
