const express = require('express')
const expressError = require('../expressError')
const company = require("../models/company")
const db = require('../db')

let companyRouter = express.Router()

interface companyinfo {
    code: string,
    name: string,
    description: string,
    invoices: Array<number>
}

companyRouter.get("/:code", async function get(req, resp, next) {
    // Return specified company
    try {
        const { code } = req.params
        const results = await company.get(code)

        if (!results.rows[0]) {
            return next()
        }

        const invoiceIds = results.rows.reduce((ids, row) => {
            ids.push(row.id)
            return ids
        }, [])
        
        const companyinfo: companyinfo = {
            code: results.rows[0].code,
            name: results.rows[0].name,
            description: results.rows[0].description,
            invoices: invoiceIds

        }

        return resp.json({"company": companyinfo})
    } catch (err) {
        return next(err)
    }
})

companyRouter.get("/", async function list(req, resp, next) {
    // Return all companies
    try {
        const results = await company.getAll()
        return resp.json({"companies": results.rows})
    } catch (err) {
        return next(err)
    }   
})

companyRouter.post("/", async function add(req, resp, next) {
    // Add new company
    try {
        const {name, description} = req.body

        if (!name || !description) {
            throw new expressError("Must include company name and description", 400)
        }
        const result = await company.add(name, description)
        return resp.status(201).json({company: result.rows[0]})
    } catch (err) {
        return next(err)
    }
})

companyRouter.put("/:code", async function update(req, resp, next) {
    // Update a company's info
    try {
        const {code} = req.params
        const {name, description} = req.body

        if (!name && !description) {
            throw new expressError("Must include either name or description", 400)
        }
        const result = await company.update(code, name, description)

        if (result === "Not found") {
            throw new expressError("Company not found", 404)
        }
        return resp.json({company: result.rows[0]})

    } catch (err) {
        return next(err)
    }
})

companyRouter.delete("/:code", async function remove(req, resp, next) {
    // Delete a company
    try {
        const {code} = req.params
        const result = await company.delete(code)

        if (result === "Not found") {
            throw new expressError("Company not found", 404)
        }
        return resp.json({status: "deleted"})
    } catch (err) {
        return next(err)
    }
})

module.exports = companyRouter;