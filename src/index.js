import { sendReport } from "./controllers/send-report.js";

// ROUTES ----------------------------------------------------------------
export default {
	id: "discord-webhook",
	handler: (router, { env }) => {
		router.post("/report", (req, res) => sendReport({ req, res, env }));
	},
};
