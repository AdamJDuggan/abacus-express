const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

module.exports.validateToken = (req, res, next) => {
    console.log('got here');
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log('JWT_SECRET', jwtSecret);
  if (token) {
      console.log('about to verify');
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Could not authenticate token', error: err });
      }
      req.decoded = decoded;
      // return res.send("Valid token")

      return next();
    });
  } else {
    return res.status(401)
      .send({ message: "No token provided. Provide token in the request body, or header, or in a query, with key 'x-access-token'", success: false });
  }
};
