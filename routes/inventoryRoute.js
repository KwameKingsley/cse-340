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

// Route to deliver Add Vehicle view
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory));

// Route to process the inventory 
router.post(
    "/addInventory",
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addVehicle));

// Route to process the New Classification with validation
router.post(
    "/addClassification",
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification));

/* ***************************
 * Process Inventory Update
 * ************************** */
router.post(
    "/update",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route to Return JSON instead of HTML
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

/* ***************************
 * Build Edit Inventory view
 * ************************** */
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));


module.exports = router;