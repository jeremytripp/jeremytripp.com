var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    title: String,
    description: String,
    body: String,
    author: String,
    date: Date
});
var PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;