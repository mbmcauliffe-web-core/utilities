const fs = require("fs");

// Create a Logs Directory if one does not already exist
if (!fs.existsSync("./logs")){
    fs.mkdirSync("./logs");
}

// Create a Write Stream to a new CSV file for Requests
const logPath = "./logs/" + "Request-Log_" + new Date().toISOString().replace(/-/g, ".").replace(/:/g, ".") + ".csv";
const logStream = fs.createWriteStream(logPath, {flags:'a'});

async function logRequest(req, res, next=()=>{}, time=""){

	//Standardize the length of the time String
	if ( time !== "" ) {
		time = String(time).padStart(5, '0');
	}

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
	const consoleOutput = log.ip + " | ToS (ms)" + time + " | " + log.method + " | " + log.url + " | " + log.body;
	console.log(consoleOutput);

	// Add a timestamp and write Log Data to the Log Stream
	const logOutput = new Date().toISOString() + "," + log.ip + "," + log.method + "," + log.url + "," + log.body.split(",").join(" | ") + "\n";
	logStream.write(logOutput);

	next();
	
}

module.exports = logRequest;