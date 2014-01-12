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
  this.hostname = options.hostname === undefined ? 'localhost' : options.hostname;

  this.packet = new Buffer(128);
  this.packet.fill(0x00);
  this.packet.writeUInt32BE('0x0c616500', 0); // Identifer: OcUlUS
  this.packet.writeUInt32BE('0x00060000', 4); // Version: 00.06.00.00

  this.start();
}
util.inherits(UDPServer, Writable);

UDPServer.prototype.start = function() {
  this.client = dgram.createSocket('udp4');
};

UDPServer.prototype._write = function(analysis, encoding, done) {
  var targets = analysis.targets;
  this.packet.writeUInt32BE('0x7a129e75', 8); // TaRgeTS
  for (var name in targets) {
    // do something
  }
  this.client.send(this.packet, 0, 128, this.port, this.hostname, function(err, bytes) {
  	done();
  });
};