const knex = require("../db/connection");

const mapProperties = require("../utils/map-properties");

//This function uses Lodash to add a nested object for "critic"
const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
    created_at: "critic.created_at",
    updated_at: "critic.updated_at",
});

//This function lists all the columns from the movies table
function list() {
  return knex("movies")
    .select("*")
}

//This function lists all the columns from the movies table that are showing in theaters
function listShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .distinct("m.*")
      .where({ "is_showing": true })
  }

//This function reads a single movie that matches the movieId and returns it
function read(movieId) {
  return knex("movies")
    .select("*")
    .where({ "movie_id": movieId })
    .first();
}

//This function reads a movie and returns in which theaters the movie is playing
function readTheaters(movieId) {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
      .select("t.*", "mt.is_showing", "m.movie_id")
      .where({ "mt.movie_id": movieId })
  }

//This function returns reviews for the matching movie and also includes critic data matching each review
function readReviews(movieId) {
    return knex("reviews as r")
        .join("movies as m", "r.movie_id", "m.movie_id")
        .join("critics as c", "r.critic_id", "c.critic_id")
      .select("r.*", "c.*")
      .where({"r.movie_id": movieId })
      .then(reviews => reviews.map(review => addCritic(review)));
  }

module.exports = {
  list,
  listShowing,
  read,
  readTheaters,
  readReviews
};
