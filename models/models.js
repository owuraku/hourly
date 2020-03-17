const bookshelf = require("./dbconn");
const jwt = require("jsonwebtoken");

const User = bookshelf.model("User", {
	tableName: "users",
	uuid: true,
	hidden: ["password"],
	attendance() {
		return this.hasMany(Attendance);
	},
	mask: {
		nameOnly: "fullname"
	},
	generateToken() {
		return jwt.sign(
			{
				name: this.attributes.fullname,
				role: this.attributes.role
			},
			process.env.APP_KEY ||
				"$2b$10$cae294uO/E3sMcKTMPfPLuXkPRsJqVTpEA0UyN2Smpis01AY1EJgy"
		);
	}
});

const Attendance = bookshelf.model("Attendance", {
	tableName: "attendance",
	uuid: true,
	user() {
		return this.belongsTo(User);
	}
});

module.exports.bookshelf = bookshelf;
module.exports.User = User;
module.exports.Attendance = Attendance;
