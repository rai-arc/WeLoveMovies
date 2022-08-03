const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//This function allows the list function to have multiple "movies" arrays
const addMovies = reduceProperties("theater_id", {
  rating: ["movies", null, "rating"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  title: ["movies", null, "title"],  
});

//This function joins the theaters, movies_theaters, and movies tables to obtain data
function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select("t.*", "m.rating", "m.runtime_in_minutes", "m.title")
    .then(theaters => addMovies(theaters))
}

module.exports = {
  list,
};
