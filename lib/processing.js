/**
 * Image Processing 
 *
 * In imaging science, image processing is any form of signal processing for
 * which the input is an image, such as a photograph or video frame; the output
 * of image processing may be either an image or a set of characteristics or
 * parameters related to the image. Most image-processing techniques involve
 * treating the image as a two-dimensional signal and applying standard
 * signal-processing techniques to it.
 *
 * -->Image Processing (image in -> image out)
 * Image Analysis (image in -> measurements out)
 * Image Understanding (image in -> high-level description out)
 *
 * - http://en.wikipedia.org/wiki/Image_processing
 */

var util = require('util');
var stream = require('stream');
var Transform = stream.Transform;
var cv = require('opencv');

function Processing(settings, options) {
  if (!(this instanceof Processing))
    return new Processing(options);

  if (options === undefined)
    options = {};
  options.objectMode = true;

  Transform.call(this, options);

  this.settings = settings;
  this.decodeSettings();
}
util.inherits(Processing, Transform);

Processing.prototype.decodeSettings = function() {
  var profile = this.settings.profile;
  this.profile = this.settings[profile];

  this.lowerbound = this.profile.lowerb.reverse();
  this.upperbound = this.profile.upperb.reverse();
};

/**
 * Expects a full image
 */
Processing.prototype._transform = function(chunk, encoding, callback) {
  var self = this;

  cv.readImage(chunk, function(err, image) {
    // Color filter
    image.inRange(self.lowerbound, self.upperbound);

    // Do canny operations on a copy
    var im_canny = image.copy();

    // Feature detection with canny algorithm
    im_canny.canny(self.settings.lowThresh, self.settings.highThresh);
    im_canny.dilate(self.settings.nIters);

    // All done
    self.push({
      'original': chunk,
      'image': image
    });
    callback();
  });
};

module.exports = Processing;