const express = require('express');
const router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Web3 = require('web3');
const User = require('../models/user');
const isLoggedIn = require('./middlewares/isLoggedIn');
const web3 = new Web3()

// @route POST api/user/register
// @desc Add new user
// @access Public

router.post('/register', async (req, res) => {
    const {username, password, email} = req.body

    if(!username || !email || !password){
        res.status(400).json({msg: 'Please enter all fields'})
    }
    
    const ethAcc = await web3.eth.accounts.create();
    User.findOne({username: username})
        .then(user => {
            if(user) res.status(400).json({msg:'User already exists'})
            const newUser = new User({
                username: username,
                password: password,
                email: email,
                address: ethAcc.address,
                privKey: ethAcc.privateKey
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash
                    newUser.save()
                        .then((user) => {
                            jwt.sign(
                                {id: user.id},
                                jwtSecret,
                                {expiresIn: 36000},
                                (err, token) => {
                                    if(err) throw err
                                    res.status(200).json({msg: 'User created successfully', user: {username: user.username, email: user.email}, token})
                                }
                            )
                        })
                })
            })
        })
})

// @route POST api/user/login
// @desc Login user and create token
// @access Public

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if(!username || !password){
        res.status(400).json({msg: 'Please enter all fields'})
    }
    User.findOne({username: username})
        .then(user => {
            if(!user) res.status(400).json({msg:'User not found, please sign up'})
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) res.status(400).json({msg: 'Incorrect password!'})
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

router.get('/', isLoggedIn, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
})

module.exports = router