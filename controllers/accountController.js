const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// Build Login View
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

// Build Register View
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ********************
* Process Registration
* ******************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Register",
            nav,
            errors: null,
        })
        return
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Register",
            nav,
            errors: null,
        })
    }
}

/* ********************
* Process Login
* ******************** */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === "development") {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        } else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error("Access Forbidden")
    }
}

/* ********************
* Deliver Account Management View
* ******************** */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    const messages = req.flash("notice")
    res.render("account/management", {
        title: "Account Management",
        nav,
        notice: messages,
        errors: null,
    })
}

/* ********************
* Process Logout
* ******************** */
async function accountLogout(req, res, next) {
    res.clearCookie("jwt")
    res.redirect("/")
}

/* ***************************
 * Account Update View
 * ************************** */
async function buildAccountUpdateView(req, res, next) {
    const account_id = parseInt(req.params.account_id)
    let nav = await utilities.getNav()

    const accountData = await accountModel.getAccountById(account_id)

    res.render("account/account-update", {
        title: "Edit Account",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_id: accountData.account_id,
    })
}

/* ****************************************
* Process Account Update
* *************************************** */
async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)

    if (updateResult) {
        const accountData = await accountModel.getAccountById(account_id)
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

        req.flash("notice", `Congratulations, your information has been updated.`)
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/account-update", {
            title: "Edit Account",
            nav,
            errors: null,
            accountData: { account_firstname, account_lastname, account_email, account_id }
        })
    }
}

/* ****************************************
* Process Password Update
* *************************************** */
async function updatePassword(req, res) {
    let nav = await utilities.getNav()
    const { account_password, account_id } = req.body

    let hashedPassword = await bcrypt.hashSync(account_password, 10)
    const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

    if (updateResult) {
        req.flash("notice", `Password updated successfully.`)
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the password update failed.")
        res.status(501).redirect(`/account/update/${account_id}`)
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, accountLogout, buildAccountUpdateView, updateAccount, updatePassword };