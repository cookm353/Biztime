const express = require('express');
const ExpressError = require('../expressError');
const industry = require('../models/industry');
const company = require('../models/company');
const db = require('../db');
const industryRouter = express.Router();
industryRouter.get('/', async function list(req, resp, next) {
    try {
        const results = await industry.getAll();
        return resp.json({ industries: results.rows });
    }
    catch (err) {
        return next(err);
    }
});
industryRouter.get('/:code', async function get(req, resp, next) {
    try {
        const { code } = req.params;
        const industryResults = await industry.get(code);
        let companyCodes = await company.getByIndustry(code);
        const industryDetails = industryResults.rows[0];
        companyCodes = companyCodes.rows.reduce((codesArr, currCode) => {
            codesArr.push(currCode.code);
            return codesArr;
        }, []);
        console.log(companyCodes);
        industryDetails.company_codes = companyCodes;
        return resp.json({ industry: industryDetails });
    }
    catch (err) {
        return next(err);
    }
});
industryRouter.post('/', async function add(req, resp, next) {
    try {
        const { name } = req.body;
        if (!name) {
            throw new ExpressError("Must include industry name", 400);
        }
        const result = await industry.add(name);
        return resp.status(201).json(result.rows[0]);
    }
    catch (err) {
        return next(err);
    }
});
industryRouter.post('/:code', async function associateBusiness(req, resp, next) {
    // Associate a business with an industry
    try {
        const { code } = req.params;
        const { compCode } = req.body;
        const industryExists = await industry.exists(code);
        const compExists = await company.exists(compCode);
        if (!industryExists) {
            throw new ExpressError("Invalid industry code", 400);
        }
        else if (!compExists) {
            throw new ExpressError("Invalid company code", 400);
        }
        const result = await industry.addToIndustry(code, compCode);
        return resp.status(201).json(result.rows[0]);
    }
    catch (err) {
        return next(err);
    }
});
module.exports = industryRouter;
