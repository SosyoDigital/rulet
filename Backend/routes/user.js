const express = require('express');
const router = express.Router()
const apiCall = require('../maticServices');
const User = require('../models/user');
const Score = require('../models/score');
const middlewares = require('./middlewares/isLoggedIn');
const bcrypt = require('bcryptjs');

// @route POST api/bets/addbet
// @desc Add new bet
// @access Private

router.post('/addbet', middlewares.isLoggedIn, async (req, res) => {
    const user = await User.findById(req.user.id)
                    .select('-password -privKey')
    const roundId = req.body.roundId
    const amount = req.body.amount
    const pick = req.body.pick
    const payload = {
        _roundId: roundId,
        _addr: user.address,
        _pick: pick,
        _amt: amount
    }
    await Score.findOne({_userAddr: user.address})
        .then(user => {
            user._betAmount += amount
            user.save()
        })
    await apiCall.game.placeBet(payload)
    .then(response => {
        if(response.data.success){
            res.status(200).json({msg: 'Bet added!', txHash: response.data.data[0].txHash})
        } else if(!response.data.success){
            res.status(200).json({msg: 'Could not place your bet!', error: response.data.error.message})
        } else {
            res.status(400).json({msg: 'Some error has occured!'})
        }
    })
    .catch(err => {console.log(err.response.data.error); console.log(err.response.data.error.details.data)})
})

// @route GET api/user/getbalance
// @desc Query users balance
// @access Private
router.get('/getbalance',middlewares.isLoggedIn, async(req, res) => {
    const user = await User.findById(req.user.id)
                    .select('-password -privKey')
    const resp = await apiCall.erc.getBalance(user.address)
    if(resp.data.success){
        res.status(200).json({addr: user.address, balance: resp.data.data[0].uint256})
    }
})

// @route POST api/user/changepassword
// @desc Change users password
// @access Private
router.post('/changepassword', middlewares.isLoggedIn, async(req, res) => {
    const currentPassword = req.body.currentPassword
    const newPassword = req.body.newPassword
    await User.findById(req.user.id)
        .then(user => {
            if(user==null) res.status(200).json({msg:'User not found, please sign up'})
            bcrypt.compare(currentPassword, user.password)
                .then(isMatch => {
                    if(!isMatch){ res.status(200).json({success: false, msg: 'Please enter correct current password!'}) 
                        return; 
                    }
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newPassword, salt, async(err, hash) => {
                            if(err) throw err;
                            user.password = hash
                            await user.save()
                            res.status(200).json({success: true, msg: 'Password Changed!'})
                        })
                    })
                })
            })
        .catch(err => console.log(err))
})

module.exports = router