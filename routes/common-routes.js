const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("./../models/models");

const credentialsSchema = Joi.object({
	username: Joi.string()
		.required()
		.min(5)
		.max(50),
	password: Joi.string()
		.required()
		.min(5)
		.max(50)
});

function validateUserCredentials(credentials, res) {
	const result = Joi.validate(credentials, credentialsSchema);
	if (!result.error) return true;
	const {
		error: {
			details: [{ message: errorMessage = null }]
		}
	} = result;
	if (errorMessage) {
		res.locals.code = 422;
		res.locals.success = false;
		res.locals.error = errorMessage;
		res.locals.message = "Validation Error";
	}
	return false;
}

router.post("/login", async (req, res, next) => {
	//login
	const { ...credentials } = req.body;
	if (!validateUserCredentials(credentials, res)) {
		next();
	}
	User.forge({ username: credentials.username })
		.fetch({ require: false, hidden: [""] })
		.then(async ruser => {
			res.locals.message = "Invalid username/password";
			res.locals.success = false;

			try {
				const { attributes: user } = ruser;
				const validPassword = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (validPassword) {
					res.locals.message = "Token retrieved";
					res.locals.success = null;
					res.locals.code = 200;
					//console.log(ruser);
					res.locals.data = ruser.generateToken();
					//res.locals.data = token;
				}
			} catch (error) {}
		})
		.catch(err => {
			res.locals.success = false;
			res.locals.code = 500;
			res.locals.error = err;
			res.locals.message = "Something went wrong";
		})
		.finally(() => next());
});

module.exports = router;
