const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//This function allows the list function to have multiple "movies" arrays
const addMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  created_at: ["movies", null, "m.created_at"],
  updated_at: ["movies", null, "m.updated_at"],
  is_showing: ["movies", null, "is_showing"],
  theater_id: ["movies", null, "theater_id"]
});

//This function joins the theaters, movies_theaters, and movies tables to obtain data
function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select("t.*", "m.rating", "m.runtime_in_minutes", "m.title", "m.image_url", "m.movie_id", "m.description", "m.created_at as m.created_at", "m.updated_at as m.updated_at")
    .then(theaters => addMovies(theaters))
}

module.exports = {
  list,
};
