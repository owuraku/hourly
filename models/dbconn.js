const dotenv = require("dotenv").config();

if (dotenv.error) {
	throw new Error("ENV NOT LOADED");
}

function getConn() {
	const config = { client: "sqlite3", connection: {} };
	if (process.env.NODE_ENV == "development") {
		config.connection.filename = "./../dev.sqlite3";
	} else {
		config.client = process.env.DB_CLIENT || "mysql";
		config.connection.host = process.env.DB_HOST;
		config.connection.user = process.env.DB_USER;
		config.connection.password = process.env.DB_PASSWORD;
		config.connection.database = process.env.DB_NAME;
	}

	return config;
}

const knex = require("knex")(getConn());
const bookshelf = require("bookshelf")(knex);
const mask = require("bookshelf-mask");

bookshelf.plugin(mask);
//bookshelf.plugin(require("bookshelf-uuid"));
module.exports = bookshelf;
