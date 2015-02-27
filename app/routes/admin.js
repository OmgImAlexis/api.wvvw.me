var express  = require('express'),
    _ = require('underscore'),
    Post = require('../models/Post'),
    Menu = require('../models/Menu'),
    User = require('../models/User');

module.exports = (function() {
    var app = express.Router();

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/signin');
    }

    app.use(ensureAuthenticated);

    app.get('/', function(req, res){
        res.render('admin/index');
    });

    return app;
})();
