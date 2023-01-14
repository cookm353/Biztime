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

    static async getByCode(code: string) {
        // Return invoices for specified company
        const results = await db.query(
            `SELECT id, amt, paid, add_date, paid_date, comp_code
            FROM invoices
            WHERE comp_code = $1`, [code]
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

    static async update(id: number, amt: number, paid: boolean) {
        // Update invoice amount
        const results = await Invoice.exists(id)
        const d = new Date()
        if(!results) return "Not found"
        
        const currInvoice = await db.query(
            `SELECT amt, paid
            FROM invoices
            WHERE id = $1`,
            [id]
        )
        
        const currAmt = currInvoice.rows[0].amt
        const isPaid = currInvoice.rows[0].paid

        if ( isPaid === false && Boolean(paid)) {
            return db.query(
                `UPDATE invoices SET amt=$1, paid=$2, paid_date=$3
                WHERE id = $4
                RETURNING id, comp_code, amt, paid, add_date, paid_date`,
                [amt, paid, d, id]
             )
        } else if ( !Boolean(paid) ) {
            return db.query(
                `UPDATE invoices SET amt=$1, paid=$3, paid_date=$4
                WHERE id = $4
                RETURNING id, comp_code, amt, paid, add_date, paid_date`,
                [amt, paid, null, id]
                )
        } else {
            console.log("foo")
            return db.query(
                `UPDATE invoices SET amt=$1
                WHERE id = $2
                RETURNING id, comp_code, amt, paid, add_date, paid_date`,
                [amt, id]
            )
        }
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