var express  = require('express'),
    _ = require('underscore'),
    Post = require('../models/Post'),
    User = require('../models/User');

module.exports = (function() {
    var app = express.Router();

    app.get('*', function(req, res, next) {
        if(!req.isAuthenticated()) res.redirect('/signin');
        if(!req.user.isAdmin) res.render('http/304', {
            error: 'You\'re not an admin!'
        });
        return next();
    });

    app.get('/', function(req, res){
        res.render('admin/index');
    });

    app.get('/new/*', function(req, res){
        var url = req.url.replace(/^\/|\/$/g, '').split("/");
        var base = url[1];
        if(base == 'post') {
            res.render('admin/new/post');
        } else if(base == 'page'){
            res.render('admin/new/page');
        } else {
            res.render('http/500', {
                error: 'I have no clue what type of thing you\'re trying to make?'
            });
        }
    });

    app.post('/new/*', function(req, res){
        var url = req.url.replace(/^\/|\/$/g, '').split("/");
        var base = url[1];
        if(base == 'post') {
            var published = req.body.published == 'on' ? true : false,
                title = req.body.title,
                content = req.body.content,
                tags = req.body.tags.replace(/^\s*|\s*$/g,'').split(/\s*,\s*/),
                anonymous = req.body.anonymous == 'on' ? true : false;

            var post = new Post({
                owner: req.user.id,
                published: published,
                title: title,
                content: content,
                tags: tags,
                anonymous: anonymous
            });
            post.save(function(err, post){
                if(err) {
                    res.render('http/genericError', {
                        error: err
                    });
                } else {
                    res.redirect('/post/' + post.slug);
                }
            });
        } else if(base == 'page'){
            res.render('admin/new/page');
        } else {
            res.render('http/500', {
                error: 'I have no clue what type of thing you\'re trying to make?'
            });
        }
    });

    return app;
})();
