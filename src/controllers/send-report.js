import sanitizeHtml from "sanitize-html";

async function sendReport(payload) {
	let { req, res, env } = payload;

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
