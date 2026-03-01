var mongoose = require('mongoose');

// create a user model
var User = mongoose.model('User', {
    oauthID: Number,
    full_name: String,
    first_name: String,
    last_name: String,
    email: String,
    picture: String,
    created: Date,
    roles: Array
});

module.exports = User;