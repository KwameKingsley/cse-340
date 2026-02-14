const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewCont = {}

/* ***************************
 * Process Add Review
 * ************************** */
reviewCont.postReview = async function (req, res) {
    const { review_text, inv_id, account_id } = req.body
    const result = await reviewModel.addReview(review_text, inv_id, account_id)

    if (result) {
        req.flash("notice", "Thank you! Your review has been submitted.")
        res.redirect(`/inv/detail/${inv_id}`)
    } else {
        req.flash("notice", "Sorry, there was an error submitting your review.")
        res.redirect(`/inv/detail/${inv_id}`)
    }
}

/* ***************************
 * Deliver Delete Confirmation View
 * ************************** */
reviewCont.deleteReviewView = async function (req, res) {
    const review_id = parseInt(req.params.review_id)
    const reviewData = await reviewModel.getReviewById(review_id)

    // Security check
    if (!reviewData || reviewData.account_id !== res.locals.accountData.account_id) {
        req.flash("notice", "You are not authorized to delete this review.")
        return res.redirect("/account/")
    }

    let nav = await utilities.getNav()
    res.render("review/delete-confirm", {
        title: "Delete Review",
        nav,
        review_date: new Date(reviewData.review_date).toLocaleDateString(),
        review_text: reviewData.review_text,
        review_id: reviewData.review_id,
        errors: null,
    })
}

/* Deliver Edit Review View */
reviewCont.editReviewView = async function (req, res) {
    const review_id = parseInt(req.params.review_id)
    const reviewData = await reviewModel.getReviewById(review_id)

    if (!reviewData || reviewData.account_id !== res.locals.accountData.account_id) {
        req.flash("notice", "You are not authorized to edit this.")
        return res.redirect("/account/")
    }

    let nav = await utilities.getNav()
    res.render("review/edit-review", {
        title: "Edit Review",
        nav,
        review_text: reviewData.review_text,
        review_id: reviewData.review_id,
        errors: null,
    })
}

/* Process Update */
reviewCont.updateReview = async function (req, res) {
    const { review_id, review_text } = req.body
    const result = await reviewModel.updateReview(review_id, review_text)

    if (result) {
        req.flash("notice", "Review updated.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Update failed.")
        res.redirect(`/review/edit/${review_id}`)
    }
}

/* ***************************
 * Process Review Delete
 * ************************** */
reviewCont.deleteReview = async function (req, res) {
    const review_id = parseInt(req.body.review_id)
    const result = await reviewModel.deleteReview(review_id)

    if (result) {
        req.flash("notice", "The review was successfully deleted.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the delete failed.")
        res.redirect("/account/")
    }
}


module.exports = reviewCont