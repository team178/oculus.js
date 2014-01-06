var http = require('http');
var util = require('util');
var stream = require('stream');
var Writable = stream.Writable;
var mjpegServer = require('mjpeg-server');
var cv = require('opencv');

var draw = require('./utils/draw.js');

exports.createServer = function(options) {
  return new HTTPServer(options);
};

function HTTPServer(settings, options) {
  if (!(this instanceof HTTPServer))
    return new HTTPServer(settings, options);

  if (options === undefined)
    options = {};
  options.objectMode = true;

  Writable.call(this, options);

  this.port = settings.port;
  this.hostname = settings.hostname;
  this.rectangleColor = settings.rectangleColor.reverse();
  this.centerColor = settings.centerColor.reverse();

  this.start();
}
util.inherits(HTTPServer, Writable);

HTTPServer.prototype.start = function() {
  var self = this;

  this.server = http.createServer(function (req, res) {
    if (req.url == 'view') {
      self.viewFinder(req, res)
    } else {
      // Serve mjpeg stream on all paths for now
      self.viewFinder(req, res);
    }
  });

  this.listen();
};

HTTPServer.prototype.listen = function() {
  this.server.listen(this.port, this.hostname);
  console.log('[HTTP server] started on port ' + this.port + ' at ' +
  	this.hostname);
};

HTTPServer.prototype.viewFinder = function(req, res) {
  var mjpegReqHandler = mjpegServer.createReqHandler(req, res);

  this.on('write', function(image) {
    mjpegReqHandler.update(image);
  });
};

HTTPServer.prototype._write = function(analyzed, encoding, done) {
  var self = this;
  var image = analyzed.image;

  cv.readImage(image, function(err, im) {
    for (var key in analyzed.targets) {
      draw.boundingRect(im, analyzed.targets[key], self.rectangleColor);
      draw.center(im, analyzed.targets[key], self.centerColor);
    }

    self.emit('write', im.toBuffer());
    done();
  });
};