const express = require('express');
const router = express.Router()
const User = require('../models/user');
const Bets = require('../models/bets');
const isLoggedIn = require('./middlewares/isLoggedIn');

// @route POST api/bets/addbet
// @desc Add new bet
// @access Private

router.post('/addbet', isLoggedIn, (req, res) => {
    const user = null;
    User.findById(req.user.id)
        .select('-password')
        .then(foundUser => user = foundUser)
    //Add MaticVigil calls here
})