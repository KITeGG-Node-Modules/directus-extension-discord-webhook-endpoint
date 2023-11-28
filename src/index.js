export default (router, { env }) => {
	router.get("/", (req, res) => res.send("Hello, World!"));
};
