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
        return await resp.json({ invoice: results.rows });
    }
    catch (err) {
        return next(err);
    }
});
invoiceRouter.get("/", async function list(req, resp, next) {
    // Return all invoices
    try {
        const results = await invoice.getAll();
        return resp.json(results.rows);
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
            throw new expressError("Must include company code and invoice amount", 400);
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
        const { amt } = req.body;
        if (!amt) {
            throw new expressError("Must include new invoice amount", 404);
        }
        const result = await (invoice.update(id, amt));
        if (result === "Not found") {
            throw new expressError("Invoice not found", 404);
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
            throw new expressError("Invoice not found", 404);
        }
        return resp.json({ status: "deleted" });
    }
    catch (err) {
        return next(err);
    }
});
module.exports = invoiceRouter;
