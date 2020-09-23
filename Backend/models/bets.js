const mongoose = require('mongoose')

const betSchema = new mongoose.Schema({
    _roundId: Number,
    _sysPick: Number,
    _isGreen: Boolean
})

module.exports = mongoose.model("Bets", betSchema)