const invoice = require('./invoice');
const db = require('../db');
class Company {
    static async get(code) {
        // Return specified company or 404
        // const exists = Company.exists(code)
        const result = await db.query(`SELECT code, name, description, id
            FROM companies JOIN invoices
                ON code = comp_code
            WHERE code = $1`, [code]);
        return result;
    }
    static async getAll() {
        // Return all companies
        return db.query('SELECT * FROM companies');
    }
    static async add(code, name, description) {
        // Add a new company
        return db.query(`INSERT INTO companies (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING code, name, description`, [code, name, description]);
    }
    static async update(code, name, description) {
        // Update a company
        const results = await Company.exists(code);
        if (!results)
            return "Not found";
        const currName = results.rows[0].name;
        const currDescription = results.rows[0].description;
        if (!name) {
            name = currName;
        }
        else if (!description) {
            description = currDescription;
        }
        return db.query(`UPDATE companies SET name=$1, description=$2
            WHERE code = $3
            RETURNING code, name, description`, [name, description, code]);
    }
    static async delete(code) {
        // Delete a given company
        const exists = await Company.exists(code);
        if (!exists)
            return "Not found";
        return db.query('DELETE FROM companies WHERE code = $1', [code]);
    }
    static async exists(code) {
        const results = await Company.get(code);
        if (!results.rows[0]) {
            return false;
        }
        return results;
    }
}
module.exports = Company;
