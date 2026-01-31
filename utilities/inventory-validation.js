const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .isAlpha()
            .withMessage("Classification name must correct and alphabetical.")
    ]
}

/* **********************************
 * Inventory Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        // Classification is required
        body("classification_id").notEmpty().withMessage("Please select a classification."),

        // Make and Model
        body("inv_make").trim().isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
        body("inv_model").trim().isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),

        // Year must be 4 digits
        body("inv_year").trim().isInt({ min: 1900, max: 2099 }).withMessage("Please enter a valid year."),

        // Price and Miles must be numbers
        body("inv_price").trim().isDecimal().withMessage("Price must be a decimal or integer."),
        body("inv_miles").trim().isInt().withMessage("Miles must be digits only."),

        // Color and Description
        body("inv_color").trim().notEmpty().withMessage("Color is required."),
        body("inv_description").trim().notEmpty().withMessage("Description is required.")
    ]
}

validate.checkInvData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Vehicle",
            nav,
            classificationSelect,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
        })
        return
    }
    next()
}

/* ******************************
 * Check classification data and return errors or continue
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = validate    
