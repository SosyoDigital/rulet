const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
    _userAddr: String,
    _betAmount: Number
})

module.exports = mongoose.model("Score", scoreSchema)