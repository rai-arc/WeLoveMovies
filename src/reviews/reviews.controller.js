const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//This function checks if the review is already inside the database and is used to update or delete reviews
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  return next({ status: 404, message: `Review cannot be found.` });
}

//This function updates the corresponding review and returns the data along with critic information
//Sqlite does not return data upon an update request, so a new read service was created to return the data
async function update(req, res) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  }
  await service.update(updatedReview);
  const updatedData = await service.readWithCritic(res.locals.review.review_id);
  res.status(201).json({ data: updatedData });
}

//This function deletes the corresponding review
async function destroy(req, res) {
  const { review } = res.locals;
  await service.delete(review.review_id)
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
};