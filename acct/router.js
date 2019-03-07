'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {User} = require('../users/models');

const router = express.Router();

const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate('jwt', { session: false });


//---------------------------------------------------------------
// Account: Update account 
//---------------------------------------------------------------
router.post('/setup', jwtAuth, jsonParser, (req, res) => {
    console.log('coming through to router');
    const user = req.user;
    console.log(user);
    const incomeAndExpenses = req.body;
    const income = incomeAndExpenses[0];
    console.log(income);
    const expenses = (incomeAndExpenses[1]);
    console.log(expenses);
  // findandupdate
    User.findOneAndUpdate({username: user.username})
      .then(user => {
          if(!user){console.log('not matching on db')}
          else(
            console.log('matched on db!')
          )
    })
    res.json('sent back from router');
    
  })

module.exports = {router};


