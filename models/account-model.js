const pool = require("../database")

/* ****************
* Register a new account
******************************/
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* *********************
* Check for existing email
************************/
async function checkExistingEmail(email) {
    try {
        const sql = "SELECT inv_email FROM public.inventory WHERE inv_email = $1"
        const email = await pool.query(sql, [account_email])
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* *********************
* Return account data by email address
************************/
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
            [account_email]
        )
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found.")
    }
}

/* ********************* 
* Add New Classification
*******************************/
async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}

module.exports = { registerAccount, checkExistingEmail, addClassification, getAccountByEmail };