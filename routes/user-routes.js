const express = require("express");
const Joi = require("joi");
const _ = require("lodash");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("./../models/models");
const {
	bookshelf: { knex }
} = require("./../models/models");
const userSchema = Joi.object({
	id: Joi.string(),
	fullname: Joi.string()
		.required()
		.min(6),
	role: Joi.string().required(),
	password: Joi.string()
		.required()
		.min(6),
	username: Joi.string().required(),
	confirm_password: Joi.any()
		.valid(Joi.ref("password"))
		.required()
});

function validateUser(userObject, res) {
	const result = Joi.validate(userObject, userSchema);
	if (result.error == null) return true;
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

router.get("/", (req, res, next) => {
	//get users
	const { ...queryString } = req.query;

	//search for users
	if (queryString.search === "true") {
		User.where("username", "like", `%${queryString.username}%`)
			.fetchAll({ columns: ["fullname", "username", "id"] })
			.then(result => {
				res.locals.data = result.toJSON();
			})
			.catch(err => {
				console.log(err);
				res.locals.error = err;
			})
			.finally(() => next());
	}

	if (queryString.filter === "true") {
		const { user } = queryString.user;
	}

	//if (queryString.hasOwnKey('aggregate')){

	User.query(function(qb) {
		qb.innerJoin("attendance", "users.id", "attendance.user_id")
			.min("clockin as earliestEntryTime")
			.max("clockin as latestEntryTime")
			.min("clockout as earliestExitTime")
			.max("clockout as latestExitTime")
			.groupBy("users.id")
			.select("fullname", "username", "user_id")
			.select(knex.raw("MIN(HOUR(TIMEDIFF(`clockout`,`clockin`))) as minhours"))
			.select(knex.raw("MAX(HOUR(TIMEDIFF(`clockout`,`clockin`))) as maxhours"))
			.select(
				knex.raw("SUM(HOUR(TIMEDIFF(`clockout`,`clockin`))) as totalhours")
			)
			.select(knex.raw("COUNT(clockin) as totaldays"))
			.select(
				knex.raw("AVG(HOUR(TIMEDIFF(`clockout`,`clockin`))) as avghours")
			);
	})
		.fetchAll()
		.then(r => {
			//const { attributes: d } = r;
			res.locals.data = r;
			//console.log(d);
		})
		.catch(err => (res.locals.error = err))
		.finally(() => next());

	//}

	// User.collection()
	// 	.fetch()
	// 	.then(users => {
	// 		res.locals.data = users;
	// 		res.locals.message = "Users retrieved successfully";
	// 	})
	// 	.catch(err => {
	// 		res.locals.success = false;
	// 		res.locals.message = err;
	// 		res.locals.code = 500;
	// 	})
	// 	.finally(() => {
	// 		next();
	// 	});
});

router.get("/:id", (req, res, next) => {
	//get users
	const userid = req.params.id;
	User.where({ id: userid })
		.fetch()
		.then(model => {
			res.locals.data = model;
			res.locals.message = "User data retrived";
		})
		.catch(err => {
			res.locals.success = false;
			res.locals.error = err.message;
			res.locals.code = 404;
			res.locals.message = `User with id : ${userid} not found`;
		})
		.finally(() => next());
});

//post
//add a user
router.post("/", async (req, res, next) => {
	const { ...user } = req.body;
	if (!validateUser(user, res)) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	User.forge(_.pick(user, ["fullname", "password", "role", "username"]))
		.save()
		.then(user => {
			res.locals.data = user;
			res.locals.message = "User created succesfully";
			res.locals.code = 201;
		})
		.catch(err => {
			res.locals.success = false;
			res.locals.message = "Adding user failed";
			res.locals.error = err;
			res.locals.code = 500;
		})
		.finally(() => next());
});

router.put("/", (req, res, next) => {
	//get user
	//patch
	if (validateUser(user, res)) {
	}
	res.json("patch users");
});

router.delete("/", (req, res, next) => {
	//get user
	//remove
	next("delete users");
});

module.exports = router;
