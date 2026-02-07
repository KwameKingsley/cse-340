//Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Login View Route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Register View Route
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Register Account Route
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountController.accountLogin)
)

// Account Management View Route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

// Logout Route
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// GET the account update view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdateView));

// POST the account update
router.post("/update-info", regValidate.updateAccountRules(), regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount));

// POST the password update
router.post("/update-password", regValidate.passwordRules(), regValidate.checkPasswordData, utilities.handleErrors(accountController.updatePassword));


module.exports = router;