/*
 * Image Analysis
 *
 * Image analysis is the extraction of meaningful information from images;
 * mainly from digital images by means of digital image processing
 * techniques. Image analysis tasks can be as simple as reading bar coded tags
 * or as sophisticated as identifying a person from their face.
 *
 * Image Processing (image in -> image out)
 * *Image Analysis (image in -> measurements out)
 * Image Understanding (image in -> high-level description out)
 *
 * - http: *en.wikipedia.org/wiki/Image_analysis
 */

var util = require('util');
var stream = require('stream');
var Transform = stream.Transform;
var cv = require('opencv');

function Analysis(settings, options) {
  if (!(this instanceof Analysis))
    return new Analysis(options);

  if (options === undefined)
    options = {};
  options.objectMode = true;

  Transform.call(this, options);

  this.settings = settings;
  this.targets = this.settings.targets;

  this.tape = this.targets.tape;
  this.low = this.targets.low;
  this.middle = this.targets.middle;
  this.high = this.targets.high;

  this.topWidth = this.high.opening.width + 2*this.tape;
  this.topHeight = this.high.opening.height + 2*this.tape;
  this.middleWidth = this.middle.opening.width + 2*this.tape;
  this.middleHeight = this.middle.opening.height + 2*this.tape;
  this.bottomWidth = this.low.opening.width + 2*this.tape;
  this.bottomHeight = this.low.opening.height + 2*this.tape;
}
util.inherits(Analysis, Transform);

Analysis.prototype._transform = function(processed, encoding, done) {
  var targets = {};

  // Contour lines are joints of equivalation in height. Find them.
  var contours = processed.image.findContours();

  for (var i = 0; i < contours.size(); i++) {

    // Filter out small rectangles
    if (contours.area(i) < this.settings.maxArea)
      continue; // skip

    // Rename variable for ease of access
    var current = contours.boundingRect(i);

    // Filter out double targets picked up from canny dilation
    if ( this.isInsideAny(current, contours) )
    	continue; //skip

    // Determine which target we're looking at from size
    var placement = this.getTargetPlacement(current.width, current.height);

    // Random object that just happens to look like a target?
    if (placement === null)
      continue // skip

    // If we already have a middle, and this is a middle
    // then this is the second middle
    if ( targets[placement] != undefined && placement == 'middle') {
      placement = 'middle_right';
    }

    // Store valid target goal
    targets[placement] = current;
    targets[placement].center = this.getCenter(
      current.x, current.y,
      current.width, current.height
    );
  }

  this.push({
    'image': processed.original,
    'targets': targets
  });
  done();
};

/**
 * Check if one image is inside another
 *
 * @param object smaller contour.boundingRect() object
 * @param object bigger contour.boundingRect() object
 * @return boolean
 */
Analysis.prototype.isInside = function(smaller, bigger) {
  var smaller_topLeft = smaller.x;
  var bigger_topLeft = bigger.x;
  var smaller_topRight = smaller.x + smaller.width;
  var bigger_topRight = bigger.x + bigger.width;

  if ( (bigger_topLeft < smaller_topLeft) && (bigger_topRight > smaller_topRight) ) {
    return true;
  }

  return false;
};

/**
 * Check if one image is inside another
 *
 * @param object current contour.boundingRect() object
 * @param object all findContours() object
 * @return boolean
 */
Analysis.prototype.isInsideAny = function(current, all) {
  for (var i = 0; i < all.size(); i++) {
  	if ( this.isInside(current, all.boundingRect(i)) ) {
      return true;
  	}
  }

  return false;
};

Analysis.prototype.getTargetPlacement = function(width, height) {
  // Define the sizes of the targets. Adding 8 in. for 4 in. border tape.
  var top_size = this.topWidth / this.topHeight;
  var mid_size = this.middleWidth / this.middleHeight;
  var bot_size = this.bottomWidth / this.bottomHeight;

  // Create thresholds by expanding/shrinking from standard sizes
  var expandFactor = 1.2;
  var shrinkFactor = 1.2;

  var top_high = top_size * expandFactor;
  var mid_high = mid_size * expandFactor;
  var bot_high = bot_size * expandFactor;

  var top_low = top_size / shrinkFactor;
  var mid_low = mid_size / shrinkFactor;
  var bot_low = bot_size / shrinkFactor;

  // Determine the target's placement based on size
  var ratio = width / height;

  if (ratio >= top_low && ratio <= top_high) {
    return 'top';
  } else if (ratio >= mid_low && ratio <= mid_high) {
  	return 'middle';
  } else if ( ratio >= bot_low && ratio <= bot_high ) {
  	return 'bottom';
  } else {
    return null;
  }
};

/**
 * Get the center given x,y, width, and height of a particle
 *
 * @param int x Top left x axiscoordinate of particle
 * @param int y Top left y axis coordinate of particle
 * @param int width Width of particle
 * @param int height Height of particle
 * @return array Array (x, y) of coordinate
 */
Analysis.prototype.getCenter = function(x, y, width, height) {
  var center_x = x + width/2;
  var center_y = y + height/2;
  return { 'x': center_x, 'y': center_y };
}

module.exports = Analysis;