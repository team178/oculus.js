var util = require('util');
var stream = require('stream');
var Writable = stream.Writable;
var dgram = require('dgram');
var crc32 = require('buffer-crc32');

exports.createServer = function(options) {
  return new UDPServer(options);
};

function UDPServer(port, options) {
  if (!(this instanceof UDPServer))
    return new UDPServer(port, options);

  if (options === undefined)
    options = {};
  options.objectMode = true;

  Writable.call(this, options);

  this.port = port;
  this.packet = new Buffer(1024);

  this.start();
}
util.inherits(UDPServer, Writable);

UDPServer.prototype.start = function() {
  this.client = dgram.createSocket('udp4');
};

UDPServer.prototype._write = function(analysis, encoding, done) {
  var targets = analysis.targets;
  this.client.send(this.packet, 0, 1024, this.port, 'localhost', function(err, bytes) {
    //console.log(chunk);
  	done();
  });
};