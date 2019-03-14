'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const decode = require('jwt-decode');
const config = require('../config');
const router = express.Router();
const {
  User
} = require('../users/models');
const tokenValidator = require('./tokenValidator')

const createAuthToken = function (user) {
  return jwt.sign({
    user
  }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {
  session: false
});

const jwtAuth = passport.authenticate('jwt', {
  session: false
});

router.use(bodyParser.json());


//-----------------------------------------------------
// Login The user provides a username and password to login
//-----------------------------------------------------
router.post('/login', localAuth, (req, res) => {
  const {username, password} = req.body;

  User.find({
      username: username
    })
    .then(user => {
      const authToken = createAuthToken(username);
      const payload = {
        authToken
      }
      res.json(payload);
    })

})


//-----------------------------------------------------
// Refresh: The user exchanges a valid JWT for a new one with a later expiration
//-----------------------------------------------------
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({
    authToken
  });
});


//---------------------------------------------------------------
// Registration form submit: validate, and if no user then push new user to db
//---------------------------------------------------------------
router.post('/register', (req, res) => {
  
  // Confirm data sent from reg form 
  console.log('Infomation sent from reg form');
  
  // Get user data from reg form
  const {username, password, password2, income, expenses, budgetinggoal, monthly} = req.body;
 
  // VALIDATION 
  let errors = [];

  //check requird fields
  if (!username || !password || !password2) {
    errors.push({msg: 'Please fill in all fields'});
  }
  // check passwords match
  if (password !== password2) {
    errors.push({msg: "Passwords do not match"})
  }
  // check password length: update this to 6 characters before going to production
  if(password.length < 1){errors.push({msg: "Password should be at least six characters"})}

  // Check DB for existing user
    User.find({
        username: username
      })
      .then(user => {
        // Check if 
        if (user.length > 0) {errors.push({msg: "Username is already registered"})}
        })
        // HERE WE GO!!!
        .then(user => {
          // SEND BACK HERE IF ERRORS 
          if(errors.length > 0){res.status(500).json(errors);}

          // Create new user 
          else {
          // I have a model and I am here creating a new instance of user
          const newUser = new User({username, password, income, expenses, budgetinggoal,monthly});
          // Hash password before saving to DB. Generate a salt so we can create a hash 
          //takes number of keys as argument
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hashed
              newUser.password = hash;
              // saving new user to db returns a promise 
              newUser.save(function (err, user) {
                if (err) {
                  console.log(err)
                } else {
                  console.log('User added to db')
                  const authToken = createAuthToken(newUser.username);
                  res.json({authToken});
                  }
              })
            })
          )
          }
        })

  
// END OF ROUTER POST TO SETUP ON REGISTRATION 
});




//---------------------------------------------------------------
// Dashboard: Get user data to dispaly account to view on page load 
//---------------------------------------------------------------
router.post('/dashboard', tokenValidator.validateToken, (req, res) => {
  const {
    token
  } = req.body;
  let payload = req.decoded;
  let username = payload.user
  User.findOne({
      username: username
    }).select("-password")

    .then(user => {
      res.json(user);
    })

})



//---------------------------------------------------------------
// Update: Update user account after user changes their account settings: WORKING 
//---------------------------------------------------------------
router.put('/update', tokenValidator.validateToken, (req, res) => {

  console.log('req.headers:', req.headers);
  console.log('req.body:', req.body);

  let payload = req.decoded;
  let username = payload.user
  User.findOneAndUpdate({
      username: username
    }, req.body)
    .then(result => {
      console.log('successfullherey updated', result);
      res.send(result);
    }).catch(err => {
      console.log('errrrrr', err);
      res.send(err)
      });
 
})


//---------------------------------------------------------------
// Delete: Delete user account: WORKING 
//---------------------------------------------------------------
router.delete('/delete', tokenValidator.validateToken, (req, res) => {

  console.log('req.headers:', req.headers);

  let payload = req.decoded;
  let username = payload.user
  User.findOneAndRemove({
      username: username
    })
    .then(result => {
      console.log('successfully deleted', result);
      res.send(result);
    }).catch(err => {
      console.log('error on delete account', err);
      res.send(err)
      });
})




module.exports = {
  router
}