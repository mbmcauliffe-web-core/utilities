const fs = require("fs");
let logPath;
let logStream;

function init () {

	if (!fs.existsSync("./logs")){
	    fs.mkdirSync("./logs");
	}

	logPath = "./logs/" + "Request-Log_" + new Date().toISOString().replace(/-/g, ".").replace(/:/g, ".") + ".csv";
	logStream = fs.createWriteStream(logPath, {flags:'a'});

}

function removePasswords ( reqBody ) {

	bodyString = '';

	for( i in reqBody ) {

		if(i == "password"){

			bodyString = bodyString + i + ": " + "**********" + ", ";

		} else{

			bodyString = bodyString + i + ": " + reqBody[i] + ", ";

		}
		
	}

	return bodyString

}

function logRequest (req, res, time=""){

	const log = {
		url: req.url,
		method: req.method,
		body: removePasswords( req.body ),
		ip: req.connection.remoteAddress,
		time: "ResTime: " + Math.floor( time * 1000 ) / 1000 + "ms"
	}

	const consoleOutput = log.ip + " | " + log.time + " | " + log.method + " | " + log.url + " | " + log.body;
	console.log(consoleOutput);

	const logOutput = new Date().toISOString() + "," + log.ip + "," + log.time + "," + log.method + "," + log.url + "," + log.body.split(",").join(" | ") + "\n";
	logStream.write(logOutput);
	
}

init();
module.exports = logRequest;