const db = require('../db')
const company = require('./company')
const slugify = require('slugify')

class Industry {
    static async get(code: string) {
        // Return specified industry
        
        return db.query(
            `SELECT *
            FROM industries
            WHERE code = $1`,
            [code]
        )
    }

    static async getAll() {
        // Return all industries
        return db.query(`SELECT * FROM industries;`)
    }

    static async add(name: string) {
        // Add a new industry
        const code = slugify(name, {lower: true})
        
        const results = await db.query(
            `INSERT INTO industries (code, industry)
            VALUES ($1, $2)
            RETURNING code, industry`,
            [code, name]
        )
        return results
    }

    static async addToIndustry(indCode: string, compCode: string) {
        const results = await db.query(
            `INSERT INTO company_industries (ind_code, comp_code)
            VALUES ($1, $2)
            RETURNING ind_code, comp_code`,
            [indCode, compCode]
        )

        return results
    }

    static async exists(code: string) {
        const results = await Industry.get(code)

        if (!results.rows[0]) {
            return false
        }

        return true
    }
}

module.exports = Industry