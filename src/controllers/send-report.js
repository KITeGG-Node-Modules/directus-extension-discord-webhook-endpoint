import sanitizeHtml from "sanitize-html";

function checkAccess(req, res, logger) {
	if (!req.accountability.user) {
		res.status(401);
		return res.send({ message: "api_errors.unauthorized" });
	} else {
		logger.info("User is authorized");
	}
}

function checkNestedProperty(obj, key) {
	const keys = key.split(".");
	return keys.every((k) => obj && (obj = obj[k]) !== undefined);
}

async function sendReport(payload) {
	let { req, res, env, logger } = payload;

	// Check if user is authorized
	checkAccess(req, res, logger);

	const mandatoryFields = [
		{ key: "email", message: "Email is required" },
		{ key: "system", message: "System is required" },
		{ key: "system.browser", message: "System browser is required" },
		{ key: "system.version", message: "System version is required" },
		{ key: "system.os", message: "System OS is required" },
		{ key: "url", message: "URL is required" },
		{ key: "issue", message: "Issue is required" },
	];

	for (const field of mandatoryFields) {
		if (!checkNestedProperty(req.body, field.key)) {
			res.status(500).send(field.message);
			return;
		}
	}

	let issue = sanitizeHtml(req.body.issue);

	try {
		await fetch(env.DISCORD_WEBHOOK, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: `**${req.body.email}**
using ${req.body.system.browser} ${req.body.system.version} on ${req.body.system.os}
**has the issue:**
${issue}
**on the page:**
${req.body.url}`,
			}),
		});

		res.status(200).send("Report sent");
	} catch (error) {
		res
			.status(500)
			.send(`Sending report failed: ${error.message || "Unknown error"}`);
	}
}

export { sendReport };
