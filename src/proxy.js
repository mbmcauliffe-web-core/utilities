const fetch = require("cross-fetch");

async function proxy ( req, res, next, target ) {

	var requestPayload={
		method: req.method,
		headers: {}
	}

	if ( req.headers.authorization != null ) {
		requestPayload.headers.authorization = req.headers.authorization;
	}

	if (req.method != "GET") {
		requestPayload.body = JSON.stringify(req.body);
		requestPayload.headers["content-type"] = "application/json";
	}

	response = await fetch( target, requestPayload).then(function(response){return response}, function(error){console.log(error)});

	if(!response){
		return res.sendStatus(503);
	}

	res.status(response.status);

	if ( response.headers.authorization ) {
		res.set("Access-Control-Expose-Headers", "authorization");
		res.set("authorization", response.headers.authorization);
	}

	res.body = response.text();

	next();

}

module.exports = proxy;