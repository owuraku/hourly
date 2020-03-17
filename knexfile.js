// Update with your config settings.
const dotenv = require("dotenv").config();

module.exports = {
	development: {
		client: "sqlite3",
		connection: {
			filename: "./dev.sqlite3"
		}
	},

	staging: {
		client: process.env.DB_CLIENT,
		connection: {
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "knex_migrations"
		}
	},

	production: {
		client: "postgresql",
		connection: {
			database: "my_db",
			user: "username",
			password: "password"
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "knex_migrations"
		}
	}
};
