'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const decode = require('jwt-decode');
const config = require('../config');
const router = express.Router();

const {User} = require('../users/models');

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});


router.use(bodyParser.json());

//-----------------------------------------------------
// The user provides a username and password to login
//-----------------------------------------------------
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  console.log("landed in auth router" + authToken)
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});


//---------------------------------------------------------------
// Registration form submit: validate, create new user on db and
// move to setup account screen passing user id as jwt
//---------------------------------------------------------------
router.post('/register', (req, res) => {

  console.log('infomation sent from reg form');
  const {username, password, password2} = req.body;

  // Validation
  let errors = [];
  //check requird fields
  if(!username || !password || !password2){errors.push({msg: 'Please fill in all fields'});
  }
  // check passwords match
  if(password !== password2){errors.push({msg: "Passwords do not match"})}
  // check pass length 
  // if(password.length < 6){errors.push({msg: "Password should be at least six characters"})}
  // Console lot any errors 
  if(errors.length > 0){(console.log(errors + "I want this to show on html to user"))} 
  
  else{
  // Check DB for existing user
    User.find({username: username})
    .then(user => {
      console.log(user)
        if(user.length > 0){console.log('username already registered. I want this to show on screen')} 
      // Create new user 
        else {
              // I have a model and I am here creating a new instance
              // HERE
              const newUser = new User({username, password});
              // Hash password before saving to DB. Generate a salt so we can create a hash 
              //takes number of keys as argument
              bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if(err) throw err;
                  // Set password to hashed
                  newUser.password = hash;
                  // saving new user to db returns a promise 
                  newUser.save(function(err, user){
                    if(err){console.log(err)}
                    else{
                      console.log('User added to db')
                      const authToken = createAuthToken(newUser.username);
                      res.json({authToken});
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
// Setup screen: Push income and expenditure to db  
//---------------------------------------------------------------
router.post('/setup1', (req, res) => {
  const {user} = req.body;
  console.log(user);
  console.log(JSON.parse(req.body.user).authToken);

  jwt.verify(JSON.parse(req.body.user).authToken, 'myfirstapp', function(err, decoded){
    console.log(decoded.user);
    User.find({username: decoded.user})
    .then(user => {
        if(!user){console.log('not matching')}
        else(console.log('matched!'));
  })
})
  
})



module.exports = {router};
