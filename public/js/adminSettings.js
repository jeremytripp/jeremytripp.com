var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    weatherService: String
});
var AdminSetting = mongoose.model('AdminSetting', adminSchema);

module.exports = AdminSetting;