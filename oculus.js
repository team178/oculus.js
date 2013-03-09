var vapix = require('vapix');

// Custom
var server = require('./components/server');
var detection = require('./components/detection');
var analysis = require('./components/analysis');

require('js-yaml');

var settings = require('./config/settings.yaml');

var camera = new vapix.Camera({
	address: settings.camera.ip,
	port: settings.camera.port,
	username: settings.camera.username,
	password: settings.camera.password
});

server.start({
	settings: settings,
	camera: camera,
	detection: detection,
	analysis: analysis
});

// Dependency Injection Magic
//
//             o
//                  O       /`-.__
//                         /  \·'^|
//            o           T    l  *
//                       _|-..-|_
//                O    (^ '----' `)
//                      `\-....-/^   Dependicus Injectus
//            O       o  ) "/ " (
//                      _( (-)  )_
//                  O  /\ )    (  /\
//                    /  \(    ) |  \
//                o  o    \)  ( /    \
//                  /     |(  )|      \
//                 /    o \ \( /       \
//           __.--'   O    \_ /   .._   \
//          //|)\      ,   (_)   /(((\^)'\
//             |       | O         )  `  |
//             |      / o___      /      /
//            /  _.-''^^__O_^^''-._     /
//          .'  /  -''^^    ^^''-  \--'^
//        .'   .`.  `'''----'''^  .`. \
//      .'    /   `'--..____..--'^   \ \
//     /  _.-/                        \ \
// .::'_/^   |                        |  `.
//        .-'|                        |    `-.
//  _.--'`   \                        /       `-.
// /          \                      /           `-._
// `'---..__   `.                  .´_.._   __       \
//          ``'''`.              .'      `'^  `''---'^
//                 `-..______..-'