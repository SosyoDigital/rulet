const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    address: String,
    privKey: String,
    referral: {
        id: String,
        users: [String]
    }
})

module.exports = mongoose.model("User", userSchema)