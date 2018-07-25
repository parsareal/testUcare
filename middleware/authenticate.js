var {User} = require('./../mongoDatabase/user.js');

var authenticate = (req, res, next) => {
  var token = req.header('x-auth');
  console.log(token);

  User.findByToken(token).then((user) => {
    if (!user){
      console.log('not find');
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  })
};


module.exports = {authenticate};
 
