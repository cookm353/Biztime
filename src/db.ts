const { Client } = require("pg")
const password = require("./shh")

let DB_URI

process.env.PGPASSWORD = password

if (process.env.NODE_ENV === "test") {
    DB_URI = "postgresql:///biztime_test"
} else {
    DB_URI = "postgresql:///biztime"
}

let db = new Client({
    connectionString: DB_URI
})

db.connect()

module.exports = db