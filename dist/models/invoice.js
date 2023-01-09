class Invoice {
    compCode;
    amt;
    paid;
    addDate;
    paidDate;
    constructor(compCode, amt, paid = false, paidDate = null) {
        this.compCode = compCode;
        this.amt = amt;
        this.paid = paid;
        this.paidDate = paidDate;
    }
    static get(id) {
        // Return specified invoice
    }
    static getAll() {
        // Return all invoices
    }
    static add(compCode, amt) {
        // Add a new invoice
    }
    static update(id, amt) {
        // Update invoice amount
    }
    static delete(id) {
        // Remove specified invoice
    }
}
