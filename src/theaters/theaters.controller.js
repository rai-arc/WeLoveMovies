const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//This function lists the theaters and also adds the movies found at the each theater
async function list(req, res) {
  const data = await service.list()
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
};