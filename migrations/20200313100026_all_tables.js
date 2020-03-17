exports.up = function(knex) {
	return knex.schema
		.createTable("users", function(table) {
			table.string("fullname");
			table.string("username").unique();
			table.string("password");
			table.string("role").defaultsTo("user");
			table
				.increments("id")
				.unsigned()
				.primary();
		})
		.createTable("attendance", function(table) {
			table
				.increments("id")
				.unsigned()
				.primary();
			table.date("date");
			table.time("clockin");
			table.time("clockout");
			table.integer("user_id").unsigned();
			table.foreign("user_id").references("users.id");
		})
		.createTable("attendanceprojects", function(table) {
			table.increments("id").primary();
			table.integer("attendance_id").unsigned();
			table.foreign("attendance_id").references("attendance.id");
			table.string("project_name");
		});
};

exports.down = function(knex) {
	knex.schema
		.dropTable("attendanceprojects")
		.dropTable("attendance")
		.dropTable("users");
};
