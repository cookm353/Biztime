const db = require('../db')

class Invoice {
    static async get(id: number) {
        // Return specified invoice
        const results = await db.query(
            `SELECT id, amt, paid, add_date, paid_date, comp_code, name, description
            FROM invoices JOIN companies
                ON comp_code = code
            WHERE id = $1`, [id]
        )
        
        return results
    }

    static async getAll() {
        // Return all invoices
        return db.query('SELECT id, comp_code FROM invoices')
    }

    static async add(compCode: string, amt: number) {
        // Add a new invoice
        return db.query(
            `INSERT INTO invoices (comp_code, amt)
            VALUES ($1, $2)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [compCode, amt]
        )
    }

    static async update(id: number, amt: number) {
        // Update invoice amount
        const results = await Invoice.exists(id)
        if(!results) return "Not found"

        return db.query(
            `UPDATE invoices SET amt=$1
            WHERE id = $2
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [amt, id]
        )
    }

    static async delete(id: number) {
        // Remove specified invoice
        const exists = await Invoice.exists(id)
        if (!exists) return "Not found"

        return db.query(
            'DELETE FROM invoices WHERE id = $1',
            [id]
        )
    }

    static async exists(id: number) {
        const results = await Invoice.get(id)

        if (!results.rows[0]) {
            return false
        }

        return results
    }
}

module.exports = Invoice