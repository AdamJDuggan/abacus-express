'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {User} = require('../users/models');

const router = express.Router();

const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate('jwt', { session: false });




module.exports = {router}
