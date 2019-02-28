'use strict';
exports.DATABASE_URL =
    process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://AdamJDuggan:Munster1@ds121673.mlab.com:21673/passport';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'myfirstapp';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
