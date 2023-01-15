const express = require('express');
const expressError = require('../expressError');
const invoice = require('../models/invoice');
const db = require('../db');
const invoiceRouter = express.Router();
invoiceRouter.get("/:id", async function get(req, resp, next) {
    // Return specified invoice
    try {
        const { id } = req.params;
        const results = await invoice.get(id);
        if (!results.rows[0]) {
            return next();
        }
        const respObject = {
            id: results.rows[0].id,
            amt: results.rows[0].amt,
            paid: results.rows[0].paid,
            add_date: results.rows[0].add_date,
            paid_date: results.rows[0].paid_date,
            company: {
                code: results.rows[0].comp_code,
                name: results.rows[0].name,
                description: results.rows[0].description
            }
        };
        // return await resp.json({invoice: results.rows[0]})
        return await resp.json({ invoice: respObject });
    }
    catch (err) {
        return next(err);
    }
});
invoiceRouter.get("/", async function list(req, resp, next) {
    // Return all invoices
    try {
        const results = await invoice.getAll();
        return resp.json({ invoices: results.rows });
    }
    catch (err) {
        return next(err);
    }
});
invoiceRouter.post("/", async function add(req, resp, next) {
    // Add a new invoice
    try {
        const { comp_code, amt } = req.body;
        if (!comp_code || !amt) {
            throw new ExpressError("Must include company code and invoice amount", 400);
        }
        const result = await invoice.add(comp_code, amt);
        return resp.status(201).json({ invoice: result.rows[0] });
    }
    catch (err) {
        return next(err);
    }
});
invoiceRouter.put("/:id", async function update(req, resp, next) {
    try {
        const { id } = req.params;
        const { amt, paid } = req.body;
        if (amt === null || !paid) {
            throw new ExpressError("Must include new invoice amount and if it's been paid", 404);
        }
        const result = await (invoice.update(id, amt, paid));
        if (result === "Not found") {
            throw new ExpressError("Invoice not found", 404);
        }
        return resp.json({ invoice: result.rows[0] });
    }
    catch (err) {
        return next(err);
    }
});
invoiceRouter.delete("/:id", async function remove(req, resp, next) {
    try {
        const { id } = req.params;
        const result = await invoice.delete(id);
        if (result === "Not found") {
            throw new ExpressError("Invoice not found", 404);
        }
        return resp.json({ status: "deleted" });
    }
    catch (err) {
        return next(err);
    }
});
module.exports = invoiceRouter;
