var express  = require('express'),
    _ = require('underscore'),
    Post = require('../models/Post'),
    Menu = require('../models/Menu'),
    User = require('../models/User');

module.exports = (function() {
    var app = express.Router();

    app.get('/', function(req, res){
        res.send({user: req.user});
    });

    return app;
})();
