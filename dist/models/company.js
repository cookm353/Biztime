class Company {
    code;
    name;
    description;
    constructor(code, name, description) {
        this.code = code;
        this.name = name;
        this.description = description;
    }
    static get(code) {
        // Return specified company or 404
    }
    static getAll() {
        // Return all companies
    }
    static add(code, name, description) {
        // Add a new company
    }
    static update(code, name, description) {
        // Update a company
    }
    static delete(code) {
        // Delete a given company
    }
}
module.exports = Company;
