function responseStructure(req, res, next) {
	const s =
		res.locals.success == true || res.locals.success == null ? true : false;
	const response = {
		success: s,
		message: res.locals.message || "",
		data: res.locals.data || [],
		error: res.locals.error || null,
		code: res.locals.code || 200
	};
	res.status(response.code).json(response);
}

module.exports = responseStructure;
