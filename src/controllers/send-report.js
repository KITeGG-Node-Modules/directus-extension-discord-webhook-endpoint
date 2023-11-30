import sanitizeHtml from "sanitize-html";

function checkNestedProperty(obj, key) {
	const keys = key.split(".");
	return keys.every((k) => obj && (obj = obj[k]) !== undefined);
}

async function sendReport(payload) {
	let { req, res, env } = payload;

	const mandatoryFields = [
		{ key: "email", message: "Email is required" },
		{ key: "platform", message: "Platform is required" },
		{ key: "platform.name", message: "Platform name is required" },
		{ key: "platform.version", message: "Platform version is required" },
		{ key: "platform.os", message: "Platform OS is required" },
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
using ${req.body.platform.name} ${req.body.platform.version} on ${req.body.platform.os}
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
