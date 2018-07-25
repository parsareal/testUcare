var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const validator = require('validator');

var userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },

  lastName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not valid.'
    }
  },

  password: {
    type: String,
    required: true,
    min: 6
  },

  age: {
    type: Number,
    required:true
  },

  tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
  }]

});


userSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email'])
};

 
userSchema.methods.generateAuthTokens = function () {
  var user = this;
  var access = 'auth';

  var token = jwt.sign({_id: user._id.toHexString(), access}, 'aurliano').toString();

  // return token;

  user.tokens.push({access, token});

  return user.save().then((user) => {
    return token;
  });
};

userSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

userSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
      decoded = jwt.verify(token, 'aurliano');
  } catch (e) {
    return Promise.reject();
  }


  return User.findOne({
    '_id': decoded._id,
    'tokens.access': 'auth',
    'tokens.token': token
  })
};

userSchema.statics.findByEmail = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res){
          resolve(user);
        } else {
          reject();
        }
      })
    });
  })
}

userSchema.pre('save', function(next) {
  var user = this;

  if (user.isModified('password')){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
          next();
        })
    })
  } else{
    next();
  }
});

var User = mongoose.model('User', userSchema);


module.exports = {User};
