var mongoose = require('mongoose');

var lightsSchema = mongoose.Schema({
    id: String,
    state: Object,
    name: String,
    lastFetched: String
});
var LightsModel = mongoose.model('Lights', lightsSchema);

module.exports = LightsModel;