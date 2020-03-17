const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const cors = require("cors");
if (dotenv.error) {
	throw new Error("ENV NOT LOADED");
}
const { attendanceRoutes, commonRoutes, userRoutes } = require("./routes");

const _app_folder = "public";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());

app.use("/api/", commonRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use(require("./middleware/response-structure"));

//all other routes go to index.html
// app.use(express.static("public"));
// app.use("*", (req, res) => {
// 	res.sendFile("/", { root: _app_folder });
// });

app.listen(process.env.PORT || 3000);
