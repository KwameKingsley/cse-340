const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ***************************
 * Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id)
    const detailHtml = await utilities.buildVehicleDetail(data)
    let nav = await utilities.getNav()
    const vehicleName = `${data.inv_make} ${data.inv_model}`
    res.render("./inventory/detail", {
        title: vehicleName,
        nav,
        detailHtml,
    })
}

/* ***************************
 * Intentional Error Controller
 * ************************** */
invCont.triggerError = async function (req, res, next) {
    const error = new Error("Intentional Server Error for Testing")
    error.status = 500
    next(error)
}

/* ***************************
 * Deliver Inventory Management View
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null,
    })
}

/* ***************************
 * Deliver Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
    })
}

/* ***************************
* Process Add Classification
* ************************** */
invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result) {
        let nav = await utilities.getNav()
        req.flash("notice", `The classification ${classification_name} was added successfully.`)
        res.status(201).render("inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", `Sorry, adding the classification ${classification_name} failed.`)
        res.status(501).render("inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        })
    }
}

module.exports = invCont