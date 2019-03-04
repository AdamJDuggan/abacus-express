'use strict';
exports.DATABASE_URL = 
    'mongodb://AdamJDuggan:Munster1@ds159185.mlab.com:59185/abacus';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'myfirstapp';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
