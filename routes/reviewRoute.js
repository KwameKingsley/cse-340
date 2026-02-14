const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const regValidate = require("../utilities/review-validation")
const utilities = require("../utilities/")

// Add the rules and the check to the route middleware chain
router.post(
    "/add",
    utilities.checkLogin,
    regValidate.reviewRules(),
    regValidate.checkReviewData,
    utilities.handleErrors(reviewController.postReview)
)

// Edit View
router.get("/edit/:review_id", utilities.checkLogin, utilities.handleErrors(reviewController.editReviewView))

// Update Process
router.post("/update",
    utilities.checkLogin,
    regValidate.reviewRules(),
    regValidate.checkReviewData,
    utilities.handleErrors(reviewController.updateReview)
)

// Delete View (Confirmation)
router.get("/delete/:review_id", utilities.checkLogin, utilities.handleErrors(reviewController.deleteReviewView))

// Delete Process
router.post("/delete", utilities.checkLogin, utilities.handleErrors(reviewController.deleteReview))

module.exports = router