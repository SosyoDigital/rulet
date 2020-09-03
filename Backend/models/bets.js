const mongoose = require('mongoose')

const betSchema = new mongoose.Schema({
    betId: Number,
    result: Number
})

module.exports = mongoose.model("Bet", betSchema)