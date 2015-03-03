var mongoose = require('mongoose');

var routeSchema = new mongoose.Schema({
    base: String,
    type: String
});

module.exports = mongoose.model('Route', routeSchema);
