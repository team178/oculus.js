// Custom
var server = require('./components/server');
var detection = require('./components/detection');

require('js-yaml');

var settings = require('./config/settings.yaml');

if (settings.debug) {
	console.log('enforce.js: Debug mode on');
}

server.start(settings, detection);

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