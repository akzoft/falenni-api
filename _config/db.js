const mongoose = require("mongoose")
const url = process.env.DATABASE_URL
console.log("DBname: ", url)
mongoose.connect(url, {})
    .then(() => {
        console.log("Mongodb connected ")
    })
    .catch(error => {
        console.log("Failed to connect MongoDB", { error })
    })