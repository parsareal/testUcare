const express = require('express');
const _ = require('lodash');
var {mongoose} = require('./mongoDatabase/mongoose.js');
var {User} = require('./mongoDatabase/user.js');
var {Doctor} = require('./mongoDatabase/doctor.js');
var {authenticate} = require('./middleware/authenticate.js');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.post('/ucareUsers/register', (req, res) => { 
  var body = _.pick(req.body, ['firstName', 'lastName', 'email', 'age', 'password']);
  var user = new User(body);

  // var token = user.generateAuthTokens();
  // var access = 'auth';
  // user.tokens.push({access, token});

  user.save().then((user) => {
    // res.header('x-auth', token).send(user);
    user.generateAuthTokens();
  })
  .then((token) => {
    res.header('x-auth', token).send(user);
  })
  .catch((e) => {
    res.status(400).send(e);
  });
});


app.get('/ucareUsers/me', authenticate, (req, res) => {
  res.send(req.user);
});


app.post('/ucareUsers/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByEmail(body.email, body.password).then((user) => {
    user.generateAuthTokens().then((token) => {
      res.header('x-auth', token).send(user);
    })
  }).catch((e) => {
    res.status(401).send();
  });

});


app.get('/ucareUsers/getDoctors', authenticate, (req, res) => {

  Doctor.find({
    patient: req.user._id
  }).then((doctors) => {
    res.send(doctors)
  }).catch((e) => {
    res.status(400).send();
  })
});


app.delete('/ucareUsers/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then((user) => {
      res.send(user);
    }).catch((e) => {
      res.status(400).send();
    });
});


app.post('/ucareDoctors/register', (req, res) => {
  var body = _.pick(req.body, ['firstName', 'lastName', 'phone', 'patient']);
  var doctor = new Doctor(body);

  doctor.save().then((doctor) => {
    res.send(doctor);
  }).catch((e) => {
    res.status(400).send();
  })
});


app.listen(3000, () => {
  console.log('Server is Up on 3000...');
});
