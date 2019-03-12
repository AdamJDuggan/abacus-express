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


// //-----------------------------------------------------
// // Login The user provides a username and password to login
// //-----------------------------------------------------
router.post('/login', localAuth, (req, res) => {
  const {
    username,
    password
  } = req.body;
  console.log(username, password, '@"adfadf@')
  User.find({
      username: username
    })
    .then(user => {
      console.log(user)
      const authToken = createAuthToken(username);
      const payload = {
        authToken
      }
      res.json(payload);
    })

})

// END OF ROUTER POST FROM LOGIN TO DASHBOARD



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

  console.log('infomation sent from reg form');
  const {
    username,
    password,
    password2,
    income,
    expenses,
    budgetinggoal,
    monthly
  } = req.body;
  console.log("Expenses", expenses);
  console.log("Income", income);


  // Validation
  let errors = [];
  //check requird fields
  if (!username || !password || !password2) {
    errors.push({
      msg: 'Please fill in all fields'
    });
  }
  // check passwords match
  if (password !== password2) {
    errors.push({
      msg: "Passwords do not match"
    })
  }
  // check pass length 
  // if(password.length < 6){errors.push({msg: "Password should be at least six characters"})}
  // Console lot any errors 
  if (errors.length > 0) {
    (console.log(errors + "I want this to show on html to user"))
  } else {
    // Check DB for existing user
    User.find({
        username: username
      })
      .then(user => {
        console.log(user)
        if (user.length > 0) {
          console.log('username already registered. I want this to show on screen')
          res.json('user already registered');
        }
        // Create new user 
        else {
          // I have a model and I am here creating a new instance
          // HERE
          const newUser = new User({
            username,
            password,
            income,
            expenses,
            budgetinggoal,
            monthly
          });
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
                  res.json({
                    authToken
                  });
                }
              })
            })
          )
        }
      })
  }
  // END OF ROUTER POST TO SETUP ON REGISTRATION 
});



//---------------------------------------------------------------
// Dashboard: Get user data to dispaly account to view 
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
// Update: 
//---------------------------------------------------------------
router.put('/update', tokenValidator.validateToken, (req, res) => {

  console.log('came from dashboard', req.headers);
  console.log('came from dashboardttttt', req.body);

  let payload = req.decoded;
  //console.log(req.body);
  let username = payload.user
  //console.log(username, payload, "here");
  User.findOneAndUpdate({
      username: username
    }, req.body)
    // User.findByIdAndUpdate('5c8686b47a0c4a678b7e80ef', {budgetinggoal: 200})
    .then(result => {
      console.log('successfullherey updated', result);
      res.send(result);
    }).catch(err => {
      console.log('errrrrr', err);
      res.send(err)
      });
 /* User.findOne({
      username: username
    }).select("-password")

    .then(user => {
      console.log(user.income + "ok")

      res.json('back from server. User object to go here then window reload');
    });
    */
})







module.exports = {
  router
}