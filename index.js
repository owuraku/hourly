const express = require("express");

const app = express();

app.get("/", (req, res) => {
	res.send("Hello world");
});

app.get("/users", (req, res) => {
	res.send(
		JSON.stringify({
			success: true,
			message: "User data retrieved successfully",
			error: null,
			data: [
				{ id: 1, name: "Kofi" },
				{ id: 2, name: "Ama" }
			]
		})
	);
});

app.get("/attendance", (req, res) => {
	res.send(
		JSON.stringify({
			success: true,
			message: "Attendance data retrieved successfully",
			error: null,
			data: [
				{
					id: 1,
					userid: 1,
					date: "2020-03-10",
					clockin: "08:00",
					clockout: "17:00",
					hours: 8
				},
				{
					id: 2,
					userid: 2,
					date: "2020-03-10",
					clockin: "08:00",
					clockout: "17:00",
					hours: 8
				}
			]
		})
	);
});

app.post("/users", (req, res) => {
	console.log(req);
	res.send();
});

app.listen(process.env.PORT || 3000);
