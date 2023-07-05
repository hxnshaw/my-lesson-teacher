const notFound = (req, res) => res.status(404).send("ROUTE DOES NOT EXIST");

module.exports = notFound;
