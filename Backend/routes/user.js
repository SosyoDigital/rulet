const express = require('express');
const router = express.Router()
const apiCall = require('../maticServices');
const User = require('../models/user');
const middlewares = require('./middlewares/isLoggedIn');
const isLoggedIn = require('./middlewares/isLoggedIn');

// @route POST api/bets/addbet
// @desc Add new bet
// @access Private

router.post('/addbet', middlewares.isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user.id)
                    .select('-password -privKey')
    const roundId = req.body.roundId
    const amount = req.body.amount
    const pick = req.body.pick
    //Add MaticVigil calls here
    apiCall.game.placeBet({
        _roundId: roundId,
        _addr: user.address,
        _pick: pick,
        _amt: amount
    })
    .then(response => {
        if(response.data.success){
            res.status(200).json({msg: 'Bet added!', txHash: response.data.data[0].txHash})
        } else if(!response.data.success){
            res.status(200).json({msg: 'Could not place your bet!', error: response.data.error.message})
        } else {
            res.status(400).json({msg: 'Some error has occured!'})
        }
    })
})

router.get('/getbalance',middlewares.isLoggedIn, async(req, res) => {
    const user = await User.findById(req.user.id)
                    .select('-password -privKey')
    const resp = await apiCall.erc.getBalance(user.address)
    if(resp.data.success){
        res.status(200).json({addr: user.address, balance: resp.data.data[0].uint256})
    }
})

module.exports = router