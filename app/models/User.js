var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: {
        first: String,
        last: String
    }
});

module.exports = mongoose.model('User', userSchema);
