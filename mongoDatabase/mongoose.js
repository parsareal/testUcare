var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/UcareDB', () => {
  console.log('Connect to the Database...');
});

module.exports = {mongoose};
