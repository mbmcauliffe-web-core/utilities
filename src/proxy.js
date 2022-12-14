const fetch = require("node-fetch");

function proxy ( serviceIP ) {

	// This actual middleware is returned with the target parameter already inserted.
	return async ( req, res, next )=>{

		var requestPayload={
			method: req.method,
			headers: {},
			redirect: "manual"
		}

		if ( req.headers.authorization != null ) {
			requestPayload.headers.authorization = req.headers.authorization;
		}

		if (req.method != "GET") {
			requestPayload.body = JSON.stringify(req.body);
			requestPayload.headers["content-type"] = "application/json";
		}

		response = await fetch( serviceIP + req.originalUrl, requestPayload ).then(function(response){return response}, function(error){console.log(error)});

		if ( response.status === 302 ) {
			return res.redirect(response.headers.get("location").split(response.url)[1]);
		}

		res.status(response.status);

		res.set("Access-Control-Expose-Headers", "client-authorization");
		res.set("client-authorization", response.headers.get("client-authorization"));

		res.body = await response.text();

		next();

	}

}

module.exports = proxy;