var mongoose = require('mongoose');

var menuSchema = new mongoose.Schema({
    type: String,
    title: String,
    dropdowns: {
        type : Array ,
        "default" : []
    },
    relativeUrl: String,
    hasActive: Boolean
});

module.exports = mongoose.model('Menu', menuSchema);
