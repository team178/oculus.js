// Copyright (c) 2013-2014 Brandon Cheng <bcheng.gt@gmail.com>
//
// This Source Code Form is subject to the terms of the Mozilla Public License,
// v. 2.0. If a copy of the MPL was not distributed with this file, You can
// obtain one at http://mozilla.org/MPL/2.0/.

var vapix = require('vapix');
var yaml = require('js-yaml');
var fs = require('fs');

// Oculus.js
var UDPServer = require('./lib/udp-server');
var HTTPServer = require('./lib/http-server');
var Processing = require('./lib/processing');
var Analysis = require('./lib/analysis');

// Grab settings
try {
  var settings = yaml.safeLoad(fs.readFileSync('./config/main.yaml', 'ascii'));
  settings.camera = yaml.safeLoad(fs.readFileSync('./config/camera.yaml', 'ascii'));
  settings.processing = yaml.safeLoad(fs.readFileSync('./config/processing.yaml', 'ascii'));
  settings.game = yaml.safeLoad(fs.readFileSync('./config/game.yaml', 'ascii'));
} catch (e) {
  console.log('Unable to ' + e.syscall + ' ' + e.path + '. Are you sure ' +
  	'it\'s been renamed and setup?');
  process.exit(1);
}

// Axis camera instance
var camera = vapix.createCamera({
  address: settings.camera.ip,
  port: settings.camera.port,
  username: settings.camera.username,
  password: settings.camera.password
});

// Camera video stream
var videoStream = camera.createVideoStream(settings.camera.video);

// Image Processing
var processing = new Processing(settings.processing);

// Image Analysis
var analysis = new Analysis(settings.game);

// UDP Robot Server
var robot = UDPServer.createServer(settings.udp.port, {
  hostname: settings.udp.hostname
});

// HTTP Debugging
var cockpit = HTTPServer.createServer({
  port: settings.http.port,
  hostname: settings.http.hostname,
  rectangleColor: settings.draw.rectangle,
  centerColor: settings.draw.center
});

// Magic!
videoStream.pipe(processing).pipe(analysis).pipe(robot);
                                   analysis.pipe(cockpit);