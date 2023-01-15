const express = require("express");
const morgan = require('morgan');
const app = express();
const ExpressError = require("./expressError");
const companyRouter = require("./routes/companies");
const invoiceRouter = require("./routes/invoices");
const industryRouter = require('./routes/industries');
app.use(express.json());
app.use('/companies', companyRouter);
app.use('/invoices', invoiceRouter);
app.use('/industries', industryRouter);
app.use(morgan());
/** 404 handler */
app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);
    return next(err);
});
/** General error handler */
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    return res.json({
        error: err
    });
});
module.exports = app;
