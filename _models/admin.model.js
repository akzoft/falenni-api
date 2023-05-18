const mongoose = require('mongoose')

const admin = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    phone: { type: Number, trim: true },
    email: { type: String, trim: true, lowercase: true, set: email => email.toLowerCase() },
    password: { type: String, trim: true, required: true },
    photo: { type: String, trim: true },
    adresse: { type: String, trim: true },
    socials: [{
        facebook: { type: Object, default: null },
        google: { type: Object, default: null }
    }],
    role: { type: String, enum: ["admin", "editeur"], default: "editeur" }
})

const AdminModel = mongoose.model('Admin', admin)
module.exports = AdminModel 