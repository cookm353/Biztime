class Company {
    code: string
    name: string
    description: string

    constructor(code: string, name: string, description: string) {
        this.code = code
        this.name = name
        this.description = description
    }

    static get(code: string) {
        // Return specified company or 404
    }
    
    static getAll() {
        // Return all companies

    }

    static add(code: string, name: string, description: string) {
        // Add a new company
    }

    static update(code: string, name: string, description: string) {
        // Update a company
    }

    static delete(code: string) {
        // Delete a given company
    }
}

module.exports = Company