var http = require('http'),
    fs = require('fs'),
    path = process.argv.splice(2);
    console.log(path);
http.get(path[0], function (res) {
	var imageData = '';
	res.setEncoding('binary');

	res.on('data', function (chunk) {
		imageData += chunk;
	});

	res.on('end', function () {
		fs.writeFile('hi.png', imageData, 'binary', function (err) {
			if (err) throw err;
			console.log('File saved');
		});
	});
});