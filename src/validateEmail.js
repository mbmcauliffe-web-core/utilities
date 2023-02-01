function validateEmail( req, res, next ){

	if ( typeof req.body.email === 'undefined' ){ next(); return }

	let invalid = false;

	const email = req.body.email;

	if(email == ""){
		invalid = true;

	} else if(email.split(" ") != email){
		invalid = true;

	} else if(email.split("@") == email){
		invalid = true;

	} else if(email.split("@")[1].split(".") == email.split("@")[1]){
		invalid = true;

	} else if(email.split("@")[1].split(".").length != 2){
		invalid = true;

	} else if(email.split("@")[1].split(".")[1] == ""){
		invalid = true;
		
	}

	if ( invalid == true ) {
		return res.status(400).send(JSON.stringify({
			title: "Invalid",
			message: 'Please use a valid email address.'
		}));
	}

	next();

}

module.exports = validateEmail;