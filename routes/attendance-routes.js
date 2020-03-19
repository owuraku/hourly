const express = require("express");
const Joi = require("joi");
const { Attendance, User } = require("./../models/models");
const {
	bookshelf: { knex }
} = require("./../models/models");
const router = express.Router();
const testValidationError = require("./../common-functions");
const admin = require("./../middleware/admin");
const attendanceSchema = Joi.object({
	id: Joi.number(),
	user_id: Joi.number().required(),
	date: Joi.date().required(),
	clockin: Joi.string()
		.regex(/^([0-9]{2})\:([0-9]{2})$/)
		.required(),
	clockout: Joi.string()
		.regex(/^([0-9]{2})\:([0-9]{2})$/)
		.required()
});

const setErrors = (err, res) => {
	res.locals.success = false;
	res.locals.error = err.message;
	res.locals.message = "Error retrieving attendance.";
	res.locals.code = 500;
};

function validateAttendance(attendance, res) {
	const result = Joi.validate(attendance, attendanceSchema);
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

router.get("/", admin, async (req, res, next) => {
	const { ...queryString } = await req.query;

	//to filter statistical data
	if (queryString.filter === "true") {
		const { user, toDate, fromDate } = queryString;
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
				.whereBetween("date", [fromDate, toDate])
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
				console.log(r);
				res.locals.data = r;
			})
			.catch(err => setErrors(err, res))
			.finally(() => next());
	}

	//attendance query
	const attendanceQuery = Attendance.query(function(qb) {
		qb.leftJoin("users", "users.id", "attendance.user_id")
			.select(
				knex.raw("HOUR( TIMEDIFF( `clockout`, `clockin` ) ) - 1 as hours")
			)
			//.select(knex.raw("CONVERT(varchar, date, 106) as date"))
			.select(
				"clockin",
				"clockout",
				"users.username",
				"date",
				"users.fullname"
			);
	});

	//for pagination
	if (queryString.paginate === "true") {
		if (queryString.search !== "false") {
			attendanceQuery.where("users.username", "=", queryString.search);
		}

		attendanceQuery
			.orderBy("date", "asc")
			.fetchPage({ page: queryString.page, pageSize: queryString.pageSize })
			.then(attendance => {
				const data = {
					data: attendance.toJSON(),
					pagination: attendance.pagination
				};
				console.log(data);
				res.locals.data = data; //.mask("*,user(id,fullname)");
				res.locals.message = "Attendance retrieved successfully";
			})
			.catch(err => setErrors(err, res))
			.finally(() => {
				next();
			});
	}

	//for all results
	attendanceQuery
		.fetchAll()
		.then(attendance => {
			res.locals.data = attendance; //.mask("*,user(id,fullname)");
			res.locals.message = "Attendance retrieved successfully";
		})
		.catch(err => setErrors(err, res))
		.finally(() => {
			next();
		});
});

router.get("/:id", (req, res, next) => {
	//get users
	res.send("a user" + req.params.id);
});

//record attendance
router.post("/", (req, res, next) => {
	const data = req.body;
	const attendance = {
		user_id: req.user.id,
		date: data.date,
		clockin: data.clockin,
		clockout: data.clockout
	};

	if (!validateAttendance(attendance, res)) {
		next();
	}

	// Attendance.where({ date: "2020-12-12", user_id: attendance.user_id })
	// 	.fetch({ require: false })
	// 	.then(result => console.log(result))
	// 	.finally(() => next());

	Attendance.where({ date: attendance.date, user_id: attendance.user_id })
		.fetch({ require: false })
		.then(result => {
			if (result === null) {
				console.log("response empty-->creating");
				Attendance.forge(attendance)
					.save()
					.then(result => {
						res.locals.message = "Attendance logged successfully";
						res.locals.data = result;
					})
					.catch(err => setErrors(err, res))
					.finally(() => next());
			} else {
				res.locals.success = false;
				res.locals.message = `Attendance data already available for ${attendance.date}`;
				res.locals.code = 422;
				next();
			}
		})
		.catch(err => setErrors(err, res))
		.finally(() => next());
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
