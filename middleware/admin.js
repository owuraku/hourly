function admin(req, res, next) {
	if (req.user.role === "admin") {
		return next();
	}
	const response = {
		success: false,
		error: "Forbidden",
		message: "You don't have enough permissions for this operation",
		data: [],
		code: 403
	};
	res.status(response.code).send(response);
}

module.exports = admin;
