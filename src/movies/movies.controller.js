const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//This function does a check if the movie exists and will continue to the next function if it does. Otherwise it will return an error
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: `Movie cannot be found.` });
}

//This function lists all movies. If query is_showing === "true" then it will only list currently showing movies
async function list(req, res) {
    if (req.query && req.query.is_showing === "true") {
        const moviesNowShowing = await service.listShowing()
        res.json({data: moviesNowShowing})
        }
else{
  const data = await service.list()
  res.json({ data: data });
}
}

//This function will read and return movie data if movieExists passed, using the same data
async function read(req, res) {
  const { movie } = res.locals;
  res.json({ data: movie });
}

//This function returns data on the theaters that have the provided movieId taken from the movieExists function
async function readTheaters(req, res) {
    const movieId = res.locals.movie.movie_id;
    const theaters = await service.readTheaters(movieId)
    res.json({ data: theaters });
  }

//This function returns data on the reviews that have the provided movieId taken from the movieExists function
async function readReviews(req, res) {
  const movieId = res.locals.movie.movie_id;
    const movieReviews = await service.readReviews(movieId)
    res.json({ data: movieReviews });
  }

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  readTheaters: [asyncErrorBoundary(movieExists), readTheaters],
  readReviews: [asyncErrorBoundary(movieExists), readReviews]
};