const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

function auth(req, res, next) {
	const response = {
		success: false,
		error: "Invalid/missing token",
		message: "Verify token or login in",
		data: [],
		code: 401
	};

	const auth = req.header("Authorization");

	if (typeof auth !== "undefined") {
		const token = auth.split(" ")[1];
		try {
			req.user = jwt.verify(token, process.env.APP_KEY);
			return next();
		} catch (error) {
			response.message = error.message;
			if (error.name != "TokenExpiredError") {
				response.code = 403;
			}
			res.status(response.code).send(response);
		}
	}

	res.status(response.code).send(response);
}

module.exports = auth;
