//   'use strict';
//   global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
//   const chai = require('chai');
//   const chaiHttp = require('chai-http');

//   const {app, runServer, closeServer} = require('../server');
//   const {User} = require('../users');

//   const expect = chai.expect;


//   chai.use(chaiHttp);

//   describe('/api/user', function() {
//     const username = 'exampleUser';
//     const password = 'examplePass';
//     const usernameB = 'exampleUserB';
//     const passwordB = 'examplePassB';
  
//     before(function() {
//       return runServer();
//     });

//     after(function() {
//       return closeServer();
//     });

//     beforeEach(function() {});

//     afterEach(function() {
//       return User.remove({});
//     });

//   // Initial test to ensure basic files set up is configured
//   describe('Hit URL', function() {
//     it('should return 202 and html on get', function(){
//         return chai.request(app)
//         .get('/api/users')
//         .then(function(res){
//             expect(res).to.have.status(200);
//             expect(res).to.be.html;
//         })
//       })
//   })

//   // Initial test to ensure basic files set up is configured
//   describe('Login is working', function() {
//     it('should return 202 and html on get', function(){
//         return chai.request(app)
//         .post('/api/auth/login')
//         .then(function(res){
//             expect(res).to.have.status(201);
//         })
//       })
//   })


// // END OF TESTS
// })
