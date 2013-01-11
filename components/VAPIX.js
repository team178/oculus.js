/**
 * API to interface with AXIS Camera
 *
 * VAPIX® is Axis’ own open application programming interface (API)
 * for cost-efficient, flexible, scalable and future-proof integration
 * with other systems. 
 */

var fullImagePath = "http://" + settings.camera.ip + "/" + settings.camera.url;

http.get(fullImagePath, function(res) {
	console.log("Got response: " + res.statusCode);

	res.on('data', function (chunk) {
		console.log('BODY: ' + chunk);
	});
}).on('error', function(e) {
	console.log("Got error: " + e.message);
});