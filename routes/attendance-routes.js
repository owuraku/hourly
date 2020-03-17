const express = require("express");
const Joi = require("joi");
const { Attendance, User } = require("./../models/models");
const {
	bookshelf: { knex }
} = require("./../models/models");
const router = express.Router();
const testValidationError = require("./../common-functions");

const attendanceSchema = Joi.object({
	id: Joi.number(),
	userid: Joi.number().required(),
	date: Joi.date().required(),
	clockin: Joi.string()
		.regex(/^([0-9]{2})\:([0-9]{2})$/)
		.required(),
	clockout: Joi.string()
		.regex(/^([0-9]{2})\:([0-9]{2})$/)
		.required()
});

router.get("/", (req, res, next) => {
	const { ...queryString } = req.query;
	if (queryString.filter === "true") {
		const { user } = queryString;
		console.log(user);
		let m = User;
		if (user !== "all") {
			m = User.where("users.id", user);
		}

		m.query(function(qb) {
			qb.rightJoin("attendance", "users.id", "attendance.user_id")
				.min("clockin as earliestEntryTime")
				.max("clockin as latestEntryTime")
				.min("clockout as earliestExitTime")
				.max("clockout as latestExitTime")
				.groupBy("users.id")
				.select("fullname", "username", "user_id")
				.select(
					knex.raw("MIN(HOUR(TIMEDIFF(`clockout`,`clockin`))) as minhours")
				)
				.select(
					knex.raw("MAX(HOUR(TIMEDIFF(`clockout`,`clockin`))) as maxhours")
				)
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
	}

	//get users
	Attendance.collection()
		.fetch({ withRelated: "user" })
		.then(attendance => {
			res.locals.data = attendance.mask("*,user(id,fullname)");
			res.locals.message = "attendance retrieved successfully";
		})
		.catch(err => {
			res.locals.success = false;
			res.locals.message = err;
			res.locals.code = 500;
		})
		.finally(() => {
			next();
		});
});

router.get("/:id", (req, res, next) => {
	//get users
	res.send("a user" + req.params.id);
});

router.post("/", (req, res, next) => {
	//add user
	//get user data from req
	//validate user
	//save to database
	const data = req.body;
	const attendance = {
		userid: data.userid,
		date: data.date,
		clockin: data.clockin,
		clockout: data.clockout
	};
	testValidationError(attendance, attendanceSchema, res);
	//console.log();
	next("Success");
});

router.put("/", (req, res, next) => {
	//get user
	//patch
	res.send("patch users");
});

router.delete("/", (req, res, next) => {
	//get user
	//remove
	res.send("delete users");
});

module.exports = router;
