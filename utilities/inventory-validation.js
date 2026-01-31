const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .isAlpha()
            .withMessage("Classification name must be one word with no spaces or special characters.")
    ]
}

/* ******************************
 * Check classification data and return errors or continue
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
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
