'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());
// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});


router.post('/register', bodyParser, (req, res) => {

  console.log('infomation sent from reg form');
  const {name, email, password, password2} = req.body;

  // Validation
  let errors = [];
  //check requird fields
  if(!email || !password || !password2){errors.push({msg: 'Please fill in all fields'});
  }
  // check passwords match
  if(password !== password2){errors.push({msg: "Passwords do not match"})}
  // check pass length 
  // if(password.length < 6){errors.push({msg: "Password should be at least six characters"})}
  // Console lot any errors 
  if(errors.length > 0){(console.log(errors + "I want this to show on html to user"))} 
  
  else{
  // Check DB for existing user
    User.findOne({email: email})
    .then(user => {
        if(user){console.log('email already registered. I want this to show on screen')} 
      // Create new user 
        else {
              // I have a model and I am here creating a new instance
              // HERE
              const newUser = new User({email, password});
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
                      const authToken = createAuthToken(req.email);
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

module.exports = {router};
