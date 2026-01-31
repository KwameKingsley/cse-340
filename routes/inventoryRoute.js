// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build specific inventory item detail view
router.get("/detail/:invId", invController.buildByInvId);

// Route to trigger intentional 500 error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

// Route to deliver Inventory Management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to deliver Add Classification view
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification));

// Route to process the New Classification with validation
router.post(
    "/addClassification",
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification));


module.exports = router;