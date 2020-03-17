exports.seed = function(knex) {
	// Deletes ALL existing entries
	return knex("users")
		.del()
		.then(function() {
			// Inserts seed entries
			console.log("deleted all entries in table");
			return knex("users").insert([
				{
					fullname: "Owura Ku",
					username: "peezee",
					password: "password",
					role: "admin"
				},
				{ fullname: "Awura kua", username: "legendary", role: "user" },
				{ fullname: "Ama Boatemaa", username: "mywoman", role: "user" }
			]);
		});
};
