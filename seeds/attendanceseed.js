exports.seed = function(knex) {
	// Deletes ALL existing entries
	return knex("attendance")
		.del()
		.then(function() {
			// Inserts seed entries
			return knex("attendance").insert([
				{
					id: 1,
					date: "2020-03-12",
					clockin: "08:00",
					clockout: "17:00",
					user_id: 1
				},
				{
					id: 2,
					date: "2020-03-13",
					clockin: "08:00",
					clockout: "17:00",
					user_id: 1
				},
				{
					id: 3,
					date: "2020-03-12",
					clockin: "08:00",
					clockout: "17:00",
					user_id: 4
				},
				{
					id: 4,
					date: "2020-03-13",
					clockin: "08:00",
					clockout: "17:00",
					user_id: 4
				}
			]);
		});
};
