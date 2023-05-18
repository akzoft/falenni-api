require("dotenv").config({ path: "./_config/.env" })
const express = require("express")
const cors = require("cors")
const path = require("path")
const bodyParser = require("body-parser")
require("./_config/db")

const app = express()
app.use("/api/public", express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.use("/api/user", require("./_routes/user.route"))
app.use("/api/product", require("./_routes/product.route"))

const port = process.env.PORT || 5000
app.listen(port, () =>
    console.log(`Running on http://localhost:${port}`)
)