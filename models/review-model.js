const pool = require("../database/")

async function addReview(review_text, inv_id, account_id) {
    try {
        const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
        return await pool.query(sql, [review_text, inv_id, account_id])
    } catch (error) {
        return error.message
    }
}

async function getReviewsByInvId(inv_id) {
    try {
        const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM review r JOIN account a ON r.account_id = a.account_id 
                 WHERE r.inv_id = $1 ORDER BY r.review_date DESC`
        const data = await pool.query(sql, [inv_id])
        return data.rows
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Get review by ID
 * ************************** */
async function getReviewById(review_id) {
    try {
        const sql = "SELECT * FROM review WHERE review_id = $1"
        const result = await pool.query(sql, [review_id])
        return result.rows[0]
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Update review text
 * ************************** */
async function updateReview(review_id, review_text) {
    try {
        const sql = "UPDATE review SET review_text = $1, review_date = NOW() WHERE review_id = $2 RETURNING *"
        return await pool.query(sql, [review_text, review_id])
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Delete a review
 * ************************** */
async function deleteReview(review_id) {
    try {
        const sql = "DELETE FROM review WHERE review_id = $1"
        return await pool.query(sql, [review_id])
    } catch (error) {
        return error.message
    }
}

/* ***************************
 * Get reviews by Account ID
 * ************************** */
async function getReviewsByAccountId(account_id) {
    try {
        const sql = `SELECT r.*, i.inv_make, i.inv_model 
                 FROM review r 
                 JOIN inventory i ON r.inv_id = i.inv_id 
                 WHERE r.account_id = $1 
                 ORDER BY r.review_date DESC`
        const result = await pool.query(sql, [account_id])
        return result.rows
    } catch (error) {
        return error.message
    }
}



module.exports = {
    addReview,
    getReviewsByInvId,
    getReviewById,
    updateReview,
    deleteReview,
    getReviewsByAccountId,
}