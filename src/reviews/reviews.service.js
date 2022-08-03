const knex = require("../db/connection");

const mapProperties = require("../utils/map-properties");
//This function uses Lodash to add a nested object for "critic"
const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

//This function returns a single review with the corresponding reviewId
function read(reviewId) {
  return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .first();
}

//This function uses read and mapProperties to return the data of the updated review, as SQLite3 does not return data from updated forms
function readWithCritic(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.review_id" : reviewId })
    .first()
    .then(updatedRecord => addCritic(updatedRecord))
}

//This function updates the database with the corresponding reviewId
function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id : updatedReview.review_id })
    .update(updatedReview, "*")
}

//This function deletes the corresponding data with the correct reviewId
function destroy(reviewId) {
  return knex("reviews")
    .where({ review_id: reviewId })
    .del();
}

module.exports = {
  read,
  readWithCritic,
  update,
  delete: destroy,
};
