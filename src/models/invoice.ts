class Invoice {
    compCode: string
    amt: number
    paid: boolean
    addDate: Date
    paidDate: Date

    constructor(compCode: string, amt: number, paid: boolean = false, paidDate: Date = null) {
        this.compCode = compCode
        this.amt = amt
        this.paid = paid
        this.paidDate = paidDate
    }

    static get(id: number) {
        // Return specified invoice
    }

    static getAll() {
        // Return all invoices
    }

    static add(compCode: string, amt: number) {
        // Add a new invoice
    }

    static update(id: number, amt: number) {
        // Update invoice amount
    }

    static delete(id: number) {
        // Remove specified invoice
    }
}