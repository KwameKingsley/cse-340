// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// --- PUBLIC ROUTES ---
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build specific inventory item detail view
router.get("/detail/:invId", invController.buildByInvId);

// --- PROTECTED AUTHORIZATION ROUTES ---
// Route to deliver Inventory Management view
router.get("/",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagement));

// Route to deliver Add Classification view
router.get("/addClassification",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddClassification));

// Route to deliver Add Vehicle view
router.get("/addInventory",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddInventory));

// Route to process the New Classification with validation
router.post(
    "/addClassification",
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification));

// Route to process the inventory 
router.post(
    "/addInventory",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addVehicle));

/* ***************************
 * Build Edit Inventory view
 * ************************** */
router.get("/edit/:inv_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.editInventoryView));

/* ***************************
 * Process Inventory Update
 * ************************** */
router.post(
    "/update",
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

/* ***************************
 * Deliver Delete Confirmation View
 * ************************** */
router.get("/delete/:inv_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteView))

/* ***************************
 * Process Delete Inventory
 * ************************** */
router.post("/delete",
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory))

// JSON and Error triggers
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));
router.get("/getInventory/:classification_id",
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON));

module.exports = router;