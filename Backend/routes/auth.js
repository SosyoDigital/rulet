const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');
const apiCall = require('../maticServices');
const config = require('../config')
const User = require('../models/user');
const Score = require('../models/score')
const middleware = require('./middlewares/isLoggedIn');
const web3 = new Web3();
const jwtSecret = "casualita";

// @route POST api/user/register
// @desc Add new user
// @access Public

function makeid(l){
    var text = "";
    var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i=0; i < l; i++ ){  
    text += char_list.charAt(Math.floor(Math.random() * char_list.length));
    }
    return text;
 }

async function refFunction(username, refId){
    await User.findOne({'referral.id': refId})
        .then(referredUser => {
            referredUser.referral.users.push(username)
            referredUser.save()
        })
        .catch(err => {
            console.log(err)
        })
    await User.findOne({username: username})
        .then(referralUser => {
            console.log(referralUser)
        })
}

router.post('/register', async (req, res) => {
    const {username, password, email, refId} = req.body
    if(!username || !email || !password){
        res.status(400).json({msg: 'Please enter all fields'})
    }
    
    const ethAcc = await web3.eth.accounts.create();
    const newrefId = makeid(8)
    User.findOne({username: username})
        .then(user => {
            if(user) res.status(400).json({msg:'User already exists'})
            const newUser = new User({
                username: username,
                password: password,
                email: email,
                address: ethAcc.address,
                privKey: ethAcc.privateKey,
                referral : {
                    id: newrefId,
                    users: []
                }
            })
            const newScore = new Score({
                _userAddr: ethAcc.address,
                _betAmount: 0
            })
            newScore.save()
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash
                    newUser.save()
                        .then(async(user) => {
                            await apiCall.erc.signUpTransfer({
                                sender: config.ercContract,
                                recipient: user.address,
                                amount: 1000
                            })
                            jwt.sign(
                                {id: user.id},
                                jwtSecret,
                                {expiresIn: 36000},
                                (err, token) => {
                                    if(err) throw err
                                    res.status(200).json({success: true, msg: 'User created successfully', user: {username: user.username, email: user.email, address: user.address}, token})
                                }
                            )
                        })
                })
            })
        })
        if(refId){
            refFunction(username, refId)
        }
})

// @route POST api/user/login
// @desc Login user and create token
// @access Public

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        res.status(200).json({msg: 'Please enter all fields'})
    }
    User.findOne({username: username})
        .then(user => {
            if(user==null) res.status(200).json({msg:'User not found, please sign up'})
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) res.status(200).json({msg: 'Incorrect password!'})
                    jwt.sign(
                        {id: user.id},
                        jwtSecret,
                        {expiresIn: 36000},
                        (err, token) => {
                            if(err) throw err
                            res.status(200).json({msg: 'Logged in successfully!', user: {username: user.username, email: user.email}, token})
                        }
                    )
                })
        })
})

// @route GET api/user
// @desc Get user data
// @access Private

router.get('/', middleware.isLoggedIn, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
        .catch(err => console.log(err))
})

module.exports = router