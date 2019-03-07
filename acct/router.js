'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {User} = require('../users/models');

const router = express.Router();

const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate('jwt', { session: false });


//---------------------------------------------------------------
// Account: Update account to create an account
//---------------------------------------------------------------
// router.post('/setup', jwtAuth, jsonParser, (req, res) => {
//     console.log('coming through to router');
//     const user = req.user;
//     console.log(user);
//     const incomeAndExpenses = req.body;
//     const income = incomeAndExpenses[0];
//     console.log(income);
//     const expenses = (incomeAndExpenses[1]);
//     console.log(expenses);
//     User.find({username: user.username})
//       .then(user => {
//           if(!user){console.log('not matching on db')}
//           else(
//             User.findByIdAndUpdate(income, {income}, {new: true})
//           )
//           res.json('sent back from router')
//     })
// });

module.exports = {router}
