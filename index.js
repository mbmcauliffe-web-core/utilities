const fs = require("fs");
const fetch = require("cross-fetch");

// Create a Logs Directory if one does not already exist
if (!fs.existsSync("./logs")){
    fs.mkdirSync("./logs");
}

// Create a Write Stream to a new CSV file for Requests
const logPath = "./logs/" + "Request-Log_" + new Date().toISOString().replace(/-/g, ".").replace(/:/g, ".") + ".csv";
const logStream = fs.createWriteStream(logPath, {flags:'a'});

async function logRequest(req, res, next){

	// Replace the value of Body Objects with the Key "password" prior to logging 
	bodyString = '';
	for(i in req.body){
		if(i == "password"){
			bodyString = bodyString + i + ": " + "**********" + ", ";
		} else{
			bodyString = bodyString + i + ": " + req.body[i] + ", ";
		}
		
	}

	// Gather the Log Data
	const log = {
		url: req.url,
		method: req.method,
		body: bodyString,
		ip: req.connection.remoteAddress
	}

	// Print Log Data to the Console
	const consoleOutput = log.ip + " | " + log.url + " | " + log.method + " | " + log.body;
	console.log(consoleOutput);

	// Add a timestamp and write Log Data to the Log Stream
	const logOutput = new Date().toISOString() + "," + log.ip + "," + log.url + "," + log.method + "," + log.body.split(",").join(" | ") + "\n";
	logStream.write(logOutput);

	next();
	
}

async function proxyRequest ( req, res, next, target ) {

	var requestPayload={
		method: req.method,
		headers: {
			authorization: req.headers.authorization
		}
	}

	if (req.method != "GET") {
		requestPayload.body = JSON.stringify(req.body);
		requestPayload.headers["content-type"] = "application/json";
	}

	response = await fetch( target + req.path, requestPayload).then(function(response){return response}, function(error){console.log(error)});

	return response

}

exports.logRequest = logRequest;
exports.proxyRequest = proxyRequest;