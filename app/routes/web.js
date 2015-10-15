var express  = require('express'),
    _ = require('underscore'),
    md = require('marked'),
    config = require('../../config/config.js'),
    Post = require('../models/Post'),
    Page = require('../models/Page'),
    User = require('../models/User');

module.exports = (function() {
    var app = express.Router();

    app.use(function(req, res, next){
        res.locals.layout = {
            currentPage: req.path
        };
        next();
    });

    app.get('/', function(req, res){
        var criteria = req.user ? {} : {published: true};
        Post.find(criteria).populate('owner').sort({'_id': -1}).limit(10).exec(function(err, posts) {
            if(err) console.log(err);
            if(posts.length){
                var Showdown = require('showdown');
                var converter = new Showdown.converter();
                var finished = _.after(posts.length, function(){
                    res.render('index', {
                        posts: posts,
                        md: md
                    });
                });
                for(i = 0; i < posts.length; i++) {
                    posts[i].content = converter.makeHtml(posts[i].content);
                    finished();
                }
            } else {
                res.render('index', {
                    posts: []
                });
            }
        });
    });

    app.get('/tagged/:tag', function(req, res){
        Post.find({tags: req.params.tag}).populate('owner').sort({'_id': -1}).limit(10).exec(function(err, posts) {
            var Showdown = require('showdown');
            var converter = new Showdown.converter();
            var finished = _.after(posts.length, function(){
                res.render('index', {
                    posts: posts,
                    md: md
                });
            });
            for(i = 0; i < posts.length; i++) {
                posts[i].content = converter.makeHtml(posts[i].content);
                finished();
            }
        });
    });

    app.use('/search', function(req, res){
        var url = req.url.replace(/^\/|\/$/g, '').split("/");
        var searchTerm = url[0].length ? url[0] : req.body.searchTerm;
        Post.find({
            $text: {
                $search: searchTerm
            }
        },{
            score: {
                $meta: 'textScore'
            }
        }).populate('owner').sort({
            score: {
                $meta: 'textScore'
            }
        }).exec(function(err, posts) {
            if (err) console.log(err);
            if(posts.length){
                res.render('index', {
                    posts: posts,
                    md: md
                });
            } else {
                res.render('http/genericError', {
                    error: 'We couldn\'t find any posts with that search term.'
                });
            }
        });
    });

    app.get('/user/:userId', function(req, res){
        var userId = req.params.userId;
        var criteria = userId == 'anonymous' ? {_id: config.db.anonUserId} : {_id: userId};
        User.findOne(criteria).select('-password -__v').exec(function(err, user){
            if(err) console.log(err);
            res.render('user', {
                user: user
            });
        });
    });

    app.get('/*', function (req, res, next) {
        var url = req.url.replace(/^\/|\/$/g, '').split("/");
        var base = url[0];
        var slug = url.slice(1).join('/');
        if (base == 'post') {
            Post.findOne({slug: slug}).populate('owner').exec(function(err, post) {
                if (err) console.log(err);
                if (post) {
                    res.render('post', {
                        post: post,
                        md: md
                    });
                } else {
                    next();
                }
            });
        } else {
            Page.findOne({url: req.url}, function(err, page){
                if (err) console.log(err);
                if (page) {
                   res.render('page', {
                       page: page,
                       md: md
                   });
               } else {
                   next();
               }
            });
        }
    });

    return app;
})();
