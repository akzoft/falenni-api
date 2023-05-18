const mongoose = require('mongoose')

const user = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    phone: { type: Number, unique: true },
    email: { type: String, trim: true, lowercase: true },
    password: { type: String, trim: true, required: true },
    image: { type: String, trim: true },
    adresse: { type: String, trim: true },
    birthday: { type: String, trim: true },
    wantRemove: { will: { type: Boolean, default: false }, date: { type: Date } },
    socials: [{
        facebook: { type: Object, default: null },
        google: { type: Object, default: null }
    }],
})

const UserModel = mongoose.model('User', user)
module.exports = UserModel 