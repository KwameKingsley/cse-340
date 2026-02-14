const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* Rules for Review Validation */
validate.reviewRules = () => {
    return [
        body("review_text")
            .trim()
            .isLength({ min: 10 })
            .withMessage("Review must be at least 10 characters long."),
    ]
}

/* Check data and return errors to the view */
validate.checkReviewData = async (req, res, next) => {
    const { review_text, inv_id } = req.body
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const invModel = require("../models/inventory-model")
        const reviewModel = require("../models/review-model")

        // Re-fetch data to rebuild the page
        const data = await invModel.getInventoryByInvId(inv_id)
        const reviews = await reviewModel.getReviewsByInvId(inv_id)
        const detailHtml = await utilities.buildVehicleDetail(data)
        const vehicleName = `${data.inv_make} ${data.inv_model}`

        res.render("inventory/detail", {
            title: vehicleName,
            nav,
            detailHtml,
            inv_id,
            reviews,
            errors,
        })
        return
    }
    next()
}

module.exports = validate