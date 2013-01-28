// Custom
var server = require('./components/server');
var detection = require('./components/detection');

require('js-yaml');

var settings = require('./config/server.yaml');
var thresholds = require('./config/thresholds.yaml');

server.start(settings, detection, thresholds);