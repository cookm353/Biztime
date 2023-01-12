process.env.NODE_ENV = "test"

const request = require('supertest')
const app = require('../dist/app')
const db = require("../dist/db")


let testCompany
let testInvoice

beforeEach(async() => {
    const companyResult = await db.query(
            `INSERT INTO companies (code, name, description)
            VALUES ('ibm', 'IBM', 'Big Blue')
            RETURNING code, name, description`
        )
    testCompany = companyResult.rows[0]

    const invoiceResult = await db.query(
            `INSERT INTO invoices (comp_code, amt, paid, paid_date)
            VALUES ('ibm', 400, false, null)
            RETURNING id, comp_code, amt, paid, add_date, paid_date`
        )    
    testInvoice = invoiceResult.rows[0]
    })
    
afterEach(async () => {
    await db.query(`DELETE FROM companies`)
    await db.query(`DELETE FROM invoices`)
})

afterAll(async () => {
    await db.end()
})
        
/* Company routes */

describe("GET /companies", () => {
    test("Get a list with one company", async () => {
        const resp = await request(app).get('/companies')
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({companies: [testCompany]})
    })
})

describe("GET /companies/:code", () => {
    test("Get specified company", async () => {
        const resp = await request(app).get(`/companies/${testCompany.code}`)
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({company: {
            code: testCompany.code,
            description: testCompany.description,
            invoices: [testInvoice.id],
            name: testCompany.name
        }})
    })

    test("Get company with invalid code", async () => {
        const resp = await request(app).get('/companies/apple')
        expect(resp.statusCode).toBe(404)
        expect(resp.body).toEqual({
            "error": {
                "message": "Not Found",
                "status": 404
            }
        })
    })
})

describe("POST /companies", () => {
    test('Create a new company', async () => {
        const newCompany = {
            code: "honda",
            name: "Honda",
            description: "Car manufacturer"
        }
        
        const resp = await request(app)
            .post('/companies')
            .send(newCompany)

        expect(resp.statusCode).toBe(201)
        expect(resp.body).toEqual({company: newCompany})
    })

    test("Create a new company without all required fields", async () => {
        const newCompany = {
            code: "honda",
            name: "Honda"
        }
        
        const resp = await request(app)
            .post('/companies')
            .send(newCompany)

        expect(resp.statusCode).toBe(400)
        expect(resp.body).toEqual({
            error: {
                message: "Must include company code, name, and description",
                status: 400
            }
        })
    })
})

describe("PUT /companies/:code", () => {
    test("Update a company", async () => {
        const resp = await request(app)
            .put('/companies/ibm')
            .send({description: "Big blue"})

        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({
            company: {
                code: 'ibm',
                name: 'IBM',
                description: 'Big blue'
            }
        })
    })

    test("Update with invalid code", async () => {
        const resp = await request(app)
            .put('/companies/honda')
            .send({name: 'Toyota'})

        expect(resp.statusCode).toBe(404)
        expect(resp.body).toEqual({
            error: {
                message: 'Company not found',
                status: 404
            }
        })
    })
})

describe("DELETE /companies/:code", () => {
    test("Delete company", async () => {
        const resp = await request(app).delete("/companies/ibm")

        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({status: "deleted"})
    })

    test("Delete company using invalid code", async () => {
        const resp = await request(app).delete('/companies/honda')

        expect(resp.statusCode).toBe(404)
        expect(resp.body).toEqual({
            error: {
                message: "Company not found",
                status: 404
            }
        })
    })
})

/* Invoice routes */

describe("GET /invoices", () => {
    test("Get a list w/ only one invoice", async () => {
        const resp = await request(app).get('/invoices')
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({invoices: [{
            id: testInvoice.id, 
            comp_code: testInvoice.comp_code
        }]})
    })
})

describe("GET /invoices/:id", () => {
    test("Getting invoice", async () => {
        const resp = await request(app).get(`/invoices/${testInvoice.id}`)
        expect(resp.statusCode).toBe(200)
        // expect(resp.body).toEqual({invoice: {
        //     id: testInvoice.id,
        //     amt: testCompany.amt,
        //     paid: testCompany.paid,
        //     add_date: testCompany.add_date,
        //     paid_date: testCompany.paid_date,
        //     company: {
        //         code: testCompany.code,
        //         name: testCompany.name,
        //         description: testCompany.description
        //     }
        // }})
    })

    test("Getting invoice w/ invalid id", async () => {
        const resp = await request(app).get('/invoices/0')
        expect(resp.statusCode).toBe(404)
        expect(resp.body).toEqual({error: {
            message: "Not Found",
            status: 404
        }})
    })
})

describe("POST /invoices", () => {
    test("Creating new invoice", async () => {
        const newInvoice = {
            comp_code: 'ibm',
            amt: 500,
            paid_date: null
        }

        const resp = await request(app)
            .post('/invoices')
            .send(newInvoice)

        expect(resp.statusCode).toBe(201)
        // console.log(resp.body)
        console.log(testInvoice.add_date)
    })
})

describe('PUT /invoices/:id', () => {
    test("Updating invoice with valid id", async () => {
        const resp = await request(app)
            .put(`/invoices/${testInvoice.id}`)
            .send({amt: 500})

        expect(resp.statusCode).toBe(200)
        expect(resp.body.invoice.amt).toEqual(500)
    })

    test("Updating invoice with invalid id", async () => {
        const resp = await request(app)
            .put(`/invoices/0`)
            .send({amt: 500})

        expect(resp.statusCode).toBe(404)
    })
})

describe("DELETE /invoices/:id", () => {
    test("Delete invoice", async () => {
        const resp = await request(app).delete(`/invoices/${testInvoice.id}`)

        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({status: 'deleted'})
    })

    test("Delete invoice with invalid ID", async () => {
        const resp = await request(app).delete('/invoices/0')

        expect(resp.statusCode).toBe(404)
    })
})